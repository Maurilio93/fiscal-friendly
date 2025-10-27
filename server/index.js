// /httpdocs/server/index.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- mailer opzionale
let sendWelcomeEmail = async () => {};
try { ({ sendWelcomeEmail } = require("./mailer")); } catch {}

// --- db: supporta sia { getPool } sia { pool }
let acquirePool;
try {
  const maybe = require("./db");
  if (typeof maybe.getPool === "function") acquirePool = () => maybe.getPool();
  else if (maybe.pool) acquirePool = () => maybe.pool;
  else throw new Error("db.js must export getPool() or pool");
} catch {
  acquirePool = () => { throw new Error("Missing ./db.js (export getPool() or pool)"); };
}

// --- logger su file (leggibile da Plesk)
const LOG_PATH = path.join(__dirname, "app.log");
function flog(...args) {
  try { fs.appendFileSync(LOG_PATH, new Date().toISOString() + " " + args.join(" ") + "\n"); } catch {}
}

// --- config
const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "ff_auth";
const IS_PROD = process.env.NODE_ENV === "production";

// dietro proxy Plesk per IP reali e cookie Secure
app.set("trust proxy", 1);

// security & parsing
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
// Viva talvolta invia */* come Content-Type: abilitiamo il parser globale
app.use(express.json({ limit: "1mb", type: "*/*" }));
app.use(cookieParser());

// fetch compat
const _dynFetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const fetch = (...args) => (global.fetch ? global.fetch(...args) : _dynFetch(...args));

/* ------------------------------------------------------------------ */
/*                             Helpers Viva                            */
/* ------------------------------------------------------------------ */

function resolveVivaEnv() {
  const isSandbox = (process.env.VIVA_ENV || "sandbox").toLowerCase() === "sandbox";
  return {
    OAUTH_URL: isSandbox
      ? "https://demo-accounts.vivapayments.com/connect/token"
      : "https://accounts.vivapayments.com/connect/token",
    API_BASE: isSandbox
      ? "https://demo-api.vivapayments.com"
      : "https://api.vivapayments.com",
    CHECKOUT_BASE: isSandbox
      ? "https://demo.vivapayments.com/web/checkout?ref="
      : "https://www.vivapayments.com/web/checkout?ref=",
  };
}

async function getVivaAccessToken() {
  const { OAUTH_URL } = resolveVivaEnv();
  const cid  = process.env.VIVA_CLIENT_ID || "";
  const csec = process.env.VIVA_CLIENT_SECRET || "";
  if (!cid || !csec) throw new Error("missing_client_env");
  const auth = Buffer.from(`${cid}:${csec}`).toString("base64");
  const r = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`oauth_failed ${r.status} ${txt.slice(0,200)}`);
  return JSON.parse(txt).access_token;
}

