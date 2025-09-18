const express = require("express");
const axios = require("axios");
const { pool } = require("../db");

const router = express.Router();

const isDemo = (process.env.VIVA_ENV || "demo") !== "live";
const TOKEN_URL = isDemo
  ? "https://demo-accounts.vivapayments.com/connect/token"
  : "https://accounts.vivapayments.com/connect/token";
const API_BASE = isDemo
  ? "https://demo-api.vivapayments.com"
  : "https://api.vivapayments.com";
const CHECKOUT_BASE = isDemo
  ? "https://demo.vivapayments.com"
  : "https://www.vivapayments.com";

// -------------------- Helpers --------------------

async function getAccessToken() {
  const basic = Buffer.from(
    `${process.env.VIVA_CLIENT_ID}:${process.env.VIVA_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "urn:viva:payments:core:api:redirectcheckout",
  });

  const { data } = await axios.post(TOKEN_URL, params.toString(), {
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data.access_token;
}

// Calcola il totale server-side leggendo i prezzi dal DB
async function calcAmountAndLinesFromItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Carrello vuoto");
  }

  // Leggi i prodotti dal DB (catalogo)
  const ids = items.map((it) => String(it.id));
  const [rows] = await pool.query(
    `SELECT id, title, priceCents FROM products WHERE id IN (${ids.map(() => "?").join(",")})`,
    ids
  );

  // mappa veloce id->prodotto
  const byId = new Map(rows.map((r) => [String(r.id), r]));

  let amountCents = 0;
  const lines = [];

  for (const it of items) {
    const pid = String(it.id);
    const qty = Math.max(1, Number(it.qty || 1));
    const prod = byId.get(pid);

    // --- FALLBACK DEMO ---
    // Se non hai ancora la tabella products, puoi usare TEMPORANEAMENTE
    // il prezzo passato dal client. Per produzione ELIMINALO.
    const unit = prod ? Number(prod.priceCents) : Number(it.unitPriceCents);
    const title = prod ? prod.title : (it.title || `item-${pid}`);

    if (!Number.isFinite(unit) || unit <= 0) {
      throw new Error(`Prezzo non valido per prodotto ${pid}`);
    }

    const lineTotal = unit * qty;
    amountCents += lineTotal;
    lines.push({
      productId: pid,
      title,
      unitPriceCents: unit,
      quantity: qty,
      totalCents: lineTotal,
    });
  }

  return { amountCents: Math.round(amountCents), lines };
}

async function retrieveTransaction(transactionId) {
  const token = await getAccessToken();
  const { data } = await axios.get(
    `${API_BASE}/checkout/v2/transactions/${transactionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

// -------------------- ROUTES --------------------

// 1) CREA ORDINE (dal click "Paga ora")
router.post("/api/payments/viva/order", express.json(), async (req, res) => {
  try {
    const customer = req.body?.customer || {};
    const items = req.body?.items || [];

    // 1.a Calcolo totale e preparo righe
    const { amountCents, lines } = await calcAmountAndLinesFromItems(items);

    // 1.b Token Viva
    const token = await getAccessToken();

    // 1.c Crea ordine Viva
    const { data: order } = await axios.post(
      `${API_BASE}/checkout/v2/orders`,
      {
        amount: amountCents,
        sourceCode: String(process.env.VIVA_SOURCE_CODE || "").trim(),
        customerTrns: "Ordine e-commerce",
        merchantTrns: `ordine-${Date.now()}`,
        customer: {
          email: customer.email,
          fullName: customer.fullName,
        },
        disableExactAmount: false,
        paymentNotification: true,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const orderCodeStr = String(order.orderCode);

    // 1.d Salvo l'ordine come PENDING + cliente
    await pool.query(
      "INSERT INTO orders (orderCode, amountCents, status, customerEmail, customerName) VALUES (?, ?, 'PENDING', ?, ?)",
      [orderCodeStr, amountCents, customer.email || null, customer.fullName || null]
    );

    // 1.e Salvo le righe del carrello
    if (lines.length) {
      const values = lines.map((ln) => [
        orderCodeStr,
        ln.productId,
        ln.title,
        ln.unitPriceCents,
        ln.quantity,
        ln.totalCents,
      ]);
      await pool.query(
        "INSERT INTO order_items (orderCode, productId, title, unitPriceCents, quantity, totalCents) VALUES ?",
        [values]
      );
    }

    // 1.f Redirect URL Viva
    const color = process.env.BRAND_COLOR ? `&color=${process.env.BRAND_COLOR}` : "";
    const redirectUrl = `${CHECKOUT_BASE}/web/checkout?ref=${orderCodeStr}${color}`;

    return res.json({ ok: true, orderCode: orderCodeStr, redirectUrl });
  } catch (err) {
    const status = err.response?.status || 500;
    const msg = err.response?.data || err.message;
    return res.status(status).json({ ok: false, error: msg });
  }
});

// 2) VERIFICA PAGAMENTO (chiamata al rientro dal checkout)
router.post("/api/payments/viva/verify", express.json(), async (req, res) => {
  try {
    const { transactionId, orderCode } = req.body;
    if (!transactionId || !orderCode) {
      return res.status(400).json({ ok: false, error: "Dati mancanti" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE orderCode = ?",
      [orderCode]
    );
    if (!rows.length) {
      return res.status(404).json({ ok: false, error: "Ordine non trovato" });
    }
    const rec = rows[0];

    const tr = await retrieveTransaction(transactionId);

    const ok =
      tr?.statusId === "F" &&
      String(tr?.orderCode) === String(orderCode) &&
      Math.round(Number(tr?.amount) * 100) === Number(rec.amountCents);

    if (ok) {
      await pool.query(
        "UPDATE orders SET status='PAID', transactionId=?, paidAt=NOW() WHERE orderCode=?",
        [transactionId, orderCode]
      );
      return res.json({
        ok: true,
        transaction: { id: tr.transactionId, status: tr.statusId },
      });
    } else {
      await pool.query(
        "UPDATE orders SET status='FAILED', transactionId=? WHERE orderCode=?",
        [transactionId, orderCode]
      );
      return res.json({
        ok: false,
        reason: "Mismatch o non finalized",
        transaction: tr,
      });
    }
  } catch (e) {
    const status = e.response?.status || 500;
    res.status(status).json({ ok: false, error: e.response?.data || e.message });
  }
});

module.exports = router;
