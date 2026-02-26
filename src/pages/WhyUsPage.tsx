import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import WhyUsMetrics from "@/components/animations/WhyUsMetrics";
import WhyFusion from "@/components/WhyFusion";
import StartupToolkit from "@/components/StartupToolkit";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const stats = [
  { value: "99.9%", label: "Client Satisfaction" },
  { value: "3x", label: "Faster Than Agencies" },
  { value: "50%", label: "Cost Savings" },
  { value: "0", label: "Projects Abandoned" },
];

const WhyUsPage = () => {
  usePageMeta("Why Us", "🏆");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="Our Edge"
          title="Why Startups Choose"
          highlight="Fusion Engine"
          description="We're not just developers — we're product engineers who think like founders. Speed, scalability, and security are built into everything we do."
          animation={<WhyUsMetrics />}
        />
        <WhyFusion />
        <PageStats stats={stats} />
        <StartupToolkit />
      </main>
      <Footer />
    </div>
  );
};

export default WhyUsPage;
