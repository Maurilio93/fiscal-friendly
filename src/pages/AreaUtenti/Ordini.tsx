import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { getOverview } from "@/lib/api";

export default function AreaUtentiOrdini() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const r = await getOverview();
    setRows(Array.isArray(r.orders) ? r.orders : []);
  })(); }, []);

  return (
    <UserLayout>
      <div className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">I tuoi ordini</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 pr-2">Codice</th>
                <th className="py-2 pr-2">Importo</th>
                <th className="py-2 pr-2">Stato</th>
                <th className="py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o:any) => (
                <tr key={o.orderCode} className="border-b last:border-0">
                  <td className="py-2 pr-2">{o.orderCode}</td>
                  <td className="py-2 pr-2">{(o.amountCents/100).toFixed(2)} €</td>
                  <td className="py-2 pr-2">{o.status}</td>
                  <td className="py-2">{o.created_at?.replace("T"," ").slice(0,16) ?? "—"}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Nessun ordine</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}