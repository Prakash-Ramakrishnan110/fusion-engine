import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { FileText, CheckCircle, Scale } from "lucide-react";
import { motion } from "framer-motion";

const TermsConditions = () => {
  usePageMeta("Terms & Conditions", "📜");

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
              <Scale size={14} />
              <span>Legal Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Welcome to Fusion Engine Technology. By accessing or using our services, you agree to comply with the following terms.
            </p>
          </motion.div>

          {/* Terms Content */}
          <div className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <FileText className="text-primary" size={20} />
                <span>1. Services & Deliverables</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fusion Engine Technology provides software engineering, web application development, mobile app development, SaaS, and cloud infrastructure services based on agreed scope statements and milestone contracts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <CheckCircle className="text-primary" size={20} />
                <span>2. Intellectual Property Rights</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upon full settlement of agreed project payments, all final custom source code, assets, and intellectual property developed for the client belong entirely to the client.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Scale className="text-primary" size={20} />
                <span>3. Guarantee & Support</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All software projects include a standard post-launch support period, bug-fix guarantees, and performance monitoring as defined in the client project agreement.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
