import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

/**
 * Protegge una rotta per utenti autenticati.
 * - Se admin=true richiede anche role === "admin".
 * - Se non autorizzato -> redirect a /login con ?next=<path attuale>
 */
export default function ProtectedRoute({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  const { status, user, refreshAuth } = useAuth();
  const location = useLocation();

  // All'avvio, se non sappiamo ancora nulla, prova ad aggiornare lo stato
  useEffect(() => {
    if (status !== "user") {
      // non blocca l'UI; se già noto resta così
      refreshAuth().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = encodeURIComponent(location.pathname + location.search);

  // non loggato -> vai al login
  if (status !== "user") {
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // richiede admin ma l'utente non lo è
  if (admin && user?.role !== "admin") {
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}