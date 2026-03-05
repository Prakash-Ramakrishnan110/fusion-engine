import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import StartupAdvantage from "@/components/StartupAdvantage";
import StartupToolkit from "@/components/StartupToolkit";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Code2, Zap, Shield, Globe } from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";

const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "6+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
];

const ServicesHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.05]));

  const services = [
    { icon: Code2, title: "Custom Development", desc: "Tailored solutions" },
    { icon: Zap, title: "Lightning Fast", desc: "Rapid deployment" },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-level protection" },
    { icon: Globe, title: "Global Scale", desc: "Worldwide reach" }
  ];

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
              What We Do
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Engineering
              <motion.span 
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Digital Excellence
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              End-to-end product engineering — from mobile apps to cloud infrastructure. 
              <span className="font-semibold text-foreground"> We don't just build software;</span> 
              we engineer <span className="text-blue-600 font-semibold">scalable systems</span> that grow with your business.
            </motion.p>

            {/* Service Features */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <service.icon size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{service.title}</div>
                      <div className="text-xs text-muted-foreground">{service.desc}</div>
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
            style={{ height: 450 }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.coding}
              className="w-full h-full"
            />
            {/* Floating Service Indicators */}
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 22}%`,
                  right: index % 2 === 0 ? '-8%' : 'auto',
                  left: index % 2 === 1 ? '-8%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <service.icon size={14} className="text-blue-600" />
                  <div>
                    <div className="font-semibold text-xs">{service.title}</div>
                    <div className="text-xs text-muted-foreground">{service.desc}</div>
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
              url={LOTTIE_URLS.coding}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const ServicesPage = () => {
  usePageMeta("Services", "⚙️");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <ServicesHero />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
