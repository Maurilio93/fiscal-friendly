// src/lib/api.ts

// Regole:
// - DEV (frontend su localhost): usa VITE_API_BASE se presente, altrimenti http://localhost:4000
// - PROD (qualsiasi host non-local): same-origin (https://tuo-dominio/...)
//   ↑ il backend risponde su /api nello stesso dominio.

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

// Helper che garantisce il formato corretto dell'URL (evita // doppi).
// Se path è già un URL assoluto (http/https), lo ritorna così com'è.
function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

// Helper HTTP tipizzato con gestione errori migliorata
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(joinUrl(API_BASE, path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  // prova a parsare JSON sempre; in errore usa messaggio più leggibile
  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      message =
        (data && (data.message || data.error || data.details)) ||
        message;
    } catch {
      try {
        const text = await res.text();
        if (text) message = `HTTP ${res.status} ${text}`;
      } catch {
        /* no-op */
      }
    }
    throw new Error(message);
  }

  // ok
  try {
    return (await res.json()) as T;
  } catch {
    // alcune API potrebbero non avere body
    return undefined as unknown as T;
  }
}

/* ----------------------------- TIPI ----------------------------- */
export type User = { id: string; name: string; email: string } | null;

// Tipo degli item che il BACKEND accetta (title facoltativo lato API)
export type VivaOrderItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
  title?: string;
};

// Tipo comodo per il carrello lato FE (title richiesto nel UI)
export type CartItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
  title: string;
};

export function centsToEUR(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
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

export const logout = () =>
  http<{ ok: true }>("/api/auth/logout", { method: "POST" }); // il caller può ignorare il valore

/* ----------------------------- USER ----------------------------- */
export const getOverview = () =>
  http<{ orders: unknown[]; tickets: unknown[]; subscriptions: unknown[] }>(
    "/api/user/overview"
  );

/* ------------------------- PAGAMENTI VIVA ------------------------ */
export const createVivaOrder = (payload: {
  customer: { email: string; fullName: string };
  items: VivaOrderItem[]; // puoi passare direttamente gli item del carrello mappandoli a questo tipo
}) =>
  http<{ paymentUrl: string; orderCode: string | number }>("/api/payments/viva/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// (opzionale) ping rapido per diagnosi
export const pingPayments = () =>
  http<{ ok: boolean; env?: string; token?: boolean }>("/api/payments/viva/ping");
