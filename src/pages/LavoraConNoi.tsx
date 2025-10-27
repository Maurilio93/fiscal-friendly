import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Heart, 
  Upload, 
  Send,
  Calculator,
  FileText,
  Building,
  Phone,
  MapPin,
  Mail,
  Clock
} from "lucide-react";

const LavoraConNoi = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Lavora con Noi</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
            Entra a far parte del nostro team di professionisti
          </p>
          <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
            Stiamo crescendo!
          </Badge>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Perché lavorare con ConsulFast</h2>
            <p className="text-xl text-muted-foreground">
              Un ambiente dinamico dove crescere professionalmente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Crescita Professionale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Opportunità di sviluppo continuo in un mercato in espansione
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Team Affiatato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lavora in un ambiente collaborativo con professionisti esperti
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">Flessibilità</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Smart working e orari flessibili per un equilibrio vita-lavoro
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
              <CardHeader>
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Missione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contribuisci a semplificare la vita delle persone e delle imprese
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Posizioni Aperte</h2>
            <p className="text-xl text-muted-foreground">
              Cerca l'opportunità che fa per te
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Commercialista */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary p-3 rounded-full">
                      <Calculator className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Commercialista</CardTitle>
                      <CardDescription>Full-time • Milano/Remote</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">Urgente</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requisiti:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Laurea in Economia o equipollente</li>
                    <li>• Iscrizione all'Albo dei Dottori Commercialisti</li>
                    <li>• Esperienza min. 3 anni in studi professionali</li>
                    <li>• Competenza fiscale e tributaria</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa offriamo:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Contratto a tempo indeterminato</li>
                    <li>• Smart working 3 giorni/settimana</li>
                    <li>• Formazione continua</li>
                    <li>• Crescita professionale</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Praticante Avvocato */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary p-3 rounded-full">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Praticante Avvocato</CardTitle>
                      <CardDescription>Stage/Tirocinio • Milano</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Nuovo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requisiti:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Laurea magistrale in Giurisprudenza</li>
                    <li>• Interesse per diritto civile e commerciale</li>
                    <li>• Ottime capacità di scrittura</li>
                    <li>• Proattività e voglia di imparare</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa offriamo:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Percorso formativo strutturato</li>
                    <li>• Mentorship diretta</li>
                    <li>• Possibilità di assunzione</li>
                    <li>• Rimborso spese</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Consulente Aziendale */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-accent p-3 rounded-full">
                    <Building className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Consulente Aziendale</CardTitle>
                    <CardDescription>Full-time • Remote</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requisiti:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Esperienza in consulenza d'impresa</li>
                    <li>• Conoscenza normative societarie</li>
                    <li>• Capacità relazionali eccellenti</li>
                    <li>• Orientamento al risultato</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa offriamo:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lavoro completamente da remoto</li>
                    <li>• Bonus su obiettivi</li>
                    <li>• Formazione specialistica</li>
                    <li>• Crescita professionale rapida</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Customer Success */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-secondary p-3 rounded-full">
                    <Phone className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Customer Success</CardTitle>
                    <CardDescription>Part-time • Milano/Remote</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requisiti:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Esperienza nel customer care</li>
                    <li>• Ottima comunicazione telefonica</li>
                    <li>• Conoscenze base fiscali/legali</li>
                    <li>• Empatia e problem solving</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cosa offriamo:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Orario flessibile part-time</li>
                    <li>• Training specializzato</li>
                    <li>• Ambiente giovane e dinamico</li>
                    <li>• Possibilità di crescita interna</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Invia la tua candidatura</h2>
            <p className="text-xl text-muted-foreground">
              Compila il form e allega il tuo CV
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Modulo di Candidatura</CardTitle>
              <CardDescription>
                Tutti i campi sono obbligatori. Riceverai una risposta entro 48 ore.
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
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input id="phone" placeholder="+39 331 1234567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posizione di interesse *</Label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option value="">Seleziona una posizione</option>
                  <option value="commercialista">Commercialista</option>
                  <option value="praticante">Praticante Avvocato</option>
                  <option value="consulente">Consulente Aziendale</option>
                  <option value="customer">Customer Success</option>
                  <option value="altro">Altro (specifica nel messaggio)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Anni di esperienza</Label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option value="">Seleziona</option>
                  <option value="0-1">0-1 anni</option>
                  <option value="2-5">2-5 anni</option>
                  <option value="6-10">6-10 anni</option>
                  <option value="10+">Oltre 10 anni</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Messaggio di presentazione *</Label>
                <Textarea 
                  id="message" 
                  placeholder="Raccontaci brevemente di te, delle tue competenze e perché vorresti lavorare con noi..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Curriculum Vitae *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Trascina qui il tuo CV o clicca per selezionarlo
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Formati accettati: PDF, DOC, DOCX (max 5MB)
                  </p>
                  <Button variant="outline">
                    Seleziona File
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Privacy:</strong> I dati forniti saranno utilizzati esclusivamente per la valutazione della candidatura 
                  e verranno trattati nel rispetto del GDPR. Non verranno condivisi con terze parti.
                </p>
              </div>

              <Button className="w-full bg-gradient-hero hover:opacity-90 text-lg py-4">
                <Send className="mr-2 h-5 w-5" />
                Invia Candidatura
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-muted px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">La nostra cultura aziendale</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-elegant text-center gradient-card">
              <CardContent className="p-8">
                <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-6">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Collaborazione</h3>
                <p className="text-muted-foreground">
                  Lavoriamo insieme per raggiungere obiettivi comuni, 
                  condividendo conoscenze ed esperienze.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant text-center gradient-card">
              <CardContent className="p-8">
                <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Innovazione</h3>
                <p className="text-muted-foreground">
                  Cerchiamo sempre nuovi modi per migliorare i nostri servizi 
                  e semplificare la vita dei clienti.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant text-center gradient-card">
              <CardContent className="p-8">
                <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Passione</h3>
                <p className="text-muted-foreground">
                  Facciamo quello che facciamo con passione e dedizione, 
                  perché crediamo nel valore del nostro lavoro.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hai domande?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contattaci per maggiori informazioni sulle posizioni aperte
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>hr@consulfast.it</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>+39 02 1234 5678</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>Lun-Ven 9:00-18:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LavoraConNoi;