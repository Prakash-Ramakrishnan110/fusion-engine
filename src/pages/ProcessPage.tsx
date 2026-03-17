import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Process from "@/components/Process";
import StartupAdvantage from "@/components/StartupAdvantage";
import PageStats from "@/components/PageStats";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Target, Clock, CheckCircle, TrendingUp, Code2, Zap, Shield, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation from "@/components/LottieAnimation";

const stats = [
  { value: "98%", label: "On-Time Delivery" },
  { value: "2 Weeks", label: "Avg Sprint Cycle" },
  { value: "500+", label: "Sprints Completed" },
  { value: "0", label: "Projects Abandoned" },
];

const ProcessHero = () => {
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

  const processSteps = [
    { icon: Target, title: "Discovery", desc: "Understand needs" },
    { icon: Clock, title: "Sprint Planning", desc: "2-week cycles" },
    { icon: CheckCircle, title: "Development", desc: "Agile execution" },
    { icon: TrendingUp, title: "Delivery", desc: "On-time launch" }
  ];

  return (
    <section ref={containerRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></span>
              Our Methodology
            </motion.div>

            {/* Sophisticated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A Proven Process for
              <motion.span 
                className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Startup Success
              </motion.span>
            </motion.h1>

            {/* Advanced Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              From idea to launch in <span className="font-semibold text-foreground">structured sprints</span>. 
              Our agile process ensures <span className="text-green-600 font-semibold">transparency, speed, and quality</span> 
              at every step of your startup journey.
            </motion.p>

            {/* Process Steps */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 flex items-center justify-center">
                    <step.icon size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.desc}</div>
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
              url={LOTTIE_URLS.workflow}
              className="w-full h-full"
            />
            {/* Floating Process Indicators */}
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                className="absolute bg-background/90 backdrop-blur-sm border border-green-500/20 rounded-lg p-3 shadow-lg"
                style={{
                  top: `${15 + index * 22}%`,
                  right: index % 2 === 0 ? '-8%' : 'auto',
                  left: index % 2 === 1 ? '-8%' : 'auto'
                }}
              >
                <div className="flex items-center gap-2">
                  <step.icon size={14} className="text-green-600" />
                  <div>
                    <div className="font-semibold text-xs">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.desc}</div>
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
              url={LOTTIE_URLS.workflow}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const ProcessPage = () => {
  usePageMeta("Process", "🔄");
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const processFeatures = [
    { icon: Code2, title: "Proper Planning", desc: "3x success rate" },
    { icon: Zap, title: "Agile Development", desc: "60% less failures" },
    { icon: Shield, title: "Clear Tracking", desc: "85% success rate" },
    { icon: Globe, title: "On Time Delivery", desc: "Exceeds expectations" }
  ];

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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section ref={containerRef} className="relative min-h-screen flex items-center pt-32 lg:pt-20 overflow-hidden">
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
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <motion.div 
            className="container mx-auto px-4 relative z-10"
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
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                >
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  Our Process • Streamlined Development
                </motion.div>

                {/* Sophisticated Headline */}
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Streamlined
                  <motion.span 
                    className="text-primary block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Development Process
                  </motion.span>
                </motion.h1>

                {/* Advanced Description */}
                <motion.p 
                  className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Our proven development methodology ensures your project is delivered on time, within budget, and exceeds expectations.
                  <span className="font-semibold text-foreground"> Agile approach</span> and 
                  <span className="text-primary font-semibold"> quality assured!</span>
                </motion.p>

                {/* Advanced CTA Section */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                    <motion.div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <span>Start Your Project</span>
                        <ArrowRight size={16} className="sm:size-18" />
                      </Link>
                    </motion.div>
                    <motion.div>
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-border rounded-xl font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <span>View Services</span>
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Advanced Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-muted-foreground text-center lg:text-left">
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Proven methodology</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <span>On-time delivery</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Advanced Lottie Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative lg:block hidden"
                style={{ 
                  height: 400
                }}
              >
                <LottieAnimation
                  url={LOTTIE_URLS.workflow}
                  className="w-full h-full"
                  style={{
                    transform: `rotateY(${mousePosition.x * 8 - 4}deg) rotateX(${mousePosition.y * -8 + 4}deg)`
                  }}
                />
                {/* Floating Features */}
                {processFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="absolute bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
                    style={{
                      top: `${15 + index * 22}%`,
                      right: index % 2 === 0 ? '-8%' : 'auto',
                      left: index % 2 === 1 ? '-8%' : 'auto'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon size={14} className="text-primary" />
                      <div>
                        <div className="font-semibold text-xs">{feature.title}</div>
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
                className="lg:hidden relative mt-8"
                style={{ height: 250 }}
              >
                <LottieAnimation
                  url={LOTTIE_URLS.workflow}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>
        <Process />
      </main>
      <Footer />
    </div>
  );
};

export default ProcessPage;
