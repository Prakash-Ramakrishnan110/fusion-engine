import { motion } from "framer-motion";
import { 
  Smartphone, Globe, Cloud, Brain, Cog, Shield, 
  BarChart3, Zap, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const solutions = [
  { icon: Smartphone, title: "Mobile Apps", desc: "Native & cross-platform apps built for scale", link: "/services" },
  { icon: Globe, title: "Web Platforms", desc: "Enterprise dashboards, marketplaces & portals", link: "/services" },
  { icon: Cloud, title: "SaaS Products", desc: "Multi-tenant architecture with billing built-in", link: "/products" },
  { icon: Brain, title: "AI & Automation", desc: "Chatbots, predictive analytics & AI agents", link: "/services" },
  { icon: Cog, title: "Workflow Automation", desc: "Eliminate manual processes end-to-end", link: "/services" },
  { icon: Shield, title: "Security & Auth", desc: "Enterprise-grade encryption & access control", link: "/why-us" },
  { icon: BarChart3, title: "Analytics Systems", desc: "Real-time dashboards & business intelligence", link: "/products" },
  { icon: Zap, title: "Cloud Infrastructure", desc: "Auto-scaling, CI/CD & DevOps setup", link: "/services" },
];

const HowWeHelp = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How Fusion Engine can help</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              From concept to production — everything you need to build, launch, and scale digital products.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <LottieAnimation
              url={LOTTIE_URLS.innovation}
              className="w-full max-w-xs mx-auto"
            />
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={s.link}
                className="block glass-card p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <ArrowRight size={14} className="text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeHelp;
