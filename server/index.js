const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "ff_auth";

// --- logger semplice su file leggibile in Plesk (File Manager) ---
const LOG_PATH = path.join(__dirname, "app.log");
function flog(...args) {
  try {
    fs.appendFileSync(
      LOG_PATH,
      new Date().toISOString() + " " + args.join(" ") + "\n"
    );
  } catch {}
}
// ------------------------------------------------------------------

app.set("trust proxy", 1);
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Se API e frontend sono su lo stesso dominio, NON serve CORS.
// Se usi un dominio diverso, scommenta qui sotto:
//
// const cors = require("cors");
// app.use(cors({
//   origin: "https://TUO-DOMINIO",
//   credentials: true
// }));

// ---------------- helpers ----------------
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd, // true in HTTPS
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// ---------------- health -----------------
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ db: "ok" });
  } catch (err) {
    flog("DB_HEALTH_ERR", err.message);
    res.status(500).json({ error: "db_error" });
  }
});

// --------------- AUTH --------------------
// POST /api/auth/register  {name, email, password}
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    // validazioni minime
    if (!name || typeof name !== "string" || name.trim().length < 2)
      return res.status(400).json({ error: "invalid_name" });
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email)) return res.status(400).json({ error: "invalid_email" });
    if (!password || password.length < 8) return res.status(400).json({ error: "weak_password" });

    // email unica?
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (rows.length) return res.status(409).json({ error: "email_taken" });

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase(), password_hash]
    );

    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase() };
    const token = signToken({ sub: user.id, email: user.email });
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    flog("REGISTER_ERR", err.stack || err.message);
    res.status(500).json({ error: "server_error" });
  }
});

// POST /api/auth/login  {email, password}
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "missing_fields" });

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ error: "invalid_credentials" });

    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const user = { id: u.id, name: u.name, email: u.email };
    const token = signToken({ sub: user.id, email: user.email });
    setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    flog("LOGIN_ERR", err.stack || err.message);
    res.status(500).json({ error: "server_error" });
  }
});

// GET /api/auth/me  -> user da cookie
app.get("/api/auth/me", (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ user: null });
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: payload.sub, email: payload.email } });
  } catch {
    res.status(401).json({ user: null });
  }
});

// --------------- avvio -------------------
app.listen(PORT, () => {
  flog("SERVER_START", `port=${PORT} env=${process.env.NODE_ENV}`);
  console.log(`API ready on :${PORT}`);
});
