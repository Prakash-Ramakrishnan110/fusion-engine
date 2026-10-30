import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Users, 
  Award, 
  Zap, 
  Layers, 
  Laptop, 
  Clock, 
  HelpCircle,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  GitPullRequest,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import CareerApplicationModal from "@/components/CareerApplicationModal";
import StartupIndiaDocsModal from "@/components/StartupIndiaDocsModal";
import { usePortal } from "@/portal/context/PortalContext";

interface JobOpening {
  id: string;
  title: string;
  department: "engineering" | "sales" | "product";
  departmentLabel: string;
  engagement: string;
  compensationModel: string;
  location: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
}

const jobOpenings: JobOpening[] = [
  {
    id: "fullstack-developer",
    title: "Full-Stack Developer (SaaS Platforms)",
    department: "engineering",
    departmentLabel: "Engineering",
    engagement: "Project Contractor / Full-Time",
    compensationModel: "Salary Disbursed Upon Project Deliverable Completion",
    location: "Remote (India)",
    summary: "Architect and develop modern web platforms, digital catalog systems, secure checkout workflows, and scalable administrative dashboards.",
    responsibilities: [
      "Develop responsive React/TypeScript frontend modules and clean REST/GraphQL APIs",
      "Design PostgreSQL relational schemas with robust data integrity and transactions",
      "Implement role-based access control, secure authentication, and session handling",
      "Submit clean GitHub pull requests with comprehensive commit histories and test coverage"
    ],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS", "Git PRs"]
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer (UI/UX & Web Apps)",
    department: "engineering",
    departmentLabel: "Engineering",
    engagement: "Project Contractor / Part-Time",
    compensationModel: "Salary Disbursed Upon Frontend Deliverable Sign-off",
    location: "Remote (India)",
    summary: "Craft pixel-perfect, responsive web interfaces, interactive dashboards, and micro-animations for high-growth digital applications.",
    responsibilities: [
      "Convert Figma / UI wireframes into modular, accessible Tailwind/React components",
      "Optimize web vital metrics, SEO structure, and client-side performance",
      "Integrate state management and robust client-side validation"
    ],
    skills: ["React.js", "TailwindCSS", "Framer Motion", "TypeScript", "Responsive UI"]
  },
  {
    id: "backend-api-developer",
    title: "Backend & Database Engineer",
    department: "engineering",
    departmentLabel: "Engineering",
    engagement: "Project Contractor",
    compensationModel: "Salary Disbursed Upon API & Database Completion",
    location: "Remote (India)",
    summary: "Engineer secure, high-throughput RESTful APIs, payment gateway integrations, background workers, and PostgreSQL database migrations.",
    responsibilities: [
      "Architect robust authentication, JWT/session management, and data encryption",
      "Develop transaction audit trails, reporting engines, and invoice generation",
      "Write automated API integration tests and documentation"
    ],
    skills: ["Node.js / Express", "PostgreSQL", "Prisma/Drizzle", "Docker", "REST APIs"]
  },
  {
    id: "telecaller-sales-executive",
    title: "Telecaller & SaaS Lead Specialist",
    department: "sales",
    departmentLabel: "Sales & BD",
    engagement: "Sales Partner / Commission Model",
    compensationModel: "Performance Payout per Qualified Lead + Conversion Commission",
    location: "Remote (India)",
    summary: "Reach out to prospective commercial business owners, retail managers, and enterprise decision-makers across India to introduce software solutions and book product demos.",
    responsibilities: [
      "Connect with prospective businesses daily using structured consultative scripts",
      "Verify business details, decision-maker contact, and document software pain points",
      "Schedule live product demonstrations for our technical solutions team",
      "Maintain organized CRM call logs, objections, and follow-up schedules"
    ],
    skills: ["B2B Telecalling", "Cold Calling", "Objection Handling", "Hindi / English / Tamil", "CRM Entry"]
  },
  {
    id: "technical-project-manager",
    title: "Technical Project Lead",
    department: "product",
    departmentLabel: "Product & Delivery",
    engagement: "Project Retainer",
    compensationModel: "Disbursed Upon Milestone Sprint Acceptance",
    location: "Remote (India)",
    summary: "Bridge product requirements, sprint milestones, developer code reviews, and quality sign-offs across enterprise software builds.",
    responsibilities: [
      "Deconstruct product requirement documents into sprint tasks and milestone criteria",
      "Review GitHub pull requests and test coverage before recommending milestone acceptance",
      "Coordinate unblocking of developers and report directly to the Founder"
    ],
    skills: ["Sprint Planning", "GitHub Workflows", "Architecture Review", "Agile / Scrum"]
  }
];

