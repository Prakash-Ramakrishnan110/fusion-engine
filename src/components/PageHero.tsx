import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ReactNode, useEffect, useState, useRef } from "react";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

interface PageHeroProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  facts?: string[];
  animation?: ReactNode;
  lottieUrl?: string;
}

const PageHero = ({ badge, title, highlight, description, facts = [], animation, lottieUrl }: PageHeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.05]));
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

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

  return (
    <section ref={containerRef} className="relative pt-32 lg:pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20"
          style={{ opacity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]"
          style={{
            scale: 1 + mousePosition.x * 0.2,
            x: (mousePosition.x - 0.5) * 50,
            y: (mousePosition.y - 0.5) * 50
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              {badge}
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {title}{" "}
              <motion.span 
                className="text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {highlight}
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {description}
            </motion.p>

            {/* Interesting Facts */}
            {facts.length > 0 && (
              <motion.div 
                className="space-y-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {facts.map((fact, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      index % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'
                    }`}></span>
                    <span>{fact}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Advanced Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative"
            style={{ 
              height: 400
            }}
          >
            {animation || (
              <LottieAnimation
                url={lottieUrl || LOTTIE_URLS.techNetwork}
                className="w-full h-full"
                style={{
                  transform: `rotateY(${mousePosition.x * 8 - 4}deg) rotateX(${mousePosition.y * -8 + 4}deg)`
                }}
              />
            )}
          </motion.div>

          {/* Mobile Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:hidden relative mt-6"
            style={{ height: 250 }}
          >
            {animation || (
              <LottieAnimation
                url={lottieUrl || LOTTIE_URLS.techNetwork}
                className="w-full h-full"
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PageHero;
