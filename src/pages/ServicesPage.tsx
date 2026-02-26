import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ServiceOrbit from "@/components/animations/ServiceOrbit";
import Services from "@/components/Services";
import StartupAdvantage from "@/components/StartupAdvantage";
import StartupToolkit from "@/components/StartupToolkit";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "6+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const ServicesPage = () => {
  usePageMeta("Services", "⚙️");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="What We Do"
          title="Engineering"
          highlight="Digital Excellence"
          description="End-to-end product engineering — from mobile apps to cloud infrastructure. We don't just build software; we engineer scalable systems that grow with your business."
          animation={<ServiceOrbit />}
        />
        <Services />
        <StartupAdvantage />
        <PageStats stats={stats} />
        <StartupToolkit />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
