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

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="text-primary-foreground py-20 px-4"
        style={{ backgroundColor: "#0D3B66" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Zero burocrazia e nessuna perdita di tempo: ci pensiamo noi
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Supporto professionale per problemi fiscali, tributari, legali,
            lavorativi e finanziari.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA informativa → sezione contatti */}
            <a href="#contatti">
              <Button
                size="lg"
                className="text-lg px-8 py-4 hover:opacity-90 transition-smooth"
                style={{ backgroundColor: "#FF6B6B", color: "#fff" }}
              >
                Richiedi subito info per le tue esigenze
              </Button>
            </a>

            {/* Scorri ai servizi */}
            <a href="#servizi">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Scopri i servizi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            {/* Chiamata diretta */}
            <a href="tel:+393318341262">
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

      {/* Benefits Banner */}
      <section className="py-16 bg-muted">
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
              <p className="text-muted-foreground">Tariffe e trasparenti</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary p-4 rounded-full">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Ok il resto</h3>
              <p className="text-muted-foreground">
                Pensiamo noi alle pratiche
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prezzi" className="py-20 px-4">
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
                  <Link to="/area-utenti" className="block">
                    <Button className="w-full bg-gradient-hero hover:opacity-90">
                      Abbonati ora
                    </Button>
                  </Link>
                </div>
              </CardContent>
              <Badge className="w-fit mx-auto mb-6 bg-secondary text-secondary-foreground flex ">
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
                  <a href="#contatti" className="block">
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

      {/* Services Preview */}
      <section id="servizi" className="py-20 bg-muted px-4">
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
                <p>• Cartelle esattoriali</p>
                <p>• Istanze di sgravio</p>
                <p>• Comunicazioni Agenzia Entrate</p>
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
                <p>• Lettere di contestazione</p>
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
                <p>• Contratti di locazione</p>
                <p>• Comodati d’uso gratuito</p>
                <p>• Scritture private</p>
                {/* Rimosso: Visure e certificati (spostato su Imprese) */}
              </CardContent>
            </Card>

            {/* Consulenze */}
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-secondary p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Consulenze</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 text-center">
                <p>• Su chat</p>
                <p>• Per appuntamento</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/servizi">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                Vedi tutti i servizi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA + Contatti in fondo (sostituisce “Richiedi subito una consulenza”) */}
      <section id="contatti" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl xl:max-w-[1280px] mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Contattaci ora
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              <span className="font-semibold">Pronto a iniziare?</span> Non
              perdere altro tempo con procedure complicate: i nostri esperti
              sono qui per aiutarti a risolvere i tuoi problemi.{" "}
              <span className="font-semibold">
                Contattaci con fiducia adesso.
              </span>
            </p>
          </div>

          {/* 4 cards in linea da lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Link
                  to="/chat"
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
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-[#FF6B6B] text-white hover:opacity-90 transition-smooth"
                >
                  Prenota Visita
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* puoi tenere il form iscrizione qui, se vuoi */}
          <div className="max-w-4xl mx-auto text-center mt-12">
            <SignupForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
