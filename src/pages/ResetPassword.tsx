import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api";

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token") || "";

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) setErr("Link non valido o mancante.");
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 8) return setErr("La password deve avere almeno 8 caratteri.");
    if (pwd !== pwd2) return setErr("Le password non coincidono.");
    setSubmitting(true);
    setErr(null);
    try {
      await resetPassword(token, pwd);
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (e: any) {
      setErr(e?.message || "Impossibile reimpostare la password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reimposta password</CardTitle>
          <CardDescription>Imposta una nuova password per il tuo account.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-sm text-green-600 text-center">Password aggiornata! Reindirizzamento…</p>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="pwd">Nuova password</Label>
                <Input
                  id="pwd"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  disabled={submitting || !token}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pwd2">Conferma password</Label>
                <Input
                  id="pwd2"
                  type="password"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  required
                  disabled={submitting || !token}
                />
              </div>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90" disabled={submitting || !token}>
                {submitting ? "Salvataggio…" : "Salva nuova password"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Link scaduto? <Link to="/password-dimenticata" className="underline">Richiedi un nuovo link</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}