import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

const ProcessPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-20">
      <Process />
    </main>
    <Footer />
  </div>
);

export default ProcessPage;
