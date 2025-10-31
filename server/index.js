// /httpdocs/server/index.js
const path = require("path");
// Carica .env da /server/.env se esiste, altrimenti prova anche a risalire di una cartella
try {
  const localEnv = path.join(__dirname, ".env");
  require("dotenv").config({ path: localEnv });
} catch {}
try {
  if (!process.env.DB_HOST || !process.env.MYSQL_HOST) {
    const rootEnv = path.join(__dirname, "..", ".env");
    require("dotenv").config({ path: rootEnv });
  }
} catch {}

const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");


/* ==================== UPLOAD ==================== */
const UPLOAD_DIR = process.env.LOCAL_UPLOAD_DIR || path.join(__dirname, "uploads");
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch {}

function safeBase(str) {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").slice(0, 10);
    const base = safeBase(path.basename(file.originalname || "file", ext));
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${base}${ext || ""}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

/* ==================== MAILER (opzionale) ==================== */
let sendRaw = async () => ({ sent: false, reason: "no-mailer" });
let verifySmtp = async () => ({ ok: false, reason: "no-mailer" });
let sendWelcomeEmail = async () => {};
let notifyAdminNewRegistration = async () => {};
let sendPaymentConfirmationToUser = async () => {};
let notifyAdminPayment = async () => {};
try {
  ({
    sendRaw,
    verifySmtp,
    sendWelcomeEmail,
    notifyAdminNewRegistration,
    sendPaymentConfirmationToUser,
    notifyAdminPayment,
  } = require("./mailer"));
} catch (e) {
  console.warn("[MAILER] modulo non caricato:", e?.message || e);
}

/* ==================== DB (getPool o pool) ==================== */
let acquirePool;
try {
  const maybe = require("./db");
  if (typeof maybe.getPool === "function") acquirePool = () => maybe.getPool();
  else if (maybe.pool) acquirePool = () => maybe.pool;
  else throw new Error("db.js must export getPool() or pool");
} catch {
  acquirePool = () => { throw new Error("Missing ./db.js (export getPool() or pool)"); };
}

/* ==================== LOG FILE ==================== */
const LOG_PATH = path.join(__dirname, "app.log");
function flog(...args) {
  try { fs.appendFileSync(LOG_PATH, new Date().toISOString() + " " + args.join(" ") + "\n"); } catch {}
}

/* ==================== APP BASE ==================== */
const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "ff_auth";
const IS_PROD = process.env.NODE_ENV === "production";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(UPLOAD_DIR));

// fetch compat (node < 18)
const _dynFetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const fetch = (...args) => (global.fetch ? global.fetch(...args) : _dynFetch(...args));

/* ==================== AUTH HELPERS ==================== */
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
function optionalAuth(req, _res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) req.user = jwt.verify(token, JWT_SECRET);
  } catch {}
  next();
}
function computeRoleFromEmail(email, dbRole) {
  if (dbRole && typeof dbRole === "string") return dbRole;
  const em = String(email || "").toLowerCase();
  if (ADMIN_EMAILS.includes(em)) return "admin";
  return "user";
}
function isAdmin(req, res, next) {
  try {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ error: "forbidden" });
  } catch {
    return res.status(403).json({ error: "forbidden" });
  }
}

/* ==================== VIVA HELPERS ==================== */
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
function mapStateIdToStatus(stateId) {
  const n = Number(stateId);
  if (n === 0) return "pending";
  if (n === 1) return "expired";
  if (n === 2) return "canceled";
  if (n === 3) return "paid";
  return "unknown";
}

/* ==================== VIVA GET WEBHOOK KEY ==================== */
app.get("/api/payments/viva/webhook", (_req, res) => {
  const key = (process.env.VIVA_MESSAGES_KEY || "").trim();
  if (key) return res.status(200).json({ Key: key });
  return res.status(500).json({ error: "missing_key" });
});

