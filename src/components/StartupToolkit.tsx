import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const testimonials = [
  {
    quote: "Fusion Engine transformed our manual billing into a fully automated system. We saved 500+ hours per month.",
    name: "Retail Chain CEO",
    company: "Multi-branch retail business",
  },
  {
    quote: "Their team delivered our fleet tracking platform in just 8 weeks. It reduced our fuel costs by 40%.",
    name: "Logistics Director",
    company: "National logistics company",
  },
  {
    quote: "The school ERP they built is used by 50+ schools. Parents love the mobile app.",
    name: "EdTech Founder",
    company: "Education technology startup",
  },
];

const techStack = [
  "React", "Next.js", "Flutter", "Node.js", "Python", "PostgreSQL",
  "Firebase", "AWS", "Docker", "Kubernetes", "TensorFlow", "Redis",
];

const StartupToolkit = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Testimonials */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">What Clients Say</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Trusted by Founders</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <LottieAnimation
              url={LOTTIE_URLS.success}
              className="w-full max-w-xs ml-auto"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <Quote size={20} className="text-primary/30 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="text-sm font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>

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
