import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudies from "@/components/CaseStudies";
import usePageMeta from "@/hooks/usePageMeta";
import Hero from "@/components/Hero";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { Monitor, Rocket, Star, Code } from "lucide-react";

const PortfolioPage = () => {
  usePageMeta("Portfolio & Case Studies", "💼");
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero 
          badgeText="Our Portfolio • Case Studies"
          title1="Digital Products We've"
          title2="Brought to Life"
          description={
            <>
              Explore our most recent success stories. See how we transform complex challenges into <span className="font-semibold text-foreground">elegant, scalable</span> digital solutions that drive <span className="text-primary font-semibold">measurable results</span>.
            </>
          }
          primaryCtaText="Start Your Build"
          primaryCtaLink="/contact"
          lottieUrl={LOTTIE_URLS.growth}
          features={[
            { icon: Rocket, title: "Fast Delivery", desc: "Launched in weeks" },
            { icon: Star, title: "High Conversion", desc: "Proven results" },
            { icon: Monitor, title: "Responsive", desc: "Perfect on all devices" },
            { icon: Code, title: "Modern Stack", desc: "Built for the future" }
          ]}
        />
        <CaseStudies />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
