// src/pages/Admin/index.tsx
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, FileText } from "lucide-react";

type Metrics = { users: number; ordersLast30d: number; documents: number };

export default function AdminHome() {
  const [m, setM] = useState<Metrics | null>(null);

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

  const fmt = (n: number | undefined) => (typeof n === "number" ? n.toLocaleString("it-IT") : "—");

  return (
    <AdminLayout>
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
              Integriamo la tabella appena pronta l’API.
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Ultimi utenti</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Integriamo la tabella appena pronta l’API.
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}