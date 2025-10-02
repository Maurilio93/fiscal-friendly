import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../data/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Phone, Mail, FileText } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const svc = getServiceById(id || "");

  if (!svc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <p className="text-lg">Servizio non trovato.</p>
        <Link
          to="/servizi"
          className="inline-flex items-center gap-2 underline"
        >
          <ChevronLeft className="size-4" /> Torna ai servizi
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/servizi"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ChevronLeft className="size-4" /> Torna ai servizi
      </Link>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl">{svc.title}</CardTitle>
          {svc.subtitle && (
            <p className="text-muted-foreground">{svc.subtitle}</p>
          )}
        </CardHeader>

        <CardContent>
          <ul className="space-y-3 text-[0.975rem]">
            {svc.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 size-1.5 rounded-full bg-primary/60 shrink-0" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {/* --- CTA sotto ogni servizio --- */}
          <div
            className="mt-8 rounded-xl border p-6 bg-muted/30"
          >
            <div className="flex flex-wrap gap-4">
              <Link to="/contatti">
                <Button className="flex items-center gap-2 bg-[#0E3B63] hover:bg-[#0E3B63]/90">
                  <FileText className="size-4" />
                  Compila il form
                </Button>
              </Link>

              <a href="tel:+390000000000">
                <Button className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
                  <Phone className="size-4" />
                  Chiama
                </Button>
              </a>

              <a href="mailto:info@tuodominio.it">
                <Button className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
                  <Mail className="size-4" />
                  Scrivi una mail
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
