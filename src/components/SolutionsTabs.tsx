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
    title: "Launch Your MVP in 14 Days",
    desc: "From idea to market-ready product in just 2 weeks. Our startup-focused development framework gets you to customers faster with proven tech stacks and scalable architecture.",
    cta: "Start Building Now",
    ctaLink: "/contact",
    learnMore: "/process",
    lottieUrl: LOTTIE_URLS.coding,
    testimonial: {
      quote: "We went from concept to paying customers in 3 weeks. Fusion Engine's speed is unmatched in the startup ecosystem.",
      name: "Alex Kumar",
      role: "Founder, QuickStart AI",
    },
    related: ["MVP Development", "Rapid Prototyping"],
  },
  {
    id: "automate",
    label: "Automate",
    icon: Brain,
    title: "Scale Operations with AI",
    desc: "Automate everything from customer support to data analysis. Our AI agents work 24/7 so your lean team can focus on growth and product innovation.",
    cta: "Explore Automation",
    ctaLink: "/services",
    learnMore: "/products",
    lottieUrl: LOTTIE_URLS.automation,
    testimonial: {
      quote: "Our support costs dropped 80% while customer satisfaction increased. The AI automation transformed our business model.",
      name: "Maya Patel",
      role: "CEO, SaaScale",
    },
    related: ["AI Chatbots", "Workflow Automation"],
  },
  {
    id: "secure",
    label: "Secure",
    icon: Shield,
    title: "Enterprise Security for Startups",
    desc: "Bank-level security that builds investor confidence. SOC 2 compliance, data encryption, and security audits included — no enterprise pricing required.",
    cta: "View Security Features",
    ctaLink: "/why-us",
    learnMore: "/services",
    lottieUrl: LOTTIE_URLS.security,
    testimonial: {
      quote: "We passed our enterprise security audit on the first try. Fusion Engine's security-first approach closed our biggest deals.",
      name: "David Lee",
      role: "CTO, SecureFlow",
    },
    related: ["SOC 2 Compliance", "Data Protection"],
  },
];

const SolutionsTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tab = tabs[activeTab];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto">
            Everything Your Startup Needs to{" "}
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
                    {t.label.toLowerCase()}
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
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-8 text-lg"
        >
          Stop wasting time on technical decisions. Focus on your customers while we handle the engineering that gets you funded.
        </motion.p>

        {/* Tab buttons */}
        <div className="flex justify-center gap-2 mb-8">
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
            className="grid lg:grid-cols-2 gap-8 items-start"
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
                className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md"
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
