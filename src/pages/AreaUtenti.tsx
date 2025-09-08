import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  User, 
  Lock, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Upload, 
  Phone,
  Mail,
  ArrowRight,
  Eye,
  Download
} from "lucide-react";

const AreaUtenti = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LoginForm = () => (
    <Card className="shadow-elegant max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Accedi alla tua Area</CardTitle>
        <CardDescription>
          Inserisci le tue credenziali per accedere ai servizi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="la-tua-email@esempio.it" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button 
          className="w-full bg-gradient-hero hover:opacity-90"
          onClick={() => setIsLoggedIn(true)}
        >
          <User className="mr-2 h-4 w-4" />
          Accedi
        </Button>
        <div className="text-center">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            Password dimenticata?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">oppure</span>
          </div>
        </div>
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Non hai ancora un account?</p>
          <Link to="/servizi">
            <Button variant="outline" className="w-full">
              Scopri i Nostri Servizi
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const UserDashboard = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero text-primary-foreground p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Benvenuto, Mario!</h2>
            <p className="text-primary-foreground/90">Abbonamento attivo fino al 15/12/2024</p>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            Abbonato Premium
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="services">Servizi</TabsTrigger>
          <TabsTrigger value="history">Storico</TabsTrigger>
          <TabsTrigger value="profile">Profilo</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Service Counter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Servizi Rimanenti</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">2/4</div>
                <p className="text-xs text-muted-foreground">
                  Servizi utilizzati quest'anno
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Richieste Attive</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">1</div>
                <p className="text-xs text-muted-foreground">
                  In elaborazione
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consulenze</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">∞</div>
                <p className="text-xs text-muted-foreground">
                  Illimitate per abbonati
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Richieste Recenti</CardTitle>
              <CardDescription>Le tue ultime pratiche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent p-2 rounded-full">
                      <FileText className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Dichiarazione dei Redditi 2024</p>
                      <p className="text-sm text-muted-foreground">Richiesta il 05/11/2024</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    In elaborazione
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary p-2 rounded-full">
                      <FileText className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Contratto di Locazione</p>
                      <p className="text-sm text-muted-foreground">Completata il 28/10/2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completata
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Richiedi un Nuovo Servizio</CardTitle>
              <CardDescription>
                Hai ancora 2 servizi disponibili nel tuo abbonamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span>Fisco e Tributi</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="h-6 w-6 text-secondary" />
                  <span>Imprese</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6 text-accent" />
                  <span>Contratti</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Phone className="h-6 w-6 text-primary" />
                  <span>Consulenza</span>
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Carica Documenti</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Trascina qui i tuoi file o clicca per selezionarli
                </p>
                <Button variant="outline" size="sm">
                  Seleziona File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Archivio Richieste</CardTitle>
              <CardDescription>Tutte le tue pratiche passate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Contratto di Locazione",
                    date: "28/10/2024",
                    status: "Completata",
                    type: "Contratti"
                  },
                  {
                    title: "Apertura Partita IVA",
                    date: "15/09/2024", 
                    status: "Completata",
                    type: "Imprese"
                  },
                  {
                    title: "Consulenza Fiscale Telefonica",
                    date: "03/09/2024",
                    status: "Completata", 
                    type: "Consulenza"
                  },
                  {
                    title: "Istanza di Sgravio TARI",
                    date: "20/08/2024",
                    status: "Completata",
                    type: "Fisco"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary p-2 rounded-full">
                        <FileText className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type} • {item.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-primary text-primary-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {item.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Visualizza
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Informazioni Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input defaultValue="Mario Rossi" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue="mario.rossi@email.it" />
                </div>
                <div>
                  <Label>Telefono</Label>
                  <Input defaultValue="+39 331 1234567" />
                </div>
                <Button className="bg-gradient-hero hover:opacity-90">
                  Aggiorna Profilo
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Abbonamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Piano Attuale</span>
                    <Badge className="bg-secondary text-secondary-foreground">Premium</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Abbonamento annuale con 4 servizi inclusi
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Servizi utilizzati</span>
                    <span>2/4</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-1/2"></div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Scadenza: 15 Dicembre 2024</p>
                  <p>Rinnovo automatico: Disattivato</p>
                </div>

                <Button variant="outline" className="w-full">
                  Gestisci Abbonamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Area Utenti</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            {isLoggedIn ? "Gestisci i tuoi servizi e richieste" : "Accedi per gestire i tuoi servizi"}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        {isLoggedIn ? <UserDashboard /> : <LoginForm />}
      </section>

      {/* Features for Non-Logged Users */}
      {!isLoggedIn && (
        <section className="py-20 bg-muted px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Vantaggi dell'Area Utenti</h2>
              <p className="text-xl text-muted-foreground">
                Tutto quello che puoi fare con il tuo account
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
                <CardHeader>
                  <div className="bg-secondary p-4 rounded-full w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Gestione Richieste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Invia nuove richieste, monitora lo stato e scarica i documenti pronti
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
                <CardHeader>
                  <div className="bg-accent p-4 rounded-full w-fit mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-lg">Contatore Servizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tieni traccia dei servizi utilizzati e di quelli ancora disponibili
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-glow transition-smooth text-center">
                <CardHeader>
                  <div className="bg-primary p-4 rounded-full w-fit mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Archivio Storico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Accedi a tutte le tue pratiche passate e ai documenti archiviati
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">Pronto per iniziare?</h3>
              <p className="text-muted-foreground mb-6">
                Scegli il piano più adatto alle tue esigenze
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/servizi">
                  <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                    Vedi i Piani
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contatti">
                  <Button size="lg" variant="outline">
                    <Phone className="mr-2 h-5 w-5" />
                    Contattaci
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AreaUtenti;