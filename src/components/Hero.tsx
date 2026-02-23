import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const LOTTIE_URL = "https://assets2.lottiefiles.com/packages/lf20_fcfjwiyb.json";

const Hero = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={logo}
              alt="Fusion Engine Technology logo — building scalable apps, SaaS, AI, and automation systems"
              className="w-72 md:w-96 h-auto mb-8"
            />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build.{" "}
              <span className="text-primary glow-text">Automate.</span>{" "}
              Scale.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Fusion Engine Technology builds high-performance digital systems for businesses that want to grow faster with scalable apps, intelligent automation, and SaaS platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 glow-box"
              >
                Start a Project
                <ArrowRight size={18} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-medium text-base hover:bg-secondary transition-all hover:scale-105"
              >
                Explore Services
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right - Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop
                className="w-full max-w-[500px] h-auto"
              />
            ) : (
              <div className="w-[500px] h-[400px] rounded-xl bg-secondary/30 animate-pulse" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
