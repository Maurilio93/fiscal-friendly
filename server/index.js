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

const vivaRouter = require("./payments/viva"); // <— RIATTIVATO
// const { pool } = require("./db"); // opzionale

const app = express();
app.set("trust proxy", 1);

/* ----------------------- CORS ----------------------- */
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

/* ----------------------- MIDDLEWARE ----------------------- */
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 })); // express-rate-limit v7
app.use(express.json());
app.use(cookieParser());

// Log leggero per vedere se le richieste arrivano a Node
app.use("/api", (req, _res, next) => {
  console.log("[API]", req.method, req.path);
  next();
});

/* ----------------------- DB JSON (utenti) ----------------------- */
const DB_PATH = path.join(__dirname, "data", "db.json");
async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
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
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function newId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
}
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
function setAuthCookie(res, token, origin) {
  const crossSite = origin && origin.startsWith("http://localhost");
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: crossSite ? "none" : "lax",
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

/* ----------------------- API ROUTES ----------------------- */
// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.post("/api/payments/viva/order", (req, res) => {
  console.log("HIT /api/payments/viva/order", req.body);
  return res.status(200).json({ ok: true, echo: req.body });
});


// Auth
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email e password sono obbligatori" });
    }

    const db = await loadDb();
    if (db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return res.status(409).json({ error: "Email già registrata" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: newId(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    await saveDb(db);

    const token = signToken(user);
    setAuthCookie(res, token, req.headers.origin);

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    res.status(500).json({ error: "Errore interno" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email e password sono obbligatori" });
    }

    const db = await loadDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
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
  const user = db.users.find((u) => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: "Utente non trovato" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
});

// **PAGAMENTI VIVA** (tutto sotto /api/...)
app.use("/api", vivaRouter);

/* ----------------------- FRONTEND (SPA) ----------------------- */
// Root del sito (es. /httpdocs)
const clientRoot = path.join(__dirname, "..");
app.use(express.static(clientRoot));

// Fallback SPA per tutte le GET che NON iniziano con /api/
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(clientRoot, "index.html"));
});

// export app (il listen lo fa /httpdocs/index.js)
module.exports = app;

// avvio diretto in dev
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`API + Frontend in ascolto su http://localhost:${PORT}`)
  );
}
