require("dotenv").config();
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const cors = require("cors");  // <-- NON usarlo insieme al blocco manuale
const { sendWelcomeEmail } = require("./mailer");
// const { pool } = require("./db"); // se non lo usi, puoi commentarlo

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const DB_PATH = path.join(__dirname, "data", "db.json");

app.set("trust proxy", 1);

/* ----------------------- CORS (PRIMO MIDDLEWARE!) ----------------------- */
const ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://adoring-varahamihira.217-154-2-74.plesk.page",
  "https://api.adoring-varahamihira.217-154-2-74.plesk.page",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ----------------------- ALTRI MIDDLEWARE ----------------------- */
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());

/* ----------------------- JSON mini DB ----------------------- */
async function ensureDb() {
  try { await fs.access(DB_PATH); }
  catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}
async function loadDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw || '{"users":[]}');
}
async function saveDb(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

/* ----------------------- UTILS ----------------------- */
function newId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
}
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}
// Se testi da localhost verso dominio https, per far salvare il cookie:
function setAuthCookie(res, token, origin) {
  const crossSite = origin && origin.startsWith("http://localhost");
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,                         // richiesto da SameSite=None
    sameSite: crossSite ? "none" : "lax", // "none" per localhost -> dominio https
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ----------------------- ROUTES ----------------------- */
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email e password sono obbligatori" });

    const db = await loadDb();
    if (db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase()))
      return res.status(409).json({ error: "Email già registrata" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: newId(), name, email, passwordHash, createdAt: new Date().toISOString() };
    db.users.push(user);
    await saveDb(db);

    const token = signToken(user);
    setAuthCookie(res, token, req.headers.origin);

    sendWelcomeEmail(email, name).catch(err => console.error("Mail welcome error:", err));

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    res.status(500).json({ error: "Errore interno" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email e password sono obbligatori" });

    const db = await loadDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(401).json({ error: "Credenziali non valide" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenziali non valide" });

    const token = signToken(user);
    setAuthCookie(res, token, req.headers.origin);
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    res.status(500).json({ error: "Errore interno" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const db = await loadDb();
  const user = db.users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: "Utente non trovato" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
});

/* ----------------------- START ----------------------- */
app.listen(PORT, () => console.log(`API in ascolto su http://localhost:${PORT}`));
