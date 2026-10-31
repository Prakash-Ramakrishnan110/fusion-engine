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
import { FileText, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { JobApplication } from '../types';
import { generateFreelancerAgreementText } from '../services/freelancerAgreementService';
import { toast } from 'sonner';

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
  const rawAgreementContent =
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

  // Clean raw ASCII banners if present so letterhead is not duplicated
  let cleanAgreementContent = rawAgreementContent.trim();
  if (cleanAgreementContent.includes('================================================================================')) {
    const parts = cleanAgreementContent.split('================================================================================');
    cleanAgreementContent = parts[parts.length - 1].trim();
  }

  const signDateFormatted = application.agreementSignedAt
    ? new Date(application.agreementSignedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const signTimeFormatted = application.agreementSignedAt
    ? new Date(application.agreementSignedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  // Isolated multi-page printing engine via hidden iframe
  const handlePrint = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return;
    }

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Freelancer Service Agreement - ${application.fullName} (${application.referenceCode})</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 18mm 16mm 18mm 16mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 11.5pt;
            line-height: 1.6;
            color: #111;
            background: #fff;
            padding: 0;
          }
          .letterhead {
            text-align: center;
            border-bottom: 2px solid #111;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }
          .letterhead h1 {
            font-size: 19pt;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #0f172a;
            margin-bottom: 3px;
          }
          .letterhead .subtitle {
            font-size: 12pt;
            font-weight: bold;
            color: #0284c7;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 4px;
          }
          .letterhead .meta {
            font-size: 9pt;
            color: #475569;
            margin-bottom: 4px;
          }
          .letterhead .statute {
            font-size: 9pt;
            font-style: italic;
            color: #64748b;
          }
          .stamp-box {
            border: 1.5px solid #059669;
            background: #f0fdf4 !important;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 18px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .stamp-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #bbf7d0;
            padding-bottom: 6px;
            margin-bottom: 8px;
            font-family: Arial, sans-serif;
          }
          .stamp-top .candidate-name {
            font-size: 11pt;
            font-weight: bold;
            color: #064e3b;
          }
          .stamp-top .cert-badge {
            font-size: 8.5pt;
            font-weight: bold;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .stamp-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            font-family: Arial, sans-serif;
            font-size: 8.5pt;
            color: #334155;
          }
          .stamp-grid strong {
            color: #0f172a;
          }
          .legal-content {
            font-size: 11pt;
            line-height: 1.65;
            text-align: justify;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-bottom: 24px;
          }
          .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 2px solid #111;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .sig-card {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            padding: 12px 14px;
            border-radius: 6px;
          }
          .sig-card.verified {
            border-color: #10b981;
            background: #f0fdf4 !important;
          }
          .sig-label {
            font-family: Arial, sans-serif;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 4px;
          }
          .sig-card.verified .sig-label {
            color: #047857;
          }
          .sig-company-name {
            font-weight: bold;
            font-size: 11pt;
            color: #0f172a;
          }
          .sig-handwritten {
            font-family: 'Georgia', cursive, serif;
            font-style: italic;
            font-size: 14pt;
            font-weight: bold;
            color: #047857;
            margin: 6px 0;
          }
          .sig-meta {
            font-family: Arial, sans-serif;
            font-size: 8pt;
            color: #64748b;
            line-height: 1.4;
          }
          .footer-note {
            margin-top: 20px;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 8pt;
            color: #94a3b8;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <h1>FUSION ENGINE TECHNOLOGY</h1>
          <div class="subtitle">Freelancer Onboarding & Service Agreement</div>
          <div class="meta">Innovate • Integrate • Accelerate | https://fusionengine.in | fusionenginetechnology@gmail.com</div>
          <div class="statute">Statutory Electronic Execution under Section 10A of the Indian Information Technology Act, 2000 & Indian Contract Act, 1872</div>
        </div>

        <div class="stamp-box">
          <div class="stamp-top">
            <div class="candidate-name">${application.fullName} (${application.referenceCode})</div>
            <div class="cert-badge">✓ Certified Digital Execution</div>
          </div>
          <div class="stamp-grid">
            <div>Role: <strong>${application.roleTitle}</strong></div>
            <div>Department: <strong>${application.department === 'sales' ? 'Inside Sales & CRM' : 'Engineering'}</strong></div>
            <div>Signed Date: <strong>${signDateFormatted} ${signTimeFormatted}</strong></div>
            <div>Legal Signature: <strong>${application.agreementSignature || application.fullName}</strong></div>
            <div>Affirmation: <strong>"${application.agreementAffirmationWord || 'I AGREE AND ACCEPT'}"</strong></div>
            <div>Signer IP: <strong>${application.agreementSignerIp || 'Verified Web Session'}</strong></div>
          </div>
        </div>

        <div class="legal-content">${cleanAgreementContent}</div>

        <div class="signatures-grid">
          <div class="sig-card">
            <div class="sig-label">For Company:</div>
            <div class="sig-company-name">Fusion Engine Technology</div>
            <div class="sig-handwritten" style="color: #0f172a;">Prakash Ramakrishnan</div>
            <div class="sig-meta">
              Founder & Super Admin<br />
              Executive Leadership Signatory
            </div>
          </div>

          <div class="sig-card verified">
            <div class="sig-label">Digitally Accepted by Freelancer:</div>
            <div class="sig-company-name">${application.fullName}</div>
            <div class="sig-handwritten">${application.agreementSignature || application.fullName}</div>
            <div class="sig-meta">
              Certified on: ${signDateFormatted} ${signTimeFormatted}<br />
              Signer IP: ${application.agreementSignerIp || 'Verified Web Session'}<br />
              Status: Formally Executed & Legally Enforceable
            </div>
          </div>
        </div>

        <div class="footer-note">
          Reference: ${application.referenceCode} • Permanent Record Stored in Fusion Engine Technology Document Vault (/portal/documents)
        </div>
      </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 3000);
    }, 300);
  };

  const handleDownloadHtml = () => {
    const htmlBlob = new Blob(
      [
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Freelancer Service Agreement - ${application.fullName}</title>
  <style>
    body { font-family: "Times New Roman", Times, Georgia, serif; padding: 40px; max-width: 800px; margin: auto; line-height: 1.6; color: #111; }
    h1 { text-align: center; font-size: 24px; text-transform: uppercase; margin-bottom: 5px; }
    h2 { text-align: center; font-size: 16px; color: #0284c7; text-transform: uppercase; margin-bottom: 10px; }
    .meta { text-align: center; font-size: 12px; color: #555; margin-bottom: 25px; border-bottom: 2px solid #222; padding-bottom: 15px; }
    .cert { border: 1.5px solid #059669; background: #f0fdf4; padding: 12px 16px; border-radius: 6px; margin-bottom: 25px; font-family: Arial, sans-serif; font-size: 13px; }
    .content { white-space: pre-wrap; line-height: 1.65; text-align: justify; margin-bottom: 30px; }
    .signatures { display: flex; justify-content: space-between; border-top: 2px solid #222; padding-top: 20px; font-family: Arial, sans-serif; font-size: 13px; }
    .sig-box { width: 45%; border: 1px solid #ccc; padding: 12px; border-radius: 6px; }
    .handwriting { font-family: Georgia, serif; font-style: italic; font-weight: bold; font-size: 18px; color: #047857; margin: 6px 0; }
  </style>
</head>
<body>
  <h1>FUSION ENGINE TECHNOLOGY</h1>
  <h2>Freelancer Onboarding & Service Agreement</h2>
  <div class="meta">Innovate • Integrate • Accelerate | https://fusionengine.in | fusionenginetechnology@gmail.com<br>Statutory Electronic Execution under Section 10A of the Indian Information Technology Act, 2000</div>
  <div class="cert">
    <strong>Certified Digital Signature Record</strong><br>
    Candidate: ${application.fullName} (${application.referenceCode})<br>
    Role: ${application.roleTitle} | Signed: ${signDateFormatted} ${signTimeFormatted}<br>
    Legal Signature: "${application.agreementSignature || application.fullName}" | Signer IP: ${application.agreementSignerIp || 'Verified Web Session'}
  </div>
  <div class="content">${cleanAgreementContent}</div>
  <div class="signatures">
    <div class="sig-box">
      <strong>For Company:</strong><br>
      Fusion Engine Technology<br>
      <div class="handwriting" style="color: #111;">Prakash Ramakrishnan</div>
      Founder & Super Admin
    </div>
    <div class="sig-box" style="border-color: #059669; background: #f0fdf4;">
      <strong style="color: #047857;">Digitally Accepted by Freelancer:</strong><br>
      ${application.fullName}<br>
      <div class="handwriting">${application.agreementSignature || application.fullName}</div>
      Signed: ${signDateFormatted} ${signTimeFormatted}
    </div>
  </div>
</body>
</html>`
      ],
      { type: 'text/html;charset=utf-8' }
    );
    const downloadUrl = URL.createObjectURL(htmlBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Freelancer-Agreement-${application.fullName.replace(/\s+/g, '_')}-${application.referenceCode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    toast.success('Agreement document downloaded successfully!');
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

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadHtml}
                className="text-xs gap-1.5 h-8 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Doc
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handlePrint}
                className="text-xs gap-1.5 h-8 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </Button>
            </div>
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
                Signed on: {signDateFormatted} {signTimeFormatted}
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
              Statutory Electronic Execution under Section 10A Indian Information Technology Act, 2000 & Indian Contract Act, 1872
            </p>
          </div>

          {/* Legal Text */}
          <div className="text-left leading-relaxed text-foreground/95">
            {cleanAgreementContent}
          </div>

          {/* Electronic Countersignature Certificate Stamp */}
          <div className="mt-8 pt-6 border-t-2 border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-1.5">
              <span className="text-muted-foreground font-sans font-semibold uppercase text-[10px]">For Company:</span>
              <p className="font-bold text-sm">Fusion Engine Technology</p>
              <p className="font-serif italic font-bold text-sm">Prakash Ramakrishnan</p>
              <p className="text-[11px] text-muted-foreground font-sans">Authorized Executive Signatory</p>
            </div>

            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold uppercase text-[10px]">Digitally Accepted By Freelancer:</span>
              <p className="font-bold text-sm">{application.fullName}</p>
              <p className="font-serif italic font-bold text-emerald-600 text-sm">{application.agreementSignature || application.fullName}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Date: {signDateFormatted} {signTimeFormatted}
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
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Agreement
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
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
