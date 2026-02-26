import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import CaseStudies from "@/components/CaseStudies";
import Founder from "@/components/Founder";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const Index = () => {
  usePageMeta("Build. Automate. Scale", "🚀");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <CaseStudies />
        <Founder />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
