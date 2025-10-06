// src/pages/Servizi.tsx
import { Link } from "react-router-dom";
import { SERVICES } from "../data/service"; // o ../data/services
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/cart/CartContext";
import { centsToEUR } from "@/lib/api";
import {
  Briefcase,  // Business plan
  Calculator, // Contabilità
  BarChart3,  // Analisi di bilanci
  Shuffle,    // Cessione quote societarie
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<unknown>> = {
  contabilita: Calculator,
  "business-plan": Briefcase,
  "analisi-bilanci": BarChart3,
  "cessione-quote-societarie": Shuffle,
};

export default function Servizi() {
  const { add } = useCart();

  return (
    <>
      {/* HERO blu in stile "Chi Siamo" */}
      <section className="bg-[#0E3B63] text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Servizi Extra</h1>
          <p className="text-white/90 mt-3 text-lg md:text-xl">
            Servizi specialistici per esigenze più complesse
          </p>
        </div>
      </section>

      {/* Contenuto: griglia 2 colonne centrata */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.id] ?? Briefcase;
            const priceCents =
              typeof s.priceCents === "number" ? s.priceCents : undefined;

            const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof priceCents !== "number") return;
              add({ id: s.id, title: s.title, unitPriceCents: priceCents }, 1);
            };

            return (
              <Link key={s.id} to={`/servizi/${s.id}`} className="group focus:outline-none">
                <Card className="h-full border border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-0.5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-primary/10 grid place-items-center transition-colors group-hover:bg-primary/15">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-xl leading-tight">{s.title}</CardTitle>
                        {s.subtitle && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {s.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 text-sm text-muted-foreground">
                    <p className="line-clamp-3">{s.bullets?.[0]}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">
                        Clicca per i dettagli
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors"
                      >
                        Approfondisci
                      </Badge>
                    </div>

                    {/* Prezzo + CTA solo se definito nel datasource */}
                    {typeof priceCents === "number" && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-base font-semibold text-primary">
                          {centsToEUR(priceCents)}
                        </div>
                        <Button className="bg-[#FF6B6B] hover:opacity-90" onClick={handleAdd}>
                          Aggiungi al carrello
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
