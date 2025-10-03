import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { createVivaOrder, VivaOrderItem } from "../lib/api";

type CartItem = {
  id: string;
  qty: number;
  title?: string;
  unitPriceCents?: number;
  price?: number; // usato solo per fallback → trasformato in cents
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

    // Prepara payload conforme all'API
    const vivaItems: VivaOrderItem[] = cartItems.map((it) => ({
      id: it.id,
      qty: it.qty,
      unitPriceCents:
        typeof it.unitPriceCents === "number"
          ? it.unitPriceCents
          : Math.round(((it.price ?? 0) as number) * 100),
      title: it.title ?? it.id,
    }));

    setLoading(true);
    try {
      const { paymentUrl, orderCode } = await createVivaOrder({
        customer: { email: email.trim(), fullName: fullName.trim() },
        items: vivaItems,
      });

      try { localStorage.setItem("lastOrderCode", String(orderCode ?? "")); } catch { /* no-op */ }

      // Redirect a Viva
      window.location.href = paymentUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(`Errore creazione ordine: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h1>Carrello</h1>

      {!cartItems.length && <p>Il carrello è vuoto.</p>}

      {cartItems.map((it) => (
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
