// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../lib/api";

export type User = { id: string; name: string; email: string } | null;

const Ctx = createContext<{ user: User; setUser: (u: User) => void }>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  useEffect(() => { getMe().then(r => setUser(r.user ?? null)).catch(() => setUser(null)); }, []);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
