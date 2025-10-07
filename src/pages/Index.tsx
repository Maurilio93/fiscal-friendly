import { Link } from "react-router-dom";
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
  Users,
  FileText,
  Calculator,
  Building,
  MessageCircle,
  MapPin,
  Mail,
} from "lucide-react";
import SignupForm from "@/components/SignupForm";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line react-hooks/rules-of-hooks
const location = useLocation();
// eslint-disable-next-line react-hooks/rules-of-hooks
useEffect(() => {
  if (location.hash) {
    // attende il render e poi scrolla alla sezione
    setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }
}, [location]);

const Index = () => {
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

          {/* descrizione su UNA riga su schermi medi+ */}
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
            {/* Scorri ai servizi (lasciato com'è: ancora àncora interna) */}
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

            {/* Chiamata diretta → TEL corretto */}
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

      {/* Teaser Commercialisti */}

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
                  Servizi inclusi nell’abbonamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>4 pratiche incluse all'anno</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Consulenze Telefoniche illimitate</span>
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
                  <Link
                    to="/area-utenti"
                    className="block"
                    aria-label="Vai all'area utenti per abbonarti"
                  >
                    <Button className="w-full bg-gradient-hero hover:opacity-9">
                      Abbonati ora
                    </Button>
                  </Link>
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
                  <a
                    href="#contatti"
                    className="block"
                    aria-label="Vai alla sezione contatti per richiedere il servizio"
                  >
                    <Button variant="outline" className="w-full">
                      Richiedi servizio
                    </Button>
                  </a>
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
              Tutto quello di cui hai bisogno, in un unico posto
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
                <p>• Iscrizione CCIAA</p>
                <p>• Deposito bilanci</p>
                <p>• Adempimenti societari</p>
                <p>• Visure e certificati</p>
                {/* RIMOSSA la voce "Lettere di contestazione" */}
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
                <p>• Registrazione comodati d’uso gratuiti</p>
                <p>• Registrazioni scritture private</p>
                <p>• Stipula e registrazione cessione quote SRL</p>
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
                Vedi tutti i servizi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

      {/* Contatti in fondo */}
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

            {/* Testo informativo (non cliccabile) */}
            <span className="text-lg font-semibold mr-3 text-[#0D3B66]">
              Richiedi subito info per le tue esigenze
            </span>

            {/* Icona telefono (collegata) */}
            <a
              href="tel:+393318341262"
              aria-label="Chiama +39 331 834 1262"
              className="inline-flex items-center justify-center rounded-full p-4 bg-[#FF6B6B] hover:opacity-90 transition-smooth"
            >
              <Phone className="h-4 w-4 text-white" />
            </a>
          </div>

          {/* 4 card contatti */}
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
                  Lun–Ven: 9:00–19:00 • Sab: 9:00–13:00
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
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Scrivi Email
                </a>
              </CardContent>
            </Card>

            {/* Chat → puntiamo all'area utenti dove gestisci la chat */}
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
                <Link
                  to="/area-utenti#chat"
                  aria-label="Apri la chat nell'area utenti"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Apri Chat
                </Link>
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
                <Link
                  to="/prenota"
                  aria-label="Prenota una visita in ufficio"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Prenota Visita
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* (opzionale) form iscrizione */}
          <div className="max-w-4xl mx-auto text-center mt-12" id="registrati">
            <SignupForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
