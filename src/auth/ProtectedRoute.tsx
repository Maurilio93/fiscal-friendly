import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactNode;
  admin?: boolean;
  fallbackTo?: string;
};

export default function ProtectedRoute({
  children,
  admin = false,
  fallbackTo = "/login",
}: Props) {
  const { status, ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-muted-foreground">
        Verifica credenziali…
      </div>
    );
  }

  if (status !== "user") {
    return (
      <Navigate
        to={fallbackTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (admin && user?.role !== "admin") {
    return <Navigate to="/area-utenti" replace />;
  }

  return <>{children}</>;
}