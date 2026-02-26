import { motion } from "framer-motion";
import { Package, ShoppingCart, Activity, Truck, GraduationCap, Receipt } from "lucide-react";

const items = [
  { icon: Receipt, label: "Billing", color: "bg-primary/10" },
  { icon: Package, label: "Inventory", color: "bg-primary/10" },
  { icon: Truck, label: "Fleet", color: "bg-primary/10" },
  { icon: GraduationCap, label: "ERP", color: "bg-primary/10" },
  { icon: ShoppingCart, label: "Commerce", color: "bg-primary/10" },
  { icon: Activity, label: "AI Dash", color: "bg-primary/10" },
];

const ProductGrid = () => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            className="glass-card p-4 flex flex-col items-center gap-2 cursor-default"
          >
            <motion.div
              className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
            >
              <item.icon size={18} className="text-primary" />
            </motion.div>
            <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Live indicator */}
      <motion.div
        className="mt-4 glass-card p-3 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">6 products active</span>
        </div>
        <span className="text-xs font-bold text-primary">100%</span>
      </motion.div>
    </div>
  );
};

export default ProductGrid;
