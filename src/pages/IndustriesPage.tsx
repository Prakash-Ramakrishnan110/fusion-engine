import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Industries from "@/components/Industries";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Building2, ShoppingCart, Heart, GraduationCap } from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";

const stats = [
  { value: "7+", label: "Industries Served" },
  { value: "150+", label: "Business Clients" },
  { value: "40+", label: "Startups Launched" },
  { value: "12", label: "Countries Reached" },
];

const IndustriesHero = () => {
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

  const industryTypes = [
    { icon: Building2, title: "Real Estate", desc: "Property Tech" },
    { icon: ShoppingCart, title: "E-Commerce", desc: "Retail Solutions" },
    { icon: Heart, title: "Healthcare", desc: "Medical Tech" },
    { icon: GraduationCap, title: "Education", desc: "E-Learning" }
  ];

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></span>
              Industry Expertise
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Transforming
              <motion.span 
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Industries Worldwide
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              From <span className="font-semibold text-foreground">real estate to healthcare</span>, 
              we build <span className="text-purple-600 font-semibold">industry-specific solutions</span> that 
              <span className="text-pink-600 font-semibold">drive real results</span>.
            </motion.p>

            {/* Industry Types Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {industryTypes.map((industry, index) => (
                <motion.div
                  key={industry.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                      <industry.icon size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{industry.title}</div>
                      <div className="text-xs text-muted-foreground">{industry.desc}</div>
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
              rotateY: mousePosition.x * 4 - 2,
              rotateX: mousePosition.y * -4 + 2
            }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.globe}
              className="w-full h-full"
            />
            {/* Floating Industry Cards */}
            {industryTypes.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 22}%`,
                  right: index % 2 === 0 ? '-8%' : 'auto',
                  left: index % 2 === 1 ? '-8%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <industry.icon size={14} className="text-purple-600" />
                  <div>
                    <div className="font-semibold text-xs">{industry.title}</div>
                    <div className="text-xs text-muted-foreground">{industry.desc}</div>
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
              url={LOTTIE_URLS.globe}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const IndustriesPage = () => {
  usePageMeta("Industries", "🏭");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <IndustriesHero />
        <Industries />
      </main>
      <Footer />
    </div>
  );
};

export default IndustriesPage;
