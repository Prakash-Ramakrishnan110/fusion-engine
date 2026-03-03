import { motion } from "framer-motion";

const tags = [
  "Scalable Systems",
  "SaaS Architecture",
  "Automation-First",
  "Cloud Native",
  "AI Integrated",
  "Enterprise Security",
];

const TrustStrip = () => {
  return (
    <section className="py-8 border-y border-border/30">
      <div className="container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-muted-foreground mb-4"
        >
          Product Engineering Studio for Modern Businesses
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full text-xs text-muted-foreground border border-border/50 bg-secondary/30 font-medium"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStrip;
