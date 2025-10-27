import { useEffect, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Hourglass, Receipt } from "lucide-react";

type State = "checking" | "paid" | "pending" | "error";

export default function ThankYouPage() {
  const { consumeOrderIfPaid } = useCart();

  const p = new URLSearchParams(window.location.search);
  const orderCode = p.get("s") || "";
  const transactionId = p.get("t") || "";

  const [state, setState] = useState<State>("checking");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let on = true;

    (async () => {
      try {
        if (!orderCode) {
          setState("error");
          setMsg("Order code mancante.");
          return;
        }

        // 1) Tenta la sync con Viva (POST), poi fallback allo status locale (GET)
        let r = await fetch(`/api/payments/viva/verify`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode }),
        });

        if (!r.ok) {
          r = await fetch(`/api/payments/viva/status/${encodeURIComponent(orderCode)}`, {
            credentials: "include",
          });
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        const data = await r.json();
        const st = String(data.status || data.state || "").toLowerCase();

        if (st === "paid") {
          // Svuota carrello se possibile, ma NON blocchiamo l'UI se fallisce
          const out = await consumeOrderIfPaid();
          if (!on) return;

          if (out === "pending") setState("pending");
          else setState("paid"); // out === "paid" o "error" => lo stato è comunque PAID lato server
        } else if (st === "pending" || st === "created") {
          if (on) setState("pending");
        } else {
          if (on) {
            setState("error");
            setMsg(`Stato: ${st || "sconosciuto"}`);
          }
        }
      } catch (e: unknown) {
        if (!on) return;
        const errorMsg =
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Errore di rete";
        setState("error");
        setMsg(errorMsg);
      }
    })();

    return () => {
      on = false;
    };
  }, [orderCode, consumeOrderIfPaid]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="rounded-2xl border bg-card shadow-elegant p-8 text-center space-y-6">
        <div className="flex justify-center">
          {state === "paid" && <CheckCircle2 className="h-14 w-14 text-green-600" />}
          {state === "pending" && <Hourglass className="h-14 w-14 text-amber-500" />}
          {state === "checking" && <Hourglass className="h-14 w-14 text-muted-foreground" />}
          {state === "error" && <AlertCircle className="h-14 w-14 text-red-600" />}
        </div>

        <h1 className="text-3xl font-bold">
          {state === "paid"
            ? "Pagamento riuscito 🎉"
            : state === "pending"
            ? "Pagamento in elaborazione…"
            : state === "error"
            ? "Non riesco a confermare il pagamento"
            : "Verifica pagamento…"}
        </h1>

        <div className="mx-auto max-w-md text-left bg-muted rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Receipt className="h-4 w-4" />
            Dettagli ordine
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              Order code: <span className="font-medium text-foreground">{orderCode || "—"}</span>
            </div>
            <div>
              Transaction ID: <span className="font-medium text-foreground">{transactionId || "—"}</span>
            </div>
          </div>
        </div>

        {state === "paid" && (
          <>
            <p className="text-muted-foreground">
              Il tuo carrello è stato svuotato. Trovi i pacchetti nella tua Area Utenti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/area-utenti">
                <Button className="bg-gradient-hero hover:opacity-90">Vai all’Area Utenti</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Torna alla Home</Button>
              </Link>
            </div>
          </>
        )}

        {state === "pending" && (
          <>
            <p className="text-muted-foreground">
              Ancora qualche istante… Se non si aggiorna, riprova la verifica.
            </p>
            <Button onClick={() => window.location.reload()}>Riprova verifica</Button>
          </>
        )}

        {state === "error" && (
          <>
            <p className="text-red-600">{msg ? `(${msg})` : null}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/area-utenti">
                <Button>Vedi i tuoi ordini</Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline">Torna al carrello</Button>
              </Link>
            </div>
          </>
        )}

        {state === "checking" && <p className="text-muted-foreground">Verifica in corso…</p>}
      </div>
    </div>
  );
}
