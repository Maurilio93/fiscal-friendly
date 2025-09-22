const BASE = "https://adoring-varahamihira.217-154-2-74.plesk.page";
async function http<T>(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // <<< IMPORTANTE per inviare il cookie
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return (await res.json()) as T;
}

export const registerUser = (data:{name:string; email:string; password:string}) =>
  http<{user:{id:string;name:string;email:string}}>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMe = () => http<{user:{id:string;name:string;email:string}|null}>("/api/auth/me");
export const login = (email:string, password:string) =>
  http<{user:{id:string;name:string;email:string}}>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const logout = () => http<{ok:true}>("/api/auth/logout", { method: "POST" });
