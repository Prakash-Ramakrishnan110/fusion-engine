import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  { name: "Starter", features: 7, price: "$$" },
  { name: "Growth", features: 8, price: "$$$", popular: true },
  { name: "Enterprise", features: 9, price: "$$$$" },
];

const PricingVisual = () => {
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          className={`glass-card p-4 flex items-center justify-between ${tier.popular ? "ring-2 ring-primary shadow-md" : ""}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
          whileHover={{ scale: 1.03 }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{tier.name}</span>
              {tier.popular && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: tier.features }).map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.15 + j * 0.05 }}
                >
                  <Check size={10} className="text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
          <motion.span
            className="text-lg font-bold text-primary"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          >
            {tier.price}
          </motion.span>
        </motion.div>
      ))}

      <motion.div
        className="text-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-muted-foreground">All plans include free consultation</span>
      </motion.div>
    </div>
  );
};

export default PricingVisual;
