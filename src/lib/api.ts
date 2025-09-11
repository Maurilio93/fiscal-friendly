// src/lib/api.ts
const API_BASE = (import.meta.env.VITE_API_BASE ?? "http://localhost:4000").replace(/\/$/, "");

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // invia/riceve i cookie (necessario)
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  // Prova a leggere JSON anche in caso di errore
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

// Body {} così alcuni proxy/WAF non bloccano il POST "vuoto"
export async function logout() {
  return http<{ ok: true }>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

// (facoltativo) export per debug
export { API_BASE };
