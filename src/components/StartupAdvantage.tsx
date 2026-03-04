import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Users } from "lucide-react";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const metrics = [
  {
    icon: TrendingUp,
    title: "3x Faster Time to Market",
    desc: "Our agile methodology and pre-built modules mean your product launches 3x faster than traditional agencies.",
  },
  {
    icon: DollarSign,
    title: "50% Lower Development Cost",
    desc: "Lean teams, reusable architecture, and automation-first approach keeps your budget lean without compromising quality.",
  },
  {
    icon: Users,
    title: "Built for 10x Growth",
    desc: "Every system we build is architected to handle 10x your current load — so scaling never means rebuilding.",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring & Support",
    desc: "Post-launch, we monitor uptime, performance, and security around the clock with automated alerts.",
  },
];

const StartupAdvantage = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Startup Advantage</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Built for Startups That Scale</h2>
            <p className="text-muted-foreground max-w-2xl">
              We understand the startup game — speed, cost, and scalability matter more than anything else.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <LottieAnimation
              url={LOTTIE_URLS.startup}
              className="w-full max-w-xs ml-auto"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 flex gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <m.icon size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartupAdvantage;
