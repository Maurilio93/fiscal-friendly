import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Euro, Shield, Phone, ArrowRight, Users, FileText, Calculator, Building } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Soluzioni rapide e accessibili per cittadini, imprese e professionisti
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Zero burocrazia per te, ci pensiamo noi. Supporto professionale per problemi fiscali, legali, lavorativi e finanziari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contatti">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 hover:shadow-glow transition-smooth">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi subito una consulenza
              </Button>
            </Link>
            <Link to="/servizi">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Scopri i Servizi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
              <p className="text-muted-foreground">Risposte in tempi record per le tue urgenze</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-accent p-4 rounded-full">
                <Euro className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Risparmio</h3>
              <p className="text-muted-foreground">Costi accessibili, niente sorprese</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary p-4 rounded-full">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Professionalità</h3>
              <p className="text-muted-foreground">Esperti qualificati al tuo servizio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Scegli la soluzione per te</h2>
            <p className="text-xl text-muted-foreground">Tariffe chiare e trasparenti</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Abbonamento */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth border-secondary border-2">
              <CardHeader className="text-center pb-8">
                <Badge className="w-fit mx-auto mb-4 bg-secondary text-secondary-foreground">Consigliato</Badge>
                <CardTitle className="text-2xl">Abbonamento Annuale</CardTitle>
                <div className="text-4xl font-bold text-primary">€100<span className="text-lg text-muted-foreground"> + IVA</span></div>
                <CardDescription className="text-lg">4 servizi inclusi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>4 pratiche all'anno</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Consulenze telefoniche illimitate</span>
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
                      Abbonati Ora
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Occasionale */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Servizi Occasionali</CardTitle>
                <div className="text-4xl font-bold text-primary">€40<span className="text-lg text-muted-foreground"> + IVA</span></div>
                <CardDescription className="text-lg">A singolo servizio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Una pratica per volta</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Supporto base</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Nessun vincolo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Pagamento per servizio</span>
                </div>
                <div className="pt-4">
                  <Link to="/contatti" className="block">
                    <Button variant="outline" className="w-full">
                      Richiedi Servizio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">I nostri servizi</h2>
            <p className="text-xl text-muted-foreground">Tutto quello di cui hai bisogno, in un unico posto</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-secondary p-3 rounded-full w-fit mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Fisco e Tributi</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Dichiarazioni fiscali</p>
                <p>• Cartelle esattoriali</p>
                <p>• Istanze di sgravio</p>
                <p>• Comunicazioni IVA</p>
              </CardContent>
            </Card>

            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-accent p-3 rounded-full w-fit mx-auto mb-4">
                  <Building className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Imprese</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Apertura/chiusura P.IVA</p>
                <p>• Iscrizione CCIAA</p>
                <p>• Deposito bilanci</p>
                <p>• Adempimenti societari</p>
              </CardContent>
            </Card>

            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary p-3 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Contratti</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Locazioni</p>
                <p>• Comodati</p>
                <p>• Scritture private</p>
                <p>• Visure e certificati</p>
              </CardContent>
            </Card>

            <Card className="gradient-card hover:shadow-elegant transition-smooth">
              <CardHeader className="text-center pb-4">
                <div className="bg-secondary p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Consulenze</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Telefoniche</p>
                <p>• Via email</p>
                <p>• Lettere di contestazione</p>
                <p>• Supporto rapido</p>
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto a iniziare?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Non perdere altro tempo con la burocrazia. I nostri esperti sono qui per aiutarti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contatti">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-hero hover:opacity-90">
                <Phone className="mr-2 h-5 w-5" />
                Contattaci Ora
              </Button>
            </Link>
            <Link to="/come-funziona">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Come Funziona
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;