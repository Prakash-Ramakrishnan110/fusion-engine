import Navbar from "@/components/Navbar";
import Industries from "@/components/Industries";
import Footer from "@/components/Footer";

const IndustriesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <Industries />
    </main>
    <Footer />
  </div>
);

export default IndustriesPage;
