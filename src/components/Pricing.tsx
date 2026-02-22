import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
    ],
    highlighted: false,
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
    ],
    highlighted: true,
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
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Engagement Models</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing tailored to your project scope and business stage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card gradient-border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted ? "glow-box ring-1 ring-primary/30" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <div className="text-3xl font-bold mb-6 text-primary">{plan.price}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
