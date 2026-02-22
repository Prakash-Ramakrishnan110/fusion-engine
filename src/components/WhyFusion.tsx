import { motion } from "framer-motion";
import { Layers, Zap, Shield, Palette } from "lucide-react";

const reasons = [
  {
    icon: Layers,
    title: "Scalable Architecture",
    desc: "Systems designed to handle growth from day one, not patched together later.",
  },
  {
    icon: Zap,
    title: "Automation-First Thinking",
    desc: "Every workflow is analyzed for automation before manual processes are built.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Bank-grade encryption, role-based access, and compliance-ready infrastructure.",
  },
  {
    icon: Palette,
    title: "Modern Product UI",
    desc: "Clean, intuitive interfaces that users actually want to interact with.",
  },
];

const WhyFusion = () => {
  return (
    <section id="why-us" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Fusion Engine</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <r.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFusion;
