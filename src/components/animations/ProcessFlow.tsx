import { motion } from "framer-motion";

const steps = ["Discover", "Architect", "Develop", "Automate", "Optimize", "Scale"];

const ProcessFlow = () => {
  return (
    <div className="relative w-full max-w-md mx-auto py-8">
      {steps.map((step, i) => (
        <motion.div
          key={step}
          className="flex items-center gap-4 mb-4 last:mb-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
        >
          {/* Step number */}
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          >
            <span className="text-sm font-bold text-primary">0{i + 1}</span>
          </motion.div>

          {/* Progress bar */}
          <div className="flex-1 h-10 rounded-lg bg-card border border-border overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary/10 rounded-lg"
              initial={{ width: "0%" }}
              animate={{ width: `${((i + 1) / steps.length) * 100}%` }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.8, ease: "easeOut" }}
            />
            <div className="relative z-10 h-full flex items-center px-3">
              <span className="text-sm font-medium text-foreground">{step}</span>
            </div>
          </div>

          {/* Status dot */}
          <motion.div
            className="w-3 h-3 rounded-full bg-primary shrink-0"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        </motion.div>
      ))}

      {/* Completion badge */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Pipeline Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessFlow;
