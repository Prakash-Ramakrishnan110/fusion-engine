import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingUp, Users, Zap, Shield, Activity, Globe, RefreshCw } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

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

const useLiveValue = (base: number, variance: number, interval: number) => {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue(base + Math.round((Math.random() - 0.3) * variance));
    }, interval);
    return () => clearInterval(id);
  }, [base, variance, interval]);
  return value;
};

const kpiConfigs = [
  { label: "Active Users", base: 12847, variance: 120, icon: Users, color: "text-primary" },
  { label: "API Calls / mo", base: 2400000, variance: 50000, icon: Zap, color: "text-primary" },
  { label: "Uptime", base: 999, variance: 0, icon: Shield, color: "text-emerald-400" },
  { label: "Latency", base: 42, variance: 8, icon: Activity, color: "text-amber-400" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const KPIDashboard = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"6m" | "12m">("12m");
  const [tick, setTick] = useState(0);

  // Live-updating bar data
  const [barData, setBarData] = useState([40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88]);
  const [lineData, setLineData] = useState([20, 35, 30, 50, 45, 65, 55, 70, 60, 78, 72, 85]);

  useEffect(() => {
    const id = setInterval(() => {
      setBarData(prev => prev.map(v => Math.min(100, Math.max(20, v + Math.round((Math.random() - 0.4) * 6)))));
      setLineData(prev => prev.map(v => Math.min(95, Math.max(15, v + Math.round((Math.random() - 0.4) * 5)))));
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const liveUsers = useLiveValue(12847, 120, 2000);
  const liveApi = useLiveValue(2400, 50, 2500);
  const liveLatency = useLiveValue(42, 8, 1800);

  const displayBars = timeRange === "6m" ? barData.slice(6) : barData;
  const displayLine = timeRange === "6m" ? lineData.slice(6) : lineData;
  const displayMonths = timeRange === "6m" ? months.slice(6) : months;

  const kpis = [
    { label: "Active Users", value: liveUsers, display: liveUsers.toLocaleString(), trend: "+23%", color: "text-primary", icon: Users },
    { label: "API Calls / mo", value: liveApi, display: `${(liveApi / 1000).toFixed(1)}M`, trend: "+18%", color: "text-primary", icon: Zap },
    { label: "Uptime", value: 99.9, display: "99.9%", trend: "SLA", color: "text-emerald-400", icon: Shield },
    { label: "Latency", value: liveLatency, display: `< ${liveLatency}ms`, trend: "p99", color: "text-amber-400", icon: Activity },
  ];

  return (
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
            <motion.div
              key={kpi.value}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className={`text-xl font-bold ${kpi.color}`}
            >
              {kpi.display}
            </motion.div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Bar Chart */}
      <div className="bg-secondary/50 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium">System Performance</span>
          <div className="flex items-center gap-2">
            {/* Time range toggle */}
            {(["6m", "12m"] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                  timeRange === range ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
            <motion.div
              animate={{ rotate: tick * 360 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw size={10} className="text-muted-foreground" />
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="w-2 h-2 rounded-sm bg-primary/60" /> Throughput
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="w-2 h-2 rounded-sm bg-emerald-400/60" /> Efficiency
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-24 relative">
          {displayBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 relative flex flex-col items-center"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {hoveredBar === i && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-7 bg-card border border-border rounded px-2 py-0.5 text-[10px] text-foreground whitespace-nowrap z-10 shadow-lg"
                >
                  {h}% · {displayLine[i]}%
                </motion.div>
              )}
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 z-10"
                style={{ bottom: `${displayLine[i]}%` }}
                animate={{ bottom: `${displayLine[i]}%` }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className={`w-full rounded-t cursor-pointer transition-colors ${hoveredBar === i ? 'bg-primary/90' : 'bg-primary/50'}`}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {displayMonths.map((m) => (
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
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <KPIDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
