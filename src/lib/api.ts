// src/lib/api.ts
export const API_BASE = "https://api.adoring-varahamihira.217-154-2-74.plesk.page";

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  let payload: any = null;
  try { payload = await res.json(); } catch {}

  if (!res.ok) throw new Error(payload?.error || `Errore ${res.status}`);
  return payload as T;
}

export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput    = { email: string; password: string };

export async function registerUser(data: RegisterInput) {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export async function loginUser(data: LoginInput) {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export async function getMe() {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/me"
  );
}

export async function logout() {
  return http<{ ok: true }>(
    "/api/auth/logout",
    { method: "POST", body: JSON.stringify({}) }
  );
}
