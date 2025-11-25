// src/lib/api.ts

// In dev: usa same-origin (chiamate relative) così Vite proxy -> :4000
// In prod: same-origin
// Se vuoi forzare un base diverso, imposta VITE_API_BASE (es. "https://tuo-dominio")
const RAW_ENV =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE ?? "")
    .trim()
    .replace(/\/$/, "");

function resolveApiBase(): string {
  // Se definisci VITE_API_BASE la uso (sia in dev che in prod)
  if (RAW_ENV) return RAW_ENV;
  // Default: same-origin (stringa vuota -> joinUrl produrrà percorsi relativi tipo "/api/...").
  return "";
}

export const API_BASE = resolveApiBase();

/* ----------------------------- URL & HTTP ----------------------------- */
function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path; // se path è assoluto, lo lascio com'è
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

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
      } catch { /* no-op */ }
    }
    throw new Error(message);
  }

  try {
    return (await res.json()) as T;
  } catch {
    // alcune API potrebbero non avere body
    return undefined as unknown as T;
  }
}

/* ----------------------------- TIPI COMUNI ----------------------------- */
export type User = { id: string; name: string; email: string; role?: string } | null;

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
  http<{ user: {
    role: string; id: string; name: string; email: string 
} }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () => http<{ ok: true }>("/api/auth/logout", { method: "POST" });

export const requestPasswordReset = (email: string) =>
  http<{ ok: boolean }>("/api/auth/request-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export async function resetPassword(token, newPassword) {
  const res = await fetch("/api/auth/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Errore");
  return await res.json();
}

/* ----------------------------- USER ----------------------------- */
export type Overview = {
  orders: unknown[];
  tickets: unknown[];
  subscriptions: unknown[];
};

// Parametro opzionale: puoi chiamare getOverview() senza argomenti
export const getOverview = (q: string = "") =>
  http<Overview>(q ? `/api/user/overview?q=${encodeURIComponent(q)}` : "/api/user/overview");

/* ------------------------- PAGAMENTI VIVA ------------------------ */
// Funzione principale usata dal checkout (include anche billing)
export function createOrder(payload: {
  customer?: { email?: string; fullName?: string };
  items: VivaOrderItem[];
  billing: BillingPayload;  // <-- QUI billing, non billing_json!
}): Promise<{ paymentUrl: string; orderCode: string | number }> {
  return http("/api/payments/viva/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Alias retro-compatibile: se in qualche punto importi ancora createVivaOrder
export const createVivaOrder = (payload: {
  customer: { email: string; fullName: string };
  items: VivaOrderItem[];
  billing?: BillingPayload; // <-- QUI billing, non billing_json!
}) => createOrder({ ...payload, billing: payload.billing as BillingPayload });

// Diagnostica
export const pingPayments = () =>
  http<{ ok: boolean; env?: string; token?: boolean }>("/api/payments/viva/ping");

/* ======================= ADMIN API ======================= */
export type AdminOrder = {
  billing_json(billing_json: any): import("react").ReactNode;
  id: string | number;
  orderCode: string;
  user_id: string | null;
  guest_email?: string | null;
  amountCents: number;
  status: "created" | "paid" | "failed" | "refunded" | string;
  transactionId?: string | null;
  paidAt?: string | null;
  created_at?: string | null;
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: "user" | "admin";
  created_at?: string | null;
};

export type AdminLog = {
  id: number | string;
  ts: string; // ISO date
  level: "INFO" | "WARN" | "ERROR" | string;
  event: string;
  message?: string;
};

export const adminListOrders = (page = 1, q = "") =>
  http<{ orders: AdminOrder[]; page: number; total: number }>(
    `/api/admin/orders?page=${page}&q=${encodeURIComponent(q)}`
  );

export const adminListUsers = (page = 1, q = "") =>
  http<{ users: AdminUser[]; page: number; total: number }>(
    `/api/admin/users?page=${page}&q=${encodeURIComponent(q)}`
  );

export const adminListLogs = (page = 1, level = "") =>
  http<{
    items: AdminLog[]; logs: AdminLog[]; page: number; total: number 
}>(
    `/api/admin/logs?page=${page}&level=${encodeURIComponent(level)}`
  );

export const adminUserDocuments = (userId: string) =>
  http<{ documents: Array<{ id: string; label: string; url: string; created_at?: string }> }>(
    `/api/admin/users/${encodeURIComponent(userId)}/documents`
  );

  /* ----------------------------- USER ORDERS ----------------------------- */
export type UserOrder = {
  orderCode: string;
  status: string;
  amountCents: number;
  paidAt?: string;
  created_at?: string;
};

export const getMyOrders = () =>
  http<{ orders: UserOrder[] }>("/api/me/orders");