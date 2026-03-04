import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LottieAnimationProps {
  url: string;
  className?: string;
  loop?: boolean;
  style?: React.CSSProperties;
}

const LottieAnimation = ({ url, className = "", loop = true, style }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, [url]);

  if (!animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
      style={style}
    >
      <Lottie animationData={animationData} loop={loop} />
    </motion.div>
  );
};

// Centralized Lottie URLs
export const LOTTIE_URLS = {
  // Hero & general
  rocket: "https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json",
  techNetwork: "https://assets4.lottiefiles.com/packages/lf20_iorpbol0.json",
  coding: "https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json",
  
  // Services
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
