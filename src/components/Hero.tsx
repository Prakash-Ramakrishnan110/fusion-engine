import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingUp, Users, Zap, Shield, Activity, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const AnimatedCounter = ({ target, duration = 2, prefix = "", suffix = "" }: { target: number; duration?: number; prefix?: string; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    const unsubscribe = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsubscribe(); };
  }, [target]);

  return <span>{display}</span>;
};

const kpis = [
  { label: "Active Users", value: 12847, suffix: "", icon: Users, trend: "+23%", color: "text-primary" },
  { label: "API Calls / mo", value: 2.4, suffix: "M", icon: Zap, trend: "+18%", color: "text-primary" },
  { label: "Uptime", value: 99.9, suffix: "%", icon: Shield, trend: "SLA", color: "text-emerald-400" },
  { label: "Latency", value: 42, suffix: "ms", prefix: "< ", icon: Activity, trend: "p99", color: "text-amber-400" },
];

const barData = [40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88];
const lineData = [20, 35, 30, 50, 45, 65, 55, 70, 60, 78, 72, 85];

const Hero = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
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

          {/* Right - Interactive KPI Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass-card gradient-border p-5 glow-box">
              {/* Title bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <span className="ml-3 text-xs text-muted-foreground font-body">dashboard.fusionengine.dev</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe size={12} className="text-primary/60" />
                  <span className="text-[10px] text-primary/70 font-medium">LIVE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    className="bg-secondary/50 rounded-lg p-3 cursor-pointer hover:bg-secondary/70 transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <kpi.icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                        <TrendingUp size={9} /> {kpi.trend}
                      </span>
                    </div>
                    <div className={`text-xl font-bold ${kpi.color}`}>
                      {kpi.suffix === "M" ? (
                        <AnimatedCounter target={2} suffix=".4M" duration={2} />
                      ) : kpi.suffix === "%" ? (
                        <AnimatedCounter target={99} suffix=".9%" duration={2.5} />
                      ) : kpi.label === "Latency" ? (
                        <AnimatedCounter target={42} prefix="< " suffix="ms" duration={1.5} />
                      ) : (
                        <AnimatedCounter target={kpi.value} duration={2} />
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Interactive Bar Chart */}
              <div className="bg-secondary/50 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">System Performance</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="w-2 h-2 rounded-sm bg-primary/60" /> Throughput
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="w-2 h-2 rounded-sm bg-emerald-400/60" /> Efficiency
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-24 relative">
                  {barData.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 relative flex flex-col items-center"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {hoveredBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-7 bg-card border border-border rounded px-2 py-0.5 text-[10px] text-foreground whitespace-nowrap z-10 shadow-lg"
                        >
                          {h}% · {lineData[i]}%
                        </motion.div>
                      )}
                      {/* Efficiency line dot */}
                      <motion.div
                        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 z-10"
                        style={{ bottom: `${lineData[i]}%` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                      />
                      {/* Bar */}
                      <motion.div
                        className={`w-full rounded-t cursor-pointer transition-colors ${hoveredBar === i ? 'bg-primary/90' : 'bg-primary/50'}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: "easeOut" }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <span key={m} className="text-[8px] text-muted-foreground/60 flex-1 text-center">{m}</span>
                  ))}
                </div>
              </div>

              {/* Bottom stats strip */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "99.9% Uptime", icon: "🟢" },
                  { label: "256-bit Encrypted", icon: "🔐" },
                  { label: "Auto-Scaling", icon: "⚡" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="bg-secondary/50 rounded-lg p-2.5 text-center hover:bg-secondary/70 transition-colors cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs mb-0.5">{item.icon}</div>
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
