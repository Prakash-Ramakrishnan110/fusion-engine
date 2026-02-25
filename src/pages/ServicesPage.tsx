import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const ServicesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <Services />
    </main>
    <Footer />
  </div>
);

export default ServicesPage;
