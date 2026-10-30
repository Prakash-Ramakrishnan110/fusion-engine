import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Award, 
  FileCode, 
  CheckCircle2, 
  Lightbulb, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Layers,
  FileCheck2
} from "lucide-react";
import { toast } from "sonner";

interface StartupIndiaDocsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
  singleDocOnly?: boolean;
}

const governanceDocuments = [
  {
    id: "contractor",
    title: "Technical Contractor Agreement",
    category: "Technical Engagement Agreement",
    icon: FileCode,
    summary: "Deliverable and milestone-based agreement. Developer salary is disbursed immediately upon verified completion of agreed project deliverables.",
    content: `INDEPENDENT CONTRACTOR AGREEMENT (DELIVERABLE & MILESTONE-BASED)

Organization: FUSION ENGINE TECHNOLOGY
Udyam Registration: UDYAM-TN-04-0044558 | Registered MSME & Startup India Entity
Headquarters: Palacode, Dharmapuri, Tamil Nadu - 636808, India

1. ENGAGEMENT AND SERVICES
Company hereby engages Contractor, and Contractor agrees to perform software development services for Company's digital platforms, SaaS products, and enterprise applications in accordance with the project specifications agreed in Schedule A.

2. COMPENSATION & SALARY DISBURSEMENT POLICY
• Compensation is strictly deliverable-based and agreed upon in writing prior to work commencement.
• Salary / milestone payouts are disbursed upon complete delivery, functional testing, and verification of agreed project deliverables.
• Schedule of Deliverables:
  - Milestone 1: Approved Architecture, System Design & Database Schema — Disbursed upon sign-off.
  - Milestone 2: Backend APIs, Core Business Logic & Authentication — Disbursed upon sign-off.
  - Milestone 3: Frontend Implementation & User Workflows — Disbursed upon sign-off.
  - Milestone 4: End-to-End QA, Automated Tests, Bug Fixes & Handover — Disbursed upon sign-off.

3. ACCEPTANCE AND VERIFICATION PROCEDURE
• Contractor submits completed work accompanied by GitHub Pull Request references, commit hashes, test results, and live staging demonstrations.
• Company reviews deliverables against the written acceptance criteria within 5 business days.
• Once marked 'Approved', payment is disbursed directly via Bank Transfer / UPI accompanied by an auditable payment voucher.

4. INDEPENDENT CONTRACTOR STATUS
Contractor operates as an independent technical professional. Contractor is responsible for all applicable statutory taxes and filings.

5. INTELLECTUAL PROPERTY & CODE RIGHTS
All code, repositories, workflows, architecture diagrams, and technical documentation constitute 'Work Made for Hire' and are exclusively assigned to Fusion Engine Technology upon deliverable disbursement.

6. CONFIDENTIALITY & REPOSITORY SECURITY
Contractor agrees to maintain strict confidentiality regarding all proprietary source code, database credentials, API secrets, and company intellectual property for a period of 36 months.`
  },
  {
    id: "telecaller",
    title: "Telecaller Policy Agreement",
    category: "Sales & BD Governance",
    icon: Award,
    summary: "Clear qualification guidelines, weekly audit cycles, and performance-based compensation without arbitrary withholding.",
    content: `TELECALLER LEAD ENGAGEMENT & COMPENSATION POLICY

Organization: FUSION ENGINE TECHNOLOGY
Domain: Enterprise SaaS, Web Platforms & Custom Software Solutions

1. PURPOSE & ENGAGEMENT
Telecaller is engaged as an independent sales executive to reach business decision-makers, introduce Company's software products, and schedule qualified product demonstrations.

2. TRANSPARENT COMPENSATION MODELS
• Model A (Default): Agreed compensation per Accepted Qualified Lead.
• Model B: Performance commission upon prospect onboarding & converted subscription.
• Model C: Base retainer combined with performance incentives (mutually agreed in Annexure 1).

3. STRICT QUALIFICATION CRITERIA
A lead qualifies for compensation ONLY when:
1. Prospect is an operating, verifiable commercial business establishment.
2. Contact is confirmed as the Owner, General Manager, or authorized IT decision-maker.
3. Telecaller records verified business requirements, notes, and confirmed demonstration timing.
4. Lead is verified as genuine and is NOT a duplicate, unreachable number, or fabricated record.

4. AUDIT & FRAUD PREVENTION
• The system automatically checks prospective phone numbers against existing company records.
• Rejected or invalid leads receive zero payout. Any intentional submission of fake records results in immediate disengagement.

5. REGULAR PAYOUT SCHEDULE
Leads are audited and approved on a weekly cycle. Verified lead compensation is disbursed directly to Telecaller's registered UPI/Bank account.`
  },
  {
    id: "nda",
    title: "Proprietary Information & NDA Policy",
    category: "Proprietary Information",
    icon: ShieldCheck,
    summary: "DPIIT-aligned Non-Disclosure Agreement protecting source code, database architectures, and business secrets.",
    content: `NON-DISCLOSURE & PROPRIETARY INFORMATION UNDERTAKING

Under the Indian Contract Act (1872) & Information Technology Act (2000)

1. PROPRIETARY INFORMATION
Includes all source code repositories, software designs, client lists, API keys, algorithmic logic, unreleased product blueprints, and operational records belonging to Fusion Engine Technology.

2. OBLIGATIONS OF RECIPIENT
• Maintain confidentiality with the same degree of care as reasonable professional standards dictate.
• Use confidential information solely for performing authorized project deliverables.
• Not disclose, export, replicate, or share proprietary assets with any unauthorized third parties.

3. REPOSITORY HYGIENE & CREDENTIAL RETURN
Upon project completion or disengagement, Contributor agrees to delete local database dumps, revoke personal development keys, and confirm all work resides in company-controlled GitHub repositories.

4. ENFORCEABILITY
These obligations remain legally binding during association and for 3 years following project handover.`
  },
  {
    id: "ip",
    title: "Intellectual Property Assignment",
    category: "Intellectual Property",
    icon: FileText,
    summary: "Comprehensive assignment ensuring all code, UI components, and software assets are legally owned by Fusion Engine Technology.",
    content: `INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

1. COMPLETE ASSIGNMENT
The Contributor hereby unconditionally assigns, transfers, and conveys to Fusion Engine Technology all worldwide rights, titles, copyrights, trade secrets, patents, and intellectual property rights in all code, UI components, and database schemas created during engagement.

2. MORAL RIGHTS WAIVER
To the fullest extent permitted by law, the Contributor irrevocably waives all moral rights in the work.

3. ORIGINALITY & LICENSING WARRANTY
The Contributor warrants that all code provided is original work and does not incorporate unauthorized third-party proprietary code or restrictive copyleft open-source licenses (such as GPL/AGPL) without prior written consent.`
  },
  {
    id: "voucher",
    title: "Milestone Sign-Off Voucher",
    category: "Audit & Finance Record",
    icon: CheckCircle2,
    summary: "Auditable sign-off and payment voucher linking GitHub PRs, test records, and bank transaction references.",
    content: `MILESTONE ACCEPTANCE & PAYMENT VOUCHER
Voucher ID: FET-MS-2026-XXXX

Project Name: [Designated Software Product / Platform]
Contributor / Team Member: [Full Name]
Milestone Deliverable: [Deliverable Name / Scope Completed]
Agreed Compensation: [Amount as per written contract]

VERIFICATION RECORD:
[x] Deliverables meet predefined acceptance criteria
[x] GitHub commits & Pull Requests verified and merged
[x] Code builds cleanly with passing test suites
[x] Staging deployment reviewed and verified
[x] Walkthrough & documentation completed

APPROVAL & DISBURSEMENT:
Approved by: Prakash Ramakrishnan (Founder / Technical Lead)
Date of Sign-off: [DD-MM-YYYY]
Payment Status: Payment Disbursed (Bank Ref / UTR: [Reference Number])`
  },
  {
    id: "suggestions",
    title: "Operational Best Practices Guide",
    category: "Engineering & Sales Guidelines",
    icon: Lightbulb,
    summary: "Professional best practice guidelines and execution standards for developers, telecallers, and founders.",
    content: `STARTUP INDIA & MSME COMPLIANCE: OPERATIONAL EXECUTION GUIDE

1. GUIDELINES FOR SOFTWARE DEVELOPERS:
• Milestone Clarity: Always ensure the acceptance criteria, user stories, and required test cases are documented in the task description before writing code.
• Commit Hygiene: Write clear, semantic commit messages (e.g., 'feat: add table reservation API' or 'fix: resolve JWT expiration issue').
• Pull Request Protocol: Include video/screenshot walkthroughs and test verification outputs in your Pull Requests. This accelerates code review from 5 days to under 24 hours.
• Defect Correction Window: Good engineering practices include addressing bug fixes discovered within 14 days of handover without extra friction.

2. GUIDELINES FOR TELECALLERS & SALES PARTNERS:
• Quality Over Quantity: 10 deeply qualified leads with confirmed decision-maker meetings are infinitely more valuable than 50 unverified phone numbers.
• Accurate CRM Notes: Always record the specific pain points mentioned by the client (e.g., 'Current system crashes during peak hours', 'Needs cloud invoice sync').
• Ethical Representation: Represent Fusion Engine Technology transparently. Never promise features or pricing not officially approved in the product collateral.

3. GUIDELINES FOR PROJECT MANAGERS & FOUNDERS:
• Escrow & Timely Payouts: Disburse compensation within 3-5 business days of verified acceptance. This builds immense trust and attracts top-tier engineering talent.
• Transparent Revisions: If a submission does not meet criteria, provide actionable feedback points rather than vague rejection notes.
• Document Storage: Keep signed agreements, NDA acknowledgments, and milestone vouchers organized in the company document vault.`
  }
];

