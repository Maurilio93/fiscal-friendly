// src/lib/api.ts

// Regole:
// - DEV (frontend su localhost): usa VITE_API_BASE se presente, altrimenti http://localhost:4000
// - PROD (qualsiasi host non-local): same-origin (https://tuo-dominio/...)
//   ↑ il backend risponde su /api nello stesso dominio, quindi va benissimo.

const HOST = window.location.hostname;
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

// Prendo la variabile solo per DEV, così non rischio di "sporcare" la prod
const RAW_ENV =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE ?? "")
    .trim()
    .replace(/\/$/, ""); // tolgo la slash finale

function resolveApiBase(): string {
  if (IS_LOCAL) {
    // In locale consenti override: VITE_API_BASE (es. http://localhost:4000)
    if (RAW_ENV) return RAW_ENV;
    return "http://localhost:4000";
  }
  // In produzione sempre same-origin
  return window.location.origin;
}

export const API_BASE = resolveApiBase();

// Helper che garantisce il formato corretto dell'URL (evita // doppi)
function joinUrl(base: string, path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

// Helper HTTP tipizzato
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(joinUrl(API_BASE, path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/* ----------------------------- AUTH ----------------------------- */
export const getMe = () =>
  http<{ user: { id: string; name: string; email: string } | null }>("/api/auth/me");

export const registerUser = (body: { name: string; email: string; password: string }) =>
  http<{ user: { id: string; name: string; email: string } }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const login = (email: string, password: string) =>
  http<{ user: { id: string; name: string; email: string } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () => http<{ ok: true }>("/api/auth/logout", { method: "POST" });

/* ----------------------------- USER ----------------------------- */
export const getOverview = () =>
  http<{ orders: unknown[]; tickets: unknown[]; subscriptions: unknown[] }>(
    "/api/user/overview"
  );

/* ------------------------- PAGAMENTI VIVA ------------------------ */
export type VivaOrderItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
  title?: string;
};

export const createVivaOrder = (payload: {
  customer: { email: string; fullName: string };
  items: VivaOrderItem[];
}) =>
  http<{ paymentUrl: string; orderCode: string }>("/api/payments/viva/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
// 
