// server/src/db.ts (o il file dove crei il pool)
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "consultfast_user",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "consultfast_prod",

  // impostazioni consigliate
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",

  // 👇 fondamentale con MySQL 8 se non usi SSL
  allowPublicKeyRetrieval: true,

  // se non stai usando TLS, lascialo false
  ssl: false,
});