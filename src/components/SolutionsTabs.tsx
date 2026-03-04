import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Smartphone, Shield, Brain, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const tabs = [
  {
    id: "build",
    label: "Build",
    icon: Smartphone,
    title: "Build and scale digital products",
    desc: "From mobile apps to SaaS platforms — build production-ready products with modern architecture, CI/CD, and auto-scaling infrastructure. Ship in weeks, not months.",
    cta: "Start building now",
    ctaLink: "/services",
    learnMore: "/products",
    lottieUrl: LOTTIE_URLS.coding,
    testimonial: {
      quote: "Fusion Engine delivered our entire platform in 8 weeks — what our previous agency quoted 6 months for. The quality exceeded expectations.",
      name: "Arjun Mehta",
      role: "Founder, LogiTrack Solutions",
    },
    related: ["SaaS Starter Kit", "Mobile App Development"],
  },
  {
    id: "automate",
    label: "Automate",
    icon: Brain,
    title: "Automate operations with AI agents",
    desc: "Remove manual workflows with intelligent automation. From WhatsApp bots to predictive analytics — we make your operations run on autopilot with AI-powered systems.",
    cta: "Explore automation",
    ctaLink: "/services",
    learnMore: "/process",
    lottieUrl: LOTTIE_URLS.automation,
    testimonial: {
      quote: "The automation system reduced our manual processing time by 70%. Our team can now focus on strategy instead of repetitive tasks.",
      name: "Priya Sharma",
      role: "COO, EduManager",
    },
    related: ["Workflow Automation", "AI Chatbots"],
  },
  {
    id: "secure",
    label: "Secure",
    icon: Shield,
    title: "Secure and protect your systems",
    desc: "Enterprise-grade security baked into every product. 256-bit encryption, role-based access, audit logs, and compliance-ready infrastructure — protecting your business from day one.",
    cta: "View security features",
    ctaLink: "/why-us",
    learnMore: "/services",
    lottieUrl: LOTTIE_URLS.security,
    testimonial: {
      quote: "Bank-grade security without the enterprise price tag. Fusion Engine's security-first approach gives us complete peace of mind.",
      name: "Vikram Singh",
      role: "CTO, FinSecure",
    },
    related: ["256-bit Encryption", "RBAC Systems"],
  },
];

const SolutionsTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tab = tabs[activeTab];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto">
            Our engineering studio is the best place to{" "}
            <span className="block mt-2">
              {tabs.map((t, i) => (
                <span key={t.id}>
                  {i > 0 && <span className="text-muted-foreground"> · </span>}
                  <button
                    onClick={() => setActiveTab(i)}
                    className={`transition-colors duration-300 ${
                      activeTab === i ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label.toLowerCase()} your {t.id === "build" ? "products" : t.id === "automate" ? "operations" : "systems"}
                  </button>
                </span>
              ))}
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-lg"
        >
          Full-stack product engineering on one unified platform. We call it the startup engine.
        </motion.p>

        {/* Tab buttons */}
        <div className="flex justify-center gap-2 mb-12">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === i
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <t.icon size={16} className="inline mr-2" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left: Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{tab.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">{tab.desc}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  to={tab.ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
                >
                  {tab.cta} <ArrowRight size={16} />
                </Link>
                <Link
                  to={tab.learnMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-all"
                >
                  Learn more
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {tab.related.map((r) => (
                  <span key={r} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Lottie + Testimonial */}
            <div className="space-y-6">
              <LottieAnimation
                url={tab.lottieUrl}
                className="w-full max-w-xs mx-auto"
                style={{ height: 200 }}
              />
              <div className="glass-card p-6 relative">
                <Quote size={24} className="text-primary/20 mb-3" />
                <blockquote className="text-foreground leading-relaxed mb-4 text-base italic">
                  "{tab.testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground text-sm">{tab.testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{tab.testimonial.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SolutionsTabs;
