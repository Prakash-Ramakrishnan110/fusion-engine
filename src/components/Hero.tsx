import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Code2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use MotionValues for high-performance parallax (avoids React state updates on every mouse move)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smoothing the mouse movement for a premium feel
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.1]));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const features = [
    { icon: Zap, title: "All Client Types", desc: "Startups to Enterprise" },
    { icon: Shield, title: "Quality Assured", desc: "3 successful deliveries" },
    { icon: TrendingUp, title: "Growing Fast", desc: "Expanding our services" },
    { icon: Code2, title: "Custom Solutions", desc: "Tailored to your needs" }
  ];

  const rotateY = useTransform(smoothMouseX, [0, 1], [-10, 10]);
  const rotateX = useTransform(smoothMouseY, [0, 1], [10, -10]);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 overflow-hidden">
      {/* Animated RGB Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
              'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(34, 197, 94, 0.3) 100%)',
              'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(34, 197, 94, 0.3) 50%, rgba(59, 130, 246, 0.3) 100%)',
              'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(168, 85, 247, 0.3) 100%)',
              'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)'
            ]
          }}
          transition={{
            duration: 10, // Slightly slower for better performance
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ scale, y: parallaxY }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Advanced Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Fresh Startup • 3 Projects Delivered
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your Vision,
              <motion.span 
                className="text-primary block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Our Expertise
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              We're a passionate startup team delivering quality solutions for all client needs. 
              <span className="font-semibold text-foreground"> 3 successful projects</span> and 
              <span className="text-primary font-semibold"> growing fast!</span>
            </motion.p>

            {/* Advanced CTA Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
                <motion.div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-primary text-white rounded-xl font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <span>Start Your Project</span>
                    <ArrowRight size={16} className="sm:size-18" />
                  </Link>
                </motion.div>
              </div>
              
              {/* Advanced Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground text-center lg:text-left px-4 sm:px-0">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Available for new projects</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span>3 Projects Completed</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Advanced Lottie Animation with high-performance 3D parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:block hidden"
            style={{ 
              height: '300px sm:350px md:400px lg:450px xl:500px',
              rotateX,
              rotateY,
              perspective: 1000
            }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.techNetwork}
              className="w-full h-full"
            />
            {/* Floating Features */}
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 20}%`,
                  right: index % 2 === 0 ? '-5% sm:-8% md:-10%' : 'auto',
                  left: index % 2 === 1 ? '-5% sm:-8% md:-10%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <feature.icon size={16} className="text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.desc}</div>
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
            className="lg:hidden relative mt-6 sm:mt-8"
            style={{ height: '200px sm:225px md:250px' }}
          >
            <LottieAnimation
              url={LOTTIE_URLS.techNetwork}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
