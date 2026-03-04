import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const caseStudies = [
  {
    title: "Multi-Vendor E-commerce Platform",
    industry: "Retail",
    result: "300% increase in vendor onboarding speed",
    desc: "Built a scalable marketplace with real-time inventory sync, automated vendor payouts, and AI-powered product recommendations.",
    challenge: "The client had a manual vendor onboarding process that took 2 weeks per vendor. They needed a self-service platform that could handle thousands of vendors.",
    solution: "We built a fully automated onboarding flow with document verification, product catalog import, and integrated payment processing.",
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
    metrics: [
      { label: "Vendors Onboarded", value: "2,500+" },
      { label: "Monthly GMV", value: "$1.2M" },
      { label: "Onboarding Time", value: "< 24hrs" },
    ],
  },
  {
    title: "Fleet Monitoring System",
    industry: "Logistics",
    result: "40% reduction in fuel costs",
    desc: "Real-time GPS tracking, route optimization, and predictive maintenance alerts for a fleet of 500+ vehicles.",
    challenge: "The logistics company was losing money on inefficient routes, unauthorized vehicle usage, and unexpected breakdowns.",
    solution: "We deployed IoT-enabled GPS trackers with real-time dashboards, automated route optimization, and ML-based maintenance predictions.",
    tags: ["Flutter", "Firebase", "IoT", "Maps API"],
    metrics: [
      { label: "Vehicles Tracked", value: "500+" },
      { label: "Fuel Savings", value: "40%" },
      { label: "Downtime Reduced", value: "60%" },
    ],
  },
  {
    title: "School ERP Platform",
    industry: "Education",
    result: "Digitized operations for 50+ schools",
    desc: "End-to-end management system covering admissions, attendance, grading, fee collection, and parent communication.",
    challenge: "Schools were managing everything on paper and Excel sheets, leading to data loss, errors, and frustrated parents.",
    solution: "A comprehensive ERP with mobile apps for parents, web dashboards for admin, automated fee reminders, and WhatsApp notifications.",
    tags: ["Next.js", "Supabase", "WhatsApp API"],
    metrics: [
      { label: "Schools Using", value: "50+" },
      { label: "Students Managed", value: "25,000+" },
      { label: "Fee Collection", value: "95%" },
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
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Case Studies</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Real projects. Real results. Here's how we've helped businesses scale with technology.
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
              className="glass-card p-8 md:p-10 hover:shadow-lg transition-all duration-300"
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
                  <h3 className="text-2xl font-bold mb-4">{cs.title}</h3>
                  
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
