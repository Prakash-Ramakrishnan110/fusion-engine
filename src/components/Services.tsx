import { motion } from "framer-motion";
import {
  Smartphone,
  Globe,
  Cloud,
  Brain,
  Cpu,
  Server,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Cloud,
    title: "SaaS Development",
    desc: "Build and launch scalable SaaS products with multi-tenant architecture, billing integrations, and powerful analytics built right in.",
    features: ["Multi-tenant Architecture", "Subscription Billing", "Usage-Based Pricing", "Analytics Dashboards"],
    stat: "10x",
    statLabel: "Faster Launch",
    image: "/services/saas.png",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "Integrate intelligence into your business workflows. From autonomous agents to predictive analytics, we make your data work harder.",
    features: ["AI Chatbots", "Predictive Analytics", "Smart Monitoring", "Computer Vision"],
    stat: "40%",
    statLabel: "Cost Reduction",
    image: "/services/ai.png",
  },
  {
    icon: Globe,
    title: "Web Development",
    desc: "Enterprise-grade web systems with robust architecture. From complex dashboards to full-blown marketplaces, we build it all.",
    features: ["Admin Dashboards", "ERP & CRM Platforms", "Multi-Vendor Marketplaces", "API-Driven Architecture"],
    stat: "99.9%",
    statLabel: "Uptime SLA",
    image: "/services/web.png",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "High-performance mobile apps built for scale. We craft native and cross-platform experiences that delight users and drive engagement.",
    features: ["Native iOS/Android", "Flutter Cross-Platform", "GPS & IoT Integration", "Offline-first Architecture"],
    stat: "50+",
    statLabel: "Apps Delivered",
    image: "/services/mobile.png",
  },
  {
    icon: Cpu,
    title: "Firmware Development",
    desc: "Embedded systems and IoT solutions that bridge hardware and software. We write robust firmware for connected devices and edge computing.",
    features: ["IoT Architecture", "Embedded Systems", "Hardware Integration", "Real-time Processing"],
    stat: "Zero",
    statLabel: "Latency Focus",
    image: "/services/firmware.png",
  },
  {
    icon: Server,
    title: "Cloud Solutions",
    desc: "Reliable backend architecture for scaling products. We set up, manage, and optimize your cloud infrastructure for peak performance.",
    features: ["AWS / GCP / Azure", "Serverless Architecture", "Secure Auth", "Performance Optimization"],
    stat: "256-bit",
    statLabel: "Encryption",
    image: "/services/cloud.png",
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
              className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-xl font-bold text-white drop-shadow-md">{service.stat}</div>
                  <div className="text-[11px] text-white/90 drop-shadow-md font-medium">{service.statLabel}</div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <service.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{service.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">{service.desc}</p>
                <ul className="space-y-2 mt-auto pt-4 border-t border-border/50">
                  {service.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
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
