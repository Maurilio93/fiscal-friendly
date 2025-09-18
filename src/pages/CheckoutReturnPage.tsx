import React, { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import { useCart } from "../cart/CartContext";

export default function CheckoutReturnPage() {
  const { clear } = useCart();
  const [status, setStatus] = useState<"checking"|"ok"|"ko"|"invalid">("checking");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(location.search);
        const txId = params.get("t") || params.get("transactionId");
        const orderCode = localStorage.getItem("lastOrderCode");

        if (!txId || !orderCode) {
          setStatus("invalid");
          setMessage("Parametri mancanti.");
          return;
        }

        const res = await fetch(`${API_BASE}/api/payments/viva/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ transactionId: txId, orderCode })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setStatus("ok");
          setMessage("Pagamento riuscito, grazie!");
          localStorage.removeItem("lastOrderCode");
          localStorage.removeItem("cart");
          clear();
        } else {
          setStatus("ko");
          setMessage(data?.reason || data?.error || "Pagamento non confermato.");
        }
      } catch (e: any) {
        setStatus("ko");
        setMessage(e.message || "Errore durante la verifica.");
      }
    })();
  }, [clear]);

  return (
    <div style={{maxWidth: 640, margin: "48px auto", padding: 16}}>
      <h1>Esito pagamento</h1>
      {status === "checking" && <p>Verifica in corso…</p>}
      {status === "ok" && <p style={{color:"green"}}>{message}</p>}
      {status === "ko" && <p style={{color:"crimson"}}>{message}</p>}
      {status === "invalid" && <p>{message}</p>}
      <a href="/">Torna alla home</a>
    </div>
  );
}
