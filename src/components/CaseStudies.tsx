import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const caseStudies = [
  {
    title: "Local Business Website",
    industry: "Retail",
    result: "50% increase in customer inquiries",
    desc: "Built a professional website with online booking system, contact forms, and social media integration.",
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
    <section id="case-studies" className="py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp size={14} />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
              Proven <span className="text-primary italic">Results</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">
              We've helped founders transform napkin sketches into market-leading platforms. Here's a glimpse into our recent impact.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:flex justify-end"
          >
            <LottieAnimation
              url={LOTTIE_URLS.growth}
              className="w-full max-w-sm"
            />
          </motion.div>
        </div>

        <div className="space-y-10">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card group"
            >
              <div className="grid md:grid-cols-3 gap-0">
                <div className="md:col-span-2 p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-widest">
                      {cs.industry}
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp size={14} /> {cs.result}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    {cs.title}
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">The Challenge</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{cs.challenge}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">The Solution</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{cs.solution}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-50/50 dark:bg-slate-900/30 p-8 md:p-12 flex flex-col justify-between border-l border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Key Performance</h4>
                    <div className="space-y-6">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="group/metric">
                          <div className="text-3xl font-black text-primary transition-transform group-hover/metric:scale-105 origin-left tabular-nums">{m.value}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-widest">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800"
                  >
                    <Link
                      to="/contact"
                      className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors group/link"
                    >
                      View Full Build Details
                      <ArrowUpRight size={18} className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                    </Link>
                  </motion.div>
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
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg font-medium">
            Ready to become our next <span className="text-primary font-bold italic tracking-tight">Success Story?</span>
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-[1.02]"
          >
            Start Your Build Now <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
