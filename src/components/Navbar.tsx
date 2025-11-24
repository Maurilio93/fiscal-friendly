import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import { logout as apiLogout } from "@/lib/api";
import { useCart } from "@/cart/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, status, refreshAuth } = useAuth();
  const isLoggedIn = status === "user" && !!user;
  const isAdmin = isLoggedIn && user?.role === "admin";

  const { totalQty, clear } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Chi Siamo", href: "/chi-siamo" },
    { name: "Servizi", href: "/servizi" },
    { name: "Come Funziona", href: "/come-funziona" },
    { name: "Blog", href: "/blog" },
    { name: "Contatti", href: "/contatti" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const doLogout = async () => {
    try { await apiLogout(); } catch {}
    clear(); // <-- svuota carrello qui
    await refreshAuth().catch(() => {});
    navigate("/");
  };

  const AreaUtentiBtn = ({ className = "", full = false }: { className?: string; full?: boolean }) => (
    <Link to="/area-utenti" aria-label="Vai alla tua area utenti">
      <Button variant="default" className={`${className} ${full ? "w-full" : ""} bg-gradient-hero hover:opacity-90 transition-smooth`}>
        Area Utenti
      </Button>
    </Link>
  );

  const AdminBtn = ({ className = "", full = false }: { className?: string; full?: boolean }) => (
    <Link to="/admin" aria-label="Vai al pannello Admin">
      <Button variant="outline" className={`${className} ${full ? "w-full" : ""}`}>
        Admin
      </Button>
    </Link>
  );

  return (
    <nav className="bg-card shadow-elegant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="Vai alla Home">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <Phone className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Miniconsulenze</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-primary bg-muted"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA + Carrello (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/cart" className="relative" aria-label="Vai al carrello">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                    {totalQty}
                  </span>
                )}
              </Button>
            </Link>

            {/* Se ADMIN mostra Admin, altrimenti Area Utenti */}
            {isAdmin ? <AdminBtn /> : <AreaUtentiBtn />}

            {/* Logout solo se loggato */}
            {isLoggedIn && (
              <Button
                onClick={doLogout}
                variant="default"
                className="bg-[#FF6B6B] hover:bg-[#e85a5a] transition-smooth"
                aria-label="Esci"
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary focus:outline-none focus:text-primary transition-smooth"
              aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-muted rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-primary bg-card"
                      : "text-muted-foreground hover:text-primary hover:bg-card"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Carrello (Mobile) */}
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block" aria-label="Vai al carrello">
                <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrello</span>
                  {totalQty > 0 && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      {totalQty}
                    </span>
                  )}
                </Button>
              </Link>

              {/* CTA (Mobile): Admin se admin, altrimenti Area Utenti */}
              <div onClick={() => setIsOpen(false)}>
                {isAdmin ? <AdminBtn full className="mt-2" /> : <AreaUtentiBtn full className="mt-2" />}
              </div>

              {/* Logout (Mobile) */}
              {isLoggedIn && (
                <Button
                  onClick={async () => {
                    setIsOpen(false);
                    await doLogout();
                  }}
                  variant="default"
                  className="w-full mt-2 bg-[#FF6B6B] hover:bg-[#e85a5a] transition-smooth"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;