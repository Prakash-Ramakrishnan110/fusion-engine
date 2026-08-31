import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { RefreshCw, DollarSign, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  usePageMeta("Refund & Cancellation Policy", "💳");

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
              <RefreshCw size={14} />
              <span>Billing & Satisfaction Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Refund & Cancellation <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. Clear and transparent rules regarding project milestone refunds, retainer cancellations, and service guarantees.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm">
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Clock className="text-primary" size={20} />
                <span>1. Service Cancellation</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clients may cancel ongoing development retainers or recurring maintenance contracts by providing a 14-day written notice to <a href="mailto:fusionenginetechnology@gmail.com" className="text-primary font-semibold hover:underline">fusionenginetechnology@gmail.com</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <DollarSign className="text-primary" size={20} />
                <span>2. Milestone Payments & Refund Terms</span>
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="p-3.5 rounded-lg bg-secondary/40 border border-border/60">
                  <strong className="text-foreground font-semibold">Pre-Kickoff Deposit:</strong> 100% refundable if requested within 48 hours of payment before any architectural discovery or coding work has commenced.
                </li>
                <li className="p-3.5 rounded-lg bg-secondary/40 border border-border/60">
                  <strong className="text-foreground font-semibold">Active Milestone Work:</strong> Once milestone deliverables (designs, code commits, deployment builds) are signed off, completed milestone payments are non-refundable.
                </li>
                <li className="p-3.5 rounded-lg bg-secondary/40 border border-border/60">
                  <strong className="text-foreground font-semibold">Unperformed Milestones:</strong> Any advance payments for unstarted future project phases will be refunded in full within 5-7 business days.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <AlertTriangle className="text-primary" size={20} />
                <span>3. Non-Refundable Items</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Third-party API subscriptions, domain registrations, SSL certificates, cloud infrastructure hosting fees (AWS, Vercel, GCP), and specialized plugin licenses purchased on behalf of the client are non-refundable.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" size={20} />
                <span>4. Dispute Resolution</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We take customer satisfaction seriously. If you are dissatisfied with a project deliverable, we provide an immediate code review and remediation sprint at no extra charge before any formal cancellation is processed.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
