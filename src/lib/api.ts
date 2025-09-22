export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function handleJson(res: Response) {
  let payload: any = null;
  try { payload = await res.json(); } catch {}
  if (!res.ok) throw new Error(payload?.error || `Errore ${res.status}`);
  return payload;
}

export type RegisterInput = { name: string; email: string; password: string };

export async function registerUser(data: RegisterInput) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // necessario per ricevere il cookie
    body: JSON.stringify(data),
  });
  return handleJson(res);
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
  return handleJson(res);
}

export async function logout() {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleJson(res);
}
