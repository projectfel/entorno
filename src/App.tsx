import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import MarketPage from "./pages/MarketPage";
import Dashboard from "./pages/Dashboard";
import TermosDeUso from "./pages/TermosDeUso";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mercado/:id" element={<MarketPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/termos" element={<TermosDeUso />} />
            <Route path="/privacidade" element={<TermosDeUso />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
