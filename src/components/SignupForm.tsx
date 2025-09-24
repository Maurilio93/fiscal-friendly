import React, { useRef, useState } from "react";
import { registerUser } from "../lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function SignupForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // normalizza i dati
      const payload = {
        name: name.trim() || undefined,              // opzionale se lato server hai il fallback
        email: email.trim().toLowerCase(),
        password,
      };

      await registerUser(payload);

      // svuota stato
      setName("");
      setEmail("");
      setPassword("");

      // reset HTML in modo sicuro (la ref non è null)
      formRef.current?.reset();

      alert("Registrazione completata!");
      // eventualmente: navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Errore durante la registrazione";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl tracking-tight">Registrazione</CardTitle>
          <CardDescription>
            Crea il tuo account per accedere all’area clienti.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@esempio.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Invio..." : "Registrati"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Hai già un account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Accedi
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
