import React from "react";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/payments/viva/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: 1234, // €12,34 (per test, in produzione calcoli dal carrello)
          customer: {
            email: "test@example.com",
            fullName: "Mario Rossi",
          },
        }),
      });

      const data = await res.json();
      if (data.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl; // vai su Viva Smart Checkout
      } else {
        alert("Errore creazione ordine: " + JSON.stringify(data.error));
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Paga €12,34
    </button>
  );
}
