// src/lib/api.ts
export const API_BASE =
  (import.meta as ImportMeta).env?.VITE_API_BASE?.trim()?.replace(/\/$/, "") ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : window.location.origin);

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// --- AUTH ---
export type RegisterPayload = { name?: string; email: string; password: string };

export async function registerUser(payload: RegisterPayload) {
  return http<{ ok?: boolean; user?: unknown }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return http<{ user: { id: string; name: string; email: string } | null }>(
    "/api/auth/me"
  );
}

export async function login(email: string, password: string) {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

// alias, nel caso qualche file usi loginUser
export { login as loginUser };

export async function logout() {
  return http<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

// --- USER ---
export async function getOverview() {
  return http<{ orders: unknown[]; tickets: unknown[]; subscriptions: unknown[] }>(
    "/api/user/overview"
  );
}
