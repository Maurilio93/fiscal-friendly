import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title?: string;
  qty: number;
  unitPriceCents?: number; // il server ricalcola comunque
};

type VivaItem = { id: string; qty: number; unitPriceCents: number; title?: string };

type CartContextValue = {
  items: CartItem[];
  add: (item: { id: string; title?: string; unitPriceCents?: number }, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalClientCents: number;   // solo display locale
  totalQty: number;           // per badge carrello
  toVivaItems: () => VivaItem[];

  /** Salva orderCode + snapshot carrello prima del redirect a Viva */
  rememberOrder: (orderCode: string) => void;
  /** Verifica lo stato dell'ultimo ordine e svuota se pagato */
  consumeOrderIfPaid: () => Promise<"paid" | "pending" | "error">;
  /** Ripristina il carrello dallo snapshot (es. pagina di failure) */
  restoreFromSnapshot: () => void;
};

const CART_KEY = "cart";
const SNAPSHOT_KEY = "cart_snapshot_v1";
const LAST_OC_KEY = "lastOrderCode";

const CartCtx = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persistenza locale
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* empty */ }
  }, [items]);

  const api = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (i, qty = 1) => {
      setItems(prev => {
        const idx = prev.findIndex(p => p.id === i.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + Math.max(1, qty) };
          return copy;
        }
        return [...prev, { id: i.id, title: i.title, unitPriceCents: i.unitPriceCents, qty: Math.max(1, qty) }];
      });
    };

    const remove: CartContextValue["remove"] = id =>
      setItems(prev => prev.filter(p => p.id !== id));

    const setQty: CartContextValue["setQty"] = (id, qty) =>
      setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));

    const clear: CartContextValue["clear"] = () => setItems([]);

    const totalClientCents = items.reduce((sum, i) => sum + (i.unitPriceCents ?? 0) * i.qty, 0);
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

    const toVivaItems = (): VivaItem[] =>
      items.map(i => ({
        id: i.id,
        qty: i.qty,
        unitPriceCents: i.unitPriceCents ?? 0,
        title: i.title,
      }));

    // --- pagamento: helpers ---

    const rememberOrder: CartContextValue["rememberOrder"] = (orderCode) => {
      try {
        sessionStorage.setItem(LAST_OC_KEY, String(orderCode));
        sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(items)); // snapshot carrello
      } catch { /* empty */ }
    };

    const consumeOrderIfPaid: CartContextValue["consumeOrderIfPaid"] = async () => {
      try {
        const oc = sessionStorage.getItem(LAST_OC_KEY);
        if (!oc) return "error";

        // usa l'endpoint locale che hai già nel backend
        const r = await fetch(`/api/payments/viva/status/${encodeURIComponent(oc)}`, {
          credentials: "include",
        });
        if (!r.ok) return "error";
        const data = await r.json();

        if (data?.status === "paid") {
          clear();
          try {
            sessionStorage.removeItem(LAST_OC_KEY);
            sessionStorage.removeItem(SNAPSHOT_KEY);
          } catch { /* empty */ }
          return "paid";
        }

        // opzionale: se vuoi forzare sync con Viva, puoi usare /api/payments/viva/verify?orderCode=oc
        if (data?.status === "pending" || data?.status === "created") return "pending";

        return "error";
      } catch {
        return "error";
      }
    };

    const restoreFromSnapshot: CartContextValue["restoreFromSnapshot"] = () => {
      try {
        const snap = sessionStorage.getItem(SNAPSHOT_KEY);
        if (!snap) return;
        const arr: CartItem[] = JSON.parse(snap);
        if (Array.isArray(arr)) setItems(arr);
      } catch { /* empty */ }
    };

    return {
      items,
      add,
      remove,
      setQty,
      clear,
      totalClientCents,
      totalQty,
      toVivaItems,
      rememberOrder,
      consumeOrderIfPaid,
      restoreFromSnapshot,
    };
  }, [items]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
