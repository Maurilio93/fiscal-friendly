// src/pages/Commercialisti.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircle, Info, Shield } from "lucide-react";
import { createVivaOrder } from "@/lib/api";
import { useAuth } from "@/auth/AuthContext";

type Pack = {
  key: string;
  title: string;
  subtitle?: string;
  priceNet: number; // € NETTI (IVA esclusa)
  label: string; // es: "€ 150 + IVA"
};

const PACKS: Pack[] = [
  {
    key: "p5",
    title:
      "Pacchetto da 5 pratiche per deposito bilanci e/o altre pratiche CCIAA",
    priceNet: 150,
    label: "€ 150 + IVA",
  },
  {
    key: "p10",
    title:
      "Pacchetto da 10 pratiche per deposito bilanci e/o altre pratiche CCIAA",
    priceNet: 250,
    label: "€ 250 + IVA",
  },
  {
    key: "quote",
    title:
      "Cessione quote SRL con atto stipulato da commercialista iscritto in categoria A",
    subtitle: "Oltre rimborso spese Agenzia Entrate e CCIAA",
    priceNet: 300,
    label: "€ 300 + IVA",
  },
];

function PackRow({
  p,
  loadingKey,
  onBuy,
}: {
  p: Pack;
  loadingKey: string | null;
  onBuy: (p: Pack) => void;
}) {
  const loading = loadingKey === p.key;
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="font-semibold">{p.title}</div>
          {p.subtitle && (
            <div className="text-sm text-muted-foreground">{p.subtitle}</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-bold">{p.label}</div>
          <Button
            onClick={() => onBuy(p)}
            disabled={loading}
            className="bg-[#FF6B6B] hover:opacity-90"
          >
            {loading ? "Attendi..." : "Acquista pacchetto"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CommercialistiPage() {
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  // Se vuoi incassare IVA inclusa, metti INCLUDE_VAT = true
  const INCLUDE_VAT = false;
  const VAT_RATE = 0.22;

  async function handleBuy(p: Pack) {
    try {
      if (!user) {
        // se vuoi: redirect a /Login. Per ora messaggio chiaro:
        alert("Per acquistare, accedi o registrati.");
        return;
      }
      setLoadingKey(p.key);
      const net = p.priceNet;
      const gross = INCLUDE_VAT
        ? Math.round(net * (1 + VAT_RATE) * 100)
        : Math.round(net * 100);

      const res = await createVivaOrder({
        customer: { email: user.email, fullName: user.name },
        items: [
          {
            id: p.key,
            qty: 1,
            unitPriceCents: gross,
            title: p.title,
          },
        ],
      });
      window.location.href = res.paymentUrl;
    } catch {
      alert("Errore durante la creazione dell'ordine.");
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero breve */}
      <section className="text-white bg-[linear-gradient(135deg,#0D3B66_0%,#0A2C4C_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Pacchetto speciale per commercialisti
            </h1>
            <p className="mt-4 text-white/90 max-w-3xl mx-auto">
              Trasferite a noi gli adempimenti per i vostri clienti: riducete i
              tempi, aumentate la qualità del servizio e mantenete i costi sotto
              controllo.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-9xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Colonna sinistra: pacchetti */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Offerte disponibili</CardTitle>
                <CardDescription>
                  Clicca su “Acquista pacchetto” per procedere al checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {PACKS.map((p) => (
                  <PackRow
                    key={p.key}
                    p={p}
                    loadingKey={loadingKey}
                    onBuy={handleBuy}
                  />
                ))}

                {/* Business Plan */}
                <div className="rounded-2xl border p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">
                        Business Plan triennale o quinquennale
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Per accedere a pratiche di finanziamento, mutui bancari,
                        leasing e altre operazioni di natura finanziaria.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a href="#contatti">
                      <Button>Chiedi info</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Domande frequenti</CardTitle>
                <CardDescription>
                  Chiarimenti utili prima dell’acquisto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="q1">
                    <AccordionTrigger>IVA compresa o esclusa?</AccordionTrigger>
                    <AccordionContent>
                      I prezzi indicati sono <strong>+ IVA</strong>. Se desideri
                      incassare IVA inclusa al checkout, abilita il calcolo in
                      pagina (flag <code>INCLUDE_VAT</code>).
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q2">
                    <AccordionTrigger>
                      Spese Agenzia Entrate e CCIAA?
                    </AccordionTrigger>
                    <AccordionContent>
                      Per la “Cessione quote SRL” le spese di Agenzia Entrate e
                      CCIAA sono escluse e saranno rendicontate separatamente.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q3">
                    <AccordionTrigger>
                      Serve essere registrati per acquistare?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sì: l’acquisto è collegato alla tua area utente, dove
                      potrai monitorare lo stato delle pratiche e scaricare i
                      documenti.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q4">
                    <AccordionTrigger>Tempi di evasione</AccordionTrigger>
                    <AccordionContent>
                      Lavoriamo tipicamente entro 24–72h lavorative in base alla
                      pratica. Urgenze? Contattaci.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Colonna destra: info/benefit */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Perché delegarci gli adempimenti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-primary" />
                  <p>
                    Riduci il carico operativo e concentra le energie
                    sull’attività consulenziale core.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-primary" />
                  <p>
                    Flussi standardizzati, rendicontazione chiara, assistenza
                    dedicata.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-primary" />
                  <p>Prezzi trasparenti e competitivi, senza costi nascosti.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Note fiscali e amministrative</CardTitle>
                <CardDescription>Trasparenza prima di tutto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Prezzi al netto di IVA; eventuale IVA sarà aggiunta in fase
                  di emissione/checkout se abilitata.
                </p>
                <p>
                  • Per pratiche CCIAA possono essere previsti oneri camerali o
                  diritti di segreteria.
                </p>
                <p>
                  • Per atti con Agenzia Entrate valgono imposte/diritti secondo
                  normativa vigente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hai domande specifiche?</CardTitle>
                <CardDescription>Parla con un consulente</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="#contatti">
                  <Button className="w-full">Contattaci ora</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
