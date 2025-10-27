// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThankYouPage from "./pages/ThankYouPage";
import Index from "./pages/Index";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import ComeFunziona from "./pages/ComeFunziona";
import AreaUtenti from "./pages/AreaUtenti";
import LavoraConNoi from "./pages/LavoraConNoi";
import Contatti from "./pages/Contatti";
import NotFound from "./pages/NotFound";
import CheckoutFailurePage from "./pages/CheckoutFailurePage";
import { CartProvider } from "./cart/CartContext";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./components/ScrollToTop";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import SignupForm from "./components/SignupForm";
import CommercialistiPage from "./pages/Commercialisti";

// <<< IMPORTA il provider auth se lo usi per mostrare Logout in navbar
import { AuthProvider } from "./auth/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/* Wrappa con Auth + Cart; wrapper con overflow-x-hidden per iOS */}
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col overflow-x-hidden">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chi-siamo" element={<ChiSiamo />} />
                  <Route path="/servizi" element={<Servizi />} />
                  <Route path="/come-funziona" element={<ComeFunziona />} />
                  <Route path="/area-utenti" element={<AreaUtenti />} />
                  <Route path="/commercialisti" element={<CommercialistiPage />} />
                  <Route path="/lavora-con-noi" element={<LavoraConNoi />} />
                  <Route path="/contatti" element={<Contatti />} />
                  <Route path="/checkout/success" element={<ThankYouPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout/failure" element={<CheckoutFailurePage />} />
                  <Route path="/servizi/:id" element={<ServiceDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registrazione" element={<SignupForm />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
