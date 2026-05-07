import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { queryClient } from "./lib/queryClient";

import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Interview from "@/pages/Interview";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";

// ====================
// Private Route Wrapper
// ====================
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, isHydrated } = useAuthStore();
  const location = useLocation();

  if (!isHydrated) {
    return <div className="text-center pt-20">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
    </>
  );
}

// ====================
// Animated Routes Wrapper (FIX)
// ====================
function AnimatedRoutes() {
  const location = useLocation();
  const { user, isHydrated } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route
          path="/auth"
          element={
            isHydrated && user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage />
            )
          }
        />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <Interview />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics/:id"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

// ====================
// App Component
// ====================
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
          <Router>
            <AnimatedRoutes /> {/* ✅ FIXED */}
          </Router>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;