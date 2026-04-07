import React from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Award, Shield } from "lucide-react";

const TrustSignals = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "100%",
      label: "Client Satisfaction",
      description: "Happy clients with our work"
    },
    {
      icon: Star,
      value: "5/5",
      label: "Quality Commitment",
      description: "Dedicated to excellence"
    },
    {
      icon: Award,
      value: "2025",
      label: "Company Established",
      description: "Fresh perspectives and innovation"
    },
    {
      icon: Shield,
      value: "$0",
      label: "Consultation Fee",
      description: "Free initial consultation"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-primary">Startup Founders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join the successful entrepreneurs who chose us to build their dreams
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="text-primary" size={32} />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm font-bold text-primary bg-yellow-100 px-3 py-1 rounded border-2 border-yellow-400">
              <Award className="w-4 h-4 text-yellow-600" />
              UDYAM REGISTERED
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