export const StartupIndiaDocsModal: React.FC<StartupIndiaDocsModalProps> = ({
  open,
  onOpenChange,
  defaultTab = "contractor",
  singleDocOnly = false
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSingleDoc, setIsSingleDoc] = useState(singleDocOnly);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
    setIsSingleDoc(singleDocOnly);
  }, [defaultTab, open, singleDocOnly]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    toast.success("Document text copied to clipboard!");
    setTimeout(() => setCopied(null), 2500);
  };

  const currentIndex = governanceDocuments.findIndex((d) => d.id === activeTab);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentDoc = governanceDocuments[safeCurrentIndex];
  const CurrentIcon = currentDoc.icon;

  const handlePrev = () => {
    const prevIndex = (safeCurrentIndex - 1 + governanceDocuments.length) % governanceDocuments.length;
    setActiveTab(governanceDocuments[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (safeCurrentIndex + 1) % governanceDocuments.length;
    setActiveTab(governanceDocuments[nextIndex].id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl lg:max-w-6xl w-[96vw] sm:w-[94vw] h-[94dvh] sm:h-[88vh] max-h-[94dvh] sm:max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl sm:rounded-3xl">
        {/* Desktop Header (>= md) */}
        <DialogHeader className="hidden md:flex p-5 lg:p-6 pb-4 border-b border-border bg-secondary/25 shrink-0 pr-12">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                {isSingleDoc ? <CurrentIcon className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-bold">
                    {isSingleDoc ? currentDoc.title : "Legal Governance & Operational Guidelines"}
                  </DialogTitle>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {isSingleDoc ? currentDoc.category : "DPIIT & MSME Standards"}
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {isSingleDoc
                    ? currentDoc.summary
                    : "Official operational standards, deliverable-based salary policies, and execution guidelines for Fusion Engine Technology contributors."}
                </DialogDescription>
              </div>
            </div>

            {isSingleDoc && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSingleDoc(false)}
                className="text-xs font-semibold gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 shrink-0 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                Browse All 6 Documents
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Mobile Header (< md): Clean, compact, zero overlap, full title visibility */}
        <div className="md:hidden flex flex-col border-b border-border bg-secondary/30 p-3 shrink-0 pr-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 truncate">
                {currentDoc.category}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!isSingleDoc && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-lg border border-border bg-background hover:bg-secondary flex items-center justify-center text-foreground cursor-pointer shadow-xs"
                    title="Previous Document"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-7 h-7 rounded-lg border border-border bg-background hover:bg-secondary flex items-center justify-center text-foreground cursor-pointer shadow-xs"
                    title="Next Document"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleCopy(currentDoc.content, currentDoc.id)}
                className="h-7 px-2 rounded-lg border border-border bg-background hover:bg-secondary flex items-center gap-1 text-[11px] font-semibold text-foreground cursor-pointer shadow-xs ml-0.5"
                title="Copy Document"
              >
                {copied === currentDoc.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Document Title or Dropdown Selector on Mobile */}
          {isSingleDoc ? (
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <h2 className="text-xs font-bold text-foreground leading-snug">
                {currentDoc.title}
              </h2>
              <button
                type="button"
                onClick={() => setIsSingleDoc(false)}
                className="text-[11px] font-semibold text-primary underline shrink-0 cursor-pointer"
              >
                All Documents
              </button>
            </div>
          ) : (
            <div className="relative mt-0.5">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-background border border-primary/30 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer pr-8 leading-tight"
              >
                {governanceDocuments.map((doc, idx) => (
                  <option key={doc.id} value={doc.id}>
                    {idx + 1}. {doc.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Desktop Document Navigation Sidebar (>= md) */}
          {!isSingleDoc && (
            <aside className="hidden md:flex w-72 lg:w-84 shrink-0 bg-secondary/20 border-r border-border p-3 sm:p-4 flex-col gap-2 overflow-y-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 flex items-center justify-between shrink-0 mb-1">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                  Official Documents
                </span>
                <span className="bg-primary/10 text-primary border border-primary/20 font-bold px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                  6 Documents
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {governanceDocuments.map((doc) => {
                  const Icon = doc.icon;
                  const isActive = activeTab === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActiveTab(doc.id)}
                      className={`w-full text-left p-2.5 px-3 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-card/70 hover:bg-card border-border/80 text-foreground hover:border-primary/40 hover:shadow-xs"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs leading-snug">
                          {doc.title}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {doc.category}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primary-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Document Content Reader Pane */}
          <main className="flex-1 min-w-0 flex flex-col p-2.5 sm:p-6 overflow-hidden bg-card/15">
            {/* Desktop Reader Header (>= md) */}
            <div className="hidden md:flex items-center justify-between pb-3 mb-3 border-b border-border shrink-0 gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {currentDoc.title}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 shrink-0">
                    {currentDoc.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentDoc.summary}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(currentDoc.content, currentDoc.id)}
                className="flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer rounded-xl hover:bg-secondary border-border"
              >
                {copied === currentDoc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Document</span>
                  </>
                )}
              </Button>
            </div>

            {/* Document Content View - Optimized for Maximum Screen Space on Mobile */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-background rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-border shadow-inner font-mono text-[11px] sm:text-xs md:text-[13px] leading-relaxed text-foreground select-all whitespace-pre-wrap break-words">
              {currentDoc.content}
            </div>
          </main>
        </div>

        {/* Modal Footer */}
        <div className="p-2 sm:p-4 bg-secondary/35 border-t border-border flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="hidden sm:inline">Official Policy Framework • Fusion Engine Technology (UDYAM-TN-04-0044558)</span>
            <span className="sm:hidden truncate">UDYAM-TN-04-0044558 • Registered</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onOpenChange(false)} 
            className="cursor-pointer font-semibold hover:bg-secondary rounded-xl text-xs h-7 sm:h-8 px-3 shrink-0"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartupIndiaDocsModal;
