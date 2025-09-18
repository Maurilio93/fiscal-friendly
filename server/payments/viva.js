// server/payments/viva.js
const express = require("express");
const axios = require("axios");
const pool = require("../db"); // importa la connessione DB

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

function computeAmountCents(payload) {
  const n = Number(payload?.amountCents);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Importo non valido");
  return Math.round(n);
}

// ---------- ROUTES ----------

// Crea ordine
router.post("/api/payments/viva/order", express.json(), async (req, res) => {
  try {
    const amount = computeAmountCents(req.body);
    const customer = req.body?.customer || {};
    const token = await getAccessToken();

    const { data: order } = await axios.post(
      `${API_BASE}/checkout/v2/orders`,
      {
        amount,
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

    // 🔹 Salva nel DB come PENDING
    await pool.query(
      "INSERT INTO orders (orderCode, amountCents, status) VALUES (?, ?, 'PENDING')",
      [orderCodeStr, amount]
    );

    const color = process.env.BRAND_COLOR
      ? `&color=${process.env.BRAND_COLOR}`
      : "";
    const redirectUrl = `${CHECKOUT_BASE}/web/checkout?ref=${orderCodeStr}${color}`;

    return res.json({ ok: true, orderCode: orderCodeStr, redirectUrl });
  } catch (err) {
    const status = err.response?.status || 500;
    const msg = err.response?.data || err.message;
    return res.status(status).json({ ok: false, error: msg });
  }
});

// Recupera transazione
async function retrieveTransaction(transactionId) {
  const token = await getAccessToken();
  const { data } = await axios.get(
    `${API_BASE}/checkout/v2/transactions/${transactionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

// Verifica pagamento
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
