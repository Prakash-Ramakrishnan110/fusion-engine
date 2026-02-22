import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build.{" "}
              <span className="text-primary glow-text">Automate.</span>{" "}
              Scale.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Fusion Engine Technology builds high-performance digital systems for businesses that want to grow faster with scalable apps, intelligent automation, and SaaS platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 glow-box"
              >
                Start a Project
                <ArrowRight size={18} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-medium text-base hover:bg-secondary transition-all hover:scale-105"
              >
                Explore Services
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass-card gradient-border p-6 glow-box">
              {/* Mock dashboard */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="ml-3 text-xs text-muted-foreground font-body">dashboard.fusionengine.dev</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-secondary/50 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Active Users</div>
                    <div className="text-2xl font-bold text-primary">12,847</div>
                    <div className="text-xs text-primary/70 mt-1">↑ 23% this month</div>
                  </div>
                  <div className="flex-1 bg-secondary/50 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">API Calls</div>
                    <div className="text-2xl font-bold">2.4M</div>
                    <div className="text-xs text-primary/70 mt-1">↑ 18% this month</div>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-3">System Performance</div>
                  <div className="flex items-end gap-1 h-20">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-primary/60 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["99.9% Uptime", "< 50ms Latency", "256-bit Encrypted"].map((text) => (
                    <div key={text} className="bg-secondary/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
