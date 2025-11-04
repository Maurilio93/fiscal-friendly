// src/pages/ServiceDetail.tsx
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "@/data/service";
import { useCart } from "@/cart/CartContext";
import { centsToEUR } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ClipboardList } from "lucide-react";

const TEL_DISPLAY = "+39 3318341262";
const TEL_LINK = "tel:+393318341262";
const EMAIL = "info@miniconsulenze.it";
const EMAIL_LINK = "mailto:info@miniconsulenze.it";

// Mappa varianti/prezzi per ciascun servizio
const VARIANTS: Record<
  string,
  { id: string; title: string; desc?: string; priceCents: number }[]
> = {
  // Contabilità: tutte le fasce citate
  contabilita: [
    {
      id: "contab-forfettario-25",
      title: "Forfettario",
      desc: "Consulenza + dichiarativi",
      priceCents: 2500, // 25 €/mese
    },
    {
      id: "contab-semplificata-ditte-75",
      title: "Semplificata – Ditte individuali",
      desc: "Consulenza + dichiarativi",
      priceCents: 7500, // 75 €/mese
    },
    {
      id: "contab-semplificata-soc-90",
      title: "Semplificata – Società di persone",
      desc: "Scritture + adempimenti + dichiarativi",
      priceCents: 9000, // 90 €/mese
    },
    {
      id: "contab-ordinaria-soc-150",
      title: "Ordinaria – Società di persone",
      desc: "Scritture + adempimenti + dichiarativi",
      priceCents: 15000, // 150 €/mese
    },
    {
      id: "contab-ordinaria-cap-250",
      title: "Ordinaria – Società di capitali",
      desc: "Scritture + libri sociali + adempimenti",
      priceCents: 25000, // 250 €/mese
    },
  ],

  // Business Plan: 3 scaglioni
  "business-plan": [
    {
      id: "bp-fino-100k",
      title: "Triennale fino a 100.000 €",
      desc: "Elaborazione completa",
      priceCents: 25000, // 250 € + IVA
    },
    {
      id: "bp-oltre-100k",
      title: "Triennale oltre 100.000 €",
      desc: "Con relazione del commercialista",
      priceCents: 50000, // 500 € + IVA
    },
    {
      id: "bp-quinquennale-oltre-500k",
      title: "Quinquennale oltre 500.000 €",
      desc: "Con relazione del commercialista",
      priceCents: 80000, // 800 € + IVA
    },
  ],

  // Analisi di bilanci: 2 scaglioni
  "analisi-bilanci": [
    {
      id: "analisi-base-250",
      title: "Analisi + relazione",
      priceCents: 25000, // 250 € + IVA
    },
    {
      id: "analisi-avanzata-400",
      title: "Analisi avanzata + rating bancario",
      priceCents: 40000, // 400 € + IVA
    },
  ],

  // Cessione quote societarie: prezzo unico (onorario)
  "cessione-quote-societarie": [
    {
      id: "cessione-quote",
      title: "Cessione quote",
      desc: "Onorario (esclusi costi registrazione/deposito)",
      priceCents: 30000, // 300 € + IVA
    },
  ],
};

export default function ServiceDetailPage() {
  const { id = "" } = useParams();
  const service = getServiceById(id);
  const { add } = useCart();

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-2">Servizio non trovato</h1>
        <Link to="/servizi" className="underline text-primary">Torna ai servizi</Link>
      </div>
    );
  }

  const variants = VARIANTS[id] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Intestazione */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{service.title}</h1>
        {service.subtitle && (
          <p className="text-lg text-muted-foreground mt-2">{service.subtitle}</p>
        )}
      </div>

      {/* Descrizione puntata */}
      <Card className="mb-8">
        <CardContent className="prose max-w-none pt-6">
          <ul className="list-disc pl-6 space-y-2">
            {service.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Varianti/piani acquistabili */}
      {variants.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Scegli il piano</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {variants.map((v) => (
              <Card key={v.id} className="shadow-elegant">
                <CardHeader>
                  <CardTitle>{v.title}</CardTitle>
                  {v.desc && <CardDescription>{v.desc}</CardDescription>}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-xl font-bold text-primary">
                    {centsToEUR(v.priceCents)}
                  </div>
                  <Button
                    className="bg-[#FF6B6B] hover:opacity-90"
                    onClick={() =>
                      add({ id: v.id, title: `${service.title} – ${v.title}`, unitPriceCents: v.priceCents }, 1)
                    }
                  >
                    Aggiungi al carrello
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* CTA contatto */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row gap-3">
            <a href={TEL_LINK}>
              <Button className="bg-[#FF6B6B]">
                <Phone className="mr-2 h-5 w-5" />
                Chiama — {TEL_DISPLAY}
              </Button>
            </a>
            <a href={EMAIL_LINK}>
              <Button variant="outline">
                <Mail className="mr-2 h-5 w-5" />
                Scrivi una mail — {EMAIL}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
