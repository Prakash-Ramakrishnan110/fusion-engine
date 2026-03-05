import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { DollarSign, TrendingUp, Shield, Clock } from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";

const stats = [
  { value: "30%", label: "Avg Cost Savings vs Agencies" },
  { value: "Flexible", label: "Payment Plans" },
  { value: "100%", label: "Transparent Pricing" },
  { value: "Free", label: "Initial Consultation" },
];

const PricingHero = () => {
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

  const valueProps = [
    { icon: DollarSign, title: "Cost Effective", desc: "30% savings" },
    { icon: TrendingUp, title: "Max ROI", desc: "3x faster delivery" },
    { icon: Shield, title: "No Hidden Fees", desc: "100% transparent" },
    { icon: Clock, title: "Flexible Terms", desc: "Pay as you grow" }
  ];

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"
          style={{ opacity: 0.6 }}
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></span>
              Exceptional Value
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Startup Pricing
              <motion.span 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                That Makes Sense
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="font-semibold text-foreground">30% cost savings</span> with 
              <span className="text-emerald-600 font-semibold"> enterprise quality</span> and 
              <span className="text-teal-600 font-semibold"> flexible payment terms</span>. 
              No hidden fees, just value you can count on.
            </motion.p>

            {/* Value Props Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {valueProps.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                      <prop.icon size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{prop.title}</div>
                      <div className="text-xs text-muted-foreground">{prop.desc}</div>
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
              url={LOTTIE_URLS.calculator}
              className="w-full h-full"
            />
            {/* Floating Value Cards */}
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 22}%`,
                  right: index % 2 === 0 ? '-8%' : 'auto',
                  left: index % 2 === 1 ? '-8%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <prop.icon size={14} className="text-emerald-600" />
                  <div>
                    <div className="font-semibold text-xs">{prop.title}</div>
                    <div className="text-xs text-muted-foreground">{prop.desc}</div>
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
              url={LOTTIE_URLS.calculator}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const PricingPage = () => {
  usePageMeta("Pricing", "💰");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PricingHero />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