/* ==================== VIVA CREATE ORDER ==================== */
app.post("/api/payments/viva/order", optionalAuth, async (req, res) => {
  try {
    const { customer = {}, items = [], billing = {} } = req.body || {};
    const email = (customer.email || "").trim();
    const fullName = (customer.fullName || "").trim();
    const userId = req.user?.sub || null;

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

    let dynamicDescriptor = null;
    try {
      const raw = (process.env.VIVA_DYNAMIC_DESCRIPTOR || "").trim();
      if (raw) {
        const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 13);
        if (cleaned) dynamicDescriptor = cleaned;
      }
    } catch {}

    const safeBilling = {
      type: (billing.type || "").toLowerCase() === "company" ? "company" : "person",
      fullName: (billing.fullName || "").toString().trim() || null,
      companyName: (billing.companyName || "").toString().trim() || null,
      vatNumber: (billing.vatNumber || "").toString().trim().toUpperCase() || null,
      cf: (billing.cf || "").toString().trim().toUpperCase() || null,
      sdi: (billing.sdi || "").toString().trim().toUpperCase() || null,
      pec: (billing.pec || "").toString().trim() || null,
      address: (billing.address || "").toString().trim() || null,
      zip: (billing.zip || "").toString().trim() || null,
      city: (billing.city || "").toString().trim() || null,
      province: (billing.province || "").toString().trim().toUpperCase() || null,
      country: (billing.country || "IT").toString().trim().toUpperCase(),
      email: (billing.email || email || "").toString().trim() || null,
      phone: (billing.phone || "").toString().trim() || null,
    };

    const orderBody = {
      amount: amountCents,
      sourceCode,
      merchantTrns,
      customerTrns,
      customer: { email: email || undefined, fullName: fullName || undefined },
      paymentTimeout: 300,
      preauth: false,
      allowRecurring: false,
      tags: ["subscription"],
      successUrl: process.env.VIVA_SUCCESS_URL,
      failureUrl: process.env.VIVA_FAILURE_URL,
    };
    if (dynamicDescriptor) orderBody.dynamicDescriptor = dynamicDescriptor;

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

    const m = raw.match(/"orderCode"\s*:\s*([0-9]{16})/i);
    if (!m) {
      flog("VIVA_ORDER_NO_CODE", raw.slice(0, 200));
      return res.status(500).json({ error: "missing_order_code_in_response" });
    }
    const orderCodeStr = m[1];
    const paymentUrl = `${CHECKOUT_BASE}${orderCodeStr}`;

    try {
      const pool = acquirePool();
      await pool.query(
        `INSERT INTO orders (
           orderCode, amountCents, total_cents, status,
           user_id, guest_email, guest_full_name,
           items_json, billing_json
         )
         VALUES (?, ?, ?, 'created', ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           amountCents     = VALUES(amountCents),
           total_cents     = VALUES(total_cents),
           user_id         = VALUES(user_id),
           guest_email     = VALUES(guest_email),
           guest_full_name = VALUES(guest_full_name),
           items_json      = VALUES(items_json),
           billing_json    = VALUES(billing_json)`,
        [
          orderCodeStr,
          amountCents,
          amountCents,
          userId,
          email || null,
          fullName || null,
          JSON.stringify(items || []),
          JSON.stringify(safeBilling || null),
        ]
      );

      if (Array.isArray(items) && items.length) {
        const values = [];
        const placeholders = [];
        items.forEach((it) => {
          values.push(
            orderCodeStr,
            String(it.id || it.sku || "sku"),
            String(it.title || "Prodotto"),
            Number(it.qty || 1),
            Number(it.unitPriceCents || 0)
          );
          placeholders.push("(?,?,?,?,?)");
        });
        try {
          await pool.query(
            `INSERT INTO order_items (orderCode, sku, title, qty, unit_price_cents)
             VALUES ${placeholders.join(",")}`,
            values
          );
        } catch {}
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

/* ==================== VIVA PING ==================== */
app.get("/api/payments/viva/ping", async (_req, res) => {
  try {
    const token = await getVivaAccessToken();
    return res.status(200).json({ ok: true, env: process.env.VIVA_ENV, token: !!token });
  } catch (e) {
    flog("VIVA_PING_ERR", e?.stack || e?.message || String(e));
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/* ==================== VIVA WEBHOOK ==================== */
const vivaJson = express.json({ limit: "1mb", type: "*/*" });
app.post("/api/payments/viva/webhook", vivaJson, async (req, res) => {
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

      try {
        const [[o]] = await pool.query(
          "SELECT guest_email, amountCents FROM orders WHERE orderCode=? LIMIT 1",
          [orderCode]
        );
        const totalEuro = Number(o?.amountCents || 0) / 100;

        if (o?.guest_email) {
          try {
            await sendPaymentConfirmationToUser(o.guest_email, orderCode, totalEuro);
          } catch (e) {
            flog("MAIL_PAY_USER_ERR", e?.message || String(e));
          }
        }
        try {
          await notifyAdminPayment(o?.guest_email || null, orderCode, totalEuro);
        } catch (e) {
          flog("MAIL_PAY_ADMIN_ERR", e?.message || String(e));
        }
      } catch (e) {
        flog("MAIL_PAY_QUERY_ERR", e?.message || String(e));
      }

    } else if (failedLike && orderCode) {
      await pool.query(`UPDATE orders SET status='failed' WHERE orderCode=?`, [orderCode]);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    flog("WEBHOOK_ERR", e?.message || String(e));
    return res.status(200).json({ ok: false });
  }
});

/* ==================== VIVA VERIFY (legacy) ==================== */
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

    const pool = acquirePool();
    const [rows] = await pool.query(
      "SELECT amountCents, status FROM orders WHERE orderCode = ? LIMIT 1",
      [String(orderCode)]
    );
    const row = rows?.[0];
    if (!row) return res.status(404).json({ ok: false, error: "order_not_found_in_db" });

    const base = (process.env.VIVA_ENV || "sandbox").toLowerCase() === "sandbox"
      ? "https://demo.vivapayments.com"
      : "https://www.vivapayments.com";

    const mid = process.env.VIVA_MERCHANT_ID || "";
    const key = process.env.VIVA_API_KEY || "";
    const basic = Buffer.from(`${mid}:${key}`).toString("base64");

    const url = `${base}/api/orders/${String(orderCode)}`;
    const r = await fetch(url, { headers: { Authorization: `Basic ${basic}` } });
    const txt = await r.text();

    if (r.status === 404) return res.status(404).json({ ok: false, error: "viva_order_not_found" });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "viva_orders_error", status: r.status, body: txt.slice(0,200) });
    }

    const viva = JSON.parse(txt);

    const expectedCents = Number(row.amountCents);
    const vivaCents = Math.round(Number(viva.RequestAmount) * 100);
    const sameAmount = Number.isFinite(expectedCents) && Number.isFinite(vivaCents)
      ? (expectedCents === vivaCents) : true;

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

    const stateId = Number(viva.StateId);
    const status = mapStateIdToStatus(stateId);

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

/* ==================== HEALTH ==================== */
app.get("/api/health", (_req, res) => { res.json({ ok: true, ts: Date.now() }); });
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

/* ==================== AUTH ==================== */
// REGISTER (compatibile con id AUTO_INCREMENT)
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

    const password_hash = await bcrypt.hash(password, 12);
    // niente id esplicito -> AUTO_INCREMENT
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name.trim(), email.toLowerCase(), password_hash]
    );

    // prendi lo user appena creato
    const [[u]] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()]
    );

    const role = computeRoleFromEmail(u.email, u.role);
    const user = { id: u.id, name: u.name, email: u.email, role };
    const token = signToken({ sub: user.id, email: user.email, name: user.name, role });
    setAuthCookie(res, token);

    (async () => {
      try {
        await sendWelcomeEmail(user.email, user.name);
        await notifyAdminNewRegistration(user.email, user.name);
      } catch (e) { flog("MAIL_ERR", e.message); }
    })();

    return res.status(201).json({ user });
  } catch (err) {
    const msg = (err && (err.sqlMessage || err.message)) || String(err);
    const code = err && (err.code || err.errno);
    flog("REGISTER_ERR", code || "", msg);
    return res.status(500).json({ error: "server_error", code, detail: msg });
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

    const role = computeRoleFromEmail(u.email, u.role);
    const user = { id: u.id, name: u.name, email: u.email, role };
    const token = signToken({ sub: user.id, email: user.email, name: user.name, role });
    setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    flog("LOGIN_ERR", err.stack || err.message);
    res.status(500).json({ error: "server_error" });
  }
});

