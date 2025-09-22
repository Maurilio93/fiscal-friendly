import React, { useState } from "react";
import { registerUser, getMe } from "../lib/api";

export default function SignupForm() {
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
      alert(`Registrazione completata! Benvenut* ${me.user?.name}.`);
      // TODO: redirect all'area clienti
    } catch (err: any) {
      alert(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h2>Registrazione</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Nome</label><br />
        <input required value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Email</label><br />
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Password</label><br />
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Invio..." : "Registrati"}
      </button>
    </form>
  );
}