// --- Nuova API Orders (Bearer / OAuth)
async function getOrderNew(orderCode) {
  const { API_BASE } = resolveVivaEnv();
  const token = await getVivaAccessToken();
  const r = await fetch(`${API_BASE}/checkout/v2/orders/${orderCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const txt = await r.text();
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`orders_v2_get_failed ${r.status} ${txt.slice(0,200)}`);
  return JSON.parse(txt);
}

// Mappa lo stato numerico documentato da Viva
function mapStateIdToStatus(stateId) {
  const n = Number(stateId);
  if (n === 0) return "pending";  // in attesa
  if (n === 1) return "expired";  // scaduto
  if (n === 2) return "canceled"; // annullato
  if (n === 3) return "paid";     // pagato
  return "unknown";
}

/* ------------------------------------------------------------------ */
/*                      Viva: GET di verifica (Key)                    */
/* ------------------------------------------------------------------ */
app.get("/api/payments/viva/webhook", (_req, res) => {
  const key = (process.env.VIVA_MESSAGES_KEY || "").trim();
  if (key) return res.status(200).json({ Key: key });
  return res.status(500).json({ error: "missing_key" });
});

/* ------------------------------------------------------------------ */
/*                         Viva: CREATE ORDER                          */
/* ------------------------------------------------------------------ */
app.post("/api/payments/viva/order", authMiddleware, async (req, res) => {
  try {
    const { customer = {}, items = [] } = req.body || {};
    const email = (customer.email || "").trim();
    const fullName = (customer.fullName || "").trim();

    const userId = req.user?.sub;            // <<< collega all'utente
    if (!userId) return res.status(401).json({ error: "not_authenticated" });

    const amountCents = Array.isArray(items) && items.length
      ? items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.unitPriceCents || 0), 0)
      : 10000;

    if (!amountCents || Number.isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: "Importo non valido" });
    }

    const { API_BASE, CHECKOUT_BASE } = resolveVivaEnv();
    const sourceCode = process.env.VIVA_SOURCE_CODE || "";
    if (!sourceCode) return res.status(500).json({ error: "missing_source_code" });

    const access_token = await getVivaAccessToken();

    const merchantTrns = `SUB-${Date.now()}`;
    const customerTrns = items?.[0]?.title || "Abbonamento";

    const orderBody = {
      amount: amountCents,
      sourceCode,
      merchantTrns,
      customerTrns,
      customer: {
        email: email || undefined,
        fullName: fullName || undefined,
      },
      paymentTimeout: 300,
      preauth: false,
      allowRecurring: false,
      tags: ["subscription"],
      successUrl: process.env.VIVA_SUCCESS_URL,
      failureUrl: process.env.VIVA_FAILURE_URL,
    };

    const orderRes = await fetch(`${API_BASE}/checkout/v2/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });

    const raw = await orderRes.text();
    if (!orderRes.ok) {
      flog("VIVA_ORDER_ERR", orderRes.status, raw.slice(0, 300));
      return res.status(orderRes.status).json({ error: "create_order_failed", details: raw });
    }

    // estrai l'orderCode a 16 cifre come stringa
    const m = raw.match(/"orderCode"\s*:\s*([0-9]{16})/i);
    if (!m) {
      flog("VIVA_ORDER_NO_CODE", raw.slice(0, 200));
      return res.status(500).json({ error: "missing_order_code_in_response" });
    }
    const orderCodeStr = m[1];
    const paymentUrl = `${CHECKOUT_BASE}${orderCodeStr}`;

    // --- SALVA nel DB associandolo all'utente + items
    try {
      const pool = acquirePool();

      await pool.query(
        `INSERT INTO orders (orderCode, amountCents, total_cents, status, user_id, items_json)
         VALUES (?, ?, ?, 'created', ?, ?)
         ON DUPLICATE KEY UPDATE amountCents = VALUES(amountCents), total_cents = VALUES(total_cents), user_id = VALUES(user_id), items_json = VALUES(items_json)`,
        [orderCodeStr, amountCents, amountCents, userId, JSON.stringify(items || [])]
      );

      // (opzionale) salva anche le righe normalizzate
      if (Array.isArray(items) && items.length) {
        const values = [];
        const placeholders = [];

        items.forEach((it) => {
          values.push(orderCodeStr, String(it.id || it.sku || "sku"), String(it.title || "Prodotto"), Number(it.qty || 1), Number(it.unitPriceCents || 0));
          placeholders.push("(?,?,?,?,?)");
        });

        await pool.query(
          `INSERT INTO order_items (orderCode, sku, title, qty, unit_price_cents) VALUES ${placeholders.join(",")}`,
          values
        );
      }
    } catch (e) {
      flog("ORDERS_INSERT_ERR", e?.message || String(e));
    }

    return res.json({ paymentUrl, orderCode: orderCodeStr });
  } catch (err) {
    flog("VIVA_ORDER_CATCH", err?.stack || err?.message || String(err));
    return res.status(500).json({ error: "server_error", detail: String(err) });
  }
});

