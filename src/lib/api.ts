// src/lib/api.ts

/** Determina in modo robusto la base delle API */
function resolveApiBase(): string {
  const env = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  if (env && env.trim()) return env.trim().replace(/\/$/, "");

  const host = window.location.hostname;

  // Siamo in locale?
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:4000";
  }

  // Siamo sul dominio pubblico: usa il sottodominio api.<dominio>
  // Se già siamo su api.<dominio>, mantieni quello.
  if (host.startsWith("api.")) {
    return `https://${host}`;
  }
  return `https://api.${host}`;
}

export const API_BASE = resolveApiBase();
console.log("[API_BASE]", API_BASE); // <-- utile per verificare a runtime

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // cookie on/off
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  let payload: any = null;
  try { payload = await res.json(); } catch { /* ignore */ }

  if (!res.ok) {
    const msg = payload?.error || payload?.message || `Errore ${res.status}`;
    throw new Error(msg);
  }
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
  return http<{ ok: true }>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
