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
const CareersPage = lazy(() => import("./pages/CareersPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ServerError = lazy(() => import("./pages/ServerError"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
import CookieBanner from "./components/CookieBanner";

// Internal Workforce & Lead Management Portal (Phases 1-6)
const PortalLayout = lazy(() => import("./portal/PortalLayout"));
const DashboardPage = lazy(() => import("./portal/pages/DashboardPage"));
const ProjectsPage = lazy(() => import("./portal/pages/ProjectsPage"));
const TasksPage = lazy(() => import("./portal/pages/TasksPage"));
const TelecallerPage = lazy(() => import("./portal/pages/TelecallerPage"));
const FinancePage = lazy(() => import("./portal/pages/FinancePage"));
const DocumentsPage = lazy(() => import("./portal/pages/DocumentsPage"));
const AuditPage = lazy(() => import("./portal/pages/AuditPage"));
const TeamPage = lazy(() => import("./portal/pages/TeamPage"));
const LoginPage = lazy(() => import("./portal/pages/LoginPage"));
const PortalRoot = lazy(() => import("./portal/PortalRoot"));
const ClientsPage = lazy(() => import("./portal/pages/ClientsPage"));
const ReviewQueuePage = lazy(() => import("./portal/pages/ReviewQueuePage"));
const ReportsPage = lazy(() => import("./portal/pages/ReportsPage"));
const SuppressionsPage = lazy(() => import("./portal/pages/SuppressionsPage"));
const PipelineKanbanPage = lazy(() => import("./portal/pages/PipelineKanbanPage"));
const ScriptsAdminPage = lazy(() => import("./portal/pages/ScriptsAdminPage"));
const IntegrationsPage = lazy(() => import("./portal/pages/IntegrationsPage"));
const ProjectBriefsPage = lazy(() => import("./portal/pages/ProjectBriefsPage"));
const StandupsPage = lazy(() => import("./portal/pages/StandupsPage"));
const CandidateAgreementSignPage = lazy(() => import("./portal/pages/CandidateAgreementSignPage"));

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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/maintenance" element={<Maintenance />} />
            
            {/* Internal Workforce Portal (Login & Protected Shell sharing single PortalProvider) */}
            <Route element={<PortalRoot />}>
              <Route path="/agreement" element={<CandidateAgreementSignPage />} />
              <Route path="/portal/agreement" element={<CandidateAgreementSignPage />} />
              <Route path="/portal/login" element={<LoginPage />} />
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="telecaller" element={<TelecallerPage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="audit" element={<AuditPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="review-queue" element={<ReviewQueuePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="suppressions" element={<SuppressionsPage />} />
                <Route path="pipeline" element={<PipelineKanbanPage />} />
                <Route path="scripts" element={<ScriptsAdminPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="briefs" element={<ProjectBriefsPage />} />
                <Route path="standups" element={<StandupsPage />} />
              </Route>
            </Route>

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
