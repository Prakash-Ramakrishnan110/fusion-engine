import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Breadcrumbs from "./components/Breadcrumbs";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import ChatWidget from "./components/ChatWidget";
import OnboardingModal from "./components/OnboardingModal";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ProcessPage = lazy(() => import("./pages/ProcessPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const IndustriesPage = lazy(() => import("./pages/IndustriesPage"));
const WhyUsPage = lazy(() => import("./pages/WhyUsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ServerError = lazy(() => import("./pages/ServerError"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
import CookieBanner from "./components/CookieBanner";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToasterSonner />
      <BrowserRouter>
        <ScrollToTop />
        <Breadcrumbs />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ChatWidget />
        <OnboardingModal />
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
