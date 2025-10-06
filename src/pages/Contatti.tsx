import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageSquare, HelpCircle, ArrowRight } from "lucide-react";

const TEL_DISPLAY = "+39 3318341262";
const TEL_LINK = "tel:+393318341262";
const EMAIL = "info@miniconsulenze.it";
const EMAIL_LINK = "mailto:info@miniconsulenze.it";

const Contatti = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0D3B66] text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contatti</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Siamo qui per aiutarti. Contattaci quando vuoi!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">Sempre disponibili</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Come puoi contattarci</h2>
            <p className="text-xl text-muted-foreground">
              Scegli il canale che preferisci per ricevere assistenza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Telefono */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Telefono</CardTitle>
                <CardDescription>Chiamata diretta</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={TEL_LINK} className="font-semibold text-primary mb-2 block underline underline-offset-4">
                  {TEL_DISPLAY}
                </a>
                <p className="text-sm text-muted-foreground mb-4">
                  Lun–Ven: 9:00–19:00<br />
                  Sab: 9:00–13:00
                </p>
                <a href={TEL_LINK}>
                  <Button variant="outline" size="sm" className="w-full">Chiama Ora</Button>
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">E-mail</CardTitle>
                <CardDescription>Risposta entro 2 ore</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={EMAIL_LINK} className="font-semibold text-primary mb-2 block underline underline-offset-4">
                  {EMAIL}
                </a>
                <p className="text-sm text-muted-foreground mb-4">
                  Assistenza generale<br />e richieste servizi
                </p>
                <a href={EMAIL_LINK}>
                  <Button variant="outline" size="sm" className="w-full">Scrivi Email</Button>
                </a>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Chatta in diretta</CardTitle>
                <CardDescription>Supporto immediato</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-secondary text-secondary-foreground mb-2">Online</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Assistenza in tempo reale<br />per abbonati premium
                </p>
                <Link to="/area-utenti">
                  <Button variant="outline" size="sm" className="w-full">Apri Chat</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ufficio */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Ufficio</CardTitle>
                <CardDescription>Su appuntamento</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-primary mb-2">Palermo Centro</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Via Principe di Villafranca, 43<br />
                  90141 Palermo (PA)
                </p>
                <Link to="/contatti#prenota">
                  <Button variant="outline" size="sm" className="w-full">Prenota Visita</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Domande Frequenti</h2>
            <p className="text-xl text-muted-foreground">Le risposte alle domande più comuni</p>
          </div>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Qual è la differenza tra abbonamento prepagato e a consumo?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  L'<strong>abbonamento prepagato</strong> include 4 servizi + consulenze telefoniche illimitate.
                  È ideale per chi ha bisogno di più servizi durante l'anno.
                </p>
                <p className="text-muted-foreground">
                  I <strong>servizi a consumo</strong> sono perfetti per esigenze occasionali, senza vincoli.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Quanto tempo serve per ricevere una risposta?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rispondiamo a tutte le richieste entro <strong>2 ore lavorative</strong>.
                  I documenti complessi vengono consegnati in 24–48 ore.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Posso passare da occasionale ad abbonamento?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sì, puoi passare all'abbonamento in qualsiasi momento.
                  Il costo dei servizi già utilizzati verrà scalato dal prezzo dell'abbonamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info ufficio */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Informazioni di Contatto</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Indirizzo</h3>
                    <p className="text-muted-foreground">
                      Via Principe di Villafranca, 43<br />
                      90141 Palermo (PA)<br />
                      Italia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent p-3 rounded-full">
                    <Phone className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Telefono</h3>
                    <p className="text-muted-foreground">
                      <a href={TEL_LINK} className="underline underline-offset-4">{TEL_DISPLAY}</a><br />
                      <span className="text-sm">(Lun–Ven 9:00–19:00, Sab 9:00–13:00)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">E-mail</h3>
                    <p className="text-muted-foreground">
                      <a href={EMAIL_LINK} className="underline underline-offset-4">{EMAIL}</a><br />
                      <span className="text-sm">(Risposta entro 2 ore)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <Clock className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Orari di Apertura</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lunedì–Venerdì: 9:00–19:00</p>
                      <p>Sabato: 9:00–13:00</p>
                      <p>Domenica: Chiuso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mappa placeholder */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Dove Siamo</h2>
              <div className="bg-card rounded-lg shadow-elegant h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Mappa Interattiva</p>
                  <p className="text-sm">Palermo, Via Principe di Villafranca, 43</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Parcheggio:</strong> Nelle vicinanze</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Non aspettare oltre</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Inizia subito a semplificare la tua vita burocratica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={TEL_LINK}>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                Chiama Ora
              </Button>
            </a>
            <Link to="/servizi">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
              >
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

export default Contatti;
