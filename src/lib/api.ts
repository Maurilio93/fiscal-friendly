// src/lib/api.ts

// Base URL dell’API.
// In sviluppo puoi mettere VITE_API_BASE, in prod userà il dominio corrente.
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  (typeof window !== "undefined" ? window.location.origin : "");

// Wrapper fetch con cookie (sessione)
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  // se la risposta non è ok, prova a estrarre messaggio utile
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body?.error || msg;
    } catch {
      try { msg = await res.text(); } catch {}
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }

  // prova a fare json, se non è json (204 ecc.) restituisci undefined
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

// ---- API auth ----
export function registerUser(data: { name: string; email: string; password: string }) {
  return http<{ user: { id: string; name: string; email: string } }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(email: string, password: string) {
  return http<{ user: { id: string; name: string; email: string } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return http<{ user: { id: string; name: string; email: string } | null }>("/api/auth/me", {
    method: "GET",
  });
}

export function logout() {
  return http<{ ok: true }>("/api/auth/logout", { method: "POST" });
}
