import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { generateFreelancerAgreementText } from '../services/freelancerAgreementService';
import { JobApplication } from '../types';
import emailjs from '@emailjs/browser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Printer,
  AlertCircle,
  FileCheck,
  XCircle,
  ArrowDown,
  Check,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const REQUIRED_AFFIRMATION = 'I AGREE AND ACCEPT';

export const CandidateAgreementSignPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refCode = (searchParams.get('ref') || searchParams.get('id') || '').trim();
  const urlCandidateName = (searchParams.get('name') || '').trim();
  const urlCandidateEmail = (searchParams.get('email') || '').trim();
  const urlCandidateRole = (searchParams.get('role') || '').trim();

  const { applications, signCandidateAgreement, rejectCandidateAgreement } = usePortal();

  // Find candidate by reference code or ID (case-insensitive & trimmed)
  const existingCandidate = applications.find(
    (app) =>
      app.referenceCode.trim().toLowerCase() === refCode.toLowerCase() ||
      app.id.trim().toLowerCase() === refCode.toLowerCase()
  );

  // If candidate record not in this browser's localStorage, but refCode is provided,
  // construct a resolved candidate profile so the candidate can sign
  const fallbackCandidate: JobApplication | null = refCode
    ? {
        id: refCode,
        referenceCode: refCode,
        roleId: urlCandidateRole ? urlCandidateRole.toLowerCase().replace(/\s+/g, '-') : 'fullstack-developer',
        roleTitle: urlCandidateRole || 'Software Developer & Independent Contractor',
        department:
          urlCandidateRole.toLowerCase().includes('telecaller') || urlCandidateRole.toLowerCase().includes('sales')
            ? 'sales'
            : 'engineering',
        fullName: urlCandidateName || '',
        email: urlCandidateEmail || '',
        phone: '',
        city: '',
        experienceSummary: 'Candidate profile accessed via digital signing link.',
        status: 'Shortlisted',
        submittedAt: new Date().toISOString(),
        agreementStatus: 'pending',
        agreementTermsAccepted: false,
        agreementSignature: undefined,
        agreementSignerIp: undefined,
        agreementAffirmationWord: undefined,
        agreementSignedAt: undefined,
        agreementRejectedAt: undefined,
        agreementRejectionReason: undefined,
      }
    : null;

  const candidate: JobApplication | null =
    (existingCandidate as JobApplication | undefined) || fallbackCandidate;

  const [decisionMode, setDecisionMode] = useState<'accept' | 'decline'>('accept');
  const [signatureName, setSignatureName] = useState(candidate?.fullName || urlCandidateName || '');
  const [candidateEmail, setCandidateEmail] = useState(candidate?.email || urlCandidateEmail || '');
  const [affirmationText, setAffirmationText] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessfullySigned, setIsSuccessfullySigned] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  // Decline Form State
  const [declineReason, setDeclineReason] = useState('Accepted another opportunity');
  const [declineNotes, setDeclineNotes] = useState('');

  // Agreement Scroll / Read Progress
  const agreementContainerRef = useRef<HTMLDivElement>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    if (candidate) {
      if (candidate.agreementTermsAccepted || candidate.agreementStatus === 'signed') {
        setIsSuccessfullySigned(true);
        setSignatureName(candidate.agreementSignature || candidate.fullName || urlCandidateName);
        setAffirmationText(candidate.agreementAffirmationWord || REQUIRED_AFFIRMATION);
        setAgreedToTerms(true);
      } else if (candidate.status === 'Rejected' || candidate.agreementStatus === 'rejected') {
        setIsDeclined(true);
        if (candidate.agreementRejectionReason) {
          setDeclineReason(candidate.agreementRejectionReason);
        }
      } else if (candidate.fullName) {
        setSignatureName(candidate.fullName);
      }
    }
  }, [candidate, urlCandidateName]);

  const handleScrollAgreement = () => {
    if (!agreementContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = agreementContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setReadProgress(100);
      setHasScrolledToBottom(true);
      return;
    }
    const pct = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
    setReadProgress(pct);
    if (pct >= 85) {
      setHasScrolledToBottom(true);
    }
  };

  const handleScrollToBottom = () => {
    if (agreementContainerRef.current) {
      agreementContainerRef.current.scrollTo({
        top: agreementContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setReadProgress(100);
      setHasScrolledToBottom(true);
    }
  };

  const agreementRole: 'Software Developer' | 'Telecaller' =
    candidate?.department === 'sales' || candidate?.roleTitle?.toLowerCase().includes('telecaller')
      ? 'Telecaller'
      : 'Software Developer';

  const fullAgreementText = generateFreelancerAgreementText({
    candidateName: signatureName || candidate?.fullName || 'Candidate Full Name',
    candidatePhone: candidate?.phone || '+91 XXXXX XXXXX',
    candidateEmail: candidateEmail || candidate?.email || 'candidate@email.com',
    candidateAddress: candidate?.city ? `${candidate.city}, India` : 'India',
    role: agreementRole,
    agreementDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    projectFee: agreementRole === 'Software Developer' ? '₹15,000 (Per Milestone Sprint)' : undefined,
    commissionPerConversion: agreementRole === 'Telecaller' ? 150 : undefined,
  });

  const isAffirmationMatched = affirmationText.trim().toUpperCase() === REQUIRED_AFFIRMATION;
  const isSignReady = agreedToTerms && signatureName.trim().length >= 2 && isAffirmationMatched;

  const handleSignAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Please review and check the acceptance declaration.');
      return;
    }
    if (!signatureName.trim() || signatureName.trim().length < 2) {
      toast.error('Please type your legal full name as your digital signature.');
      return;
    }
    if (!isAffirmationMatched) {
      toast.error(`Please type "${REQUIRED_AFFIRMATION}" in the affirmation box.`);
      return;
    }

    setIsSubmitting(true);
    const targetRef = candidate?.referenceCode || refCode;
    const res = await signCandidateAgreement(
      targetRef,
      signatureName.trim(),
      undefined,
      affirmationText.trim().toUpperCase()
    );

    // Also dispatch notification email to founders via EmailJS
    try {
      const SERVICE_ID = 'service_vtbrgi5';
      const TEMPLATE_ID = 'template_p8i38d6';
      const PUBLIC_KEY = 'QNzyFmRohhj8Soht0';
      emailjs.init(PUBLIC_KEY);
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: `${signatureName.trim()} (Agreement Digitally Signed)`,
          from_email: candidateEmail || 'candidate@fusionengine.in',
          to_email: 'fusionenginetechnology@gmail.com',
          message: `[FREELANCER AGREEMENT DIGITALLY SIGNED]\nCandidate Name: ${signatureName.trim()}\nReference Code: ${targetRef}\nRole: ${agreementRole}\nSigned Timestamp: ${new Date().toLocaleString()}\nAffirmation: ${affirmationText.trim().toUpperCase()}\nCompliance: Indian Information Technology Act, 2000 (Section 10A)`,
          time: new Date().toLocaleString(),
        },
        PUBLIC_KEY
      );
    } catch (emailErr) {
      console.warn('Agreement sign notification note:', emailErr);
    }

    setIsSubmitting(false);

    if (res.success || targetRef) {
      setIsSuccessfullySigned(true);
      toast.success('Your Freelancer Agreement has been digitally signed & recorded!');
    } else {
      toast.error(res.error || 'Failed to submit agreement.');
    }
  };

  const handleDeclineOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you wish to decline this engagement offer? This will notify the executive team.')) {
      return;
    }

    setIsSubmitting(true);
    const targetRef = candidate?.referenceCode || refCode;
    const res = await rejectCandidateAgreement(
      targetRef,
      declineReason,
      declineNotes.trim()
    );

    // Also dispatch decline notification to founders via EmailJS
    try {
      const SERVICE_ID = 'service_vtbrgi5';
      const TEMPLATE_ID = 'template_p8i38d6';
      const PUBLIC_KEY = 'QNzyFmRohhj8Soht0';
      emailjs.init(PUBLIC_KEY);
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: `${signatureName.trim() || 'Candidate'} (Offer Declined)`,
          from_email: candidateEmail || 'candidate@fusionengine.in',
          to_email: 'fusionenginetechnology@gmail.com',
          message: `[OFFER DECLINED BY CANDIDATE]\nCandidate: ${signatureName.trim() || 'Candidate'}\nReference Code: ${targetRef}\nReason: ${declineReason}\nAdditional Notes: ${declineNotes.trim() || 'None'}\nTimestamp: ${new Date().toLocaleString()}`,
          time: new Date().toLocaleString(),
        },
        PUBLIC_KEY
      );
    } catch (emailErr) {
      console.warn('Agreement decline notification note:', emailErr);
    }

    setIsSubmitting(false);

    if (res.success || targetRef) {
      setIsDeclined(true);
      toast.info('You have declined this engagement offer.');
    } else {
      toast.error(res.error || 'Failed to record decline.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground py-8 px-4 sm:px-6 antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <img
              src="/header-logo.png"
              alt="Fusion Engine Technology"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="border-l border-border/50 pl-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  Freelancer Onboarding Agreement
                </h1>
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20 uppercase font-mono">
                  IT Act 2000
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Independent Contractor Service Agreement & Code of Conduct
              </p>
            </div>
          </div>
        </div>

        {/* Candidate & Agreement Verification Status Banner */}
        {candidate ? (
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              isDeclined
                ? 'bg-rose-500/10 border-rose-500/30'
                : isSuccessfullySigned
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-primary/5 border-primary/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isDeclined
                    ? 'bg-rose-500/20 text-rose-500'
                    : isSuccessfullySigned
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                {isDeclined ? (
                  <XCircle className="w-5 h-5" />
                ) : isSuccessfullySigned ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <FileCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>{candidate.fullName || signatureName || 'Shortlisted Candidate'}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {candidate.roleTitle}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                  <span>
                    Ref: <strong className="text-foreground font-mono">{candidate.referenceCode}</strong>
                  </span>
                  {(candidateEmail || candidate.email) && (
                    <span>Email: {candidateEmail || candidate.email}</span>
                  )}
                  {candidate.phone && <span>Contact: {candidate.phone}</span>}
                </div>
              </div>
            </div>

            <div className="text-right">
              {isDeclined ? (
                <div className="space-y-0.5">
                  <Badge className="bg-rose-600 text-white text-xs gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Offer Declined
                  </Badge>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {candidate.agreementRejectedAt
                      ? new Date(candidate.agreementRejectedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recorded'}
                  </p>
                </div>
              ) : isSuccessfullySigned ? (
                <div className="space-y-0.5">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Agreement Executed
                  </Badge>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Signed:{' '}
                    {new Date(candidate.agreementSignedAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Awaiting Digital Signature
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-sm">Previewing Master Agreement Template</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                No specific candidate reference supplied ({refCode || 'None'}). Showing the standard Fusion Engine
                Freelancer Onboarding & Service Agreement terms below.
              </p>
            </div>
          </div>
        )}

        {/* Agreement Text Document Card */}
        <Card className="border-border/60 bg-card/80 backdrop-blur shadow-xl">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Legal Service Agreement & Terms of Engagement
                </CardTitle>
                <CardDescription className="text-xs">
                  Please review all 15 clauses regarding deliverables, milestone compensation, intellectual property, and confidentiality.
                </CardDescription>
              </div>

              {/* Reading Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hasScrolledToBottom ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${readProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{readProgress}% read</span>
                </div>

                {!hasScrolledToBottom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleScrollToBottom}
                    className="text-[11px] h-7 gap-1 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <ArrowDown className="w-3 h-3" /> Scroll to End
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div
              ref={agreementContainerRef}
              onScroll={handleScrollAgreement}
              className="h-[440px] overflow-y-auto rounded-lg border border-border/40 bg-muted/20 p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text shadow-inner"
            >
              {fullAgreementText}
            </div>
          </CardContent>

          {/* Decision & Action Footer */}
          <CardFooter className="flex flex-col border-t border-border/40 pt-4 pb-6 bg-muted/10 space-y-4">
            {isDeclined ? (
              <div className="w-full p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2 text-center">
                <XCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="font-bold text-sm text-foreground">Engagement Offer Declined</h3>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                  This engagement offer has been formally declined by candidate{' '}
                  <strong className="text-foreground">{candidate?.fullName || 'Candidate'}</strong> (Ref:{' '}
                  <span className="font-mono">{candidate?.referenceCode || refCode}</span>).
                </p>
                {declineReason && (
                  <p className="text-xs text-rose-500 font-medium">
                    Reason recorded: {declineReason}
                  </p>
                )}
              </div>
            ) : isSuccessfullySigned ? (
              <div className="w-full p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-base text-foreground">Agreement Formally Signed & Certified</h3>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                  Thank you, <strong className="text-foreground">{signatureName}</strong>. Your digital acceptance has
                  been verified under Section 10A of the Indian Information Technology Act, 2000 and logged in the
                  Fusion Engine Workforce System under application ref{' '}
                  <strong className="text-foreground font-mono">{candidate?.referenceCode || refCode}</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    Affirmation: &quot;{affirmationText}&quot;
                  </Badge>
                  <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono">
                    Signed: {signatureName}
                  </Badge>
                </div>
                <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-center gap-2 max-w-md mx-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Our administration team will review your countersignature and activate your workspace login credentials shortly.
                  </span>
                </div>
              </div>
            ) : candidate ? (
              <div className="w-full space-y-4">
                {/* Decision Mode Tabs: Accept vs Decline */}
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Candidate Decision:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDecisionMode('accept')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        decisionMode === 'accept'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ✓ Accept & Digitally Sign
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionMode('decline')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        decisionMode === 'decline'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ✕ Decline Offer
                    </button>
                  </div>
                </div>

                {decisionMode === 'accept' ? (
                  /* ACCEPT & SIGN FORM */
                  <form onSubmit={handleSignAgreement} className="space-y-4">
                    {/* Legal Checkbox */}
                    <div className="flex items-start gap-3 p-3.5 rounded-lg border border-primary/20 bg-primary/5">
                      <Checkbox
                        id="acceptTerms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <label htmlFor="acceptTerms" className="text-xs text-foreground cursor-pointer leading-relaxed">
                        I, <strong className="text-primary">{candidate.fullName || signatureName || 'Candidate'}</strong>, hereby declare that I have
                        carefully read, understood, and voluntarily accept all 15 clauses of the{' '}
                        <strong>Fusion Engine Technology Freelancer Onboarding & Service Agreement</strong> as an
                        independent contractor under the Indian Contract Act, 1872 and Information Technology Act, 2000.
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name Signature Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>1. Digital Signature (Legal Full Name) *</span>
                          <span className="text-[10px] text-muted-foreground">Matches applicant record</span>
                        </label>
                        <Input
                          type="text"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          placeholder="e.g. Arjun Kumar"
                          className="text-sm font-serif italic h-10 bg-background"
                          required
                        />
                      </div>

                      {/* Required Affirmation Word Typing */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>2. Type Affirmation Phrase *</span>
                          <span className="text-[10px] text-muted-foreground">
                            Type: <strong className="text-primary font-mono">{REQUIRED_AFFIRMATION}</strong>
                          </span>
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={affirmationText}
                            onChange={(e) => setAffirmationText(e.target.value)}
                            placeholder={REQUIRED_AFFIRMATION}
                            className={`text-xs font-mono uppercase h-10 bg-background pr-8 ${
                              isAffirmationMatched
                                ? 'border-emerald-500 focus-visible:ring-emerald-500'
                                : affirmationText.trim().length > 0
                                ? 'border-amber-500'
                                : ''
                            }`}
                            required
                          />
                          {isAffirmationMatched && (
                            <Check className="w-4 h-4 text-emerald-500 absolute right-2.5 top-3" />
                          )}
                        </div>
                        {affirmationText.trim().length > 0 && !isAffirmationMatched && (
                          <p className="text-[10px] text-amber-500">
                            Phrase must exactly match &quot;{REQUIRED_AFFIRMATION}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Legally binding electronic signature pursuant to Sec 10A IT Act 2000.</span>
                      </p>

                      <Button
                        type="submit"
                        className="h-10 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-md w-full sm:w-auto"
                        disabled={isSubmitting || !isSignReady}
                      >
                        {isSubmitting ? (
                          <span>Executing Signature...</span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" /> Sign & Accept Freelancer Agreement
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* DECLINE OFFER FORM */
                  <form onSubmit={handleDeclineOffer} className="space-y-4">
                    <div className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-2">
                      <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Decline Engagement Offer</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        If you choose to decline, this application will be closed. Please help us understand your decision
                        so our talent team can improve future engagements.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Reason for Declining *
                        </label>
                        <select
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="Accepted another opportunity">Accepted another opportunity</option>
                          <option value="Availability / Schedule mismatch">Availability / Schedule mismatch</option>
                          <option value="Compensation expectations differ">Compensation expectations differ</option>
                          <option value="Disagreement with agreement terms">Disagreement with agreement terms</option>
                          <option value="Personal / Other reasons">Personal / Other reasons</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Additional Feedback (Optional)
                        </label>
                        <Textarea
                          value={declineNotes}
                          onChange={(e) => setDeclineNotes(e.target.value)}
                          placeholder="Provide any feedback for the founders..."
                          className="text-xs bg-background h-10 min-h-[40px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <Button
                        type="submit"
                        variant="destructive"
                        className="h-10 px-6 text-xs font-semibold gap-1.5 shadow-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" /> Confirm Decline of Offer
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-muted-foreground">
                To sign or decline an agreement, please use your personalized candidate notification link.
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Footer Guarantee */}
        <div className="text-center text-[11px] text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Fusion Engine Technology. All rights reserved.</p>
          <p>Innovate • Integrate • Accelerate | https://fusionengine.in | fusionenginetechnology@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateAgreementSignPage;
