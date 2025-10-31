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

// Pagine pubbliche
import Index from "./pages/Index";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import ComeFunziona from "./pages/ComeFunziona";
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

// AREA UTENTI
import UserLayout from "./pages/components/UserLayout";
import AreaUtentiHome from "./pages/AreaUtenti/index";
import AreaUtentiOrdini from "./pages/AreaUtenti/Ordini";
import AreaUtentiDocumenti from "./pages/AreaUtenti/Documenti";

// ADMIN
import AdminLayout from "./pages/components/AdminLayout";
import AdminHome from "./pages/Admin/index";
import AdminOrdini from "./pages/Admin/Ordini";
import AdminUtenti from "./pages/Admin/Utenti";
import AdminLog from "./pages/Admin/Log";

import { CartProvider } from "./cart/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col overflow-x-hidden">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Pubbliche */}
                  <Route path="/" element={<Index />} />
                  <Route path="/chi-siamo" element={<ChiSiamo />} />
                  <Route path="/servizi" element={<Servizi />} />
                  <Route path="/servizi/:id" element={<ServiceDetail />} />
                  <Route path="/come-funziona" element={<ComeFunziona />} />
                  <Route path="/commercialisti" element={<CommercialistiPage />} />
                  <Route path="/lavora-con-noi" element={<LavoraConNoi />} />
                  <Route path="/contatti" element={<Contatti />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout/success" element={<ThankYouPage />} />
                  <Route path="/checkout/failure" element={<CheckoutFailurePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registrazione" element={<SignupForm />} />
                  <Route path="/password-dimenticata" element={<PasswordDimenticata />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* AREA UTENTI protetta */}
                  <Route
                    path="/area-utenti"
                    element={
                      <ProtectedRoute>
                        <UserLayout/>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AreaUtentiHome />} />
                    <Route path="ordini" element={<AreaUtentiOrdini />} />
                    <Route path="documenti" element={<AreaUtentiDocumenti />} />
                  </Route>

                  {/* ADMIN protetto */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute admin>
                        <AdminLayout/>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminHome />} />
                    <Route path="ordini" element={<AdminOrdini />} />
                    <Route path="utenti" element={<AdminUtenti />} />
                    <Route path="log" element={<AdminLog />} />
                  </Route>

                  {/* 404 */}
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