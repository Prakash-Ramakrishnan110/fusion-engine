import { motion } from "framer-motion";

const tags = [
  "Scalable Systems",
  "SaaS Architecture",
  "Automation-First",
  "Cloud Native",
  "AI Integrated",
];

const TrustStrip = () => {
  return (
    <section className="py-16 border-y border-border/30">
      <div className="container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl font-heading font-semibold text-foreground mb-6"
        >
          Product Engineering Studio for Modern Businesses
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full text-sm text-muted-foreground border border-border/50 bg-secondary/30"
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
