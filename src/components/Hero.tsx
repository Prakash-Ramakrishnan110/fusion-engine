import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const highlights = [
  "everywhere",
  "at scale",
  "with AI",
  "securely",
  "faster",
];

const Hero = () => {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlights.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build, automate,{" "}
              <br className="hidden md:block" />
              and scale{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={highlightIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-primary inline-block"
                  >
                    {highlights[highlightIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              We build high-performance digital systems — apps, AI agents, and platforms — 
              that are faster, smarter, and more secure. Our engineering studio is the best 
              place to build and scale modern products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Start for free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium text-base hover:bg-secondary transition-all"
              >
                See pricing
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
            style={{ height: 500 }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.techNetwork}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
