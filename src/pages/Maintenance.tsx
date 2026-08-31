import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, ShieldAlert, Mail, Clock } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";

const Maintenance = () => {
  usePageMeta("Scheduled Maintenance", "🛠️");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-6">
            <Clock size={14} className="animate-pulse" />
            <span>Scheduled System Upgrade</span>
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner mx-auto">
            <Wrench size={38} className="animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            We'll be back shortly!
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We are performing scheduled system maintenance and database optimizations to serve you better. Thank you for your patience!
          </p>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border text-left mb-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Estimated Downtime:</span>
              <span className="font-semibold text-foreground">~30 Minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">System Status:</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Database Upgrading
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:fusionenginetechnology@gmail.com"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95 text-sm"
            >
              <Mail size={16} />
              <span>Email Support</span>
            </a>

            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all border border-border text-sm"
            >
              <ShieldAlert size={16} />
              <span>Check Status</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
