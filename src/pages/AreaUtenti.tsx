import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getOverview } from "../lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, Phone } from "lucide-react";

type Overview = {
  orders: Array<{ id: number | string; total_cents?: number; created_at?: string }>;
  tickets: Array<{ id: number | string; subject?: string; status?: string; created_at?: string }>;
  subscriptions: Array<{ id: number | string; plan?: string; status?: string; renew_at?: string | null }>;
};

const AreaUtenti = () => {
  const { user } = useAuth();
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);

  // Carica i dati reali (anche se vuoti) solo quando l'utente è autenticato
  useEffect(() => {
    if (!user) return;
    let on = true;
    (async () => {
      try {
        const res = await getOverview();
        if (on) setOverview(res as Overview);
      } finally {
        if (on) setLoadingOverview(false);
      }
    })();
    return () => { on = false; };
  }, [user]);

  // Non autenticato: messaggio semplice + CTA login (niente dashboard finta)
  if (user === null) {
    return (
      <div className="min-h-screen">
        <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Area Utenti</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90">
              Devi effettuare l’accesso per continuare
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                  Vai al login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // In caricamento iniziale (AuthContext non ha ancora risposto)
  if (!user) {
    return (
      <div className="min-h-screen">
        <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Area Utenti</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90">Caricamento…</p>
          </div>
        </section>
      </div>
    );
  }

  // Utente autenticato
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Area Utenti</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Gestisci i tuoi servizi e richieste
          </p>
        </div>
      </section>

      {/* Contenuto autenticato */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Benvenuto */}
          <div className="bg-gradient-hero text-primary-foreground p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ciao, {user.name}</h2>
                <p className="text-primary-foreground/90">
                  Qui trovi ordini, abbonamenti e richieste.
                </p>
              </div>
              <Badge variant="secondary" className="text-secondary-foreground">
                Area personale
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full max-w-xl mx-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="services">Servizi</TabsTrigger>
              <TabsTrigger value="profile" disabled>Profilo (presto)</TabsTrigger>
            </TabsList>

            {/* Dashboard reale: SOLO liste reali/vuote */}
            <TabsContent value="dashboard" className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>I tuoi ordini</CardTitle>
                  <CardDescription>Storico ordini dell’account</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOverview ? (
                    <p>Caricamento…</p>
                  ) : overview?.orders?.length ? (
                    <ul className="list-disc pl-5">
                      {overview.orders.map((o) => (
                        <li key={o.id}>
                          Ordine #{o.id}
                          {typeof o.total_cents === "number" ? ` – ${(o.total_cents / 100).toFixed(2)} €` : ""}
                          {o.created_at ? ` – ${new Date(o.created_at).toLocaleDateString()}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessun ordine trovato.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Abbonamenti</CardTitle>
                  <CardDescription>Gestione dei tuoi piani</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOverview ? (
                    <p>Caricamento…</p>
                  ) : overview?.subscriptions?.length ? (
                    <ul className="list-disc pl-5">
                      {overview.subscriptions.map((s) => (
                        <li key={s.id}>{s.plan ?? "Piano"} – {s.status ?? "—"}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessun abbonamento attivo.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Richieste di supporto</CardTitle>
                  <CardDescription>Le tue pratiche e domande</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOverview ? (
                    <p>Caricamento…</p>
                  ) : overview?.tickets?.length ? (
                    <ul className="list-disc pl-5">
                      {overview.tickets.map((t) => (
                        <li key={t.id}>{t.subject ?? "Richiesta"} – {t.status ?? "—"}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessuna richiesta aperta.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Servizi: solo CTA, nessun dato finto */}
            <TabsContent value="services" className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Richiedi un servizio</CardTitle>
                  <CardDescription>Scegli la categoria per aprire una nuova richiesta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-6 w-6" />
                      <span>Fisco e Tributi</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <CreditCard className="h-6 w-6" />
                      <span>Imprese</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-6 w-6" />
                      <span>Contratti</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Phone className="h-6 w-6" />
                      <span>Consulenza</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AreaUtenti;