export const CareersPage: React.FC = () => {
  usePageMeta("Careers & Opportunities", "🚀");
  const { recruitmentSettings } = usePortal();

  const [activeFilter, setActiveFilter] = useState<"all" | "engineering" | "sales" | "product">("all");
  const [selectedRole, setSelectedRole] = useState("Full-Stack Developer");
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [docsDefaultTab, setDocsDefaultTab] = useState("contractor");
  const [singleDocMode, setSingleDocMode] = useState(false);

  const filteredJobs = activeFilter === "all" 
    ? jobOpenings 
    : jobOpenings.filter((j) => j.department === activeFilter);

  const handleApplyClick = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setAppModalOpen(true);
  };

  const openDocsModalWithTab = (tab: string, single: boolean = false) => {
    setDocsDefaultTab(tab);
    setSingleDocMode(single);
    setDocsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        {/* Standard Hero Section with Lottie Animation, RGB Background & 3D Tilt */}
        <Hero
          badgeText="Careers • Startup India & MSME Registered"
          title1="Build Modern Software."
          title2="Earn with 100% Transparency."
          description={
            <>
              Join our engineering and sales ecosystem. Build modern digital products, enterprise platforms, and scalable web solutions with defined deliverables, clear acceptance criteria, and guaranteed salary disbursement upon completion.
            </>
          }
          primaryCtaText="Explore Open Positions"
          primaryCtaLink="#openings"
          onPrimaryCtaClick={() => {
            const el = document.getElementById("openings");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              handleApplyClick("Full-Stack Developer");
            }
          }}
          secondaryCtaText="Policies & Operational Guide"
          onSecondaryCtaClick={() => openDocsModalWithTab("contractor")}
          lottieUrl={LOTTIE_URLS.startup}
          features={[
            { icon: Code2, title: "Completion Payouts", desc: "Salary paid upon deliverable sign-off" },
            { icon: PhoneCall, title: "Verified Performance", desc: "Qualified leads & conversions" },
            { icon: ShieldCheck, title: "Startup India & MSME", desc: "DPIIT legal protection" },
            { icon: Zap, title: "5-Day Reviews", desc: "Prompt review & bank payouts" }
          ]}
          trustText1="UDYAM-TN-04-0044558 Registered"
          trustText2="Escrow & Milestone Protection"
        />

        {/* Our Two Transparent Hiring Tracks */}
        <section className="py-20 bg-secondary/15 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Hiring Principles</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-4">Our Two Hiring & Compensation Tracks</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We believe in total upfront clarity. Software developer salary is provided upon the successful completion, testing, and acceptance of agreed project deliverables, while sales compensation is disbursed for verified qualified leads and conversions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Track 1: Developer Milestone & Completion Track */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold">Software Developers & Engineers</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      Salary Paid After Completion
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Developers are engaged with clear specifications and deliverables documented in advance. Full salary is disbursed directly to your account immediately after the project deliverables are verified and accepted.
                  </p>

                  <div className="space-y-3 mb-6 bg-secondary/40 rounded-2xl p-4 border border-border">
                    <div className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5 text-primary" /> Delivery & Payment Lifecycle
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                        <span><strong>Upfront Agreement:</strong> Project scope, technical deliverables, and salary are documented before commencing work.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                        <span><strong>Build & Submit:</strong> Developer implements features and submits GitHub Pull Requests with automated test proofs.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                        <span><strong>5-Day Verification:</strong> Technical team reviews functionality and merges clean code against acceptance criteria.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                        <span><strong>Salary Disbursement:</strong> Agreed payment is disbursed via Bank Transfer / UPI accompanied by an auditable voucher.</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Zero delayed retainers or unagreed scope creep.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Prompt 5-day review window with actionable technical feedback.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Protected by standard Startup India Independent Contractor terms.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto text-xs font-semibold gap-1.5 cursor-pointer rounded-xl border-primary/25 hover:bg-primary/10 transition-all"
                    onClick={() => openDocsModalWithTab("contractor", true)}
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    View Contractor Agreement
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleApplyClick("Full-Stack Developer")}
                    className="w-full sm:w-auto font-semibold gap-1.5 cursor-pointer rounded-xl shadow-xs"
                  >
                    Apply as Developer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Track 2: Telecaller & Sales Specialist Track */}
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold">Telecallers & Business Development</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Verified Performance Model
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Sales executives reach prospective enterprise and commercial clients. Payouts are calculated transparently based on verified qualified leads and successful customer onboarding.
                  </p>

                  <div className="space-y-3 mb-6 bg-secondary/40 rounded-2xl p-4 border border-border">
                    <div className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Lead Qualification & Payout Framework
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                        <span><strong>B2B Outreach:</strong> Connect with business decision-makers and identify digital solution pain points.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                        <span><strong>Lead Qualification:</strong> Book product demonstration with confirmed business contact details.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                        <span><strong>Weekly CRM Audit:</strong> Verification team confirms lead validity and approves records in CRM.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                        <span><strong>Performance Disbursement:</strong> Verified lead payouts and conversion commissions released on schedule.</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Clear qualification criteria: verifiable business & confirmed owner interest.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Weekly audit cycles with transparent CRM approval dashboard.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Pitch scripts, product collateral, and objection training provided.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto text-xs font-semibold gap-1.5 cursor-pointer rounded-xl border-emerald-500/25 hover:bg-emerald-500/10 transition-all"
                    onClick={() => openDocsModalWithTab("telecaller", true)}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    View Telecaller Policy
                  </Button>
                  {recruitmentSettings?.salesHiringOpen === false ? (
                    <Button 
                      size="sm" 
                      disabled
                      className="w-full sm:w-auto font-semibold gap-1.5 rounded-xl bg-muted text-muted-foreground opacity-75 cursor-not-allowed shadow-none"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Applications Closed (Positions Filled)
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyClick("Telecaller / Sales Specialist")}
                      className="w-full sm:w-auto font-semibold gap-1.5 cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      Apply as Telecaller
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Professional Hiring Lifecycle */}
        <section className="py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Operational Journey</span>
              <h2 className="text-3xl font-bold tracking-tight mt-1">From Application to Payout in 4 Steps</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Our standardized process ensures you always know what to deliver, when it is reviewed, and when salary is released.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Apply & Screen",
                  desc: "Submit your profile and GitHub/portfolio. Technical team reviews code within 48 hours."
                },
                {
                  step: "02",
                  title: "Agreement & Scope",
                  desc: "Review and sign the Startup India compliant contract with agreed deliverables and salary terms."
                },
                {
                  step: "03",
                  title: "Execute & Submit",
                  desc: "Build features with clean commits and submit Pull Requests with test verification proofs."
                },
                {
                  step: "04",
                  title: "Verify & Get Paid",
                  desc: "Review completed within 5 days followed by prompt salary disbursement via Bank / UPI voucher."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-2xl p-6 relative flex flex-col justify-between hover:border-primary/40 transition-all">
                  <div>
                    <span className="text-2xl font-extrabold text-primary/40 font-mono">{item.step}</span>
                    <h3 className="text-base font-bold text-foreground mt-2 mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className="py-20 bg-background" id="openings">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs uppercase font-bold text-primary tracking-wider">Current Openings</span>
                <h2 className="text-3xl font-bold tracking-tight mt-1">Explore Open Positions</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We are hiring across engineering, sales, and product delivery.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Roles" },
                  { id: "engineering", label: "Engineering" },
                  { id: "sales", label: "Sales & BD" },
                  { id: "product", label: "Product" }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.id as any)}
                    className="text-xs font-semibold cursor-pointer transition-all"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {filteredJobs.map((job) => {
                const isJobLocked =
                  job.department === "sales"
                    ? !recruitmentSettings?.salesHiringOpen
                    : !recruitmentSettings?.engineeringHiringOpen;

                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-4 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {job.departmentLabel}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {job.engagement}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          {job.location}
                        </span>
                        {isJobLocked && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Applications Closed (Positions Filled)
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {job.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((skill) => (
                          <span key={skill} className="text-[11px] bg-secondary/60 text-foreground px-2.5 py-1 rounded-md font-mono">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs font-medium text-foreground/80 flex items-center gap-1.5 pt-1">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        <span><strong>Compensation:</strong> {job.compensationModel}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                      <Button 
                        disabled={isJobLocked}
                        onClick={() => handleApplyClick(job.title)}
                        className={`px-6 font-semibold gap-1.5 transition-all ${
                          isJobLocked
                            ? "bg-muted text-muted-foreground opacity-75 cursor-not-allowed shadow-none"
                            : "cursor-pointer hover:bg-primary/90 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {isJobLocked ? (
                          <>
                            <Lock className="w-4 h-4" /> Applications Closed
                          </>
                        ) : (
                          <>
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDocsModalWithTab(job.department === "sales" ? "telecaller" : "contractor")}
                        className="text-xs cursor-pointer hover:bg-secondary transition-all"
                      >
                        View Terms & Policy
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Legal Governance & Operational Guidelines Section */}
        <section className="py-20 bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Governance & Compliance</span>
              <h2 className="text-3xl font-bold tracking-tight mt-1">Legally Sound. Transparent Operational Governance.</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Our workforce operations, technical milestone sign-offs, and data security are governed by formal legal policies and operational guidelines aligned with Startup India (DPIIT) and MSME standards.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Technical Contractor Agreement & Policy",
                  desc: "Protects contributors with clear scopes, 5-day review windows, defect correction terms, and completion salary protection.",
                  tab: "contractor"
                },
                {
                  title: "Telecaller & Sales Engagement Policy",
                  desc: "Establishes transparent criteria for verified qualified leads, conversion bonuses, and duplicate audits.",
                  tab: "telecaller"
                },
                {
                  title: "Proprietary Information & NDA Policy",
                  desc: "Binds both parties under the Indian Information Technology Act (2000) for source code and asset safety.",
                  tab: "nda"
                },
                {
                  title: "Intellectual Property & Code Assignment",
                  desc: "Assigns complete worldwide rights and copyright of code to Fusion Engine Technology upon payout.",
                  tab: "ip"
                },
                {
                  title: "Milestone Verification & Sign-Off Voucher",
                  desc: "Auditable sign-off sheet documenting GitHub commits, PR merges, test proofs, and bank UTRs.",
                  tab: "voucher"
                },
                {
                  title: "Operational Best Practices & Execution Guide",
                  desc: "Actionable engineering, sales, and founder guidelines for high-quality software execution.",
                  tab: "suggestions"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <FileCheck2 className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-6 justify-between text-xs font-semibold rounded-xl border-primary/25 bg-primary/5 hover:bg-primary hover:text-primary-foreground group transition-all cursor-pointer shadow-xs"
                    onClick={() => openDocsModalWithTab(item.tab, true)}
                  >
                    <span>View Official Document</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Have Questions?</span>
              <h2 className="text-3xl font-bold tracking-tight mt-1">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "When is software developer salary disbursed?",
                  a: "Developer salary/compensation is disbursed immediately upon successful completion, testing, and approval of the agreed project deliverables. Once your GitHub Pull Request and test proofs pass review within 5 business days, payment is sent directly via Bank Transfer or UPI with an official voucher."
                },
                {
                  q: "How is telecaller performance compensation calculated?",
                  a: "Telecaller compensation is calculated on a regular weekly audit cycle for verified qualified business leads that meet our written qualification standards (operating business, verified owner contact, confirmed interest) plus additional commissions on converted paying clients."
                },
                {
                  q: "Can college students, freelancers, or contractors apply?",
                  a: "Yes! We welcome enthusiastic developers, UI/UX designers, and sales specialists. All that matters is your work ethic, GitHub code commits, communication speed, and execution reliability."
                },
                {
                  q: "Do I sign an agreement before starting work?",
                  a: "Yes. In accordance with Startup India & MSME best practices, every team member acknowledges our standard Milestone Contractor Agreement, NDA, and IP Assignment before access to internal code repositories is granted."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-base text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Join the Fusion Engine Team?
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base max-w-2xl mx-auto mb-8">
              Submit your profile and portfolio today. Our technical leadership reviews every application within 48 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => handleApplyClick("General Application")}
                className="font-bold px-8 shadow-lg cursor-pointer hover:bg-white transition-all"
              >
                Apply In 2 Minutes
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => openDocsModalWithTab("contractor")}
                className="bg-transparent border-white/40 text-white hover:bg-white/10 cursor-pointer transition-all"
              >
                Explore Policies & Guidelines
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <CareerApplicationModal
        open={appModalOpen}
        onOpenChange={setAppModalOpen}
        defaultRole={selectedRole}
        onViewPolicies={openDocsModalWithTab}
      />

      <StartupIndiaDocsModal
        open={docsModalOpen}
        onOpenChange={setDocsModalOpen}
        defaultTab={docsDefaultTab}
        singleDocOnly={singleDocMode}
      />

      <Footer />
    </div>
  );
};

export default CareersPage;
