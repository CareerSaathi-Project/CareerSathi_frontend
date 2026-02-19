import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/hooks/use-auth";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Interview from "@/pages/Interview";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto min-h-screen">
        <Component {...rest} />
      </main>
    </>
  );
}

function Router() {
  const { user } = useAuthStore();
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/auth">
          {user ? <Dashboard /> : <AuthPage />}
        </Route>
        
        <Route path="/">
          <PrivateRoute component={Dashboard} />
        </Route>
        
        <Route path="/interview">
          <PrivateRoute component={Interview} />
        </Route>
        
        <Route path="/history">
          <PrivateRoute component={History} />
        </Route>
        
        <Route path="/analytics">
          <PrivateRoute component={Analytics} />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
