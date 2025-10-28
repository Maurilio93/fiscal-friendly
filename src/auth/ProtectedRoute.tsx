// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status } = useAuth(); // viene dal nuovo AuthContext che abbiamo appena preparato
  const loc = useLocation();

  if (status === "loading") return null; // il Provider mostra già un placeholder

  if (status === "guest") {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
