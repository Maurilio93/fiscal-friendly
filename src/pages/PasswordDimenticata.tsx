import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/api";

export default function PasswordDimenticata() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErr(null);
    try {
      await requestPasswordReset(email);
      setDone(true); // l’API risponde sempre ok per privacy
    } catch (e: any) {
      setErr(e?.message || "Errore durante la richiesta");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Password dimenticata</CardTitle>
          <CardDescription>Inserisci la tua email: ti invieremo il link di reset.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-sm text-green-600 text-center">
              Se l’email esiste, riceverai un messaggio con il link per reimpostare la password.
            </p>
          ) : (
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
                  disabled={sending}
                />
              </div>
              {err && <p className="text-sm text-red-600">{err}</p>}
              <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90" disabled={sending}>
                {sending ? "Invio in corso…" : "Invia link di reset"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}