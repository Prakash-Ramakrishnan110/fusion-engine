import { motion } from "framer-motion";
import { Shield, Zap, Clock, Layers, Headphones, Palette } from "lucide-react";

const items = [
  { icon: Layers, label: "Scalable", value: "10x" },
  { icon: Zap, label: "Fast", value: "3x" },
  { icon: Shield, label: "Secure", value: "256-bit" },
  { icon: Clock, label: "On-Time", value: "98%" },
  { icon: Palette, label: "Modern", value: "A+" },
  { icon: Headphones, label: "Support", value: "24/7" },
];

const WhyUsMetrics = () => {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="glass-card p-3 flex items-center gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
          whileHover={{ x: -4 }}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <item.icon size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </div>
          <motion.div
            className="text-lg font-bold text-primary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          >
            {item.value}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default WhyUsMetrics;
