// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type User = { id: string; name: string; email: string } | null;
type AuthState = { status: "loading" | "guest" | "user"; user: User };

type CtxShape = AuthState & {
  setUser: (u: User) => void;
  refreshAuth: () => Promise<void>;
};

const Ctx = createContext<CtxShape>({
  status: "loading",
  user: null,
  setUser: () => {},
  refreshAuth: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  const refreshAuth = async () => {
    try {
      const r = await fetch("/api/auth/status", { credentials: "include" });
      const j = await r.json();
      if (j?.auth === "user" && j?.user) {
        setState({ status: "user", user: j.user });
      } else {
        setState({ status: "guest", user: null });
      }
    } catch {
      setState({ status: "guest", user: null });
    }
  };

  useEffect(() => { void refreshAuth(); }, []);

  const setUser = (u: User) => {
    setState(prev => ({ status: u ? "user" : "guest", user: u }));
  };

  const value = useMemo(() => ({ ...state, setUser, refreshAuth }), [state]);

  // Finché non sappiamo se guest o user, NON renderizziamo l'app per evitare cambi di albero
  if (state.status === "loading") return <div style={{ padding: 16 }}>Caricamento…</div>;

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);