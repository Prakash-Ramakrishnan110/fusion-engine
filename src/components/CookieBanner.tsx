import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Check, Settings, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "fusion_cookie_consent_v1";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [functionalConsent, setFunctionalConsent] = useState(true);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Delay display slightly so it doesn't obstruct initial paint
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (type: "all" | "essential" | "custom") => {
    const consentPayload = {
      essential: true,
      analytics: type === "all" ? true : type === "essential" ? false : analyticsConsent,
      functional: type === "all" ? true : type === "essential" ? false : functionalConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentPayload));
    setShowBanner(false);
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50"
        >
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-5 shadow-2xl text-foreground">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Cookie size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Cookie Preferences</h4>
                  <p className="text-xs text-muted-foreground">GDPR & ePrivacy Compliant</p>
                </div>
              </div>
              <button
                onClick={() => saveConsent("essential")}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              We use cookies to improve navigation, analyze site performance, and customize your experience. Read our{" "}
              <Link to="/cookies" className="text-primary underline font-medium">
                Cookie Policy
              </Link>{" "}
              for full details.
            </p>

            {/* Expanded Preferences Drawer */}
            {showPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 mb-4 pt-3 border-t border-border"
              >
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <div>
                    <span className="font-semibold block">Essential Cookies</span>
                    <span className="text-[11px] text-muted-foreground">Required for core functionality</span>
                  </div>
                  <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">Required</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <div>
                    <span className="font-semibold block">Analytics & Telemetry</span>
                    <span className="text-[11px] text-muted-foreground">Anonymous usage measurement</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <div>
                    <span className="font-semibold block">Functional Settings</span>
                    <span className="text-[11px] text-muted-foreground">Remembers dark mode & preferences</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={functionalConsent}
                    onChange={(e) => setFunctionalConsent(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => saveConsent("all")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
              >
                <Check size={14} />
                <span>Accept All</span>
              </button>

              {!showPreferences ? (
                <button
                  onClick={() => setShowPreferences(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-all border border-border"
                >
                  <Settings size={14} />
                  <span>Customize</span>
                </button>
              ) : (
                <button
                  onClick={() => saveConsent("custom")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-all border border-border"
                >
                  <ShieldCheck size={14} />
                  <span>Save Choices</span>
                </button>
              )}

              <button
                onClick={() => saveConsent("essential")}
                className="text-xs text-muted-foreground hover:text-foreground underline px-2 py-2"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
