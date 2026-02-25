import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const PricingPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <Pricing />
    </main>
    <Footer />
  </div>
);

export default PricingPage;
