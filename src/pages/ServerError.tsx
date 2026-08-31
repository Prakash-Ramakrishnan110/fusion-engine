import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ServerCrash, RefreshCw, Home, LifeBuoy } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";

const ServerError = () => {
  usePageMeta("500 Internal Server Error", "💥");

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 text-destructive mb-6 shadow-inner">
            <ServerCrash size={40} />
          </div>

          <span className="text-xs font-bold text-destructive uppercase tracking-widest block mb-2">
            UX State: 500 Internal Server Error
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Something went wrong
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Our servers encountered an unexpected hiccup. Our engineering team has been notified and is looking into it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <RefreshCw size={18} />
              <span>Retry Page</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all border border-border"
            >
              <Home size={18} />
              <span>Back Home</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LifeBuoy size={14} className="text-primary" />
            <span>Need urgent help?</span>
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contact Tech Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerError;
