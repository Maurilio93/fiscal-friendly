import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { login } from "../lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, refreshAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se già loggato, esci subito dalla pagina di login (senza chiamare /api/auth/me)
  useEffect(() => {
    if (status === "user") {
      const next = new URLSearchParams(location.search).get("next") || "/area-utenti";
      navigate(next, { replace: true });
    }
  }, [status, location.search, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password); // setta cookie HttpOnly lato server
      await refreshAuth();          // aggiorna AuthProvider (status -> "user")
      const next = new URLSearchParams(location.search).get("next") || "/area-utenti";
      navigate(next, { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? (err.message.includes("invalid") || err.message.includes("401")
              ? "Credenziali non valide."
              : err.message)
          : "Errore di accesso.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Accedi alla tua Area</CardTitle>
          <CardDescription>
            Inserisci le credenziali per continuare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {location.state?.justRegistered && (
            <p className="mb-4 text-green-600 text-sm text-center">
              ✅ Registrazione completata! Ora effettua il login.
            </p>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gradient-hero hover:opacity-90"
              disabled={submitting}
            >
              {submitting ? "Accesso in corso…" : "Accedi"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Non hai un account?{" "}
              <Link to="/registrazione" className="underline">
                Registrati
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}