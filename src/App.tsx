import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded routes — reduces initial bundle for 50k+ concurrent users
const Index = lazy(() => import("./pages/Index"));
const MarketPage = lazy(() => import("./pages/MarketPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MeusPedidos = lazy(() => import("./pages/MeusPedidos"));
const Perfil = lazy(() => import("./pages/Perfil"));
const TermosDeUso = lazy(() => import("./pages/TermosDeUso"));
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const EsqueciSenha = lazy(() => import("./pages/EsqueciSenha"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const CompraVoz = lazy(() => import("./pages/CompraVoz"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="mx-auto max-w-6xl px-4 py-12 space-y-4">
    <Skeleton className="h-60 w-full rounded-2xl" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 min — reduces refetch storms at scale
      gcTime: 15 * 60 * 1000,       // 15 min — keep cache longer to reduce DB pressure
      retry: (failureCount, error: any) => {
        if (error?.code === "PGRST116" || error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <CartDrawer />
              <AnalyticsProvider>
              <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mercado/:id" element={<MarketPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/termos" element={<TermosDeUso />} />
                <Route path="/privacidade" element={<TermosDeUso />} />
                <Route path="/compra-voz" element={<CompraVoz />} />

                <Route path="/meus-pedidos" element={<ProtectedRoute><MeusPedidos /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute requiredRole="moderator"><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              </AnalyticsProvider>
              <Footer />
            </BrowserRouter>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
