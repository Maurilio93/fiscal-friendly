require("dotenv").config();
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");


const app = express();

/* ----------------------- CONFIG ----------------------- */
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const DB_PATH = path.join(__dirname, "data", "db.json");

// se stai dietro proxy (Plesk/Nginx) per cookie e IP reali
app.set("trust proxy", 1);

/* ----------------------- MIDDLEWARE ----------------------- */
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://tuodominio.it"], // <-- metti il tuo dominio reale
    credentials: true,
  })
);

/* ----------------------- MINI DB JSON ----------------------- */
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
function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}
function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "lax" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ----------------------- ROUTES ----------------------- */

// health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.get("/api/db-ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: rows[0].ok === 1 ? "ok" : "fail" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});


// REGISTER (login automatico)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email e password sono obbligatori" });
    }

    const db = await loadDb();
    const exists = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) return res.status(409).json({ error: "Email già registrata" });

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
    setAuthCookie(res, token);

    // 👇 invio mail NON bloccante (se fallisce, logga e continua)
    sendWelcomeEmail(email, name).catch(err =>
      console.error("Errore invio mail di benvenuto:", err)
    );

    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Errore interno" });
  }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email e password sono obbligatori" });
    }
    const db = await loadDb();
    const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(401).json({ error: "Credenziali non valide" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenziali non valide" });

    const token = signToken(user);
    setAuthCookie(res, token);
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Errore interno" });
  }
});

// ME (protetta)
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const db = await loadDb();
  const user = db.users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: "Utente non trovato" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// LOGOUT
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
});

/* ----------------------- START ----------------------- */
app.listen(PORT, () => console.log(`API in ascolto su http://localhost:${PORT}`));
