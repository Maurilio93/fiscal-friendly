import React, { useEffect, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { createVivaOrder, VivaOrderItem, centsToEUR } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BillingModal, { BillingPayload } from "@/components/BillingModal";

type LocalCartItem = {
  id: string;
  qty: number;
  title?: string;
  unitPriceCents?: number;
  price?: number;
};

export default function CartPage() {
  const { items, setQty, remove, clear, totalClientCents, rememberOrder } = useCart();
  const cartItems = items as LocalCartItem[];

  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Modale dati fatturazione
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  // Prefill da utente loggato
  useEffect(() => {
    if (user) {
      setEmail((prev) => prev || user.email || "");
      setFullName((prev) => prev || user.name || "");
    }
  }, [user]);

  const handlePayClick = () => {
    setErr(null);
    if (!cartItems.length) {
      setErr("Carrello vuoto");
      return;
    }
    setBillingModalOpen(true);
  };

  // Su conferma modale dati fatturazione
  const handleBillingSubmit = async (billingData: BillingPayload) => {
    setBillingModalOpen(false);
    await payNow(billingData);
  };

  // Chiamata a backend per checkout
  const payNow = async (billingData: BillingPayload) => {
    setErr(null);

    if (!cartItems.length) {
      setErr("Carrello vuoto");
      return;
    }
    if (!email.trim() || !fullName.trim()) {
      setErr("Inserisci nome e email");
      return;
    }
    if (!billingData) {
      setErr("Completa tutti i dati di fatturazione");
      return;
    }

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
        billing: billingData, 
      });

      if (!paymentUrl || !orderCode) {
        throw new Error("Risposta ordine non valida");
      }

      rememberOrder(String(orderCode));
      window.location.href = paymentUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(`Errore creazione ordine: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Carrello</h1>

      {/* Carrello vuoto */}
      {!cartItems.length && (
        <div className="rounded-xl border p-6 text-center">
          <p className="text-muted-foreground mb-4">Il carrello è vuoto.</p>
          <Link to="/servizi">
            <Button>Vai ai servizi</Button>
          </Link>
        </div>
      )}

      {/* Lista articoli */}
      {cartItems.length > 0 && (
        <>
          <div className="space-y-3 mb-6">
            {cartItems.map((it) => (
              <div
                key={it.id}
                className="border rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="font-medium">{it.title ?? it.id}</div>
                  {typeof it.unitPriceCents === "number" && (
                    <div className="text-sm text-muted-foreground">
                      {centsToEUR(it.unitPriceCents)} cad
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => setQty(it.id, Number(e.target.value))}
                  className="w-20 border rounded-md px-2 py-1"
                />

                <div className="text-right hidden sm:block">
                  {typeof it.unitPriceCents === "number" && (
                    <div className="font-semibold">
                      {centsToEUR(it.unitPriceCents * it.qty)}
                    </div>
                  )}
                  <button
                    className="text-xs text-red-600 mt-1"
                    onClick={() => remove(it.id)}
                  >
                    Rimuovi
                  </button>
                </div>

                <div className="sm:hidden">
                  <button
                    className="text-xs text-red-600"
                    onClick={() => remove(it.id)}
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dati cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm mb-1">Nome e cognome</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario.rossi@example.com"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Totale + azioni */}
          <div className="border rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="font-medium">
              Totale (indicativo):{" "}
              <span className="text-lg font-semibold">
                {centsToEUR(totalClientCents)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => clear()} disabled={!cartItems.length}>
                Svuota
              </Button>
              <Button
                className="bg-[#FF6B6B] hover:opacity-90"
                onClick={handlePayClick}
                disabled={loading || !cartItems.length}
              >
                {loading ? "Reindirizzamento..." : "Paga ora"}
              </Button>
            </div>
          </div>

          {err && <p className="text-red-600 mt-3">{err}</p>}
          <p className="mt-2 text-xs text-muted-foreground">
            * Il totale esatto viene ricalcolato lato server e validato da VivaWallet.
          </p>
        </>
      )}

      {/* Modale dati fatturazione */}
      <BillingModal
        open={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        onSubmit={handleBillingSubmit}
        defaultEmail={email}
        defaultName={fullName}
      />
    </div>
  );
}