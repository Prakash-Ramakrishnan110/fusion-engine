import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, CheckCircle, Cookie, Mail, Phone, MessageSquare, Clock, Laptop, Smartphone, Cpu, Cloud } from "lucide-react";
import emailjs from '@emailjs/browser';

const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    service: "Web Platform",
    projectScope: "MVP Build (2-4 Weeks)",
    message: ""
  });

  useEffect(() => {
    // Check if user has already made a decision (submitted or cancelled)
    const onboardStatus = localStorage.getItem("fusion_onboard_status");
    const cookieConsent = localStorage.getItem("fusion_cookie_consent");

    if (!onboardStatus && !cookieConsent) {
      // Delay popup by 2 seconds for smooth page load experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveCookieConsent = (status: "accepted" | "dismissed" | "submitted") => {
    localStorage.setItem("fusion_onboard_status", status);
    localStorage.setItem("fusion_cookie_consent", "true");
    document.cookie = `fusion_onboard=${status}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
  };

  const handleCancel = () => {
    saveCookieConsent("dismissed");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const SERVICE_ID = 'service_vtbrgi5';
      const TEMPLATE_ID = 'template_p8i38d6';
      const PUBLIC_KEY = 'QNzyFmRohhj8Soht0';

      emailjs.init(PUBLIC_KEY);

      const templateParams = {
        from_name: formData.name,
        from_email: formData.contact,
        from_phone: formData.contact,
        service_requested: formData.service,
        project_scope: formData.projectScope,
        message: formData.message || `Onboarding inquiry for ${formData.service} (${formData.projectScope})`,
        to_email: 'fusionenginetechnology@gmail.com',
        time: new Date().toLocaleString()
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setSubmitted(true);
      saveCookieConsent("submitted");

      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error("EmailJS submission error:", err);
      setSubmitted(true);
      saveCookieConsent("submitted");
      setTimeout(() => setIsOpen(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={handleCancel} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Gradient Header */}
          <div className="bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/20 p-5 border-b border-border/40 relative">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              title="Close & save preferences"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Welcome to Fusion Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Let's Build Your <span className="text-primary">Next Project</span>
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Tell us your idea or project scope for a free roadmap & quote in 5 mins.
            </p>

            {/* Quick Contact Info Strip */}
            <div className="mt-3.5 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <a href="mailto:fusionenginetechnology@gmail.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail size={13} className="text-primary shrink-0" />
                <span>fusionenginetechnology@gmail.com</span>
              </a>
              <a href="https://wa.me/916369884331" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                <MessageSquare size={13} className="text-green-500 shrink-0" />
                <span className="font-semibold">+91 63698 84331</span>
              </a>
            </div>
          </div>

          {/* Form / Submitted Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-xl font-bold text-foreground">Inquiry Received!</h4>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Thank you! Our technical lead will reach out to you within <span className="text-foreground font-semibold">5 mins</span>.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service Selection Tabs */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    What are you looking to build?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Web Platform", icon: Laptop },
                      { name: "Mobile App", icon: Smartphone },
                      { name: "AI Solution", icon: Cpu },
                      { name: "Cloud / SaaS", icon: Cloud },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormData({ ...formData, service: item.name })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          formData.service === item.name
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background/80 text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        <item.icon size={16} />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Contact Fields */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex"
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Email or Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Brief Message (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Project Details / Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your requirements or timeline..."
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Cookie & Response Time Guarantee */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-secondary/30 text-[11px] text-muted-foreground border border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-500 shrink-0" />
                    <span>Response guaranteed in <strong className="text-foreground">5 mins</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cookie size={13} className="text-primary shrink-0" />
                    <span>Cookie preference saved</span>
                  </div>
                </div>

                {/* Actions: Submit OR Cancel/Decline */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 rounded-xl border border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground font-semibold text-xs transition-colors"
                  >
                    No thanks, skip & save cookies
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? "Submitting..." : "Get Free Quote"}</span>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
