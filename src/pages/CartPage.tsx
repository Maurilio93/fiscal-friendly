import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { API_BASE } from "../lib/api";

type CartItem = {
  id: string;
  qty: number;
  title?: string;
  unitPriceCents?: number;
  price?: number;
};

type ApiOrderResponse = {
  paymentUrl: string;
  orderCode: number;
};

export default function CartPage() {
  const { items, setQty, remove, clear, totalClientCents } = useCart();
  const cartItems = items as CartItem[]; 
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const payNow = async () => {
    setErr(null);
    if (!cartItems.length) { setErr("Carrello vuoto"); return; }
    if (!email || !fullName) { setErr("Inserisci nome ed email"); return; }

    setLoading(true);
    try {
      const payload = {
        customer: { email, fullName },
        items: cartItems.map((it: CartItem) => ({
          id: it.id,
          qty: it.qty,
          unitPriceCents:
            typeof it.unitPriceCents === "number"
              ? it.unitPriceCents
              : Math.round(((it.price ?? 0) as number) * 100),
          title: it.title ?? it.id,
        })),
      };

      const res = await fetch(`${API_BASE}/api/payments/viva/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // prova JSON, fallback a testo grezzo (es. HTML d’errore da server)
      let data: unknown = null;
      let raw: string | null = null;
      try { data = await res.json(); }
      catch { try { raw = await res.text(); } catch { /* ignore */ } }

      if (!res.ok) {
        const msg =
          (typeof data === "object" && data && "error" in data && String((data as { error: unknown }).error)) ||
          (typeof data === "object" && data && "message" in data && String((data as { message: unknown }).message)) ||
          (raw ? raw.slice(0, 200) : "") ||
          `HTTP ${res.status}`;
        setErr(`Errore creazione ordine: ${msg}`);
        return;
      }

      const j = data as Partial<ApiOrderResponse> | null;
      if (!j?.paymentUrl) {
        setErr("Risposta non valida dal server (manca paymentUrl).");
        return;
      }

      try { localStorage.setItem("lastOrderCode", String(j.orderCode ?? "")); } catch { /* no-op */ }

      window.location.href = j.paymentUrl; // redirect a Viva
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(`Errore inatteso: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h1>Carrello</h1>

      {!cartItems.length && <p>Il carrello è vuoto.</p>}

      {cartItems.map((it: CartItem) => (
        <div
          key={it.id}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            borderBottom: "1px solid #eee",
            padding: "8px 0",
          }}
        >
          <div style={{ flex: 1 }}>
            <div><strong>{it.title ?? it.id}</strong></div>
            {typeof it.unitPriceCents === "number" && (
              <small>€ {(it.unitPriceCents / 100).toFixed(2)} cad</small>
            )}
          </div>
          <input
            type="number"
            min={1}
            value={it.qty}
            onChange={(e) => setQty(it.id, Number(e.target.value))}
            style={{ width: 64 }}
          />
          <button onClick={() => remove(it.id)}>Rimuovi</button>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Nome e cognome</label><br />
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Mario Rossi"
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario.rossi@example.com"
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <div><strong>Totale (indicativo):</strong> € {(totalClientCents / 100).toFixed(2)}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => clear()} disabled={!cartItems.length}>Svuota</button>
          <button onClick={payNow} disabled={loading || !cartItems.length}>
            {loading ? "Reindirizzamento..." : "Paga ora"}
          </button>
        </div>
      </div>

      {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        * Il totale esatto viene ricalcolato lato server e validato da Viva.
      </p>
    </div>
  );
}
