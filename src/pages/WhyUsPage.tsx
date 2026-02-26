import Navbar from "@/components/Navbar";
import WhyFusion from "@/components/WhyFusion";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const stats = [
  { value: "99.9%", label: "Client Satisfaction" },
  { value: "3x", label: "Faster Than Agencies" },
  { value: "50%", label: "Cost Savings" },
  { value: "0", label: "Projects Abandoned" },
];

const WhyUsPage = () => {
  usePageMeta("Why Us", "🏆");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <WhyFusion />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default WhyUsPage;
