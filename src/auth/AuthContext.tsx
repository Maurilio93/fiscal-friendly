// src/auth/AuthContext.tsx (estratto rilevante)
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/api";
import { getStatus } from "@/lib/api"; // ⬅️ usa l'helper che rispetta API_BASE

type AuthState = "guest" | "user";
type Ctx = {
  setUser: any;
  status: AuthState;
  user: User;
  ready: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  status: "guest",
  user: null,
  ready: false,
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthState>("guest");
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  async function bootstrap() {
    try {
      const r = await getStatus();      // ⬅️ QUI l’helper http() usa API_BASE
      setStatus(r.auth);
      setUser(r.user);
    } catch {
      setStatus("guest");
      setUser(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => { bootstrap(); }, []);

  async function refreshAuth() {
    setReady(false);
    await bootstrap();
  }

  return (
    <AuthCtx.Provider value={{ status, user, ready, refreshAuth }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);