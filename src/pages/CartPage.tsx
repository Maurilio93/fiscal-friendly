import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { API_BASE } from "../lib/api"; // usa il tuo resolver già presente

export default function CartPage() {
  const { items, setQty, remove, clear, totalClientCents } = useCart();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

const payNow = async () => {
  setErr(null);
  if (!items.length) { setErr("Carrello vuoto"); return; }
  if (!email || !fullName) { setErr("Inserisci nome ed email"); return; }
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/payments/viva/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: items.map(i => ({ id: i.id, qty: i.qty })),
        customer: { email, fullName }
      })
    });

    // prova a leggere JSON; se fallisce, leggi come testo grezzo
    let data: any = null;
    let raw: string | null = null;
    try { data = await res.json(); }
    catch {
      try { raw = await res.text(); } catch {}
    }

    if (!res.ok || !data?.ok) {
      const msg =
        data?.error ||
        data?.message ||
        (raw && raw.slice(0, 200)) || // HTML di Plesk o stacktrace
        `HTTP ${res.status}`;
      setErr(`Errore creazione ordine: ${msg}`);
      return;
    }

    // success
    localStorage.setItem("lastOrderCode", data.orderCode);
    window.location.href = data.redirectUrl;
  } catch (e: any) {
    setErr(`Errore inatteso: ${e?.message ?? String(e)}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container" style={{maxWidth: 720, margin: "24px auto", padding: 16}}>
      <h1>Carrello</h1>

      {!items.length && <p>Il carrello è vuoto.</p>}

      {items.map((it) => (
        <div key={it.id} style={{display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #eee", padding: "8px 0"}}>
          <div style={{flex: 1}}>
            <div><strong>{it.title ?? it.id}</strong></div>
            {typeof it.unitPriceCents === "number" && (
              <small>€ {(it.unitPriceCents/100).toFixed(2)} cad</small>
            )}
          </div>
          <input
            type="number"
            min={1}
            value={it.qty}
            onChange={e => setQty(it.id, Number(e.target.value))}
            style={{width: 64}}
          />
          <button onClick={() => remove(it.id)}>Rimuovi</button>
        </div>
      ))}

      <div style={{marginTop: 16}}>
        <div style={{marginBottom: 8}}>
          <label>Nome e cognome</label><br/>
          <input value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div style={{marginBottom: 8}}>
          <label>Email</label><br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </div>

      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16}}>
        <div><strong>Totale (indicativo):</strong> € {(totalClientCents/100).toFixed(2)}</div>
        <div style={{display: "flex", gap: 8}}>
          <button onClick={() => clear()} disabled={!items.length}>Svuota</button>
          <button onClick={payNow} disabled={loading || !items.length}>
            {loading ? "Reindirizzamento..." : "Paga ora"}
          </button>
        </div>
      </div>

      {err && <p style={{color:"crimson", marginTop: 8}}>{err}</p>}
      <p style={{marginTop: 8, fontSize: 12, opacity: .7}}>
        * Il totale esatto viene ricalcolato lato server e validato da Viva.
      </p>
    </div>
  );
}
