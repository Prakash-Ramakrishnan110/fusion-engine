import Navbar from "@/components/Navbar";
import WhyFusion from "@/components/WhyFusion";
import Footer from "@/components/Footer";

const WhyUsPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <WhyFusion />
    </main>
    <Footer />
  </div>
);

export default WhyUsPage;
