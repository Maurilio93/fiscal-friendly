import React, { useState } from "react";
import { registerUser, getMe } from "../lib/api";

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
  // 👇 stessi state/campi/logica
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      const me = await getMe(); // verifica sessione
      alert(`Registrazione completata! Benvenut* ${me.user.name}.`);
      // TODO: qui dopo faremo redirect all'area clienti
    } catch (err: any) {
      alert(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl tracking-tight">
            Registrazione
          </CardTitle>
          <CardDescription>
            Crea il tuo account per accedere all’area clienti.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#FF6B6B] ">
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
