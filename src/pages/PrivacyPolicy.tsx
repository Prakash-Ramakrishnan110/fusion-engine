import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { ShieldCheck, Lock, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  usePageMeta("Privacy Policy", "🔒");

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
              <Lock size={14} />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Fusion Engine Technology is committed to protecting your privacy and security.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" size={20} />
                <span>1. Information We Collect</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you use our website, fill out inquiry forms, or communicate with us, we may collect information such as your name, email address, phone number, company name, and project specifications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <FileText className="text-primary" size={20} />
                <span>2. How We Use Your Information</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use the information collected solely for:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Responding to technical consultation requests and providing project quotes.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Delivering customized web, mobile, and cloud software development services.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>Improving site security, user experience, and storing preference cookies.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Lock className="text-primary" size={20} />
                <span>3. Data Protection & Sharing</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We strictly do not sell, rent, or trade your personal data to any third parties. All project details shared with us remain strictly confidential under NDA standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" size={20} />
                <span>4. Contact Information</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions regarding our Privacy Policy or data handling, please contact us directly at <a href="mailto:fusionenginetechnology@gmail.com" className="text-primary font-semibold hover:underline">fusionenginetechnology@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