/* ------------------------------------------------------------------ */
/*                             Viva: PING                              */
/* ------------------------------------------------------------------ */
app.get("/api/payments/viva/ping", async (_req, res) => {
  try {
    const token = await getVivaAccessToken();
    return res.status(200).json({ ok: true, env: process.env.VIVA_ENV, token: !!token });
  } catch (e) {
    flog("VIVA_PING_ERR", e?.stack || e?.message || String(e));
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

// --------------------------------------------------------------
app.get("/api/payments/viva/_probeLegacy", async (req, res) => {
  try {
    const oc = String(req.query.orderCode || "");
    const base = (process.env.VIVA_ENV || "sandbox").toLowerCase() === "sandbox"
      ? "https://demo.vivapayments.com"
      : "https://www.vivapayments.com";
    const u = `${base}/api/orders/${oc}`;

    const basic = Buffer.from(`${process.env.VIVA_MERCHANT_ID}:${process.env.VIVA_API_KEY}`).toString("base64");
    const r = await fetch(u, { headers: { Authorization: `Basic ${basic}` } });
    const text = await r.text();

    res.status(200).json({
      url: u,
      status: r.status,
      ok: r.ok,
      snippet: text.slice(0, 200)
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});


/* ------------------------------------------------------------------ */
/*                     Viva: WEBHOOK (pagamento OK/KO)                 */
/* ------------------------------------------------------------------ */
// (lasciamo il webhook invariato: se arriva una notifica, aggiorna)
app.post("/api/payments/viva/webhook", async (req, res) => {
  try {
    const body = req.body || {};
    const data = body.EventData || body.Data || body.Payload || {};
    const orderCode = String(data.OrderCode || data.OrderId || "");
    const transactionId = String(data.TransactionId || data.EventId || "");
    const amount = Number(data.Amount || data.AmountAuthorized || data.ApprovedAmount || 0);

    const eventName = body.EventName || body.EventType || body.Event || "";
    const eventTypeId = Number(body.EventTypeId || body.EventTypeID || 0);

    const paidLike =
      /payment.*created|charge\.completed|transaction payment created/i.test(eventName) ||
      eventTypeId === 1796 ||
      (data.Status && /captured|approved|completed/i.test(String(data.Status)));

    const failedLike =
      /failed|declined/i.test(eventName) ||
      eventTypeId === 1798 ||
      (data.Status && /failed|declined|canceled|cancelled/i.test(String(data.Status)));

    const pool = acquirePool();

    if (paidLike && orderCode) {
      await pool.query(
        `UPDATE orders
           SET status='paid',
               transactionId=COALESCE(?, transactionId),
               paidAt=NOW()
         WHERE orderCode=?`,
        [transactionId || null, orderCode]
      );
      try {
        await pool.query(
          `INSERT INTO pagamenti (orderCode, transactionId, amountCents, createdAt)
           VALUES (?, ?, ?, NOW())`,
          [orderCode, transactionId || null, Number.isFinite(amount) ? amount : null]
        );
      } catch {}
    } else if (failedLike && orderCode) {
      await pool.query(`UPDATE orders SET status='failed' WHERE orderCode=?`, [orderCode]);
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(200).json({ ok: false });
  }
});


/* ------------------------------------------------------------------ */
/*  Viva: VERIFY */
/* ------------------------------------------------------------------ */
app.post("/api/payments/viva/verify", async (req, res) => {
  try {
    const orderCode =
      (req.body && (req.body.orderCode || req.body.order_code)) ||
      req.query.orderCode ||
      req.headers["x-order-code"];

    if (!orderCode) {
      return res.status(400).json({
        ok: false,
        error: "missing_params_orderCode",
        hint: "Send {orderCode} in JSON body or ?orderCode=.."
      });
    }

    // 1) Controllo che l’ordine esista nel DB locale (serve per l’importo atteso)
    const pool = acquirePool();
    const [rows] = await pool.query(
      "SELECT amountCents, status FROM orders WHERE orderCode = ? LIMIT 1",
      [String(orderCode)]
    );
    const row = rows?.[0];
    if (!row) {
      return res.status(404).json({ ok: false, error: "order_not_found_in_db" });
    }

    // 2) Chiamo la Legacy Orders API (Basic) — è quella che sappiamo funzionare
    const base = (process.env.VIVA_ENV || "sandbox").toLowerCase() === "sandbox"
      ? "https://demo.vivapayments.com"
      : "https://www.vivapayments.com";

    const mid = process.env.VIVA_MERCHANT_ID || "";
    const key = process.env.VIVA_API_KEY || "";
    const basic = Buffer.from(`${mid}:${key}`).toString("base64");

    const url = `${base}/api/orders/${String(orderCode)}`;
    const r = await fetch(url, { headers: { Authorization: `Basic ${basic}` } });
    const txt = await r.text();

    if (r.status === 404) {
      // ATTENZIONE: questo 404 è "su Viva" → order code non esiste per quel merchant
      return res.status(404).json({ ok: false, error: "viva_order_not_found" });
    }
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "viva_orders_error", status: r.status, body: txt.slice(0,200) });
    }

    const viva = JSON.parse(txt); // struttura legacy

    // 3) Confronto importo e (opzionale) source
    const expectedCents = Number(row.amountCents);
    const vivaCents = Math.round(Number(viva.RequestAmount) * 100);
    const sameAmount = Number.isFinite(expectedCents) && Number.isFinite(vivaCents)
      ? (expectedCents === vivaCents)
      : true;

    const sameSource = !process.env.VIVA_SOURCE_CODE
      || viva.SourceCode === process.env.VIVA_SOURCE_CODE;

    if (!sameAmount || !sameSource) {
      try {
        await pool.query("UPDATE orders SET status=? WHERE orderCode=?", ["mismatch", String(orderCode)]);
      } catch {}
      return res.status(409).json({
        ok: false,
        error: "order_data_mismatch",
        details: { sameAmount, sameSource, expectedCents, vivaCents, source: viva.SourceCode }
      });
    }

    // 4) Mappa stato e aggiorna DB
    const stateId = Number(viva.StateId);
    let status = "unknown";
    if (stateId === 0) status = "pending";
    else if (stateId === 1) status = "expired";
    else if (stateId === 2) status = "canceled";
    else if (stateId === 3) status = "paid";

    try {
      if (status === "paid") {
        await pool.query(
          `UPDATE orders SET status='paid', paidAt=COALESCE(paidAt, NOW()) WHERE orderCode=?`,
          [String(orderCode)]
        );
      } else if (status === "expired" || status === "canceled" || status === "pending") {
        await pool.query(`UPDATE orders SET status=? WHERE orderCode=?`, [status, String(orderCode)]);
      }
    } catch {}

    return res.json({
      ok: true,
      mode: "legacy_basic",
      status,
      stateId,
      requestAmount: viva.RequestAmount,
      requestAmountCents: vivaCents,
      sourceCode: viva.SourceCode,
      merchantTrns: viva.MerchantTrns,
      customerTrns: viva.CustomerTrns,
      expiration: viva.ExpirationDate
    });

  } catch (e) {
    flog("VERIFY_ERR_LEGACY", e?.stack || e?.message || String(e));
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});


/* ------------------------------------------------------------------ */
/*                               STATUS                                */
/* ------------------------------------------------------------------ */
app.get("/api/payments/viva/status/:orderCode", async (req, res) => {
  try {
    const oc = String(req.params.orderCode || "").trim();
    if (!oc) return res.status(400).json({ ok:false, error:"missing_order_code" });

    const pool = acquirePool();
    const [rows] = await pool.query(
      "SELECT status, transactionId, paidAt FROM orders WHERE orderCode = ?",
      [oc]
    );
    if (!rows.length) return res.status(404).json({ ok:false, error:"not_found" });

    res.json({
      ok: true,
      status: rows[0].status,
      transactionId: rows[0].transactionId || null,
      paidAt: rows[0].paidAt || null,
    });
  } catch (e) {
    flog("STATUS_ERR", e?.message || String(e));
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

/* ------------------------------------------------------------------ */
/*                             HEALTHCHECK                             */
/* ------------------------------------------------------------------ */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    const pool = acquirePool();
    await pool.query("SELECT 1");
    res.json({ db: "ok" });
  } catch (err) {
    flog("DB_HEALTH_ERR", err.stack || err.message);
    res.status(500).json({ error: "db_error" });
  }
});

/* ------------------------------------------------------------------ */
/*                                  AUTH                               */
/* ------------------------------------------------------------------ */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ user: null });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ user: null });
  }
}

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || typeof name !== "string" || name.trim().length < 2)
      return res.status(400).json({ error: "invalid_name" });
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email))
      return res.status(400).json({ error: "invalid_email" });
    if (!password || password.length < 8)
      return res.status(400).json({ error: "weak_password" });

    const pool = acquirePool();
    const [found] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (found.length) return res.status(409).json({ error: "email_taken" });

    const id = crypto.randomUUID();
    const password_hash = await bcrypt.hash(password, 12);

    await pool.query(
      "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
      [id, name.trim(), email.toLowerCase(), password_hash]
    );

    const user = { id, name: name.trim(), email: email.toLowerCase() };
    const token = signToken({ sub: user.id, email: user.email, name: user.name });
    setAuthCookie(res, token);

    try { await sendWelcomeEmail(user.email, user.name); } catch (e) { flog("MAIL_ERR", e.message); }

    res.status(201).json({ user });
  } catch (err) {
    const msg = (err && (err.sqlMessage || err.message)) || String(err);
    const code = err && (err.code || err.errno);
    flog("REGISTER_ERR", code || "", msg);
    res.status(500).json({ error: "server_error", code, detail: msg });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "missing_fields" });

    const pool = acquirePool();
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ error: "invalid_credentials" });

    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const user = { id: u.id, name: u.name, email: u.email };
    const token = signToken({ sub: user.id, email: user.email, name: user.name });
    setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    flog("LOGIN_ERR", err.stack || err.message);
    res.status(500).json({ error: "server_error" });
  }
});

