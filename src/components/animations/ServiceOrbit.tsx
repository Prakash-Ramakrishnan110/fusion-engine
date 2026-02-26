import { motion } from "framer-motion";
import { Smartphone, Globe, Cloud, Brain, Cog, Server } from "lucide-react";

const icons = [Smartphone, Globe, Cloud, Brain, Cog, Server];
const labels = ["Mobile", "Web", "SaaS", "AI", "Automation", "Cloud"];

const ServiceOrbit = () => {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Central pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">FE</span>
        </div>
      </motion.div>

      {/* Orbiting ring */}
      <motion.div
        className="absolute inset-8 rounded-full border border-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbiting icons */}
      {icons.map((Icon, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 42;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <motion.div
            key={labels[i]}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          >
            <motion.div
              className="w-14 h-14 rounded-xl bg-card border border-border shadow-md flex flex-col items-center justify-center gap-1 cursor-default"
              whileHover={{ scale: 1.15, boxShadow: "0 8px 30px -8px hsl(215 90% 50% / 0.3)" }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon size={18} className="text-primary" />
              <span className="text-[9px] font-medium text-muted-foreground">{labels[i]}</span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {icons.map((_, i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const x = 50 + 42 * Math.cos(angle);
          const y = 50 + 42 * Math.sin(angle);
          return (
            <motion.line
              key={i}
              x1="50" y1="50" x2={x} y2={y}
              stroke="hsl(215 90% 50% / 0.08)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ServiceOrbit;
