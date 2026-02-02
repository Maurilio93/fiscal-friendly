import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Euro,
  Shield,
  Phone,
  ArrowRight,
  FileText,
  Calculator,
  Building,
  MessageCircle,
  MapPin,
  Mail,
} from "lucide-react";
import SignupForm from "@/components/SignupForm";
import { useEffect, useState } from "react";
import BillingModal, { BillingPayload } from "@/components/BillingModal";
import { startCheckout } from "@/lib/checkout";
import { useAuth } from "@/auth/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Componente per il pulsante pagamento spese (solo utenti loggati)
function PaymentButton({
  onOpenBilling,
}: {
  onOpenBilling: (item: {
    id: string;
    title: string;
    unitPriceCents: number;
  }) => void;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  if (!user) return null; // nascosto se non loggato

  const handleSubmit = () => {
    setError("");
    const num = parseFloat(amount.replace(",", "."));

    if (!num || isNaN(num) || num < 1 || num > 10000) {
      setError("Inserisci un importo valido tra € 1,00 e € 10.000,00");
      return;
    }

    // Converti in centesimi (IVA esclusa, sarà aggiunta dal sistema al checkout)
    const cents = Math.round(num * 100);

    // Chiama la funzione del componente padre per aprire il modal fatturazione
    onOpenBilling({
      id: "spese-agenzia-cciaa",
      title: "PAGAMENTO SPESE AGENZIA ENTRATE / CCIAA",
      unitPriceCents: cents,
    });

    setOpen(false);
    setAmount("");
  };

  return (
    <>
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <Button
            size="lg"
            variant="outline"
            className="text-base md:text-lg px-4 md:px-8 py-3 md:py-4 border-2 border-primary hover:bg-primary hover:text-primary-foreground w-full md:w-auto"
            onClick={() => setOpen(true)}
          >
            <Euro className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="text-sm md:text-base leading-tight">
              PAGAMENTO SPESE
              <br className="md:hidden" /> AGENZIA ENTRATE / CCIAA
            </span>
          </Button>
          <p className="text-xs md:text-sm text-muted-foreground mt-3 px-2">
            Inserisci l'importo comunicato per le spese di
            registrazione/deposito
          </p>
        </div>
      </section>

      {/* Dialog per inserimento importo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento Spese Agenzia Entrate / CCIAA</DialogTitle>
            <DialogDescription>
              Inserisci l'importo (IVA esclusa) che ti è stato comunicato per le
              spese di registrazione, diritti, bolli, ecc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Importo in Euro (IVA esclusa 22%)</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max="10000"
                  placeholder="Es: 150.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Importo minimo: € 1,00 — Importo massimo: € 10.000,00
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>Procedi al pagamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const Index = () => {
  const location = useLocation();

  // ---- Modal locandine ----
  const [casartModalOpen, setCasartModalOpen] = useState(false);
  const [casartIdx, setCasartIdx] = useState(0);

  // ---- Modal Business Plan ----
  const [businessPlanModalOpen, setBusinessPlanModalOpen] = useState(false);
  const [businessPlanIdx, setBusinessPlanIdx] = useState(0);

  // ---- Billing modal (pagamento) ----
  const [billingOpen, setBillingOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{
    id: string;
    title: string;
    unitPriceCents: number;
  } | null>(null);

  // Abbonamento 100€ + IVA / Servizio occasionale 40€ + IVA
  const OPEN_BILLING_ABBONAMENTO = () =>
    openBillingFor({
      id: "abbonamento-annuale",
      title: "Abbonamento annuale",
      unitPriceCents: 10000,
    });
  const OPEN_BILLING_OCCASIONALE = () =>
    openBillingFor({
      id: "servizio-occasionale",
      title: "Servizio occasionale",
      unitPriceCents: 4000,
    });

  function openBillingFor(item: {
    id: string;
    title: string;
    unitPriceCents: number;
  }) {
    setPendingItem(item);
    setBillingOpen(true);
  }

  async function handleBillingSubmit(billing: BillingPayload) {
    if (!pendingItem) return;
    // crea ordine + redirect a Viva
    await startCheckout(pendingItem, billing);
    // se non redirige per qualche motivo, chiudi il modal per sicurezza
    setBillingOpen(false);
  }

  const posters = [
    { src: "/banner/finanziamenti.jpg", alt: "Locandina Finanziamenti" },
    { src: "/banner/servizi.jpg", alt: "Locandina Servizi" },
  ];

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  }, [location]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setCasartModalOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        id="hero"
        className="text-primary-foreground py-20 px-4"
        style={{ backgroundColor: "#0D3B66" }}
        aria-label="Introduzione"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Soluzioni rapide e accessibili
            <span className="block text-[#FFEB3B] mt-2">
              Ci pensiamo a tutto noi
            </span>
          </h1>

          <div className="mt-6 flex justify-center px-4">
            <p
              className="text-white/90 whitespace-nowrap leading-snug text-center"
              style={{ fontSize: "clamp(14px, 2.2vw, 24px)", maxWidth: "100%" }}
            >
              Supporto professionale per cittadini, imprese e professionisti:
              pratiche CCIAA, bilanci, atti, business plan e molto altro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#servizi" aria-label="Vai alla sezione servizi">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Scopri i servizi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            <a
              href="tel:+393318341262"
              aria-label="Chiama il numero +39 331 834 1262"
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Phone className="mr-2 h-5 w-5" />
                Chiama ora
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted" aria-label="Vantaggi principali">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-secondary p-4 rounded-full">
                <Clock className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Rapidità</h3>
              <p className="text-muted-foreground">
                Risposte in tempi record per le tue urgenze
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-accent p-4 rounded-full">
                <Euro className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                Scegli la soluzione per te
              </h3>
              <p className="text-muted-foreground">
                Tariffe chiare e trasparenti
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary p-4 rounded-full">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Zero pensieri</h3>
              <p className="text-muted-foreground">
                Alle pratiche pensiamo noi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="prezzi" className="py-20 px-4" aria-label="Prezzi e piani">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scegli la soluzione per te
            </h2>
            <p className="text-xl text-muted-foreground">
              Tariffe semplici e trasparenti
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Abbonamento */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth border-secondary border-2">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Abbonamento annuale</CardTitle>
                <div className="text-4xl font-bold text-primary">
                  € 100{" "}
                  <span className="text-lg text-muted-foreground">+ IVA</span>
                </div>
                <CardDescription className="text-lg">
                  Servizi inclusi nell'abbonamento
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>4 pratiche incluse all'anno</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>10 consulenze telefoniche incluse nell'anno</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Supporto via email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Area utenti dedicata</span>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-gradient-hero hover:opacity-90"
                    onClick={OPEN_BILLING_ABBONAMENTO}
                    aria-label="Inserisci i dati di fatturazione e abbonati"
                  >
                    Abbonati adesso
                  </Button>
                </div>
              </CardContent>

              <Badge className="w-fit mx-auto mb-6 bg-secondary text-secondary-foreground flex center">
                Consigliato
              </Badge>
            </Card>

            {/* Occasionale */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Servizi occasionali</CardTitle>
                <div className="text-4xl font-bold text-primary">
                  € 40{" "}
                  <span className="text-lg text-muted-foreground">+ IVA</span>
                </div>
                <CardDescription className="text-lg">
                  per singolo servizio
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Una pratica</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Una consulenza telefonica</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Paghi solo quando ti serve</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Supporto base</span>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-gradient-hero hover:opacity-90"
                    onClick={OPEN_BILLING_OCCASIONALE}
                    aria-label="Inserisci i dati di fatturazione e richiedi il servizio"
                  >
                    Richiedi il servizio adesso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="servizi"
        className="py-20 bg-muted px-4"
        aria-label="Anteprima servizi"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              I nostri servizi
            </h2>
            <p className="text-xl text-muted-foreground">
              inclusi nell'abbonamento annuale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fisco e Tributi */}
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-secondary p-3 rounded-full w-fit mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Su fisco e tributi</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 text-center">
                <p>• Dichiarazioni fiscali</p>
                <p>• Avvisi bonari Agenzia Entrate</p>
                <p>• Cartelle Agenzia Entrate Riscossione</p>
                <p>• Istanze di sgravio Agenzia Entrate</p>
                <p>• Ricorsi Commissione Tributaria</p>
              </CardContent>
            </Card>

            {/* Imprese */}
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-accent p-3 rounded-full w-fit mx-auto mb-4">
                  <Building className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Su imprese</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 text-center">
                <p>• Apertura/chiusura P.IVA</p>
                <p>• Iscrizioni, variazioni e cancellazioni CCIAA</p>
                <p>• Deposito bilanci</p>
                <p>• Adempimenti societari</p>
                <p>• Visure e certificati</p>
              </CardContent>
            </Card>

            {/* Contratti */}
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary p-3 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Su contratti</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 text-center">
                <p>• Registrazione contratto di locazione</p>
                <p>• Registrazione comodati d'uso gratuiti</p>
                <p>• Registrazioni scritture private</p>
                <p>• Consulenza per la stipula di atti tra privati</p>
              </CardContent>
            </Card>

            {/* Consulenze */}
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] p-3 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Consulenze</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 text-center">
                <p>• Telefoniche</p>
                <p>• Su chat</p>
                <p>• Per e-mail</p>
                <p>• In videoconferenza</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/servizi" aria-label="Vai alla pagina Servizi">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                I nostri servizi extra
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SEZIONE FAQ ========== */}
      <section
        className="py-20 px-4 bg-background"
        aria-label="Domande frequenti"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Risposte a domande frequenti e chiarimenti prima dell'acquisto
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">
                  IVA compresa o esclusa?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tutti i prezzi si intendono IVA esclusa 22% che viene
                  automaticamente calcolata dal sistema all'atto del pagamento.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">
                  Spese Agenzia entrate e CCIAA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Diverse pratiche da inoltrare all'agenzia delle entrate e alla
                  CCIAA sono soggette al pagamento di imposte di registro,
                  diritti e bolli che variano a secondo la pratica da
                  trasmettere e che vi saranno comunicate all'atto della
                  richiesta del servizio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== PULSANTE PAGAMENTO SPESE ========== */}
      <PaymentButton onOpenBilling={openBillingFor} />

      {/* Pacchetto Commercialisti */}
      <section className="py-10 px-4" aria-label="Pacchetto Commercialisti">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/commercialisti"
            aria-label="Vai alla pagina Commercialisti"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-yellow-100 bg-yellow-50 text-center">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-amber-800">
                  Pacchetto speciale per commercialisti
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-900">
                <p className="text-base md:text-lg">
                  Trasferite a noi gli adempimenti per i vostri clienti che vi
                  fanno perdere tempo prezioso a prezzi davvero irrisori.{" "}
                  <span className="underline">Approfondisci</span>
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Banner Business Plan */}
      <section className="py-10 px-4" aria-label="Business Plan">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => {
              setBusinessPlanIdx(0);
              setBusinessPlanModalOpen(true);
            }}
            className="group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-2xl border bg-gradient-to-r from-blue-50 to-white p-6 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600/60 transition-all"
            aria-label="Apri informazioni Business Plan"
          >
            <h3 className="text-center text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 leading-snug">
              Vuoi creare un business plan o un piano finanziario per la tua
              azienda o per la tua start-up?
            </h3>
            <span className="text-center text-sm md:text-base font-semibold text-blue-700 uppercase tracking-wide">
              Clicca qui per visualizzare gli approfondimenti
            </span>
            <span className="mt-2 rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white">
              Scopri di più
            </span>
          </button>
        </div>
      </section>

      {/* Modal locandine */}
      {casartModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 h-full w-full"
            onClick={() => setCasartModalOpen(false)}
            aria-label="Chiudi"
          />
          <img
            src={posters[casartIdx].src}
            alt={posters[casartIdx].alt}
            className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg shadow-lg"
            loading="eager"
            decoding="async"
          />
          {posters.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCasartIdx((i) => (i - 1 + posters.length) % posters.length)
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 text-lg shadow"
                aria-label="Precedente"
              >
                ‹
              </button>
              <button
                onClick={() => setCasartIdx((i) => (i + 1) % posters.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 text-lg shadow"
                aria-label="Successiva"
              >
                ›
              </button>
            </>
          )}
          <button
            onClick={() => setCasartModalOpen(false)}
            className="absolute top-5 right-5 rounded-full bg-white/80 hover:bg-white px-3 py-1 text-sm shadow"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>
      )}
      {/* Modal Business Plan */}
      {businessPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setBusinessPlanModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Informazioni Business Plan"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBusinessPlanModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Chiudi"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="prose max-w-none">
              <h2 className="mb-4 text-center text-2xl md:text-3xl font-bold text-gray-900">
                Vuoi creare un business plan o un piano finanziario per la tua
                azienda o per la tua start-up?
              </h2>

              <p className="text-center text-lg font-semibold text-blue-700 mb-6">
                PAGINA DI PRESENTAZIONE
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                IL BUSINESS PLAN È UNO STRUMENTO NECESSARIO CHE SERVE A:
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">
                    1) PRESENTARE ALLA TUA BANCA UNA PRATICA DI FINANZIAMENTO
                  </h4>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Se intendi richiedere un finanziamento sotto forma di mutuo
                    o prestito finalizzato ad un investimento nella struttura
                    produttiva della tua azienda la tua banca ti chiederà un
                    business plan ed un piano finanziario idonei a dimostrare la
                    bontà in termini economici e finanziari della tua richiesta
                    e dunque che il tuo progetto di investimento sia allineato
                    alla tua richiesta ed in grado di poter remunerare il
                    capitale e gli interessi dovuti alla banca.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">
                    2) COINVOLGERE UN INVESTITORE AL TUO PROGETTO
                  </h4>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Se hai un'idea o un progetto sul quale credi ma non hai la
                    disponibilità finanziaria per portarlo avanti e dunque vuoi
                    presentarti ad un investitore devi essere strutturato a
                    livello documentale ed il business plan è il documento
                    principale che riassume in modo chiaro la tua idea di
                    business e che questa, in base ai valori presunti sullo
                    sviluppo aziendale, si concretizza in un'idea vincente.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">
                    3) PER PARTECIPARE A BANDI PUBBLICI
                  </h4>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Se desideri partecipare ad un bando del PNRR, a un bando
                    europeo, a bandi regionali o ad un bando invitalia, è
                    fondamentale avere un Business Plan ben strutturato che si
                    allinei alla richiesta di finanziamento e che dimostri,
                    anche con la redazione accompagnatoria di un dottore
                    commercialista che ne commenta il contenuto, che
                    l'investimento da realizzare con i fondi richiesti sia nel
                    breve tempo remunerativo e possa garantire l'ente creditore
                    del rientro rateale del capitale erogato (al netto
                    dell'eventuale fondo perduto a vantaggio dell'impresa).
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">
                    4) PER STRUTTURARE LA STRATEGIE DI CRESCITA DELLA TUA
                    STARTUP
                  </h4>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Il business plan non serve solo per portarlo all'esterno
                    della tua azienda, ma soprattutto al tuo interno per
                    condividere dei nuovi progetti o delle strategie chiare con
                    tutta la tua squadra ed avere degli obiettivi tangibili da
                    raggiungere e monitorare di volta in volta durante il
                    processo di sviluppo aziendale. Questo processo, spesso
                    trascurato dagli imprenditori, è di notevole importanza per
                    poter evincere eventuali criticità emergenti ancor prima che
                    queste possano influenzare negativamente e talvolta anche
                    irreparabilmente l'andamento economico e finanziario
                    dell'azienda.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center border border-blue-200">
                <p className="text-lg font-bold text-blue-900 uppercase mb-2">
                  Invia una email per info e costi sulla realizzazione di un
                  business plan
                </p>
                <a
                  href="mailto:info@miniconsulenze.it"
                  className="inline-block mt-3 rounded-full bg-blue-700 px-6 py-3 text-white font-semibold hover:bg-blue-800 transition-colors"
                >
                  Contattaci
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contatti */}
      <section
        id="contatti"
        className="py-20 px-4 bg-muted/30"
        aria-label="Contatti e canali di supporto"
      >
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Contattaci ora
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              <span className="font-semibold">Pronto a iniziare?</span> Non
              perdere altro tempo con procedure complicate: i nostri esperti
              sono qui per aiutarti a risolvere i tuoi problemi.{" "}
              <span className="font-semibold">
                Contattaci con fiducia adesso.
              </span>
            </p>

            <span className="text-lg font-semibold mr-3 text-[#0D3B66]">
              Richiedi subito info per le tue esigenze
            </span>
            <a
              href="tel:+393318341262"
              aria-label="Chiama +39 331 834 1262"
              className="inline-flex items-center justify-center rounded-full p-4 bg-[#FF6B6B] hover:opacity-90 transition-smooth"
            >
              <Phone className="h-4 w-4 text-white" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Telefono */}
            <Card className="h-full rounded-2xl border shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white bg-gradient-hero hover:opacity-90 transition-smooth">
                  <Phone className="h-4 w-4" />
                  Telefono
                </div>
                <CardTitle className="sr-only">Telefono</CardTitle>
                <CardDescription className="pt-2">
                  Chiamata diretta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-semibold tracking-tight">
                  +39 331 834 1262
                </div>
                <div className="text-sm text-muted-foreground">
                  Lun–Ven:9:00–19:00 Sab:9:00–13:00
                </div>
                <a
                  href="tel:+393318341262"
                  aria-label="Chiama +39 331 834 1262"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white bg-[#FF6B6B] hover:opacity-90 transition-smooth"
                >
                  Chiama ora
                </a>
              </CardContent>
            </Card>

            {/* E-mail */}
            <Card className="h-full rounded-2xl border shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white bg-gradient-hero hover:opacity-90 transition-smooth">
                  <Mail className="h-4 w-4" />
                  E-mail
                </div>
                <CardTitle className="sr-only">E-mail</CardTitle>
                <CardDescription className="pt-2">
                  Risposta entro 2 ore
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-semibold tracking-tight">
                  info@miniconsulenze.it
                </div>
                <div className="text-sm text-muted-foreground">
                  Assistenza generale e richieste servizi
                </div>
                <a
                  href="mailto:info@miniconsulenze.it"
                  aria-label="Scrivi a info@miniconsulenze.it"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Scrivi Email
                </a>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="h-full rounded-2xl border shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white bg-gradient-hero hover:opacity-90 transition-smooth">
                  <MessageCircle className="h-4 w-4" />
                  Chatta in diretta
                </div>
                <CardTitle className="sr-only">Chatta in diretta</CardTitle>
                <CardDescription className="pt-2">
                  Supporto immediato
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-2xl font-semibold tracking-tight">
                  In linea
                </div>
                <div className="text-sm text-muted-foreground">
                  Assistenza in tempo reale per abbonati
                </div>

                <button
                  onClick={() =>
                    window.open(
                      "https://wa.me/393471234567?text=" +
                        encodeURIComponent("Ciao! Ho bisogno di assistenza."),
                      "_blank",
                    )
                  }
                  aria-label="Apri la chat WhatsApp"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Apri Chat
                </button>
              </CardContent>
            </Card>

            {/* Ufficio */}
            <Card className="h-full rounded-2xl border shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white bg-gradient-hero hover:opacity-90 transition-smooth">
                  <MapPin className="h-4 w-4" />
                  Ufficio
                </div>
                <CardTitle className="sr-only">Ufficio</CardTitle>
                <CardDescription className="pt-2">
                  Su appuntamento
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-2xl font-semibold tracking-tight">
                  Palermo Centro
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Via Principe di Villafranca, 43 Palermo
                </div>

                <button
                  onClick={() =>
                    window.open(
                      "https://wa.me/393471234567?text=" +
                        encodeURIComponent(
                          "Ciao! Vorrei prenotare una visita presso l'ufficio di Palermo.",
                        ),
                      "_blank",
                    )
                  }
                  aria-label="Prenota una visita in ufficio via WhatsApp"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Prenota Visita
                </button>
              </CardContent>
            </Card>
          </div>

          {/* form iscrizione */}
          <div className="max-w-4xl mx-auto text-center mt-12" id="registrati">
            <SignupForm />
          </div>
        </div>
      </section>

      {/* ---- MODAL DATI FATTURAZIONE ---- */}
      <BillingModal
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
        onSubmit={handleBillingSubmit}
      />
    </div>
  );
};

export default Index;