// ME
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const { sub, name, email } = req.user || {};
  if (!sub) return res.status(401).json({ user: null });
  res.json({ user: { id: sub, name, email } });
});


/* ------------------------------------------------------------------ */
/*                         USER OVERVIEW REALE                        */
/* ------------------------------------------------------------------ */
app.get("/api/user/overview", authMiddleware, async (req, res) => {
  try {
    const pool = acquirePool();
    const uid = req.user?.sub;
    if (!uid) return res.status(401).json({ error: "not_authenticated" });

    // Queste tabelle possono anche non esistere ancora: gestiamo fallback vuoto
    const safeQuery = async (sql, params) => {
      try { const [rows] = await pool.query(sql, params); return rows; }
      catch { return []; }
    };

    const orders = await safeQuery(
      "SELECT id, total_cents, created_at FROM orders WHERE user_id = ? ORDER BY id DESC",
      [uid]
    );
    const tickets = await safeQuery(
      "SELECT id, subject, status, created_at FROM tickets WHERE user_id = ? ORDER BY id DESC",
      [uid]
    );
    const subscriptions = await safeQuery(
      "SELECT id, plan, status, renew_at FROM subscriptions WHERE user_id = ? ORDER BY id DESC",
      [uid]
    );

    res.json({ orders, tickets, subscriptions });
  } catch (e) {
    flog("USER_OVERVIEW_ERR", e?.message || String(e));
    res.status(500).json({ error: "server_error" });
  }
});


