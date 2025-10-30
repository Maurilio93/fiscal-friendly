// src/lib/api.ts

// DEV: usa VITE_API_BASE (es. http://localhost:4000) se presente
// PROD: same-origin
const HOST = window.location.hostname;
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

const RAW_ENV =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE ?? "")
    .trim()
    .replace(/\/$/, "");

function resolveApiBase(): string {
  if (IS_LOCAL) return RAW_ENV || "http://localhost:4000";
  return window.location.origin;
}

export const API_BASE = resolveApiBase();

// ---- URL helper
function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

// ---- HTTP helper
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(joinUrl(API_BASE, path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      message = (data && (data.message || data.error || data.details)) || message;
    } catch {
      try {
        const text = await res.text();
        if (text) message = `HTTP ${res.status} ${text}`;
      } catch {}
    }
    throw new Error(message);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

/* ----------------------------- TIPI ----------------------------- */
export type User = { id: string; name: string; email: string } | null;

export type VivaOrderItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
  title?: string;
};

export type CartItem = {
  id: string;
  qty: number;
  unitPriceCents: number;
  title: string;
};

// Billing lato FE (match al “safeBilling” del backend)
export type BillingPayload = {
  type: "person" | "company";
  fullName?: string | null;
  companyName?: string | null;
  vatNumber?: string | null; // P.IVA
  cf?: string | null;        // Cod. Fiscale
  sdi?: string | null;       // Codice SDI
  pec?: string | null;
  address?: string | null;
  zip?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;          // default IT lato server
  email?: string | null;
  phone?: string | null;
};

export function centsToEUR(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ----------------------------- AUTH ----------------------------- */
export const getStatus = () =>
  http<{ auth: "guest" | "user"; user: { id: string; name: string; email: string } | null }>(
    "/api/auth/status"
  );

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

/* --------------------------- USER (placeholder) --------------------------- */
export const getOverview = () =>
  http<{ orders: unknown[]; tickets: unknown[]; subscriptions: unknown[] }>(
    "/api/user/overview"
  );

/* ------------------------- PAGAMENTI VIVA ------------------------ */

// ✅ Nuova funzione usata dal checkout FE (accetta anche billing)
export async function createOrder(payload: {
  customer?: { email?: string; fullName?: string };
  items: VivaOrderItem[];
  billing: BillingPayload;
}): Promise<{ paymentUrl: string; orderCode: string | number }> {
  return http("/api/payments/viva/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const createVivaOrder = (payload: {
  customer: { email: string; fullName: string };
  items: VivaOrderItem[];
  // 👇 aggiungi billing facoltativo
  billing?: any;
}) =>
  http<{ paymentUrl: string; orderCode: string | number }>(
    "/api/payments/viva/order",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

// Diagnostica
export const pingPayments = () =>
  http<{ ok: boolean; env?: string; token?: boolean }>("/api/payments/viva/ping");

export const requestPasswordReset = (email: string) =>
  http<{ ok: boolean }>("/api/auth/request-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token: string, newPassword: string) =>
  http<{ ok: boolean }>("/api/auth/reset", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });