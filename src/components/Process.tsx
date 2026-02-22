import { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Discover", desc: "Understand business goals, user needs, and technical requirements." },
  { num: "02", title: "Architect", desc: "Design scalable system architecture and define technology stack." },
  { num: "03", title: "Develop", desc: "Build with clean code, CI/CD pipelines, and agile sprints." },
  { num: "04", title: "Automate", desc: "Integrate automation for workflows, testing, and deployment." },
  { num: "05", title: "Optimize", desc: "Performance tuning, security hardening, and UX refinement." },
  { num: "06", title: "Scale", desc: "Launch, monitor, and scale infrastructure for growth." },
];

const Process = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="process" className="py-24 border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Build</h2>
          <p className="text-muted-foreground">A proven process for delivering scalable digital systems.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center cursor-pointer hover:glow-box transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="text-2xl font-bold text-primary mb-2">{step.num}</div>
              <div className="font-semibold text-sm mb-2">{step.title}</div>
              <motion.p
                initial={false}
                animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                className="text-xs text-muted-foreground overflow-hidden"
              >
                {step.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
