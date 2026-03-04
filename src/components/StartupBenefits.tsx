import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Users, Zap } from "lucide-react";

const StartupBenefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Launch in 14 Days",
      description: "From idea to MVP in just 2 weeks. Our proven framework accelerates your time to market."
    },
    {
      icon: Users,
      title: "Dedicated Team",
      description: "Get a full-stack development team focused exclusively on your startup's success."
    },
    {
      icon: Zap,
      title: "Scale Ready",
      description: "Built with enterprise-grade architecture that grows with your user base."
    },
    {
      icon: CheckCircle,
      title: "Risk-Free Trial",
      description: "Start with a paid pilot. Only continue if you're 100% satisfied with the results."
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Startups Choose <span className="text-primary">Fusion Engine</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We understand startup challenges because we've been there. Our approach is designed for speed, quality, and growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold text-primary">50+</span>
              <span className="text-muted-foreground">Startups Launched</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Join successful founders who trusted us with their vision
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StartupBenefits;
