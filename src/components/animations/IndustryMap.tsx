import { motion } from "framer-motion";
import { Store, Truck, GraduationCap, Factory, HeartPulse, Rocket, Sprout } from "lucide-react";

const sectors = [
  { icon: Store, label: "Retail" },
  { icon: Truck, label: "Logistics" },
  { icon: GraduationCap, label: "Education" },
  { icon: Sprout, label: "Agri" },
  { icon: Factory, label: "Mfg" },
  { icon: HeartPulse, label: "Health" },
  { icon: Rocket, label: "Startups" },
];

const IndustryMap = () => {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Hexagonal-ish grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {sectors.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.12 }}
            className="w-20 h-20 glass-card flex flex-col items-center justify-center gap-1.5 cursor-default"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            >
              <s.icon size={20} className="text-primary" />
            </motion.div>
            <span className="text-[10px] font-medium text-muted-foreground">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Connection lines animation */}
      <motion.div
        className="mt-6 glass-card p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Industry Coverage</span>
          <span className="text-xs font-bold text-primary">7 Sectors</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default IndustryMap;
