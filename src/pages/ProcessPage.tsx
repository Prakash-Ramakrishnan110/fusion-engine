import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
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
      <main className="pt-20">
        <Process />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default ProcessPage;
