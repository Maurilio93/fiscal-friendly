// src/lib/api.ts

function resolveApiBase(): string {
  const mode = import.meta.env.MODE; // 'development' | 'production'
  const env = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  const host = window.location.hostname;

  // Consenti VITE_API_BASE solo in dev
  if (mode !== "production" && env && env.trim()) {
    return env.trim().replace(/\/$/, "");
  }

  // Dev locale: front su 8080/5173 → API su 4000
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:4000";
  }

  // Produzione: stesso dominio del sito
  return window.location.origin;
}

// In prod stesso dominio
// In dev userai http://localhost:4000 tramite l'if su hostname === 'localhost'
export const API_BASE = resolveApiBase();

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  let payload: any = null;
  try { payload = await res.json(); } catch {}

  if (!res.ok) {
    const msg = payload?.error || payload?.message || `Errore ${res.status}`;
    throw new Error(msg);
  }
  return payload as T;
}

export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput    = { email: string; password: string };

export function registerUser(data: RegisterInput) {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function loginUser(data: LoginInput) {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify(data) }
  );
}

export function getMe() {
  return http<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/me"
  );
}

export function logout() {
  return http<{ ok: true }>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({}), // alcuni proxy/WAF bloccano POST vuoti
  });
}
