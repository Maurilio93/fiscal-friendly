import React, { useEffect, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { createVivaOrder, VivaOrderItem, centsToEUR, BillingPayload } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

  // Stato per i dati di fatturazione
  const [billing, setBilling] = useState<BillingPayload>({
    type: "person",
    fullName: "",
    cf: "",
    address: "",
    zip: "",
    city: "",
    province: "",
    country: "IT",
    email: "",
  });

  // Prefill da utente loggato
  useEffect(() => {
    if (user) {
      setEmail((prev) => prev || user.email || "");
      setFullName((prev) => prev || user.name || "");
      setBilling((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Pulsante paga ora
  const payNow = async () => {
    setErr(null);

    if (!cartItems.length) {
      setErr("Carrello vuoto");
      return;
    }
    if (!email.trim() || !fullName.trim()) {
      setErr("Inserisci nome e email");
      return;
    }
    // Controllo minimi campi fatturazione
    if (!billing.fullName?.trim() || !billing.cf?.trim() || !billing.address?.trim() || !billing.zip?.trim() || !billing.city?.trim() || !billing.province?.trim()) {
      setErr("Completa tutti i campi necessari per la fatturazione");
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
        billing,
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
      {!cartItems.length && (
        <div className="rounded-xl border p-6 text-center">
          <p className="text-muted-foreground mb-4">Il carrello è vuoto.</p>
          <Link to="/servizi">
            <Button>Vai ai servizi</Button>
          </Link>
        </div>
      )}

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

          {/* FORM FATTURAZIONE - visibile sempre */}
          <div className="border rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Dati per la fatturazione</h2>
            <div className="flex gap-3 mb-2">
              <button
                className={`px-3 py-1 rounded ${billing.type === "person" ? "bg-primary text-white" : "bg-gray-100"}`}
                onClick={() => setBilling((b) => ({ ...b, type: "person" }))}
                type="button"
              >
                Persona fisica
              </button>
              <button
                className={`px-3 py-1 rounded ${billing.type === "company" ? "bg-primary text-white" : "bg-gray-100"}`}
                onClick={() => setBilling((b) => ({ ...b, type: "company" }))}
                type="button"
              >
                Impresa
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border rounded-md px-3 py-2"
                placeholder={billing.type === "person" ? "Nome e cognome *" : "Ragione Sociale *"}
                value={billing.fullName ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, fullName: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder={billing.type === "person" ? "Codice Fiscale *" : "Partita IVA"}
                value={billing.type === "person" ? billing.cf ?? "" : billing.vatNumber ?? ""}
                onChange={(e) =>
                  setBilling((b) =>
                    billing.type === "person"
                      ? { ...b, cf: e.target.value }
                      : { ...b, vatNumber: e.target.value }
                  )
                }
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="Indirizzo completo *"
                value={billing.address ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, address: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="CAP *"
                value={billing.zip ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, zip: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="Città *"
                value={billing.city ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, city: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="Provincia *"
                value={billing.province ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, province: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="Email di fatturazione"
                value={billing.email ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))}
              />
              <input
                className="border rounded-md px-3 py-2"
                placeholder="Paese"
                value={billing.country ?? ""}
                onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))}
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
                onClick={payNow}
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
    </div>
  );
}