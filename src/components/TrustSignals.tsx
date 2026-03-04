import React from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Award, Shield } from "lucide-react";

const TrustSignals = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "98%",
      label: "Get Funded",
      description: "Startups that raise their next round"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Founder Rating",
      description: "Average satisfaction score"
    },
    {
      icon: Award,
      value: "75+",
      label: "Startups Launched",
      description: "Successful MVPs and platforms"
    },
    {
      icon: Shield,
      value: "$0",
      label: "Upfront Cost",
      description: "Pay only when you see results"
    }
  ];

  const testimonials = [
    {
      quote: "Fusion Engine took our concept and delivered a fully functional MVP in 12 days. We closed our seed round 2 months later. Game changer!",
      author: "Sarah Chen",
      role: "CEO, QuickStart AI",
      result: "Raised $2.5M seed round"
    },
    {
      quote: "They're not just developers, they're technical co-founders. Our user growth went from 100 to 10,000 in 6 months. Incredible partnership!",
      author: "Raj Patel",
      role: "Founder, DataFlow",
      result: "100x user growth in 6 months"
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

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-card to-secondary/20 rounded-xl p-6 border border-border"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-primary">{testimonial.result}</div>
                </div>
              </div>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-blue-500" />
              ISO 27001 Certified
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500" />
              Top Rated Agency
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
