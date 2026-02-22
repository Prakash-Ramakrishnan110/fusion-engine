import { motion } from "framer-motion";
import { Store, Truck, GraduationCap, Sprout, Factory, HeartPulse, Rocket } from "lucide-react";

const industries = [
  { icon: Store, label: "Retail & Shops" },
  { icon: Truck, label: "Logistics & Transport" },
  { icon: GraduationCap, label: "Education" },
  { icon: Sprout, label: "Agriculture" },
  { icon: Factory, label: "Manufacturing" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Rocket, label: "Startups" },
];

const Industries = () => {
  return (
    <section id="industries" className="py-24 border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Power</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 text-center group hover:glow-box transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              <ind.icon className="mx-auto text-primary mb-3 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{ind.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
