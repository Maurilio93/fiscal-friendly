// src/pages/AreaUtenti/index.tsx
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CreditCard, Phone } from "lucide-react";
import { getOverview, type Overview } from "@/lib/api";
import AreaUtentiOrdini from "./Ordini";
import AreaUtentiDocumenti from "./Documenti";

export default function AreaUtentiHome() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOverview(); // argomento opzionale
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* Header locale della pagina (il titolo principale è nel layout) */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Panoramica</h2>
        <p className="text-sm text-muted-foreground">
          Stato del tuo account e accesso rapido ad ordini e documenti.
        </p>
      </div>

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

      <p className="mt-6 text-sm text-muted-foreground">
        Suggerimento: usa le tab qui sopra per navigare tra panoramica, ordini e documenti.
      </p>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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