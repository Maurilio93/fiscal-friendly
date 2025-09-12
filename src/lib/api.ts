// src/lib/api.ts

function resolveApiBase(): string {
  const env = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  if (env && env.trim()) return env.trim().replace(/\/$/, "");

  const host = window.location.hostname;

  // Dev locale: front su 8080/5173/3000 → API locale su 4000
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:4000";
  }

  // Prod: se siamo su api.* uso quello; altrimenti prefisso api.
  if (host.startsWith("api.")) return `https://${host}`;
  return `https://api.${host}`;
}

export const API_BASE = resolveApiBase();

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // necessario per inviare/ricevere il cookie HttpOnly
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // body vuoto/non JSON → ignoro
  }

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
    body: JSON.stringify({}),
  });
}
