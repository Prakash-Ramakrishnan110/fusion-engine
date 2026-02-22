import { motion } from "framer-motion";
import {
  Smartphone,
  Globe,
  Cloud,
  Brain,
  Cog,
  Server,
} from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Application Development",
    desc: "High-performance mobile apps built for scale.",
    features: ["Native Android Apps", "Flutter Cross-Platform", "Real-time Data Sync", "GPS & IoT Integration", "Offline-first Architecture", "Secure Authentication"],
  },
  {
    icon: Globe,
    title: "Web Platform Engineering",
    desc: "Enterprise-grade web systems with robust architecture.",
    features: ["Admin Dashboards", "Role-Based Systems", "ERP & CRM Platforms", "Multi-Vendor Marketplaces", "Subscription Platforms", "API-Driven Architecture"],
  },
  {
    icon: Cloud,
    title: "SaaS Product Development",
    desc: "Build and launch scalable SaaS products.",
    features: ["Multi-tenant Architecture", "Subscription Billing", "Usage-Based Pricing", "Analytics Dashboards", "Cloud Deployment", "DevOps Integration"],
  },
  {
    icon: Brain,
    title: "AI & Intelligent Systems",
    desc: "Integrate intelligence into your business workflows.",
    features: ["AI Chatbots", "Predictive Analytics", "Smart Monitoring", "AI-Powered Dashboards", "Automated Insights", "Computer Vision"],
  },
  {
    icon: Cog,
    title: "Business Automation Systems",
    desc: "Remove manual processes and increase efficiency.",
    features: ["Workflow Automation", "WhatsApp Automation", "CRM Automation", "Invoice Automation", "Payment Integration", "API Integration"],
  },
  {
    icon: Server,
    title: "Cloud & Infrastructure",
    desc: "Reliable backend architecture for scaling products.",
    features: ["AWS / GCP / Azure", "Firebase / Supabase", "Secure Auth", "Role-Based Access", "Data Encryption", "Performance Optimization"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end product engineering — from mobile apps to cloud infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card gradient-border p-6 group hover:glow-box transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
              <ul className="space-y-1.5">
                {service.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
