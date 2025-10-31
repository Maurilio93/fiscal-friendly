
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MeOrder = {
  orderCode: string;
  status: string;
  amountCents: number;
  created_at?: string;
};

export default function AreaUtentiOrdini() {
  const [rows, setRows] = useState<MeOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: sostituire con la tua API /api/me/orders quando pronta
  useEffect(() => {
    setLoading(true);
    (async () => {
      // finto dato finché non esiste l’endpoint
      setRows([]);
      setLoading(false);
    })();
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>I tuoi Ordini</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="text-sm text-muted-foreground">Caricamento…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nessun ordine presente.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">Ordine</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Importo</th>
                <th className="py-2 pr-4">Stato</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.orderCode} className="border-t">
                  <td className="py-2 pr-4">{r.orderCode}</td>
                  <td className="py-2 pr-4">{r.created_at?.slice(0, 16)?.replace("T", " ") ?? "-"}</td>
                  <td className="py-2 pr-4">{(r.amountCents / 100).toFixed(2)} €</td>
                  <td className="py-2 pr-4">
                    <Badge variant={r.status === "paid" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}