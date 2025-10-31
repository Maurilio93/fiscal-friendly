
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CreditCard, Phone } from "lucide-react";
import UserLayout from "../components/UserLayout";
import { getOverview, type Overview } from "@/lib/api";
import AreaUtentiOrdini from "./Ordini";
import AreaUtentiDocumenti from "./Documenti";

export default function AreaUtentiHome() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOverview(); // ora l’argomento è opzionale
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserLayout
      title="Area Utenti"
      subtitle="Panoramica del tuo account e servizi"
      tabs={
        <Tabs defaultValue="panoramica" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="panoramica">Panoramica</TabsTrigger>
            <TabsTrigger value="ordini">Ordini</TabsTrigger>
            <TabsTrigger value="documenti">Documenti</TabsTrigger>
          </TabsList>

          <TabsContent value="panoramica" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<CreditCard className="h-5 w-5" />}
                label="Ordini"
                value={loading ? "…" : String(data?.orders?.length ?? 0)}
              />
              <StatCard
                icon={<Phone className="h-5 w-5" />}
                label="Ticket"
                value={loading ? "…" : String(data?.tickets?.length ?? 0)}
              />
              <StatCard
                icon={<FileText className="h-5 w-5" />}
                label="Abbonamenti"
                value={loading ? "…" : String(data?.subscriptions?.length ?? 0)}
              />
            </div>
          </TabsContent>

          <TabsContent value="ordini" className="mt-6">
            <AreaUtentiOrdini />
          </TabsContent>

          <TabsContent value="documenti" className="mt-6">
            <AreaUtentiDocumenti />
          </TabsContent>
        </Tabs>
      }
    >
      {/* contenuto extra della panoramica se vuoi, altrimenti lasciamo vuoto */}
      <div className="text-sm text-muted-foreground">
        Benvenuto nella tua area personale. Usa le tab qui sopra per gestire ordini e documenti.
      </div>
    </UserLayout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        {icon}
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}