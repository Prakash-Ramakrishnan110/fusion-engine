import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Products from "@/components/Products";
import StartupToolkit from "@/components/StartupToolkit";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Package, Smartphone, Globe, Zap } from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";

const stats = [
  { value: "25+", label: "Products Launched" },
  { value: "10M+", label: "End Users Served" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "6", label: "Product Categories" },
];

const ProductsHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.05]));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const productTypes = [
    { icon: Smartphone, title: "Mobile Apps", desc: "iOS & Android" },
    { icon: Globe, title: "Web Platforms", desc: "Scalable SaaS" },
    { icon: Package, title: "API Solutions", desc: "REST & GraphQL" },
    { icon: Zap, title: "AI Products", desc: "ML Powered" }
  ];

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"
          style={{ opacity: 0.8 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 blur-[120px]"
          style={{
            scale: 1 + Math.sin(mousePosition.x * Math.PI) * 0.2,
            rotate: (mousePosition.x - 0.5) * 20
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(251, 146, 60, 0.12) 0%, transparent 60%)`
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ scale, y: parallaxY }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Advanced Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></span>
              Our Solutions
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Products Built to
              <motion.span 
                className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Scale & Succeed
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              From <span className="font-semibold text-foreground">MVP to enterprise</span>, 
              we build products that <span className="text-orange-600 font-semibold">users love</span> and 
              <span className="text-red-600 font-semibold"> investors fund</span>. 
              Launch-ready in 14 days.
            </motion.p>

            {/* Product Types Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {productTypes.map((product, index) => (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 flex items-center justify-center">
                      <product.icon size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{product.title}</div>
                      <div className="text-xs text-muted-foreground">{product.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Advanced Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative"
            style={{ 
              height: 450,
              rotateY: mousePosition.x * 5 - 2.5,
              rotateX: mousePosition.y * -5 + 2.5
            }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.dashboard}
              className="w-full h-full"
            />
            {/* Floating Product Cards */}
            {productTypes.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-orange-500/20 rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 22}%`,
                  right: index % 2 === 0 ? '-8%' : 'auto',
                  left: index % 2 === 1 ? '-8%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <product.icon size={14} className="text-orange-600" />
                  <div>
                    <div className="font-semibold text-xs">{product.title}</div>
                    <div className="text-xs text-muted-foreground">{product.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:hidden relative mt-8"
            style={{ height: 250 }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.dashboard}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const ProductsPage = () => {
  usePageMeta("Products", "📦");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <ProductsHero />
        <Products />
        <PageStats stats={stats} />
        <StartupToolkit />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
