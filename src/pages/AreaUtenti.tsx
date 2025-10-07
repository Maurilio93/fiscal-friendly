import { useEffect, useMemo, useState } from "react";
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

/* ----------------------------- Tipi dati ----------------------------- */

// /api/user/overview (esistente)
type Overview = {
  orders: Array<{ id: number | string; total_cents?: number; created_at?: string }>;
  tickets: Array<{ id: number | string; subject?: string; status?: string; created_at?: string }>;
  subscriptions: Array<{ id: number | string; plan?: string; status?: string; renew_at?: string | null }>;
};

// /api/me/orders (nuovo)
type MeOrderItem = {
  sku?: string;
  title?: string;
  qty?: number;
  unit_price_cents?: number;
};
type MeOrder = {
  orderCode: string;
  status: "created" | "pending" | "paid" | "failed" | "expired" | "canceled" | "mismatch" | string;
  total_cents?: number | null;
  amountCents?: number | null; // alias presente nel backend
  created_at?: string | null;
  paidAt?: string | null;
  transactionId?: string | null;
  items?: MeOrderItem[];
};

function formatEuro(cents?: number | null) {
  const v = Number(cents);
  if (!Number.isFinite(v)) return "—";
  return (v / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}
function formatDate(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("it-IT");
}
function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "paid") return "bg-green-100 text-green-700";
  if (s === "pending" || s === "created") return "bg-yellow-100 text-yellow-700";
  if (s === "failed" || s === "canceled" || s === "expired" || s === "mismatch") return "bg-red-100 text-red-700";
  return "bg-muted text-foreground";
}

/* --------------------------- Componente page -------------------------- */

const AreaUtenti = () => {
  const { user } = useAuth();

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<MeOrder[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Carica tickets/subscriptions (overview) e ordini reali
  useEffect(() => {
    if (!user) return;

    let on = true;

    // 1) Overview (tickets, subscriptions; orders possono essere vuoti o schema diverso)
    (async () => {
      try {
        const res = await getOverview();
        if (on) setOverview(res as Overview);
      } finally {
        if (on) setLoadingOverview(false);
      }
    })();

    // 2) Ordini reali: /api/me/orders (cookie HttpOnly necessario)
    (async () => {
      setOrdersError(null);
      try {
        const r = await fetch("/api/me/orders", { credentials: "include" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (on) setOrders((data?.orders as MeOrder[]) || []);
      } catch (e: unknown) {
        if (on) setOrdersError(
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Errore di rete"
        );
      } finally {
        if (on) setLoadingOrders(false);
      }
    })();

    return () => { on = false; };
  }, [user]);

  // Non autenticato (AuthContext ha risposto e user === null)
  if (user === null) {
    return (
      <div className="min-h-screen">
        <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Area Utenti</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90">
              Devi effettuare l’accesso per continuare
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">Vai al login</Button>
              </Link>
              <Link to="/#registrati">
                <Button size="lg" variant="outline" className="bg-gradient-hero hover:opacity-90">Registrati</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // In attesa che l'AuthContext risponda (undefined)
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

  // derivati
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasOrders = useMemo(() => orders && orders.length > 0, [orders]);

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

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* ORDINI REALI */}
              <Card className="shadow-elegant">
                <CardHeader className="flex md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle>I tuoi ordini</CardTitle>
                    <CardDescription>Pacchetti acquistati con stato e dettagli</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        setLoadingOrders(true);
                        setOrdersError(null);
                        try {
                          const r = await fetch("/api/me/orders", { credentials: "include" });
                          if (!r.ok) throw new Error(`HTTP ${r.status}`);
                          const data = await r.json();
                          setOrders((data?.orders as MeOrder[]) || []);
                        } catch (e: unknown) {
                          setOrdersError(
                            typeof e === "object" && e !== null && "message" in e
                              ? String((e as { message?: unknown }).message)
                              : "Errore di rete"
                          );
                        } finally {
                          setLoadingOrders(false);
                        }
                      }}
                    >
                      Aggiorna
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {loadingOrders ? (
                    <p>Caricamento…</p>
                  ) : ordersError ? (
                    <p className="text-red-600">Errore: {ordersError}</p>
                  ) : !hasOrders ? (
                    <div className="flex flex-col items-start gap-3">
                      <p>Nessun ordine trovato.</p>
                      <Link to="/servizi">
                        <Button className="bg-gradient-hero hover:opacity-90">Sfoglia i servizi</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => {
                        const tot = (o.total_cents ?? o.amountCents) ?? null;
                        return (
                          <div key={o.orderCode} className="border rounded-xl p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="font-medium">
                                Ordine <span className="text-muted-foreground">#{o.orderCode}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={statusBadgeClass(o.status)}>{o.status.toUpperCase()}</Badge>
                                <div className="font-semibold">Totale: {formatEuro(tot)}</div>
                              </div>
                            </div>

                            <div className="mt-1 text-sm text-muted-foreground">
                              Creato: {formatDate(o.created_at)} {o.paidAt ? `• Pagato: ${formatDate(o.paidAt)}` : ""}
                              {o.transactionId ? ` • Transazione: ${o.transactionId}` : ""}
                            </div>

                            {o.items && o.items.length > 0 && (
                              <ul className="mt-3 text-sm list-disc pl-5">
                                {o.items.map((it, idx) => (
                                  <li key={idx}>
                                    {it.title ?? "Prodotto"} × {it.qty ?? 1} — {formatEuro(it.unit_price_cents ?? 0)}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ABBONAMENTI */}
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
                        <li key={s.id}>
                          {s.plan ?? "Piano"} – {s.status ?? "—"}
                          {s.renew_at ? ` • Rinnovo: ${formatDate(s.renew_at)}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessun abbonamento attivo.</p>
                  )}
                </CardContent>
              </Card>

              {/* TICKET */}
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
                        <li key={t.id}>
                          {t.subject ?? "Richiesta"} – {t.status ?? "—"}
                          {t.created_at ? ` • ${formatDate(t.created_at)}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessuna richiesta aperta.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Servizi */}
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
