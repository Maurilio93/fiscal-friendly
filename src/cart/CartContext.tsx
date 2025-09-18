import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; title?: string; qty: number; unitPriceCents?: number };

type CartContextValue = {
  items: CartItem[];
  add: (item: { id: string; title?: string; unitPriceCents?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalClientCents: number; // solo visuale; il totale "vero" lo ricalcola il server
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
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const api = useMemo<CartContextValue>(() => ({
    items,
    add: (i) => {
      setItems(prev => {
        const ex = prev.find(p => p.id === i.id);
        if (ex) return prev.map(p => p.id === i.id ? { ...p, qty: p.qty + 1 } : p);
        return [...prev, { id: i.id, title: i.title, unitPriceCents: i.unitPriceCents, qty: 1 }];
      });
    },
    remove: (id) => setItems(prev => prev.filter(p => p.id !== id)),
    setQty: (id, qty) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
    clear: () => setItems([]),
    totalClientCents: items.reduce((sum, i) => sum + (i.unitPriceCents ?? 0) * i.qty, 0),
  }), [items]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
