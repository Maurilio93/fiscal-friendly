function resolveApiBase(): string {
  const env = (import.meta as any).env?.VITE_API_BASE?.trim();
  if (env) return env.replace(/\/$/, "");
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return ""; // usa proxy
  return "https://api.adoring-varahamihira.217-154-2-74.plesk.page"; // prod
}
export const API_BASE = resolveApiBase();

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  let payload: any = null;
  try {
    payload = await res.json();
  } catch {}
  if (!res.ok) throw new Error(payload?.error || `Errore ${res.status}`);
  return payload as T;
}
