import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    desc: "For small businesses getting started with digital systems.",
    price: "Custom",
    features: [
      "Single Platform (Web or Mobile)",
      "Basic Admin Dashboard",
      "Standard Authentication",
      "Email Support",
      "3 Months Post-Launch Support",
      "Up to 5 Pages / Screens",
      "Basic Analytics Integration",
    ],
    highlighted: false,
    bestFor: "Small businesses & solopreneurs",
  },
  {
    name: "Growth",
    desc: "For scaling businesses that need automation and integrations.",
    price: "Custom",
    features: [
      "Web + Mobile Platform",
      "Advanced Admin Dashboard",
      "API Integrations",
      "Workflow Automation",
      "Priority Support",
      "6 Months Post-Launch Support",
      "Performance Monitoring",
      "CI/CD Pipeline Setup",
    ],
    highlighted: true,
    bestFor: "Growing companies & mid-size businesses",
  },
  {
    name: "Enterprise",
    desc: "For organizations that need full-scale digital infrastructure.",
    price: "Custom",
    features: [
      "Multi-Platform Development",
      "AI-Powered Features",
      "Custom Cloud Infrastructure",
      "Dedicated Project Manager",
      "SLA-Backed Support",
      "12 Months Post-Launch Support",
      "Security Compliance (GDPR/HIPAA)",
      "Auto-Scaling Infrastructure",
      "Custom Integrations",
    ],
    highlighted: false,
    bestFor: "Large organizations & enterprises",
  },
];

const faqs = [
  {
    q: "How do you price your projects?",
    a: "Every project is unique, so we provide custom pricing based on scope, complexity, and timeline. We start with a free consultation to understand your needs before providing a detailed quote.",
  },
  {
    q: "What's included in post-launch support?",
    a: "Post-launch support includes bug fixes, minor feature updates, performance monitoring, server maintenance, and priority email/call support from our engineering team.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Absolutely! We design systems with scalability in mind. You can start with the Starter plan and upgrade to Growth or Enterprise as your business grows — no rebuilds required.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, we offer flexible milestone-based payment plans. Typically 30% upfront, 40% at mid-project, and 30% on delivery. Custom arrangements are available for enterprise clients.",
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Engagement Models</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Flexible pricing tailored to your project scope and business stage. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted ? "ring-2 ring-primary shadow-lg" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full self-start mb-4 uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{plan.desc}</p>
              <p className="text-xs text-primary font-medium mb-6">Best for: {plan.bestFor}</p>
              <div className="text-4xl font-bold mb-6 text-primary">{plan.price}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`text-center py-3.5 rounded-xl font-semibold text-sm transition-all block ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-20"
        >
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-primary" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden"
              >
                <button
                  className="w-full text-left p-5 font-semibold flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className={`text-primary transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
