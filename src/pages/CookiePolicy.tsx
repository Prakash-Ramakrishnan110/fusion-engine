import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { Cookie, ShieldCheck, CheckCircle2, Settings } from "lucide-react";
import { motion } from "framer-motion";

const CookiePolicy = () => {
  usePageMeta("Cookie Policy", "🍪");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Cookie size={14} />
              <span>Cookie Transparency & Consent</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Cookie <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Learn how Fusion Engine Technology uses cookies and local storage to personalize and secure your experience.
            </p>
          </motion.div>

          {/* Policy Content */}
          <div className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" size={20} />
                <span>1. What Are Cookies?</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cookies are small text files placed on your device by websites you visit. They help the site remember your preferences, keep you logged in, and collect telemetry to improve site performance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Settings className="text-primary" size={20} />
                <span>2. Types of Cookies We Use</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Essential Cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    Required for core website security, session persistence, and basic navigation. Cannot be disabled.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Performance & Analytics</h3>
                  <p className="text-xs text-muted-foreground">
                    Helps us understand visitor engagement, page response speeds, and bug detection via telemetry.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Functional Preferences</h3>
                  <p className="text-xs text-muted-foreground">
                    Stores custom settings such as theme mode (light/dark) and onboarding choices.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Security Cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    Protects user forms against Cross-Site Request Forgery (CSRF) and bot attacks.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <CheckCircle2 className="text-primary" size={20} />
                <span>3. Managing Cookie Preferences</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can change your consent settings at any time using our on-site cookie banner or through your browser settings. Blocking essential cookies may affect site functionality.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                For questions regarding cookies or data privacy, reach out to us at{" "}
                <a href="mailto:fusionenginetechnology@gmail.com" className="text-primary font-semibold hover:underline">
                  fusionenginetechnology@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
