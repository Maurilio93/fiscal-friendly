import { useEffect, useState } from 'react';

type State = 'checking' | 'ok' | 'ko';

export default function CheckoutSuccess() {
  const [state, setState] = useState<State>('checking');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get('t'); // transactionId
      const s = sp.get('s'); // orderCode

      if (!t || !s) {
        setMsg('Parametri mancanti');
        setState('ko');
        return;
      }

      try {
        // (opzionale) puoi anche leggere l’importo atteso
        // const exp = await fetch(`/api/payments/viva/expected?s=${encodeURIComponent(s)}`, { credentials: 'include' }).then(r => r.json());

        const verify = await fetch('/api/payments/viva/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ transactionId: t, orderCode: s }),
        }).then(r => r.json());

        if (verify.ok) {
          setState('ok');
          setMsg('Pagamento confermato ✅');
        } else {
          setState('ko');
          setMsg('Pagamento non confermato. ' + (verify.reason || ''));
        }
      } catch (err: any) {
        setState('ko');
        setMsg('Errore durante la verifica: ' + (err?.message || ''));
      }
    })();
  }, []);

  if (state === 'checking') return <p>Verifico il pagamento…</p>;
  if (state === 'ok') return <h1>{msg}</h1>;
  return (
    <div>
      <h1>Pagamento non riuscito ❌</h1>
      <p>{msg}</p>
      <a href="/">Torna al negozio</a>
    </div>
  );
}
