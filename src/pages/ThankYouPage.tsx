export default function ThankYouPage() {
  const p = new URLSearchParams(window.location.search);
  const s = p.get("s"); const t = p.get("t");
  return (
    <div style={{maxWidth:720,margin:"48px auto",padding:24}}>
      <h1>Grazie per l’acquisto 🎉</h1>
      <p>Order code: <b>{s ?? "-"}</b><br/>Transaction ID: <b>{t ?? "-"}</b></p>
      <a href="/">Torna alla Home</a>
    </div>
  );
}
