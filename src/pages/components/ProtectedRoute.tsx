import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function ProtectedRoute({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  const { status, user, refreshAuth } = useAuth();
  const location = useLocation();
  const [hydrated, setHydrated] = useState(false);

  // Primo mount: sincronizza lo stato auth, poi sblocca la valutazione
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refreshAuth();
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => { alive = false; };
  }, [refreshAuth]);

  const next = encodeURIComponent(
    `${location.pathname}${location.search}${location.hash || ""}`
  );

  // Finché non abbiamo provato ad aggiornare l’auth, non decidere (evita flicker)
  if (!hydrated) return null; // o un piccolo spinner

  // Non loggato -> login
  if (status !== "user") {
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // Richiede admin ma non lo è -> login (o 403, a tua scelta)
  if (admin && user?.role !== "admin") {
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}