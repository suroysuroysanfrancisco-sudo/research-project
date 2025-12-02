import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Destinations from "./pages/Destinations";
import DestinationSingle from "./pages/DestinationSingle";
import VirtualTours from "./pages/VirtualTours";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// ADMIN PAGES
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/AdminDestinations";
import NewDestination from "./pages/admin/NewDestination";
import EditDestination from "./pages/admin/EditDestination";

// AUTH WRAPPER
import RequireAdmin from "@/components/RequireAdmin";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* ============================
                PUBLIC ROUTES
            ============================ */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationSingle />} />
            <Route path="/virtual-tours" element={<VirtualTours />} />
            <Route path="/contact" element={<Contact />} />

            {/* ============================
                AUTH (UNPROTECTED)
            ============================ */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ============================
                ADMIN (PROTECTED ROUTES)
            ============================ */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/destinations"
              element={
                <RequireAdmin>
                  <AdminDestinations />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/destinations/new"
              element={
                <RequireAdmin>
                  <NewDestination />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/destinations/edit/:id"
              element={
                <RequireAdmin>
                  <EditDestination />
                </RequireAdmin>
              }
            />

            {/* ============================
                404 CATCH-ALL
            ============================ */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
