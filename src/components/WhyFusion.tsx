import { motion } from "framer-motion";
import { Layers, Zap, Shield, Palette, Clock, Headphones, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const reasons = [
  {
    icon: Layers,
    title: "Scalable Architecture",
    desc: "Systems designed to handle growth from day one, not patched together later.",
    detail: "We use microservices, event-driven patterns, and cloud-native infrastructure so your system grows with your business — not against it.",
  },
  {
    icon: Zap,
    title: "Automation-First Thinking",
    desc: "Every workflow is analyzed for automation before manual processes are built.",
    detail: "From CI/CD pipelines to business workflows, we automate everything possible to reduce human error and accelerate your operations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Bank-grade encryption, role-based access, and compliance-ready infrastructure.",
    detail: "256-bit AES encryption, OAuth 2.0, RBAC, audit logs, and GDPR/HIPAA compliance — baked into every project from the start.",
  },
  {
    icon: Palette,
    title: "Modern Product UI",
    desc: "Clean, intuitive interfaces that users actually want to interact with.",
    detail: "Our designers create pixel-perfect interfaces following the latest design trends, with accessibility and mobile-first responsive design.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    desc: "We ship on schedule with agile sprints and transparent project tracking.",
    detail: "Weekly demos, real-time project dashboards, and a dedicated project manager ensure you always know where things stand.",
  },
  {
    icon: Headphones,
    title: "Post-Launch Support",
    desc: "We don't just build and leave. Our team stays with you after launch.",
    detail: "Bug fixes, feature iterations, performance monitoring, and scaling support — we're your long-term technology partner.",
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
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Edge</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Why Fusion Engine</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We're not just developers — we're product engineers who think like business owners.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <r.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-bold text-xl mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{r.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16"
        >
          {[
            { value: "99.9%", label: "Client Satisfaction" },
            { value: "0", label: "Projects Abandoned" },
            { value: "3x", label: "Faster Than Agencies" },
            { value: "50%", label: "Cost Savings" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4">
              <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Start Your Project <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyFusion;
