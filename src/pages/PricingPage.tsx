import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";

const stats = [
  { value: "30%", label: "Avg Cost Savings vs Agencies" },
  { value: "Flexible", label: "Payment Plans" },
  { value: "100%", label: "Transparent Pricing" },
  { value: "Free", label: "Initial Consultation" },
];

const PricingPage = () => {
  usePageMeta("Pricing", "💰");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="Pricing"
          title="Simple, Transparent"
          highlight="Engagement Models"
          description="No hidden fees, no surprises. Flexible pricing tailored to your project scope and business stage — from startup MVPs to enterprise systems."
          lottieUrl={LOTTIE_URLS.calculator}
        />
        <Pricing />
        <StartupAdvantage />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
