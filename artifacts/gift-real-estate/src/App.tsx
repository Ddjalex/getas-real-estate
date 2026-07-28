import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Public pages
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ListingForm from "@/pages/admin/ListingForm";
import BlogForm from "@/pages/admin/BlogForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { createLenis } from "@/lib/lenis";

const queryClient = new QueryClient();

function AppRoutes() {
  const [location, navigate] = useLocation();
  const isAdmin = location.startsWith("/staff-portal") || location.startsWith("/admin");

  // Redirect /admin* → /staff-portal*
  useEffect(() => {
    if (location.startsWith("/admin")) {
      navigate(location.replace("/admin", "/staff-portal"), { replace: true });
    }
  }, [location, navigate]);

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/staff-portal" component={AdminLogin} />
        <Route path="/staff-portal/dashboard">
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        </Route>
        <Route path="/staff-portal/listings/new">
          <ProtectedRoute><ListingForm /></ProtectedRoute>
        </Route>
        <Route path="/staff-portal/listings/:id/edit">
          <ProtectedRoute><ListingForm /></ProtectedRoute>
        </Route>
        <Route path="/staff-portal/blog/new">
          <ProtectedRoute><BlogForm /></ProtectedRoute>
        </Route>
        <Route path="/staff-portal/blog/:id/edit">
          <ProtectedRoute><BlogForm /></ProtectedRoute>
        </Route>
      </Switch>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/properties" component={Properties} />
          <Route path="/properties/:id" component={PropertyDetail} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    return createLenis();
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={base}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
