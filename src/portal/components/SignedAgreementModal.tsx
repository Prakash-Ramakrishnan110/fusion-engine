import React, { useRef, useEffect } from 'react';
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
  // All hooks declared unconditionally at the top of the component (React Rules of Hooks)
  const printRef = useRef<HTMLDivElement>(null);

  // Print engine function
  const handlePrint = () => {
    if (!application) return;

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
    frameDoc.write(generateFullDocumentHtml());
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

  // Keyboard shortcut: Ctrl+P / Cmd+P while modal is active triggers clean multi-page A4 print
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, application]);

  // Conditional early return AFTER all React hooks are registered
  if (!application) return null;

  const role: 'Software Developer' | 'Telecaller' =
    application.department === 'sales' || application.roleTitle.toLowerCase().includes('telecaller')
      ? 'Telecaller'
      : 'Software Developer';

  // Use stored agreement text or generate default corporate contract text
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

  // Parser: converts raw contract text into structured executive-grade corporate HTML
  const formatAgreementHtml = (rawText: string): string => {
    let text = rawText.trim();
    if (text.includes('================================================================================')) {
      const parts = text.split('================================================================================');
      text = parts[parts.length - 1].trim();
    }

    const lines = text.split('\n');
    const htmlParts: string[] = [];
    let inList = false;
    let inKvTable = false;
    let kvRows: { label: string; val: string }[] = [];

    const flushKvTable = () => {
      if (kvRows.length > 0) {
        htmlParts.push('<table class="contract-spec-table"><tbody>');
        for (const item of kvRows) {
          htmlParts.push(
            `<tr><td class="spec-label">${item.label}</td><td class="spec-value">${item.val}</td></tr>`
          );
        }
        htmlParts.push('</tbody></table>');
        kvRows = [];
      }
      inKvTable = false;
    };

    const flushList = () => {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushList();
        flushKvTable();
        continue;
      }

      // Clause header e.g. "1. COMPANY DETAILS", "4. ROLES AND RESPONSIBILITIES"
      if (/^\d+\.\s+[A-Z\s,–&-]+$/.test(line)) {
        flushList();
        flushKvTable();
        htmlParts.push(`<div class="clause-header">${line}</div>`);
        continue;
      }

      // Sub-clause e.g. "A. Software Developer" or "B. Telecaller — ₹150..."
      if (/^[A-Z]\.\s+.+$/.test(line) && !line.includes(':')) {
        flushList();
        flushKvTable();
        htmlParts.push(`<div class="sub-clause-header">${line}</div>`);
        continue;
      }

      // Key-Value rows in Company / Freelancer details e.g. "Company Name: Fusion Engine Technology"
      const colonIdx = line.indexOf(':');
      if (
        colonIdx > 0 &&
        colonIdx < 35 &&
        !line.startsWith('http') &&
        !line.toLowerCase().includes('agrees to:') &&
        !line.toLowerCase().includes('agree to:') &&
        !line.toLowerCase().includes('including:') &&
        !line.toLowerCase().includes('not limited to:')
      ) {
        flushList();
        inKvTable = true;
        const label = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        kvRows.push({ label, val });
        continue;
      } else {
        flushKvTable();
      }

      // Bullet lists e.g. "• Develop, test..."
      if (line.startsWith('•') || line.startsWith('*')) {
        if (!inList) {
          htmlParts.push('<ul class="clause-bullets">');
          inList = true;
        }
        const bulletText = line.replace(/^[•*]\s*/, '');
        htmlParts.push(`<li>${bulletText}</li>`);
        continue;
      }

      flushList();

      // Standard body paragraph
      htmlParts.push(`<p class="clause-text">${line}</p>`);
    }

    flushList();
    flushKvTable();

    return htmlParts.join('\n');
  };

  const parsedHtml = formatAgreementHtml(rawAgreementContent);

  // Corporate styling applied uniformly to Print Engine, Download HTML, and Modal Preview
  const corporatePrintStyles = `
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
    }
    @media print {
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 10.5pt;
      line-height: 1.58;
      color: #0f172a;
      background: #ffffff;
      padding: 2mm 4mm;
      margin: 0;
    }
    .letterhead {
      text-align: center;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .letterhead h1 {
      font-size: 18pt;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #0f172a;
      margin: 0 0 3px 0;
    }
    .letterhead .subtitle {
      font-size: 11pt;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 3px 0;
    }
    .letterhead .meta {
      font-size: 8.5pt;
      color: #475569;
      margin-bottom: 3px;
      font-family: Arial, Helvetica, sans-serif;
    }
    .letterhead .statute {
      font-size: 8pt;
      font-style: italic;
      color: #64748b;
    }

    .stamp-box {
      border: 2px solid #047857;
      background: #f0fdf4 !important;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .stamp-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #059669;
      padding-bottom: 5px;
      margin-bottom: 7px;
      font-family: Arial, Helvetica, sans-serif;
    }
    .stamp-top .candidate-name {
      font-size: 11pt;
      font-weight: 800;
      color: #064e3b;
    }
    .stamp-top .cert-badge {
      font-size: 8.5pt;
      font-weight: 700;
      color: #047857;
      border: 1px solid #047857;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stamp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px 12px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #1e293b;
    }
    .stamp-grid strong {
      color: #0f172a;
    }

    .clause-header {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 11.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      color: #0f172a;
      padding-bottom: 3px;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
      break-after: avoid;
    }
    .sub-clause-header {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      padding: 3px 8px;
      margin-top: 10px;
      margin-bottom: 6px;
      page-break-after: avoid;
      break-after: avoid;
    }
    .clause-text {
      font-size: 10pt;
      line-height: 1.62;
      text-align: justify;
      text-justify: inter-word;
      margin-bottom: 8px;
      color: #0f172a;
    }

    /* Structured Corporate Specification Schedule Table */
    .contract-spec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 14px 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .contract-spec-table td {
      border: 1.5px solid #0f172a;
      padding: 6px 12px;
      vertical-align: middle;
    }
    .contract-spec-table .spec-label {
      width: 32%;
      font-weight: 700;
      color: #0f172a;
      background-color: #f1f5f9;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.5px;
    }
    .contract-spec-table .spec-value {
      width: 68%;
      color: #0f172a;
      font-weight: 500;
    }

    .clause-bullets {
      margin: 6px 0 12px 24px;
      padding-left: 8px;
      list-style-type: square;
    }
    .clause-bullets li {
      font-size: 9.8pt;
      line-height: 1.6;
      margin-bottom: 5px;
      text-align: justify;
      text-justify: inter-word;
      color: #0f172a;
    }

    .signatures-container {
      margin-top: 24px;
      padding-top: 14px;
      border-top: 2.5px solid #0f172a;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .signatures-title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .signatures-subtitle {
      font-size: 8.5pt;
      font-style: italic;
      color: #334155;
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.45;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .sig-card {
      border: 1.5px solid #0f172a;
      background: #ffffff;
      padding: 12px 14px;
      border-radius: 6px;
    }
    .sig-card.freelancer-card {
      border: 2px solid #047857;
      background: #f0fdf4 !important;
    }
    .sig-header {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      margin-bottom: 4px;
    }
    .sig-card.freelancer-card .sig-header {
      color: #047857;
    }
    .sig-company-name {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 800;
      font-size: 10pt;
      color: #0f172a;
    }
    .sig-line-box {
      margin: 8px 0;
    }
    .sig-handwritten {
      font-family: 'Georgia', cursive, serif;
      font-style: italic;
      font-size: 15pt;
      font-weight: 700;
      line-height: 1.2;
    }
    .sig-rule {
      border-bottom: 1.5px solid #0f172a;
      margin-top: 3px;
    }
    .sig-details {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #1e293b;
      line-height: 1.5;
    }
    .sig-seal-badge {
      display: inline-block;
      margin-top: 8px;
      border: 1px solid #0f172a;
      padding: 2px 7px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .sig-statute-badge {
      display: inline-block;
      margin-top: 8px;
      border: 1px solid #047857;
      padding: 2px 7px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #047857;
    }
    .footer-note {
      margin-top: 14px;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #94a3b8;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  `;

  const generateFullDocumentHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Freelancer Service Agreement - ${application.fullName} (${application.referenceCode})</title>
      <style>${corporatePrintStyles}</style>
    </head>
    <body>
      <div class="letterhead">
        <h1>FUSION ENGINE TECHNOLOGY</h1>
        <div class="subtitle">Freelancer Onboarding &amp; Service Agreement</div>
        <div class="meta">Innovate • Integrate • Accelerate &nbsp;|&nbsp; https://fusionengine.in &nbsp;|&nbsp; fusionenginetechnology@gmail.com</div>
        <div class="statute">Statutory Electronic Execution under Section 10A of the Indian Information Technology Act, 2000 &amp; Indian Contract Act, 1872</div>
      </div>

      <div class="stamp-box">
        <div class="stamp-top">
          <div class="candidate-name">${application.fullName} (${application.referenceCode})</div>
          <div class="cert-badge">&#10003; Certified Digital Execution</div>
        </div>
        <div class="stamp-grid">
          <div>Role: <strong>${application.roleTitle}</strong></div>
          <div>Department: <strong>${application.department === 'sales' ? 'Inside Sales & CRM' : 'Engineering'}</strong></div>
          <div>Signed Date: <strong>${signDateFormatted} ${signTimeFormatted}</strong></div>
          <div>Legal Signature: <strong>${application.agreementSignature || application.fullName}</strong></div>
          <div>Affirmation: <strong>&ldquo;${application.agreementAffirmationWord || 'I AGREE AND ACCEPT'}&rdquo;</strong></div>
          <div>Signer IP: <strong>${application.agreementSignerIp || 'Verified Web Session'}</strong></div>
        </div>
      </div>

      <div class="legal-content">
        ${parsedHtml}
      </div>

      <div class="signatures-container">
        <div class="signatures-title">EXECUTION AND DIGITAL ATTESTATION</div>
        <div class="signatures-subtitle">IN WITNESS WHEREOF, the Parties hereto have caused this Freelancer Onboarding &amp; Service Agreement to be executed and delivered electronically by their duly authorized representatives pursuant to Section 10A of the Indian Information Technology Act, 2000 and the Indian Contract Act, 1872, as of the Effective Date.</div>
        <div class="signatures-grid">
          <div class="sig-card">
            <div class="sig-header">For and on behalf of the Company:</div>
            <div class="sig-company-name">FUSION ENGINE TECHNOLOGY</div>
            <div class="sig-line-box">
              <div class="sig-handwritten" style="color: #0f172a;">Prakash Ramakrishnan</div>
              <div class="sig-rule"></div>
            </div>
            <div class="sig-details">
              <div>Name: <strong>Prakash Ramakrishnan</strong></div>
              <div>Title: <strong>Founder &amp; Super Admin</strong></div>
              <div>Designation: <strong>Executive Leadership Signatory</strong></div>
              <div>Jurisdiction: <strong>Tamil Nadu, India</strong></div>
              <div class="sig-seal-badge">OFFICIAL CORPORATE SEAL • VERIFIED</div>
            </div>
          </div>

          <div class="sig-card freelancer-card">
            <div class="sig-header">Digitally Accepted &amp; Executed by Freelancer:</div>
            <div class="sig-company-name">${application.fullName}</div>
            <div class="sig-line-box">
              <div class="sig-handwritten" style="color: #047857;">${application.agreementSignature || application.fullName}</div>
              <div class="sig-rule" style="border-color: #047857;"></div>
            </div>
            <div class="sig-details">
              <div>Legal Signature: <strong>${application.agreementSignature || application.fullName}</strong></div>
              <div>Affirmation: <strong>&ldquo;${application.agreementAffirmationWord || 'I AGREE AND ACCEPT'}&rdquo;</strong></div>
              <div>Timestamp: <strong>${signDateFormatted} ${signTimeFormatted}</strong></div>
              <div>Signer IP / Session: <strong>${application.agreementSignerIp || 'Verified Web Session'}</strong></div>
              <div class="sig-statute-badge">&#10003; SEC 10A IT ACT 2000 • STATUTORILY VALID</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-note">
        Reference: ${application.referenceCode} • Permanent Statutory Record Stored in Fusion Engine Technology Document Vault (/portal/documents)
      </div>
    </body>
    </html>
  `;

  const handleDownloadHtml = () => {
    const htmlBlob = new Blob([generateFullDocumentHtml()], { type: 'text/html;charset=utf-8' });
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
                    <CheckCircle2 className="w-3 h-3" /> Signed &amp; Enforceable
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Certified electronic contract record and deliverable specification
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

        {/* Agreement Legal Text Viewer with matching typography and structured tables */}
        <div
          ref={printRef}
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          className="agreement-preview-scroll p-6 sm:p-10 rounded-xl border border-border/60 bg-white text-slate-900 select-text shadow-inner overflow-y-auto max-h-[500px] space-y-4 leading-relaxed"
        >
          {/* Inject matching styles for in-dialog preview */}
          <style>{`
            .agreement-preview-scroll .clause-header {
              font-family: 'Times New Roman', Georgia, serif;
              font-size: 11.5pt;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.75px;
              color: #0f172a;
              margin-top: 18px;
              margin-bottom: 8px;
              padding-bottom: 3px;
            }
            .agreement-preview-scroll .sub-clause-header {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #0f172a;
              background: #f8fafc;
              border-left: 3px solid #0284c7;
              padding: 3px 8px;
              margin-top: 10px;
              margin-bottom: 6px;
            }
            .agreement-preview-scroll .clause-text {
              font-size: 10pt;
              line-height: 1.62;
              text-align: justify;
              text-justify: inter-word;
              margin-bottom: 8px;
              color: #0f172a;
            }
            .agreement-preview-scroll .contract-spec-table {
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0 14px 0;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 9.5pt;
            }
            .agreement-preview-scroll .contract-spec-table td {
              border: 1.5px solid #0f172a;
              padding: 6px 12px;
              vertical-align: middle;
            }
            .agreement-preview-scroll .contract-spec-table .spec-label {
              width: 32%;
              font-weight: 700;
              color: #0f172a;
              background-color: #f1f5f9;
              text-transform: uppercase;
              font-size: 8.5pt;
              letter-spacing: 0.5px;
            }
            .agreement-preview-scroll .contract-spec-table .spec-value {
              width: 68%;
              color: #0f172a;
              font-weight: 500;
            }
            .agreement-preview-scroll .clause-bullets {
              margin: 6px 0 12px 24px;
              padding-left: 8px;
              list-style-type: square;
            }
            .agreement-preview-scroll .clause-bullets li {
              font-size: 9.8pt;
              line-height: 1.6;
              margin-bottom: 5px;
              text-align: justify;
              color: #0f172a;
            }
          `}</style>

          {/* Formal Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-slate-900">
              FUSION ENGINE TECHNOLOGY
            </h2>
            <p className="text-sm font-bold text-sky-700 uppercase tracking-widest mt-0.5">
              Freelancer Onboarding &amp; Service Agreement
            </p>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              Innovate • Integrate • Accelerate &nbsp;|&nbsp; https://fusionengine.in &nbsp;|&nbsp; fusionenginetechnology@gmail.com
            </p>
            <div className="statute text-[11px] italic text-slate-500 font-sans mt-1">
              Statutory Electronic Execution under Section 10A of the Indian Information Technology Act, 2000 &amp; Indian Contract Act, 1872
            </div>
          </div>

          {/* Structured Legal Content */}
          <div
            className="text-left leading-relaxed text-slate-900"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />

          {/* Electronic Countersignature Certificate Stamp */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div className="p-4 rounded-lg border-2 border-slate-900 bg-slate-50 space-y-1.5">
              <span className="text-slate-600 font-bold uppercase text-[10px]">For Company:</span>
              <p className="font-bold text-sm text-slate-900">Fusion Engine Technology</p>
              <div className="border-b border-slate-900 pb-1 my-1">
                <p className="font-serif italic font-bold text-base text-slate-900">Prakash Ramakrishnan</p>
              </div>
              <div className="text-[11px] text-slate-700 leading-tight">
                <div><strong>Prakash Ramakrishnan</strong></div>
                <div>Founder &amp; Super Admin</div>
                <div>Executive Leadership Signatory</div>
                <div className="mt-2 inline-block border border-slate-900 px-2 py-0.5 rounded text-[9px] font-bold">
                  OFFICIAL CORPORATE SEAL • VERIFIED
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-emerald-700 bg-emerald-50/50 space-y-1.5">
              <span className="text-emerald-700 font-bold uppercase text-[10px]">Digitally Accepted By Freelancer:</span>
              <p className="font-bold text-sm text-slate-900">{application.fullName}</p>
              <div className="border-b border-emerald-700 pb-1 my-1">
                <p className="font-serif italic font-bold text-emerald-800 text-base">{application.agreementSignature || application.fullName}</p>
              </div>
              <div className="text-[11px] text-slate-700 leading-tight space-y-0.5">
                <div>Legal Signature: <strong>{application.agreementSignature || application.fullName}</strong></div>
                <div>Affirmation: <strong>&ldquo;{application.agreementAffirmationWord || 'I AGREE AND ACCEPT'}&rdquo;</strong></div>
                <div>Certified on: <strong>{signDateFormatted} {signTimeFormatted}</strong></div>
                <div>Signer IP: <strong>{application.agreementSignerIp || 'Verified Web Session'}</strong></div>
                <div className="mt-2 inline-block border border-emerald-700 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                  ✓ SEC 10A IT ACT 2000 • STATUTORILY VALID
                </div>
              </div>
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
