import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

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
      <main className="pt-20">
        <Pricing />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
