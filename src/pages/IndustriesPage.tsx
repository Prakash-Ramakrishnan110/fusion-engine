import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Industries from "@/components/Industries";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";

const stats = [
  { value: "7+", label: "Industries Served" },
  { value: "150+", label: "Business Clients" },
  { value: "40+", label: "Startups Launched" },
  { value: "12", label: "Countries Reached" },
];

const IndustriesPage = () => {
  usePageMeta("Industries", "🏭");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="Who We Serve"
          title="Powering Growth Across"
          highlight="Every Industry"
          description="We've built digital solutions across diverse industries — each with unique challenges, domain expertise, and proven results."
          lottieUrl={LOTTIE_URLS.globe}
        />
        <Industries />
        <StartupAdvantage />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default IndustriesPage;
