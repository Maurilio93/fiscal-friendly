import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Metrics = { users: number; ordersLast30d: number; documents: number };

type OrderMini = {
  orderCode: string;
  guest_email: string | null;
  amountCents: number;
  status: string;
};

type UserMini = {
  id: string;
  name: string | null;
  email: string;
};

export default function AdminHome() {
  const [m, setM] = useState<Metrics | null>(null);
  const [latestOrders, setLatestOrders] = useState<OrderMini[]>([]);
  const [latestUsers, setLatestUsers] = useState<UserMini[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/metrics", { credentials: "include" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Partial<Metrics>;
        if (alive) {
          setM({
            users: Number(data.users ?? 0),
            ordersLast30d: Number(data.ordersLast30d ?? 0),
            documents: Number(data.documents ?? 0),
          });
        }
      } catch {
        if (alive) setM({ users: 0, ordersLast30d: 0, documents: 0 });
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    // Ultimi ordini e utenti
    setLoadingLatest(true);
    let alive = true;
    Promise.all([
      fetch("/api/admin/orders?limit=5&page=1", { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/users?limit=5&page=1", { credentials: "include" }).then(r => r.json())
    ]).then(([ordersRes, usersRes]) => {
      if (!alive) return;
      setLatestOrders(Array.isArray(ordersRes.orders) ? ordersRes.orders : []);
      setLatestUsers(Array.isArray(usersRes.users) ? usersRes.users : []);
    }).finally(() => { if (alive) setLoadingLatest(false); });
    return () => { alive = false; };
  }, []);

  const fmt = (n: number | undefined) => (typeof n === "number" ? n.toLocaleString("it-IT") : "—");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordini</CardTitle>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m ? fmt(m.ordersLast30d) : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Ultimi 30 giorni</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m ? fmt(m.users) : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Totali iscritti</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documenti</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m ? fmt(m.documents) : "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">Caricati dagli utenti</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Ultimi ordini</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {loadingLatest ? (
              <div>Caricamento…</div>
            ) : latestOrders.length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-2 pr-2">Codice</th>
                    <th className="py-2 pr-2">Email</th>
                    <th className="py-2 pr-2">Importo</th>
                    <th className="py-2">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((o) => (
                    <tr key={o.orderCode} className="border-b last:border-0">
                      <td className="py-2 pr-2">{o.orderCode}</td>
                      <td className="py-2 pr-2">{o.guest_email ?? "—"}</td>
                      <td className="py-2 pr-2">{(o.amountCents / 100).toFixed(2)} €</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            o.status === "paid"
                              ? "secondary"
                              : o.status === "failed"
                              ? "destructive"
                              : "outline"
                          }
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Nessun ordine recente…</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Ultimi utenti</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {loadingLatest ? (
              <div>Caricamento…</div>
            ) : latestUsers.length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-2 pr-2">Email</th>
                    <th className="py-2">Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">{u.email}</td>
                      <td className="py-2">{u.name ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Nessun utente recente…</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}