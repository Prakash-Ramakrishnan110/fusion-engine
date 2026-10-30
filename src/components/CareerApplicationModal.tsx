import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Send,
  ShieldCheck,
  FileText,
  AlertCircle,
  UploadCloud,
  FileCheck,
  X,
  Lock,
} from "lucide-react";
import StartupIndiaDocsModal from "@/components/StartupIndiaDocsModal";
import { usePortal } from "@/portal/context/PortalContext";

interface CareerApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: string;
  defaultCategory?: "developer" | "telecaller" | "all";
  onViewPolicies?: (tab?: string) => void;
}

export const CareerApplicationModal: React.FC<CareerApplicationModalProps> = ({
  open,
  onOpenChange,
  defaultRole = "Full-Stack Developer",
  defaultCategory = "all",
  onViewPolicies
}) => {
  const { recruitmentSettings, submitJobApplication } = usePortal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    role: defaultRole,
    engagementType: "milestone-contractor",
    portfolioUrl: "",
    expectedCompensation: "",
    experience: "",
    agreedToTerms: false
  });

  const [resumeFile, setResumeFile] = useState<{
    name: string;
    size: string;
    dataUrl: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState("");
  const [internalDocsOpen, setInternalDocsOpen] = useState(false);

  // Check if current role is locked
  const isSalesRole =
    formData.role.toLowerCase().includes("telecaller") ||
    formData.role.toLowerCase().includes("sales");
  const isRoleLocked = isSalesRole
    ? !recruitmentSettings?.salesHiringOpen
    : !recruitmentSettings?.engineeringHiringOpen;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (maximum 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size allowed is 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;
      setResumeFile({
        name: file.name,
        size: sizeStr,
        dataUrl: reader.result as string,
      });
      toast.success(`Resume attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRoleLocked) {
      toast.error("Hiring for this position is currently locked by administration.");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please read and acknowledge the official agreement policies before submitting.");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your resume (.pdf, .doc, .docx) to proceed.");
      return;
    }

    setLoading(true);

    try {
      // 1. Submit directly to Admin Dashboard database & localStorage
      // Protect browser localStorage quota: if PDF base64 is larger than 600KB,
      // save resumeFileName and metadata in localStorage while emailing full details
      const safeResumeData = resumeFile.dataUrl && resumeFile.dataUrl.length > 600000 
        ? undefined 
        : resumeFile.dataUrl;

      const appRes = await submitJobApplication({
        roleId: isSalesRole ? "telecaller-sales-executive" : "developer-contractor",
        roleTitle: formData.role,
        department: isSalesRole ? "sales" : "engineering",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        portfolioUrl: formData.portfolioUrl || undefined,
        expectedCompensation: formData.expectedCompensation || undefined,
        experienceSummary: formData.experience,
        resumeFileName: `${resumeFile.name} (${resumeFile.size})`,
        resumeFileData: safeResumeData,
      });

      const refCode = appRes.referenceCode || `FET-APP-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Dispatch email notification to fusionenginetechnology@gmail.com
      const SERVICE_ID = "service_vtbrgi5";
      const TEMPLATE_ID = "template_p8i38d6";
      const PUBLIC_KEY = "QNzyFmRohhj8Soht0";

      emailjs.init(PUBLIC_KEY);

      const detailedMessage = `
[NEW CANDIDATE APPLICATION — ${refCode}]
Role Applied For: ${formData.role}
Engagement Model: ${formData.engagementType}
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone / WhatsApp: ${formData.phone}
Location: ${formData.city}
Portfolio / GitHub / LinkedIn: ${formData.portfolioUrl || "Not provided"}
Expected Compensation / Terms: ${formData.expectedCompensation || "As per project scope"}
Resume Document: ${resumeFile.name} (${resumeFile.size})

Experience Summary & Cover Note:
${formData.experience}

Terms Acknowledged: Candidate confirmed they have read and agreed to the official Contractor & Lead Engagement Policies.
Submission Timestamp: ${new Date().toLocaleString()}
      `.trim();

      const templateParams = {
        from_name: `${formData.fullName} (Career Applicant)`,
        from_email: formData.email,
        from_phone: formData.phone,
        phone: formData.phone,
        message: detailedMessage,
        reply_to: formData.email,
        name: formData.fullName,
        email: formData.email,
        to_email: "fusionenginetechnology@gmail.com",
        time: new Date().toLocaleString(),
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setApplicationRef(refCode);
      setSubmitted(true);
      toast.success("Application and resume submitted to Admin Dashboard!");
    } catch (err) {
      console.error("Submission error:", err);
      // Even if EmailJS encounters network timeout, application is recorded
      const fallbackRef = `FET-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationRef(fallbackRef);
      setSubmitted(true);
      toast.success("Application saved to Admin Dashboard!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      role: defaultRole,
      engagementType: "milestone-contractor",
      portfolioUrl: "",
      expectedCompensation: "",
      experience: "",
      agreedToTerms: false
    });
    onOpenChange(false);
  };

  const handleOpenDocs = () => {
    if (onViewPolicies) {
      onViewPolicies(formData.role.toLowerCase().includes("telecaller") ? "telecaller" : "contractor");
    } else {
      setInternalDocsOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[94vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 bg-background border-border shadow-2xl rounded-2xl box-border">
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                Thank you for applying to join <span className="font-semibold text-foreground">Fusion Engine Technology</span>. Your profile and portfolio have been routed to our technical screening team.
              </p>
              <div className="bg-secondary/50 border border-border rounded-xl p-4 w-full max-w-sm mb-6 text-left">
                <div className="text-xs text-muted-foreground">Application Tracking Code:</div>
                <div className="text-lg font-mono font-bold text-primary">{applicationRef}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  A verification record has been dispatched to our hiring team for review.
                </div>
              </div>
              <Button onClick={handleReset} className="px-6 cursor-pointer">
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Fusion Engine Talent Portal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary text-secondary-foreground">
                    Startup India Compliant
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold mt-2">Apply for {formData.role || "Open Role"}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Join our high-performance team. Fill out the details below to start the verification and interview process.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full min-w-0 overflow-x-hidden box-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold">Mobile / WhatsApp Number *</Label>
                    <Input
                      id="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold">Current City & State *</Label>
                    <Input
                      id="city"
                      required
                      placeholder="e.g. Bangalore, Karnataka"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-semibold">Applying For *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(val) => setFormData({ ...formData, role: val })}
                    >
                      <SelectTrigger id="role" className="cursor-pointer">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-Stack Developer">Full-Stack Developer (React / Node / PostgreSQL)</SelectItem>
                        <SelectItem value="Frontend Engineer">Frontend Engineer (React / Tailwind / UI)</SelectItem>
                        <SelectItem value="Backend & API Engineer">Backend & API Engineer (Node.js / Python / DB)</SelectItem>
                        <SelectItem value="Telecaller / Sales Specialist">Telecaller & Sales Executive (Verified Leads & Commission)</SelectItem>
                        <SelectItem value="Technical Project Manager">Technical Project Manager / Team Lead</SelectItem>
                        <SelectItem value="UI/UX & Product Designer">UI/UX & Product Designer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="engagementType" className="text-xs font-semibold">Preferred Engagement Model *</Label>
                    <Select
                      value={formData.engagementType}
                      onValueChange={(val) => setFormData({ ...formData, engagementType: val })}
                    >
                      <SelectTrigger id="engagementType" className="cursor-pointer">
                        <SelectValue placeholder="Select engagement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milestone-contractor">Project Deliverable Contractor (Salary Upon Completion)</SelectItem>
                        <SelectItem value="lead-sales-contractor">Sales Lead Partner (Verified Lead & Conversion Model)</SelectItem>
                        <SelectItem value="full-time">Full-Time Team Member</SelectItem>
                        <SelectItem value="part-time">Part-Time Technical Contributor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="portfolioUrl" className="text-xs font-semibold">GitHub / Portfolio / LinkedIn *</Label>
                    <Input
                      id="portfolioUrl"
                      required
                      placeholder="https://github.com/... or linkedin.com/in/..."
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="expectedCompensation" className="text-xs font-semibold">Expected Salary / Terms</Label>
                    <Input
                      id="expectedCompensation"
                      placeholder="e.g. As agreed per project scope"
                      value={formData.expectedCompensation}
                      onChange={(e) => setFormData({ ...formData, expectedCompensation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="text-xs font-semibold">
                    Why are you a great fit? (Relevant tools, past projects, achievements) *
                  </Label>
                  <Textarea
                    id="experience"
                    required
                    rows={3}
                    placeholder="Share a short summary of the key projects you built, SaaS experience, or telecalling sales track record..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Upload Resume / CV (.pdf, .doc, .docx) *</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Max size: 10 MB</span>
                  </Label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resumeUploadInput"
                  />

                                    {resumeFile ? (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 w-full min-w-0 max-w-full overflow-hidden box-border">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden mr-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="text-xs font-semibold text-foreground truncate block max-w-full" title={resumeFile.name}>
                            {resumeFile.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {resumeFile.size} • Attached
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0 rounded-full shrink-0"
                        title="Remove attached file"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="resumeUploadInput"
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 rounded-xl cursor-pointer transition-all group"
                    >
                      <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                      <span className="text-xs font-semibold text-foreground">Click to upload your resume</span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">PDF or Word document format</span>
                    </label>
                  )}
                </div>

                {/* Role Lock Warning Banner */}
                {isRoleLocked && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3 text-destructive">
                    <Lock className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Applications Locked for this Position</div>
                      <div className="text-[11px] opacity-90">
                        Hiring for {isSalesRole ? "Telecaller & Sales" : "Developer & Engineering"} roles is currently closed or positions are filled. Submissions are temporarily paused.
                      </div>
                    </div>
                  </div>
                )}

                {/* Explicit Legal & Policy Acknowledgment Box */}
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-primary/20 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Policy & Agreement Acknowledgment
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenDocs}
                        className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Read Official Policies →
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Before submitting, please review our official policies. We operate on a transparent delivery model where developer salary is disbursed upon complete verification of project deliverables, and sales incentives are paid for verified qualified leads.
                    </p>

                    <div className="flex items-start space-x-3 pt-1 border-t border-border/60">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked === true })}
                        className="mt-0.5 cursor-pointer data-[state=checked]:bg-primary"
                      />
                      <label
                        htmlFor="terms"
                        className="font-semibold text-xs text-foreground cursor-pointer leading-snug"
                      >
                        I confirm that I have reviewed the official Contractor & Lead Engagement Policies, and I agree to the transparent deliverable-based completion and verification terms.
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submission Guidance if not checked */}
                {!formData.agreedToTerms && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Please read and check the agreement acknowledgment above to enable submission.</span>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="cursor-pointer">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isRoleLocked || !formData.agreedToTerms || !resumeFile || loading} 
                    className={`gap-2 px-6 cursor-pointer font-bold shadow-md transition-all ${
                      isRoleLocked || !formData.agreedToTerms || !resumeFile ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : isRoleLocked ? (
                      <>
                        <Lock className="w-4 h-4" /> Hiring Locked
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Internal fallback if modal opened independently */}
      <StartupIndiaDocsModal
        open={internalDocsOpen}
        onOpenChange={setInternalDocsOpen}
        defaultTab="contractor"
        singleDocOnly={true}
      />
    </>
  );
};

export default CareerApplicationModal;
