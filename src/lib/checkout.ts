// src/lib/checkout.ts
import { createOrder } from "@/lib/api";

export async function startCheckout(item: {id:string; title:string; unitPriceCents:number}, billing:any) {
  const r = await createOrder({
    customer: { email: billing.email, fullName: billing.fullName || billing.companyName },
    items: [{ id: item.id, title: item.title, qty: 1, unitPriceCents: item.unitPriceCents }],
    billing,
  });
  if (!r?.paymentUrl) throw new Error("createOrder_failed");
  window.location.href = r.paymentUrl;
}