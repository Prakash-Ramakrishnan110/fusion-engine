import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import WhyFusion from "@/components/WhyFusion";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <Process />
        <Products />
        <Industries />
        <WhyFusion />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
