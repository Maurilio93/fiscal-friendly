import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const TEL_DISPLAY = "+39 3318341262";
const TEL_LINK = "tel:+393318341262";
const EMAIL = "info@miniconsulenze.it";
const EMAIL_LINK = "mailto:info@miniconsulenze.it";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-secondary p-2 rounded-lg">
                <Phone className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="text-lg font-bold">Miniconsulenze</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Soluzioni rapide e accessibili per cittadini, imprese e professionisti.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Link Rapidi</h3>
            <div className="space-y-2">
              <Link to="/servizi" className="block text-sm hover:text-secondary transition-smooth">
                Servizi
              </Link>
              <Link to="/come-funziona" className="block text-sm hover:text-secondary transition-smooth">
                Come Funziona
              </Link>
              <Link to="/area-utenti" className="block text-sm hover:text-secondary transition-smooth">
                Area Utenti
              </Link>
              <Link to="/contatti" className="block text-sm hover:text-secondary transition-smooth">
                Contatti
              </Link>
            </div>
          </div>

          {/* Services (statici o personalizza) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servizi</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>Fisco e Tributi</p>
              <p>Imprese e Professionisti</p>
              <p>Contratti e Registrazioni</p>
              <p>Consulenze Rapide</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contatti</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-secondary" />
                <a href={TEL_LINK} className="underline underline-offset-4">
                  {TEL_DISPLAY}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-secondary" />
                <a href={EMAIL_LINK} className="underline underline-offset-4">
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-secondary mt-0.5" />
                <span>
                  Via Principe di Villafranca, 43
                  <br />
                  90141 Palermo (PA)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Lun–Ven 9:00–19:00 • Sab 9:00–13:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Miniconsulenze. Tutti i diritti riservati.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-secondary transition-smooth">Privacy</Link>
            <span>•</span>
            <Link to="/termini" className="hover:text-secondary transition-smooth">Termini</Link>
            <span>•</span>
            <Link to="/cookie" className="hover:text-secondary transition-smooth">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
