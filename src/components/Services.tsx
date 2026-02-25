import { motion } from "framer-motion";
import {
  Smartphone,
  Globe,
  Cloud,
  Brain,
  Cog,
  Server,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Application Development",
    desc: "High-performance mobile apps built for scale. We craft native and cross-platform experiences that delight users and drive engagement.",
    features: ["Native Android Apps", "Flutter Cross-Platform", "Real-time Data Sync", "GPS & IoT Integration", "Offline-first Architecture", "Secure Authentication"],
    stat: "50+",
    statLabel: "Apps Delivered",
  },
  {
    icon: Globe,
    title: "Web Platform Engineering",
    desc: "Enterprise-grade web systems with robust architecture. From admin panels to full-blown marketplaces, we build it all.",
    features: ["Admin Dashboards", "Role-Based Systems", "ERP & CRM Platforms", "Multi-Vendor Marketplaces", "Subscription Platforms", "API-Driven Architecture"],
    stat: "99.9%",
    statLabel: "Uptime SLA",
  },
  {
    icon: Cloud,
    title: "SaaS Product Development",
    desc: "Build and launch scalable SaaS products with multi-tenant architecture, billing integrations, and analytics built right in.",
    features: ["Multi-tenant Architecture", "Subscription Billing", "Usage-Based Pricing", "Analytics Dashboards", "Cloud Deployment", "DevOps Integration"],
    stat: "10x",
    statLabel: "Faster Launch",
  },
  {
    icon: Brain,
    title: "AI & Intelligent Systems",
    desc: "Integrate intelligence into your business workflows. From chatbots to predictive analytics, we make your data work harder.",
    features: ["AI Chatbots", "Predictive Analytics", "Smart Monitoring", "AI-Powered Dashboards", "Automated Insights", "Computer Vision"],
    stat: "40%",
    statLabel: "Cost Reduction",
  },
  {
    icon: Cog,
    title: "Business Automation Systems",
    desc: "Remove manual processes and increase efficiency. Automate repetitive tasks so your team can focus on what matters.",
    features: ["Workflow Automation", "WhatsApp Automation", "CRM Automation", "Invoice Automation", "Payment Integration", "API Integration"],
    stat: "500+",
    statLabel: "Hours Saved / Month",
  },
  {
    icon: Server,
    title: "Cloud & Infrastructure",
    desc: "Reliable backend architecture for scaling products. We set up, manage, and optimize your cloud infrastructure for peak performance.",
    features: ["AWS / GCP / Azure", "Firebase / Supabase", "Secure Auth", "Role-Based Access", "Data Encryption", "Performance Optimization"],
    stat: "256-bit",
    statLabel: "Encryption",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">What We Do</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Core Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            End-to-end product engineering — from mobile apps to cloud infrastructure. We don't just build software; we engineer scalable systems.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16"
        >
          {[
            { value: "100+", label: "Projects Completed" },
            { value: "50+", label: "Happy Clients" },
            { value: "6+", label: "Years Experience" },
            { value: "24/7", label: "Support Available" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4">
              <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="text-primary" size={26} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{service.stat}</div>
                  <div className="text-[11px] text-muted-foreground">{service.statLabel}</div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{service.desc}</p>
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
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
            Not sure which service you need? Let us help you figure it out.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Discuss Your Project <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