// ME
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const { sub, name, email, role } = req.user || {};
  if (!sub) return res.status(401).json({ user: null });
  res.json({ user: { id: sub, name, email, role: role || computeRoleFromEmail(email) } });
});

// STATUS (mai 401)
app.get("/api/auth/status", (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.json({ auth: "guest", user: null });
    const { sub, name, email, role } = jwt.verify(token, JWT_SECRET);
    if (!sub) return res.json({ auth: "guest", user: null });
    return res.json({ auth: "user", user: { id: sub, name, email, role: role || computeRoleFromEmail(email) } });
  } catch {
    return res.json({ auth: "guest", user: null });
  }
});

// LOGOUT
app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

// REQUEST RESET (compatibile con password_resets senza 'used')
app.post("/api/auth/request-reset", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.json({ ok: true }); // non rivelare
    const pool = acquirePool();
    const [rows] = await pool.query(
      "SELECT id, name FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()]
    );
    if (!rows.length) return res.json({ ok: true });

    const u = rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // no 'id', no 'used' -> AUTO_INCREMENT e schema semplice
    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [u.id, token, expiresAt]
    );

    const link = `${process.env.APP_BASE_URL || ""}/reset-password?token=${token}`;
    try {
      const { sendPasswordResetEmail } = require("./mailer");
      await sendPasswordResetEmail(email, link, u.name);
    } catch (e) { flog("RESET_MAIL_ERR", e.message || String(e)); }

    res.json({ ok: true });
  } catch (e) {
    flog("REQUEST_RESET_ERR", e.message || String(e));
    res.status(200).json({ ok: true });
  }
});

