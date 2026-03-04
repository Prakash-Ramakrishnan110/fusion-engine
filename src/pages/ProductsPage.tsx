import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Products from "@/components/Products";
import StartupToolkit from "@/components/StartupToolkit";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";

const stats = [
  { value: "25+", label: "Products Launched" },
  { value: "10M+", label: "End Users Served" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "6", label: "Product Categories" },
];

const ProductsPage = () => {
  usePageMeta("Products", "📦");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHero
          badge="Our Solutions"
          title="Products Built to"
          highlight="Scale Your Business"
          description="From GST billing systems to AI dashboards — real digital products engineered for real businesses. Each system is custom-built and battle-tested."
          lottieUrl={LOTTIE_URLS.dashboard}
        />
        <Products />
        <PageStats stats={stats} />
        <StartupToolkit />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
