import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const caseStudies = [
  {
    title: "Multi-Vendor E-commerce Platform",
    industry: "Retail",
    result: "300% increase in vendor onboarding speed",
    desc: "Built a scalable marketplace with real-time inventory sync, automated vendor payouts, and AI-powered product recommendations.",
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Fleet Monitoring System",
    industry: "Logistics",
    result: "40% reduction in fuel costs",
    desc: "Real-time GPS tracking, route optimization, and predictive maintenance alerts for a fleet of 500+ vehicles.",
    tags: ["Flutter", "Firebase", "IoT", "Maps API"],
  },
  {
    title: "School ERP Platform",
    industry: "Education",
    result: "Digitized operations for 50+ schools",
    desc: "End-to-end management system covering admissions, attendance, grading, fee collection, and parent communication.",
    tags: ["Next.js", "Supabase", "WhatsApp API"],
  },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24 border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Case Studies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real projects. Real results. Here's how we've helped businesses scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card gradient-border p-6 group hover:glow-box transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {cs.industry}
                </span>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">{cs.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{cs.desc}</p>
              <div className="text-sm font-semibold text-primary mb-4">{cs.result}</div>
              <div className="flex flex-wrap gap-2">
                {cs.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
