import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

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
      <main className="pt-20">
        <Products />
        <PageStats stats={stats} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