// LOGOUT
app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/*                       I miei ordini (per frontend)                  */
/* ------------------------------------------------------------------ */
app.get("/api/me/orders", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.sub;
    if (!uid) return res.status(401).json({ error: "not_authenticated" });

    const pool = acquirePool();
    const [rows] = await pool.query(
      `SELECT orderCode, status, total_cents, amountCents, created_at, paidAt, transactionId, items_json
         FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC`,
      [uid]
    );

    // opzionale: se vuoi attaccare anche le righe normalizzate
    const byCode = {};
    rows.forEach(r => { byCode[r.orderCode] = r; });

    if (rows.length) {
      const codes = rows.map(r => r.orderCode);
      const [items] = await pool.query(
        `SELECT orderCode, sku, title, qty, unit_price_cents
           FROM order_items
          WHERE orderCode IN (${codes.map(()=>"?").join(",")})`,
        codes
      );
      const m = {};
      items.forEach(it => { (m[it.orderCode] ||= []).push(it); });
      rows.forEach(r => {
        const fromJson = Array.isArray(r.items_json) ? r.items_json : (typeof r.items_json === "string" ? JSON.parse(r.items_json || "[]") : []);
        r.items = m[r.orderCode] || fromJson || [];
        delete r.items_json;
      });
    }

    res.json({ orders: rows });
  } catch (e) {
    flog("ME_ORDERS_ERR", e?.message || String(e));
    res.status(500).json({ error: "server_error" });
  }
});


/* ------------------------------------------------------------------ */
/*                        guard rails (NO process exit)                */
/* ------------------------------------------------------------------ */
process.on("unhandledRejection", (e) => flog("UNHANDLED_REJECTION", e?.stack || e));
process.on("uncaughtException", (e) => { flog("UNCAUGHT_EXCEPTION", e?.stack || e); });

/* ------------------------------------------------------------------ */
/*                                 START                               */
/* ------------------------------------------------------------------ */
app.listen(PORT, () => {
  flog("SERVER_START", `port=${PORT} env=${process.env.NODE_ENV}`);
  console.log(`API ready on :${PORT}`);
});
