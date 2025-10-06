import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title?: string;
  qty: number;
  unitPriceCents?: number; // il server ricalcola comunque
};

type CartContextValue = {
  items: CartItem[];
  add: (item: { id: string; title?: string; unitPriceCents?: number }, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalClientCents: number;   // solo display locale
  totalQty: number;           // per badge carrello
  toVivaItems: () => { id: string; qty: number; unitPriceCents: number; title?: string }[];
};

const CartCtx = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch { /* empty */ }
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

    const toVivaItems = () =>
      items.map(i => ({
        id: i.id,
        qty: i.qty,
        unitPriceCents: i.unitPriceCents ?? 0,
        title: i.title,
      }));

    return { items, add, remove, setQty, clear, totalClientCents, totalQty, toVivaItems };
  }, [items]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
