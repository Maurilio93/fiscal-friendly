import { useEffect, useState } from "react";
import { adminListOrders, AdminOrder } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BillingDetailsModal from "../BillingDetailsModal";

export default function AdminOrdini() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalBilling, setModalBilling] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const r = await adminListOrders(page, q);
      setRows(r.orders);
      setTotal(r.total);
      console.log("Ordini admin:", r.orders);
    })();
  }, [q, page]);

  // Funzione per mostrare bottone "Visualizza" e aprire la modale
  function renderBilling(billing_json: any) {
    if (!billing_json) return "—";
    let billing = billing_json;
    if (typeof billing_json === "string") {
      try { billing = JSON.parse(billing_json); } catch { return "—"; }
    }
    return (
      <button
        type="button"
        className="underline text-primary hover:text-blue-700"
        onClick={() => { setModalBilling(billing); setModalOpen(true); }}
      >
        Visualizza
      </button>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Ordini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Cerca per codice/utente…" value={q} onChange={e => {setPage(1); setQ(e.target.value);}} />
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-2">Codice</th>
                  <th className="py-2 pr-2">Email</th>
                  <th className="py-2 pr-2">Importo</th>
                  <th className="py-2 pr-2">Stato</th>
                  <th className="py-2 pr-2">Data</th>
                  <th className="py-2 pr-2">Fatturazione</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(o => (
                  <tr key={o.orderCode} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-2">{o.orderCode}</td>
                    <td className="py-2 pr-2">{o.guest_email ?? "—"}</td>
                    <td className="py-2 pr-2">{(o.amountCents/100).toFixed(2)} €</td>
                    <td className="py-2 pr-2">
                      <Badge
                        variant={o.status === "paid" ? "secondary" : o.status === "failed" ? "destructive" : "outline"}
                        className={
                          o.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : o.status === "failed"
                            ? ""
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-2 pr-2">{o.created_at?.replace("T", " ").slice(0, 16) ?? "—"}</td>
                    <td className="py-2 pr-2">{renderBilling(o.billing_json)}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nessun risultato</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Totale: {total}</span>
            <div className="space-x-2">
              <button className="px-3 py-1 rounded border" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              <button className="px-3 py-1 rounded border" onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
      <BillingDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} billing={modalBilling} />
    </div>
  );
}