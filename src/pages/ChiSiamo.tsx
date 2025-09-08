import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Target, Award, Heart, Phone, ArrowRight } from "lucide-react";

const ChiSiamo = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Chi Siamo</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Il tuo partner di fiducia per soluzioni fiscali, legali e professionali
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">La nostra missione</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Supportiamo chi deve affrontare problemi fiscali, legali, lavorativi o finanziari
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Crediamo che nessuno dovrebbe sprecare tempo prezioso e denaro per navigare nella complessità burocratica. 
              La nostra missione è semplice: <strong>zero burocrazia per te, ci pensiamo noi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="bg-secondary p-3 rounded-full w-fit mb-4">
                  <Target className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Il nostro obiettivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rendere accessibili servizi professionali di qualità, eliminando le complessità burocratiche 
                  e offrendo soluzioni rapide a costi trasparenti per cittadini, imprese e professionisti.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="bg-accent p-3 rounded-full w-fit mb-4">
                  <Heart className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">I nostri valori</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trasparenza, rapidità e professionalità sono i pilastri del nostro lavoro. 
                  Crediamo in un servizio che metta al centro le persone e le loro esigenze concrete.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Perché scegliere ConsulFast</h2>
            <p className="text-xl text-muted-foreground">
              Anni di esperienza al servizio di migliaia di clienti soddisfatti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary p-6 rounded-full w-fit mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Team Esperto</h3>
              <p className="text-muted-foreground">
                Professionisti qualificati con anni di esperienza in ambito fiscale, 
                legale e consulenziale pronti ad assisterti.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary p-6 rounded-full w-fit mx-auto mb-6">
                <Award className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Qualità Garantita</h3>
              <p className="text-muted-foreground">
                Standard elevati di qualità e precisione in ogni servizio, 
                con un approccio personalizzato per ogni cliente.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent p-6 rounded-full w-fit mx-auto mb-6">
                <Phone className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sempre Disponibili</h3>
              <p className="text-muted-foreground">
                Supporto rapido e consulenze immediate quando ne hai bisogno, 
                con risposte in tempi record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Il nostro approccio</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Non siamo solo consulenti, siamo i tuoi partner nella risoluzione di problemi complessi. 
            Trasformiamo la burocrazia in soluzioni semplici, permettendoti di concentrarti su quello che conta davvero: 
            la tua vita, la tua famiglia, la tua attività.
          </p>
          
          <Card className="shadow-elegant bg-gradient-card text-left">
            <CardContent className="p-8">
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "Finalmente un servizio veloce e chiaro. Non ho più il problema di capire la burocrazia, 
                loro si occupano di tutto e io ricevo solo la soluzione."
              </blockquote>
              <cite className="text-sm font-medium">— Maria R., Cliente dal 2023</cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Inizia oggi stesso</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Scopri come possiamo semplificare la tua vita e risolvere i tuoi problemi burocratici
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contatti">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Contattaci Ora
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
    </div>
  );
};

export default ChiSiamo;