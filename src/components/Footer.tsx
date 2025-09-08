import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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
              <span className="text-lg font-bold">ConsulFast</span>
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
              <Link to="/lavora-con-noi" className="block text-sm hover:text-secondary transition-smooth">
                Lavora con Noi
              </Link>
            </div>
          </div>

          {/* Services */}
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
                <span>+39 02 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-secondary" />
                <span>info@consulfast.it</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-secondary mt-0.5" />
                <span>Via Roma 123<br />20121 Milano, MI</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Lun-Ven 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 ConsulFast. Tutti i diritti riservati. | P.IVA 12345678901
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;