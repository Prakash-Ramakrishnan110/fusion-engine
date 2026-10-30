import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { JobApplication } from '../types';
import { generateFreelancerAgreementText } from '../services/freelancerAgreementService';

interface SignedAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication | null;
}

export const SignedAgreementModal: React.FC<SignedAgreementModalProps> = ({
  open,
  onOpenChange,
  application,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!application) return null;

  const role: 'Software Developer' | 'Telecaller' =
    application.department === 'sales' || application.roleTitle.toLowerCase().includes('telecaller')
      ? 'Telecaller'
      : 'Software Developer';

  // Use stored agreement text or regenerate from candidate profile
  const agreementContent =
    application.agreementDocumentText ||
    generateFreelancerAgreementText({
      candidateName: application.agreementSignature || application.fullName,
      candidatePhone: application.phone || '+91 XXXXX XXXXX',
      candidateEmail: application.email,
      candidateAddress: application.city ? `${application.city}, India` : 'India',
      role,
      agreementDate: application.agreementSignedAt
        ? new Date(application.agreementSignedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : undefined,
      projectFee: role === 'Software Developer' ? '₹15,000 (Per Milestone Sprint)' : undefined,
      commissionPerConversion: role === 'Telecaller' ? 150 : undefined,
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] overflow-y-auto p-4 sm:p-8 bg-background border-border shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span>Certified Freelancer Service Agreement</span>
                  <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Signed & Enforceable
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Statutory electronic contract record pursuant to Section 10A of the Indian Information Technology Act, 2000
                </DialogDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5 h-8 shrink-0 print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-primary" /> Print / Save PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Candidate & Electronic Execution Certification Stamp */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-foreground text-sm flex items-center gap-2">
                <span>{application.fullName}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {application.referenceCode}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Email: <span className="text-foreground">{application.email}</span> • Phone: <span className="text-foreground">{application.phone || 'On file'}</span>
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Digital Signature
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                Signed on:{' '}
                {application.agreementSignedAt
                  ? new Date(application.agreementSignedAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : 'Recorded'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-[11px] font-mono">
            <div>
              <span className="text-muted-foreground">Legal Signature:</span>{' '}
              <strong className="text-foreground font-serif italic text-xs">{application.agreementSignature || application.fullName}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Affirmation:</span>{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">&quot;{application.agreementAffirmationWord || 'I AGREE AND ACCEPT'}&quot;</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Signer IP / Device:</span>{' '}
              <strong className="text-foreground">{application.agreementSignerIp || 'Verified Web Session'}</strong>
            </div>
          </div>
        </div>

        {/* Agreement Legal Text Viewer in Times New Roman */}
        <div
          ref={printRef}
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          className="p-6 sm:p-10 rounded-xl border border-border/60 bg-card text-foreground text-[15px] sm:text-base leading-relaxed select-text shadow-inner overflow-y-auto max-h-[500px] whitespace-pre-wrap space-y-4"
        >
          {/* Formal Letterhead */}
          <div className="text-center pb-6 border-b-2 border-border/60 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-foreground">
              FUSION ENGINE TECHNOLOGY
            </h2>
            <p className="text-sm font-bold text-primary uppercase tracking-widest mt-0.5">
              Freelancer Onboarding & Service Agreement
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Innovate • Integrate • Accelerate | https://fusionengine.in | fusionenginetechnology@gmail.com
            </p>
            <p className="text-xs italic text-muted-foreground pt-1">
              Statutory Electronic Execution under Section 10A Indian Information Technology Act, 2000
            </p>
          </div>

          {/* Legal Text */}
          <div className="text-left leading-relaxed text-foreground/95">
            {agreementContent}
          </div>

          {/* Electronic Countersignature Certificate Stamp */}
          <div className="mt-8 pt-6 border-t-2 border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-1.5">
              <span className="text-muted-foreground font-sans font-semibold uppercase text-[10px]">For Company:</span>
              <p className="font-bold text-sm">Fusion Engine Technology</p>
              <p className="font-serif italic">Prakash Ramakrishnan</p>
              <p className="text-[11px] text-muted-foreground font-sans">Authorized Executive Signatory</p>
            </div>

            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold uppercase text-[10px]">Digitally Accepted By Freelancer:</span>
              <p className="font-bold text-sm">{application.fullName}</p>
              <p className="font-serif italic font-bold text-emerald-600">{application.agreementSignature || application.fullName}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Date: {application.agreementSignedAt ? new Date(application.agreementSignedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground font-mono">
            Ref: {application.referenceCode} • Retained permanently in Document Vault
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Agreement
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignedAgreementModal;

