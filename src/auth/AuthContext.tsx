// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/lib/api";
import { getStatus } from "@/lib/api";

type AuthState = "guest" | "user";

type Ctx = {
  status: AuthState;
  user: User; // { id, name, email, role?: "user" | "admin" } | null  (da @/lib/api)
  ready: boolean;
  refreshAuth: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthCtx = createContext<Ctx>({
  status: "guest",
  user: null,
  ready: false,
  refreshAuth: async () => {},
  setUser: () => {}, // no-op di default (evita "is not a function")
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState>("guest");
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  async function bootstrap() {
    try {
      const r = await getStatus(); // usa http() con API_BASE corretta
      setStatus(r.auth);
      setUser(r.user);             // conserva anche r.user.role (admin/user)
    } catch {
      setStatus("guest");
      setUser(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    void bootstrap();
  }, []);

  async function refreshAuth() {
    setReady(false);
    await bootstrap();
  }

  return (
    <AuthCtx.Provider value={{ status, user, ready, refreshAuth, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);