import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { getOverview } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Overview = { orders: any[]; tickets: any[]; subscriptions: any[] };

export default function AreaUtentiHome() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setData(await getOverview()); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <UserLayout>
      <Card>
        <CardHeader><CardTitle>Riepilogo</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat label="Ordini" value={loading ? "…" : String(data?.orders?.length ?? 0)} />
          <Stat label="Ticket" value={loading ? "…" : String(data?.tickets?.length ?? 0)} />
          <Stat label="Abbonamenti" value={loading ? "…" : String(data?.subscriptions?.length ?? 0)} />
        </CardContent>
      </Card>
    </UserLayout>
  );
}

function Stat({label, value}:{label:string; value:string}) {
  return (
    <div className="rounded-xl border p-5 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-muted-foreground mt-1">{label}</div>
    </div>
  );
}