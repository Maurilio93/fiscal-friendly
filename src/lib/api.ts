// src/lib/api.ts

// In prod usa sempre l'origin della pagina; in dev usa VITE_API_BASE
const API_BASE =
  import.meta.env.MODE === "development"
    ? (import.meta.env.VITE_API_BASE as string | undefined) || "http://localhost:4000"
    : (typeof window !== "undefined" ? window.location.origin : "");

// 👉 lasciamo l'export per CartPage ecc.
export { API_BASE };

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json())?.error || msg; } catch { try { msg = await res.text(); } catch {} }
    throw new Error(msg || `HTTP ${res.status}`);
  }
  try { return (await res.json()) as T; } catch { return undefined as unknown as T; }
}

// export delle funzioni…
export const registerUser = (data:{name:string;email:string;password:string}) =>
  http<{user:{id:string;name:string;email:string}}>("/api/auth/register", { method:"POST", body: JSON.stringify(data) });

export const login = (email:string, password:string) =>
  http<{user:{id:string;name:string;email:string}}>("/api/auth/login", { method:"POST", body: JSON.stringify({email, password}) });

export const getMe = () => http<{user:{id:string;name:string;email:string}|null}>("/api/auth/me");
export const logout = () => http<{ok:true}>("/api/auth/logout", { method:"POST" });
