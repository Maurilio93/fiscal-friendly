export default function CheckoutFailurePage() {
  const p = new URLSearchParams(window.location.search);
  const reason = p.get("reason") ?? "Pagamento annullato o non riuscito";

  return (
    <div style={{maxWidth:720, margin:"48px auto", padding:24}}>
      <h1>Pagamento non riuscito ❌</h1>
      <p>{reason}</p>
      <a href="/cart">Torna al carrello</a>
    </div>
  );
}
