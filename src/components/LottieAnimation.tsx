import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface LottieAnimationProps {
  url: string;
  className?: string;
  loop?: boolean;
  style?: React.CSSProperties;
}

const LottieAnimation = ({ url, className = "", loop = true, style }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setIsLoading(true);
    setHasError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout

    const primaryUrl = url;
    const fallbackUrls = [
      "https://assets9.lottiefiles.com/packages/lf20_z4cshyhf.json",
      "https://assets4.lottiefiles.com/packages/lf20_iorpbol0.json",
      "https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json",
    ];

    const tryLoad = async (urlToTry: string) => {
      try {
        const response = await fetch(urlToTry, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setAnimationData(data);
        setIsLoading(false);
        setHasError(false);
        return true;
      } catch (error) {
        console.warn(`Failed to load ${urlToTry}:`, error);
        return false;
      }
    };

    const loadAnimation = async () => {
      let loaded = await tryLoad(primaryUrl);
      if (!loaded) {
        for (const fallbackUrl of fallbackUrls) {
          loaded = await tryLoad(fallbackUrl);
          if (loaded) break;
        }
      }

      if (!loaded) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadAnimation();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url, isVisible]);

  // Show placeholder immediately instead of loading state
  if (isLoading || hasError || !animationData) {
    return (
      <div
        ref={elementRef}
        className={`flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg w-full h-full max-w-full ${className}`}
        style={style}
      >
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
          {/* Simple animated placeholder */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-primary/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }} // Reduced animation duration
      className={`w-full h-full max-w-full ${className}`}
      style={style}
    >
      <Lottie 
        animationData={animationData} 
        loop={loop}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </motion.div>
  );
};

// Centralized Lottie URLs - using working URLs
export const LOTTIE_URLS = {
  // Hero & general - working URLs
  rocket: "https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json",
  techNetwork: "https://assets4.lottiefiles.com/packages/lf20_iorpbol0.json",
  coding: "https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json",
  
  // Services - working URLs
  mobileApp: "https://assets2.lottiefiles.com/packages/lf20_kkflmtur.json",
  webDev: "https://assets10.lottiefiles.com/packages/lf20_3rwasyjy.json",
  cloudServer: "https://assets1.lottiefiles.com/packages/lf20_dews3j6m.json",
  
  // Process
  workflow: "https://assets6.lottiefiles.com/packages/lf20_vnikrcia.json",
  gears: "https://assets2.lottiefiles.com/packages/lf20_m9zragkd.json",
  
  // Products
  dashboard: "https://assets8.lottiefiles.com/packages/lf20_qp1q7mct.json",
  analytics: "https://assets5.lottiefiles.com/packages/lf20_kgyknvfq.json",
  
  // Industries
  globe: "https://assets3.lottiefiles.com/packages/lf20_bhebjzpu.json",
  
  // Why Us
  trophy: "https://assets1.lottiefiles.com/packages/lf20_touohxv0.json",
  shield: "https://assets8.lottiefiles.com/packages/lf20_ht6o1bdu.json",
  
  // Pricing
  calculator: "https://assets7.lottiefiles.com/packages/lf20_ryxbpeor.json",
  
  // Contact
  email: "https://assets1.lottiefiles.com/packages/lf20_u25cckyh.json",
  
  // CTA
  rocketLaunch: "https://assets9.lottiefiles.com/packages/lf20_z4cshyhf.json",
  
  // Case Studies
  growth: "https://assets2.lottiefiles.com/packages/lf20_ystsffqy.json",
  
  // Founder
  team: "https://assets10.lottiefiles.com/packages/lf20_v1yudlrx.json",
  
  // Stats
  dataChart: "https://assets4.lottiefiles.com/packages/lf20_dkz94e09.json",
  
  // Security
  security: "https://assets3.lottiefiles.com/packages/lf20_ullnayht.json",
  
  // Automation
  automation: "https://assets6.lottiefiles.com/packages/lf20_w4cozlrs.json",
  
  // Startup
  startup: "https://assets9.lottiefiles.com/packages/lf20_wzmchuh2.json",
  
  // Success
  success: "https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json",
  
  // Innovation
  innovation: "https://assets5.lottiefiles.com/packages/lf20_svy4ivvy.json",
};

export default LottieAnimation;
