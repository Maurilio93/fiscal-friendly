// /httpdocs/server/payments/routes.js
const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// fetch compat
const _dynFetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const fetch = (...args) => (global.fetch ? global.fetch(...args) : _dynFetch(...args));

// Viva BASIC Auth helpers
function vivaBase() {
  const isSandbox = (process.env.VIVA_ENV || "sandbox").toLowerCase() === "sandbox";
  return isSandbox ? "https://demo.vivapayments.com" : "https://www.vivapayments.com";
}
function vivaBasicHeaders() {
  const mid = process.env.VIVA_MERCHANT_ID || "";
  const key = process.env.VIVA_API_KEY || "";
  if (!mid || !key) throw new Error("VIVA credentials missing (VIVA_MERCHANT_ID / VIVA_API_KEY)");
  const basic = Buffer.from(`${mid}:${key}`).toString("base64");
  return { Authorization: `Basic ${basic}` };
}
async function getOrderByCode(orderCode) {
  const url = `${vivaBase()}/api/orders/${orderCode}`;
  const r = await fetch(url, { headers: vivaBasicHeaders() });
  const txt = await r.text();
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Viva orders get failed: ${r.status} ${txt.slice(0,200)}`);
  return JSON.parse(txt);
}
function mapStateId(stateId) {
  switch (Number(stateId)) {
    case 0: return "pending";
    case 1: return "expired";
    case 2: return "canceled";
    case 3: return "paid";
    default: return "unknown";
  }
}

// POST /api/payments/viva/verify
router.post("/verify", async (req, res) => {
  try {
    const orderCode =
      (req.body && (req.body.orderCode || req.body.order_code)) ||
      req.query.orderCode ||
      req.headers["x-order-code"];

    if (!orderCode) {
      return res.status(400).json({ ok: false, error: "missing_orderCode", hint: "send {orderCode} in JSON body" });
    }

    const pool = getPool();

    // 1) ordine locale (per importo atteso)
    const [rows] = await pool.query(
      "SELECT amountCents, status FROM orders WHERE orderCode = ? LIMIT 1",
      [String(orderCode)]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: "order_not_found_in_db" });
    const expectedCents = Number(rows[0].amountCents);

    // 2) chiama Viva
    const viva = await getOrderByCode(String(orderCode));
    if (!viva) {
      try { await pool.query("UPDATE orders SET status=? WHERE orderCode=?", ["error", String(orderCode)]); } catch {}
      return res.status(404).json({ ok: false, error: "viva_order_not_found" });
    }

    // 3) coerenza importo / source
    const vivaCents = Math.round(Number(viva.RequestAmount) * 100);
    const sameAmount = Number.isFinite(expectedCents) && Number.isFinite(vivaCents)
      ? expectedCents === vivaCents : true;
    const sameSource = !process.env.VIVA_SOURCE_CODE || viva.SourceCode === process.env.VIVA_SOURCE_CODE;

    if (!sameAmount || !sameSource) {
      try { await pool.query("UPDATE orders SET status=? WHERE orderCode=?", ["mismatch", String(orderCode)]); } catch {}
      return res.status(409).json({
        ok: false,
        error: "order_data_mismatch",
        details: { sameAmount, sameSource, expectedCents, vivaCents, source: viva.SourceCode }
      });
    }

    // 4) mappa stato & persist
    const status = mapStateId(viva.StateId);
    try {
      if (status === "paid") {
        await pool.query(
          "UPDATE orders SET status='paid', paidAt=COALESCE(paidAt, NOW()) WHERE orderCode=?",
          [String(orderCode)]
        );
      } else if (["pending","expired","canceled"].includes(status)) {
        await pool.query("UPDATE orders SET status=? WHERE orderCode=?", [status, String(orderCode)]);
      }
    } catch {}

    // 5) risposta
    return res.json({
      ok: true,
      status,                   // pending | paid | expired | canceled | unknown
      stateId: Number(viva.StateId),
      requestAmount: viva.RequestAmount,
      requestAmountCents: vivaCents,
      sourceCode: viva.SourceCode,
      merchantTrns: viva.MerchantTrns,
      customerTrns: viva.CustomerTrns,
      expiration: viva.ExpirationDate
    });

  } catch (err) {
    console.error("VIVA_VERIFY_ERR", err && (err.stack || err.message) || String(err));
    return res.status(500).json({ ok: false, error: "verify_failed" });
  }
});

module.exports = router;
