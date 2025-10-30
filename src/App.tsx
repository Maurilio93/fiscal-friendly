// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Index from "./pages/Index";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import ComeFunziona from "./pages/ComeFunziona";
import AreaUtenti from "./pages/AreaUtenti";
import CommercialistiPage from "./pages/Commercialisti";
import LavoraConNoi from "./pages/LavoraConNoi";
import Contatti from "./pages/Contatti";
import ServiceDetail from "./pages/ServiceDetail";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";
import CheckoutFailurePage from "./pages/CheckoutFailurePage";
import Login from "./pages/Login";
import SignupForm from "./components/SignupForm";
import NotFound from "./pages/NotFound";
import PasswordDimenticata from "./pages/PasswordDimenticata";
import ResetPassword from "./pages/ResetPassword";

import { CartProvider } from "./cart/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/* AuthProvider (usa /api/auth/status) prima di tutto; poi CartProvider */}
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
                  <Route
                    path="/area-utenti"
                    element={
                      <ProtectedRoute>
                        <AreaUtenti />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/commercialisti" element={<CommercialistiPage />} />
                  <Route path="/lavora-con-noi" element={<LavoraConNoi />} />
                  <Route path="/contatti" element={<Contatti />} />
                  <Route path="/password-dimenticata" element={<PasswordDimenticata />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/servizi/:id" element={<ServiceDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout/success" element={<ThankYouPage />} />
                  <Route path="/checkout/failure" element={<CheckoutFailurePage />} />
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