// RESET (compatibile con schema senza 'used': elimino il token)
app.post("/api/auth/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword || String(newPassword).length < 8)
      return res.status(400).json({ error: "invalid_payload" });

    const pool = acquirePool();
    const [rows] = await pool.query(
      "SELECT id, user_id FROM password_resets WHERE token = ? AND expires_at > NOW() LIMIT 1",
      [token]
    );
    if (!rows.length) return res.status(400).json({ error: "invalid_or_expired_token" });

    const pr = rows[0];
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, pr.user_id]);
    // token monouso: lo elimino
    await pool.query("DELETE FROM password_resets WHERE id = ?", [pr.id]);

    res.json({ ok: true });
  } catch (e) {
    flog("RESET_ERR", e.message || String(e));
    res.status(500).json({ error: "server_error" });
  }
});

/* ==================== ADMIN ==================== */
app.get("/api/admin/ping", authMiddleware, isAdmin, (_req, res) => {
  res.json({ ok: true, area: "admin" });
});

// LIST ORDERS
app.get("/api/admin/orders", authMiddleware, isAdmin, async (req, res) => {
  try {
    const q      = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim().toLowerCase();
    const page   = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit || "20", 10)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (q) {
      where.push("(o.orderCode LIKE ? OR o.guest_email LIKE ? OR o.guest_full_name LIKE ?)");
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    if (status) {
      where.push("LOWER(o.status) = ?");
      params.push(status);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const pool = acquirePool();

    const [rows] = await pool.query(
      `SELECT o.orderCode, o.status, o.amountCents, o.total_cents, o.user_id,
              o.guest_email, o.guest_full_name, o.paidAt, o.transactionId, o.created_at
         FROM orders o
        ${whereSql}
        ORDER BY COALESCE(o.paidAt, o.created_at) DESC
        LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[cnt]] = await pool.query(
      `SELECT COUNT(*) AS total FROM orders o ${whereSql}`,
      params
    );

    return res.json({
      orders: rows,
      page,
      limit,
      total: Number(cnt?.total || 0),
    });
  } catch (e) {
    flog("ADMIN_ORDERS_LIST_ERR", e?.message || String(e));
    return res.status(500).json({ error: "server_error" });
  }
});

// ORDER DETAIL (+ items se tabella presente)
app.get("/api/admin/orders/:orderCode", authMiddleware, isAdmin, async (req, res) => {
  try {
    const orderCode = String(req.params.orderCode || "").trim();
    if (!orderCode) return res.status(400).json({ error: "missing_order_code" });

    const pool = acquirePool();
    const [[order]] = await pool.query(
      `SELECT o.* FROM orders o WHERE o.orderCode = ? LIMIT 1`,
      [orderCode]
    );
    if (!order) return res.status(404).json({ error: "not_found" });

    let items = [];
    try {
      const [rows] = await pool.query(
        `SELECT sku, title, qty, unit_price_cents
           FROM order_items
          WHERE orderCode = ?
          ORDER BY title ASC`,
        [orderCode]
      );
      items = rows || [];
    } catch {}

    return res.json({ order, items });
  } catch (e) {
    flog("ADMIN_ORDERS_DETAIL_ERR", e?.message || String(e));
    return res.status(500).json({ error: "server_error" });
  }
});

// ORDER DOCUMENTS (se tabelle presenti)
app.get("/api/admin/orders/:orderCode/documents", authMiddleware, isAdmin, async (req, res) => {
  try {
    const orderCode = String(req.params.orderCode || "").trim();
    if (!orderCode) return res.status(400).json({ error: "missing_order_code" });

    const pool = acquirePool();

    const [[o]] = await pool.query(
      "SELECT id, user_id FROM orders WHERE orderCode = ? LIMIT 1",
      [orderCode]
    );
    if (!o) return res.status(404).json({ error: "not_found" });

    const [docs] = await pool.query(
      `SELECT d.id, d.order_id, d.label, d.file_url, d.mime_type, d.size_bytes,
              d.uploaded_at, d.reviewed, d.note
         FROM user_documents d
        WHERE (d.order_id = ? OR d.user_id = ?)
        ORDER BY d.uploaded_at DESC`,
      [o.id, o.user_id]
    );

    return res.json({ documents: docs });
  } catch (e) {
    flog("ADMIN_ORDER_DOCS_ERR", e?.message || String(e));
    return res.status(500).json({ error: "server_error" });
  }
});

// USERS LIST
app.get("/api/admin/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));
    const offset = (page - 1) * limit;

    const pool = acquirePool();

    let where = "";
    const params = [];
    if (q) {
      where = "WHERE (LOWER(name) LIKE ? OR LOWER(email) LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, role
         FROM users
         ${where}
         ORDER BY name ASC
         LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total } = { total: 0 }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      params
    );

    const users = rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: computeRoleFromEmail(u.email, u.role),
    }));

    res.json({ users, page, limit, total: Number(total || 0) });
  } catch (e) {
    try { flog("ADMIN_USERS_ERR", e?.message || String(e)); } catch {}
    res.status(500).json({ error: "server_error" });
  }
});

// USER DETAIL
app.get("/api/admin/users/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const uid = String(req.params.id || "");
    const pool = acquirePool();

    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1",
      [uid]
    );
    if (!rows.length) return res.status(404).json({ error: "user_not_found" });

    const u = rows[0];
    const role = computeRoleFromEmail(u.email, u.role);

    let stats = { orders: null, documents: null };
    try {
      const [[{ cnt: ordersCnt } = { cnt: 0 }]] = await pool.query(
        "SELECT COUNT(*) AS cnt FROM orders WHERE user_id = ?",
        [uid]
      );
      stats.orders = Number(ordersCnt);
    } catch {}
    try {
      const [[{ cnt: docsCnt } = { cnt: 0 }]] = await pool.query(
        "SELECT COUNT(*) AS cnt FROM user_documents WHERE user_id = ?",
        [uid]
      );
      stats.documents = Number(docsCnt);
    } catch {}

    res.json({ user: { id: u.id, name: u.name, email: u.email, role }, stats });
  } catch (e) {
    try { flog("ADMIN_USER_DETAIL_ERR", e?.message || String(e)); } catch {}
    res.status(500).json({ error: "server_error" });
  }
});

// USER DOCS LIST
app.get("/api/admin/users/:id/documents", authMiddleware, isAdmin, async (req, res) => {
  try {
    const uid = String(req.params.id || "");
    const pool = acquirePool();

    const [docs] = await pool.query(
      `SELECT id, order_id, label, file_url, mime_type, size_bytes, uploaded_at, reviewed, note
         FROM user_documents
        WHERE user_id = ?
        ORDER BY uploaded_at DESC`,
      [uid]
    );

    res.json({ documents: docs });
  } catch (e) {
    try { flog("ADMIN_USER_DOCS_ERR", e?.message || String(e)); } catch {}
    res.status(500).json({ error: "server_error" });
  }
});

// DOC UPDATE
app.patch("/api/admin/documents/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const docId = String(req.params.id || "");
    const { reviewed, note } = req.body || {};

    let reviewedVal = null;
    if (typeof reviewed !== "undefined") {
      if (typeof reviewed === "boolean") reviewedVal = reviewed ? 1 : 0;
      else if (reviewed === 1 || reviewed === 0 || reviewed === "1" || reviewed === "0") {
        reviewedVal = Number(reviewed);
      } else {
        return res.status(400).json({ error: "invalid_reviewed" });
      }
    }

    let noteVal = null;
    if (typeof note !== "undefined") {
      if (note === null) noteVal = null;
      else if (typeof note === "string") noteVal = note.slice(0, 2000);
      else return res.status(400).json({ error: "invalid_note" });
    }

    const fields = [];
    const params = [];
    if (reviewedVal !== null) { fields.push("reviewed = ?"); params.push(reviewedVal); }
    if (typeof note !== "undefined") { fields.push("note = ?"); params.push(noteVal); }

    if (!fields.length) return res.status(400).json({ error: "nothing_to_update" });

    const pool = acquirePool();

    const [exist] = await pool.query(
      "SELECT id FROM user_documents WHERE id = ? LIMIT 1",
      [docId]
    );
    if (!exist.length) return res.status(404).json({ error: "document_not_found" });

    await pool.query(
      `UPDATE user_documents SET ${fields.join(", ")} WHERE id = ?`,
      [...params, docId]
    );

    const [[doc]] = await pool.query(
      "SELECT id, user_id, label, file_url, mime_type, size_bytes, uploaded_at, reviewed, note FROM user_documents WHERE id = ? LIMIT 1",
      [docId]
    );

    res.json({ ok: true, document: doc });
  } catch (e) {
    try { flog("ADMIN_DOC_UPDATE_ERR", e?.message || String(e)); } catch {}
    res.status(500).json({ error: "server_error" });
  }
});

// SMTP VERIFY
app.get("/api/admin/debug/smtp-verify", authMiddleware, isAdmin, async (_req, res) => {
  const r = await verifySmtp();
  if (!r.ok) return res.status(500).json(r);
  res.json(r);
});

// SMTP ENV
app.get("/api/admin/debug/smtp-env", authMiddleware, isAdmin, (_req, res) => {
  const mask = (v) => (v ? v.replace(/.(?=.{4})/g, "•") : null);
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST || null,
    SMTP_PORT: process.env.SMTP_PORT || null,
    SMTP_SECURE: process.env.SMTP_SECURE || null,
    SMTP_USER: process.env.SMTP_USER || null,
    SMTP_PASS: mask(process.env.SMTP_PASS || null),
    MAIL_FROM: process.env.MAIL_FROM || null,
  });
});

// SMTP TEST SEND (singola definizione, niente doppioni)
app.post("/api/admin/debug/send-test-email", authMiddleware, isAdmin, async (req, res) => {
  try {
    const to = String(req.body?.to || process.env.SMTP_USER || "").trim();
    if (!to) return res.status(400).json({ ok: false, error: "missing_to" });
    const subject = "Test SMTP ConsulFast";
    const html = `<p>Test SMTP OK - ${new Date().toISOString()}</p>`;
    const r = await sendRaw({ to, subject, html, text: `Test SMTP OK - ${Date.now()}` });
    if (!r.sent) return res.status(500).json({ ok: false, reason: r.reason || null, error: r.error || null });
    return res.json({ ok: true, result: r });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

/* ==================== AREA UTENTE: DOCUMENTI ==================== */
app.get("/api/me/documents", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.sub;
    const pool = acquirePool();
    const [rows] = await pool.query(
      `SELECT id, order_id, label, file_url, mime_type, size_bytes, uploaded_at, reviewed, note
         FROM user_documents
        WHERE user_id = ?
        ORDER BY uploaded_at DESC`,
      [uid]
    );
    res.json({ documents: rows });
  } catch (e) {
    flog("ME_DOCS_LIST_ERR", e.message || String(e));
    res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/me/documents", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const uid = req.user?.sub;
    const { label = "", orderCode = null } = req.body || {};
    const f = req.file;

    if (!f) return res.status(400).json({ error: "missing_file" });
    if (!label || String(label).trim().length < 2) {
      try { fs.unlinkSync(f.path); } catch {}
      return res.status(400).json({ error: "invalid_label" });
    }

    const okMime = /^(application\/pdf|image\/(jpeg|png|webp|gif))$/i.test(f.mimetype || "");
    if (!okMime) {
      try { fs.unlinkSync(f.path); } catch {}
      return res.status(415).json({ error: "unsupported_media_type" });
    }

    const fileUrl = `/uploads/${path.basename(f.path)}`;
    const mime = f.mimetype || null;
    const size = Number(f.size) || null;

    const pool = acquirePool();

    let order_id = null;
    if (orderCode) {
      try {
        const [r] = await pool.query("SELECT id FROM orders WHERE orderCode = ? LIMIT 1", [String(orderCode)]);
        if (r.length) order_id = r[0].id || null;
      } catch {}
    }

    await pool.query(
      `INSERT INTO user_documents
         (user_id, order_id, label, file_url, mime_type, size_bytes, uploaded_at, reviewed, note)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 0, NULL)`,
      [uid, order_id, String(label).trim(), fileUrl, mime, size]
    );

    res.status(201).json({ ok: true, fileUrl });
  } catch (e) {
    flog("ME_DOCS_UPLOAD_ERR", e.message || String(e));
    res.status(500).json({ error: "server_error" });
  }
});

/* ==================== GUARD RAILS ==================== */
process.on("unhandledRejection", (e) => flog("UNHANDLED_REJECTION", e?.stack || e));
process.on("uncaughtException", (e) => { flog("UNCAUGHT_EXCEPTION", e?.stack || e); });

/* ==================== START ==================== */
app.listen(PORT, () => {
  flog("SERVER_START", `port=${PORT} env=${process.env.NODE_ENV}`);
  console.log(`API ready on :${PORT}`);
});