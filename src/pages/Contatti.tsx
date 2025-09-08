import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  HelpCircle
} from "lucide-react";

const Contatti = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
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
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Telefono</CardTitle>
                <CardDescription>Chiamata diretta</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-primary mb-2">+39 02 1234 5678</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Lun-Ven: 9:00-18:00<br/>
                  Sab: 9:00-13:00
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Chiama Ora
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>Risposta entro 2 ore</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-primary mb-2">info@consulfast.it</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Assistenza generale<br/>
                  e richieste servizi
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Scrivi Email
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Chat Live</CardTitle>
                <CardDescription>Supporto immediato</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-secondary text-secondary-foreground mb-2">Online</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Assistenza in tempo reale<br/>
                  per abbonati premium
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Apri Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Ufficio</CardTitle>
                <CardDescription>Su appuntamento</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-primary mb-2">Milano Centro</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Via Roma 123<br/>
                  20121 Milano, MI
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Prenota Visita
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Richiedi una consulenza</h2>
            <p className="text-xl text-muted-foreground">
              Compila il form per ricevere assistenza personalizzata
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Form di Contatto Rapido</CardTitle>
              <CardDescription>
                Riceverai una risposta entro 2 ore lavorative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input id="firstName" placeholder="Il tuo nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Cognome *</Label>
                  <Input id="lastName" placeholder="Il tuo cognome" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="la-tua-email@esempio.it" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input id="phone" placeholder="+39 331 1234567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo di servizio *</Label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option value="">Seleziona il tipo di servizio</option>
                  <option value="fisco">Fisco e Tributi</option>
                  <option value="imprese">Imprese e Professionisti</option>
                  <option value="contratti">Contratti e Registrazioni</option>
                  <option value="consulenza">Consulenza Telefonica</option>
                  <option value="abbonamento">Informazioni Abbonamento</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgenza</Label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option value="normale">Normale (2-3 giorni)</option>
                  <option value="urgente">Urgente (24 ore)</option>
                  <option value="immediata">Immediata (entro giornata)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Descrizione della richiesta *</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descrivi brevemente di cosa hai bisogno. Più dettagli fornisci, più precisa sarà la nostra risposta..."
                  rows={4}
                />
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-secondary">Garanzia di risposta</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Risposta entro 2 ore per richieste urgenti</li>
                      <li>• Prima consulenza telefonica gratuita di 15 minuti</li>
                      <li>• Preventivo gratuito per tutti i servizi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="privacy" className="rounded border-border" />
                <label htmlFor="privacy" className="text-sm text-muted-foreground">
                  Accetto il trattamento dei dati personali secondo la 
                  <a href="#" className="text-primary hover:underline"> Privacy Policy</a>
                </label>
              </div>

              <Button className="w-full bg-gradient-hero hover:opacity-90 text-lg py-4">
                <Send className="mr-2 h-5 w-5" />
                Invia Richiesta
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Domande Frequenti</h2>
            <p className="text-xl text-muted-foreground">
              Le risposte alle domande più comuni
            </p>
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
                  L'<strong>abbonamento prepagato</strong> (€100+IVA/anno) include 4 servizi + consulenze telefoniche illimitate. 
                  È ideale per chi ha bisogno di più servizi durante l'anno.
                </p>
                <p className="text-muted-foreground">
                  I <strong>servizi a consumo</strong> (€40+IVA/servizio) sono perfetti per esigenze occasionali, 
                  senza vincoli di durata.
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
                  Per le urgenze, offriamo consulenze telefoniche immediate. 
                  I documenti complessi vengono consegnati entro 24-48 ore.
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
                  Assolutamente sì! Puoi passare all'abbonamento in qualsiasi momento. 
                  Il costo dei servizi già utilizzati verrà scalato dal prezzo dell'abbonamento.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Fate anche consulenze di persona?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sì, su appuntamento presso il nostro ufficio di Milano. 
                  Tuttavia, la maggior parte delle pratiche può essere gestita completamente online, 
                  risparmiando tempo e costi di spostamento.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Cosa succede se non sono soddisfatto del servizio?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Offriamo una <strong>garanzia di soddisfazione</strong>. Se non sei completamente soddisfatto 
                  del servizio ricevuto, ti rimborsiamo integralmente o rifacciamo gratuitamente il lavoro.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Gestite anche pratiche per altre regioni italiane?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sì, gestiamo pratiche per tutta Italia. Molti adempimenti fiscali e burocratici 
                  possono essere gestiti da remoto indipendentemente dalla regione di residenza.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Info */}
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
                      Via Roma 123<br/>
                      20121 Milano, MI<br/>
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
                      +39 02 1234 5678<br/>
                      <span className="text-sm">(Lun-Ven 9:00-18:00, Sab 9:00-13:00)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      info@consulfast.it<br/>
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
                      <p>Lunedì - Venerdì: 9:00 - 18:00</p>
                      <p>Sabato: 9:00 - 13:00</p>
                      <p>Domenica: Chiuso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Dove Siamo</h2>
              <div className="bg-card rounded-lg shadow-elegant h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Mappa Interattiva</p>
                  <p className="text-sm">Via Roma 123, Milano</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Mezzi pubblici:</strong> Metro M3 Duomo (5 min a piedi)</p>
                <p><strong>Parcheggio:</strong> Garage convenzionato nelle vicinanze</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Non aspettare oltre</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Inizia subito a semplificare la tua vita burocratica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Phone className="mr-2 h-5 w-5" />
              Chiama Ora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Scopri i Servizi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contatti;