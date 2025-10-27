import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCheck, Send, CheckCircle, Phone, ArrowRight, Upload, Clock, MessageSquare } from "lucide-react";

const ComeFunziona = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Come Funziona</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Semplice, veloce e senza complicazioni
          </p>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">Processo step-by-step</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tre semplici passi per risolvere i tuoi problemi
            </h2>
            <p className="text-xl text-muted-foreground">
              Zero burocrazia per te, ci pensiamo noi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-secondary p-8 rounded-full w-fit mx-auto shadow-glow">
                  <UserCheck className="h-12 w-12 text-secondary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Registrati</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Se sei abbonato, accedi alla tua area personale.<br/>
                Se preferisci i servizi occasionali, scegli direttamente quello che ti serve.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/area-utenti">
                  <Button variant="outline" size="sm">Area Abbonati</Button>
                </Link>
                <Link to="/servizi">
                  <Button variant="outline" size="sm">Servizi Occasionali</Button>
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-accent p-8 rounded-full w-fit mx-auto shadow-glow">
                  <Send className="h-12 w-12 text-accent-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Invia Richiesta</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Compila il form con i dettagli della tua richiesta.<br/>
                Allega eventuali documenti PDF se necessario.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <span>Supporto per file PDF, DOC, IMG</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-primary p-8 rounded-full w-fit mx-auto shadow-glow">
                  <CheckCircle className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ricevi la Soluzione</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Ricevi la consulenza o il documento pronto direttamente nella tua area personale o via email.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempi di risposta: 24-48 ore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cosa rende speciale il nostro servizio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center gradient-card">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Tempi Rapidi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Risposte in 24-48 ore per la maggior parte delle richieste
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center gradient-card">
              <CardHeader>
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Supporto Continuo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Consulenze telefoniche e via email per chiarimenti
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center gradient-card">
              <CardHeader>
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Upload Semplice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Carica i tuoi documenti in modo sicuro e veloce
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center gradient-card">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Qualità Garantita</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Professionisti esperti per risultati di qualità
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription vs Occasional */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Abbonamento vs Occasionale</h2>
            <p className="text-xl text-muted-foreground">Scopri quale soluzione fa per te</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Abbonamento */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth border-secondary border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Abbonamento Prepagato</CardTitle>
                <div className="text-3xl font-bold text-primary">€100 + IVA</div>
                <p className="text-muted-foreground">4 servizi inclusi + consulenze illimitate</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Ideale per:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Professionisti e piccole imprese</li>
                    <li>• Chi ha esigenze ricorrenti</li>
                    <li>• Chi vuole risparmiare sui costi</li>
                  </ul>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-secondary">Vantaggi:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Risparmio di €60 all'anno</li>
                    <li>• Consulenze telefoniche illimitate</li>
                    <li>• Area utenti dedicata</li>
                    <li>• Priorità nelle richieste</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Occasionale */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Servizio a Consumo</CardTitle>
                <div className="text-3xl font-bold text-primary">€40 + IVA</div>
                <p className="text-muted-foreground">Per singolo servizio</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Ideale per:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Esigenze occasionali</li>
                    <li>• Chi preferisce non vincolarsi</li>
                    <li>• Prima prova del servizio</li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-accent">Caratteristiche:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nessun vincolo di durata</li>
                    <li>• Paghi solo quello che usi</li>
                    <li>• Stessa qualità di servizio</li>
                    <li>• Puoi sempre passare all'abbonamento</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Domande Frequenti</h2>
          </div>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Quanto tempo serve per avere una risposta?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Per la maggior parte delle richieste, forniamo una risposta entro 24-48 ore lavorative.
                  Per le urgenze, offriamo consulenze telefoniche immediate per gli abbonati.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Posso caricare documenti in formato diverso dal PDF?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sì, accettiamo PDF, DOC, DOCX, JPG, PNG e altri formati comuni.
                  Se hai dubbi su un formato specifico, contattaci prima di inviare la richiesta.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">L'abbonamento si rinnova automaticamente?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No, l'abbonamento non si rinnova automaticamente. Ti contatteremo prima della scadenza
                  per sapere se desideri rinnovare il servizio.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Cosa succede se ho bisogno di più di 4 servizi all'anno?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Puoi richiedere servizi aggiuntivi pagando la tariffa occasionale di €40+IVA per ogni servizio extra,
                  oppure valutare un abbonamento con più servizi inclusi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Inizia oggi stesso</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Scegli la soluzione più adatta a te e dimentica la burocrazia per sempre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/area-utenti">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Inizia con l'Abbonamento
              </Button>
            </Link>
            <Link to="/contatti">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="mr-2 h-5 w-5" />
                Richiedi un Servizio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComeFunziona;
