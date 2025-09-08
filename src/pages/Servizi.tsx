import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  Building, 
  FileText, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb
} from "lucide-react";

const Servizi = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">I Nostri Servizi</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Tutto quello di cui hai bisogno per la tua attività e la tua vita professionale
          </p>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">Prezzi trasparenti</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Scegli la formula che fa per te</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Abbonamento */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth border-secondary border-2">
              <CardHeader className="text-center pb-8">
                <Badge className="w-fit mx-auto mb-4 bg-secondary text-secondary-foreground">Consigliato</Badge>
                <CardTitle className="text-2xl">Abbonamento Annuale</CardTitle>
                <div className="text-4xl font-bold text-primary">€100<span className="text-lg text-muted-foreground"> + IVA</span></div>
                <CardDescription className="text-lg">4 servizi inclusi</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/area-utenti" className="block">
                  <Button className="w-full bg-gradient-hero hover:opacity-90 mb-4">
                    Abbonati Ora
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Ideale per chi ha bisogno di più servizi durante l'anno
                </p>
              </CardContent>
            </Card>

            {/* Occasionale */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Servizi Occasionali</CardTitle>
                <div className="text-4xl font-bold text-primary">€40<span className="text-lg text-muted-foreground"> + IVA</span></div>
                <CardDescription className="text-lg">A singolo servizio</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contatti" className="block">
                  <Button variant="outline" className="w-full mb-4">
                    Richiedi Servizio
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Perfetto per esigenze specifiche e occasionali
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Servizi inclusi nell'abbonamento</h2>
            <p className="text-xl text-muted-foreground">
              Suddivisi per categorie per aiutarti a orientarti
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fisco e Tributi */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <Calculator className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Fisco e Tributi</CardTitle>
                    <CardDescription>Tutto per le tue questioni fiscali</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Compilazione dichiarazioni fiscali</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Gestione cartelle esattoriali</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Istanze di sgravio e rimborsi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Comunicazioni IVA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Ravvedimenti operosi</span>
                </div>
              </CardContent>
            </Card>

            {/* Imprese e Professionisti */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-accent p-3 rounded-full">
                    <Building className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Imprese e Professionisti</CardTitle>
                    <CardDescription>Servizi per la tua attività</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Apertura/chiusura partita IVA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Iscrizione Camera di Commercio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Deposito bilanci</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Adempimenti societari</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Variazioni anagrafiche</span>
                </div>
              </CardContent>
            </Card>

            {/* Contratti e Registrazioni */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Contratti e Registrazioni</CardTitle>
                    <CardDescription>Documenti e pratiche legali</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Contratti di locazione</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Comodati d'uso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Scritture private</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Visure camerali e catastali</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Certificati vari</span>
                </div>
              </CardContent>
            </Card>

            {/* Consulenze Rapide */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <Phone className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Consulenze Rapide</CardTitle>
                    <CardDescription>Supporto immediato quando serve</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Consulenze telefoniche</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Supporto via email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Lettere di contestazione</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Chiarimenti normativi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span>Orientamento su adempimenti</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Extra Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Servizi Extra</h2>
            <p className="text-xl text-muted-foreground">
              Servizi specialistici per esigenze più complesse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Contabilità</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ordinaria e semplificata per la tua attività
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Business Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  E piani di risanamento aziendale
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Analisi Bilanci</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  E rating bancario per finanziamenti
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Piani marketing e studi di fattibilità
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/contatti">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                Richiedi Preventivo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Domande Frequenti</h2>
          </div>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Qual è la differenza tra abbonamento e servizi occasionali?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  L'abbonamento annuale include 4 servizi + consulenze illimitate per €100+IVA. 
                  I servizi occasionali costano €40+IVA ciascuno senza vincoli di abbonamento.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Posso cambiare da occasionale ad abbonamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Assolutamente sì. Puoi passare all'abbonamento in qualsiasi momento e avrai accesso 
                  immediato a tutti i vantaggi inclusi.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">I servizi extra sono inclusi nell'abbonamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I servizi extra come contabilità, business plan e analisi bilanci richiedono 
                  un preventivo dedicato in base alla complessità del lavoro richiesto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Inizia subito</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Scegli la soluzione più adatta alle tue esigenze e inizia a risparmiare tempo e denaro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/area-utenti">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Abbonati Ora
              </Button>
            </Link>
            <Link to="/contatti">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Consulenza
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Servizi;