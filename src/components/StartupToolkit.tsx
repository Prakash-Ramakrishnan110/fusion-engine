import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const techStack = [
  "React", "Next.js", "Flutter", "Node.js", "Python", "PostgreSQL",
  "Firebase", "AWS", "Docker", "Kubernetes", "TensorFlow", "Redis",
];

const StartupToolkit = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Technology</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Our Tech Stack</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We use battle-tested technologies trusted by startups and enterprises worldwide.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-16">
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Let's Build Together <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StartupToolkit;
