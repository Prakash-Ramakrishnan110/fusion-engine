import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ProcessFlow from "@/components/animations/ProcessFlow";
import Process from "@/components/Process";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const stats = [
  { value: "98%", label: "On-Time Delivery" },
  { value: "2 Weeks", label: "Avg Sprint Cycle" },
  { value: "500+", label: "Sprints Completed" },
  { value: "0", label: "Projects Abandoned" },
];

const ProcessPage = () => {
  usePageMeta("Process", "🔄");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="Our Methodology"
          title="A Proven Process for"
          highlight="Predictable Results"
          description="Our 6-step engineering methodology ensures every project is delivered on time, on budget, and beyond expectations. No surprises, just results."
          animation={<ProcessFlow />}
        />
        <Process />
        <StartupAdvantage />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default ProcessPage;
