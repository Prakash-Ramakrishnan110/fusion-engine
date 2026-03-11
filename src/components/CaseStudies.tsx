import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const caseStudies = [
  {
    title: "Local Business Website",
    industry: "Retail",
    result: "50% increase in customer inquiries",
    desc: "Built a professional website with online booking system, customer testimonials, and social media integration.",
    challenge: "The local business had no online presence and was losing customers to competitors with better digital visibility.",
    solution: "We created a modern, mobile-responsive website with contact forms, service galleries, and Google Maps integration.",
    tags: ["React", "Tailwind CSS", "EmailJS", "Vercel"],
    metrics: [
      { label: "Monthly Visitors", value: "500+" },
      { label: "Inquiry Increase", value: "50%" },
      { label: "Page Load Time", value: "< 2s" },
    ],
  },
  {
    title: "Small E-commerce Store",
    industry: "Retail",
    result: "Launched in 3 weeks with 20 products",
    desc: "Complete online store with product catalog, shopping cart, payment integration, and order management.",
    challenge: "Client wanted to sell products online but had limited budget and needed a quick launch.",
    solution: "We built a cost-effective e-commerce solution using modern tools with secure payment processing.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "AWS"],
    metrics: [
      { label: "Products Listed", value: "20+" },
      { label: "Launch Time", value: "3 weeks" },
      { label: "Conversion Rate", value: "2.5%" },
    ],
  },
  {
    title: "Service Booking Platform",
    industry: "Services",
    result: "Automated 90% of booking process",
    desc: "Online booking system with calendar integration, automated reminders, and customer management.",
    challenge: "Service provider was managing bookings manually through phone calls and messages, causing double bookings and missed appointments.",
    solution: "We developed an intuitive booking platform with real-time availability and automated notifications.",
    tags: ["React", "Node.js", "MongoDB", "Twilio"],
    metrics: [
      { label: "Bookings Automated", value: "90%" },
      { label: "No-Show Reduction", value: "75%" },
      { label: "Customer Satisfaction", value: "4.8/5" },
    ],
  },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Work</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">3 Projects Delivered</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              As a fresh startup, we're proud of every project we've delivered. Here's our journey so far.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <LottieAnimation
              url={LOTTIE_URLS.growth}
              className="w-full max-w-xs ml-auto"
            />
          </motion.div>
        </div>

        <div className="space-y-12">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 md:p-10 hover:shadow-lg transition-all duration-300"
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {cs.industry}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp size={12} className="text-primary" /> {cs.result}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{cs.title}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Challenge</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Solution</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cs.solution}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Metrics</h4>
                  {cs.metrics.map((m) => (
                    <div key={m.label} className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Want similar results for your business?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Start Your Success Story <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
