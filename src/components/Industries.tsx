import { motion } from "framer-motion";
import { Store, Truck, GraduationCap, Sprout, Factory, HeartPulse, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const industries = [
  {
    icon: Store,
    label: "Retail & Shops",
    desc: "POS systems, inventory management, e-commerce platforms, and customer loyalty programs for modern retail businesses.",
    clients: "30+ Clients",
  },
  {
    icon: Truck,
    label: "Logistics & Transport",
    desc: "Fleet tracking, route optimization, warehouse management, and supply chain visibility for logistics companies.",
    clients: "15+ Clients",
  },
  {
    icon: GraduationCap,
    label: "Education",
    desc: "School ERPs, LMS platforms, exam management, and parent communication portals for educational institutions.",
    clients: "50+ Schools",
  },
  {
    icon: Sprout,
    label: "Agriculture",
    desc: "Farm management systems, crop monitoring, supply chain tracking, and market price analytics for agri-businesses.",
    clients: "10+ Clients",
  },
  {
    icon: Factory,
    label: "Manufacturing",
    desc: "Production planning, quality control, equipment monitoring, and ERP solutions for manufacturing operations.",
    clients: "20+ Clients",
  },
  {
    icon: HeartPulse,
    label: "Healthcare",
    desc: "Patient management, appointment scheduling, EMR systems, and telemedicine platforms for healthcare providers.",
    clients: "12+ Clients",
  },
  {
    icon: Rocket,
    label: "Startups",
    desc: "MVP development, rapid prototyping, SaaS architecture, and growth-ready infrastructure for early-stage startups.",
    clients: "40+ Startups",
  },
];

const Industries = () => {
  return (
    <section id="industries" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Who We Serve</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Industries We Power</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We've built digital solutions across diverse industries, each with unique challenges and domain expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <ind.icon className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{ind.label}</h3>
                  <span className="text-xs text-primary font-medium">{ind.clients}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Don't see your industry? We work with all sectors. Let's talk.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Get in Touch <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;
