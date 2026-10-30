import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Send,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Star,
  UserCheck,
  UserX,
  Loader2,
  Sparkles,
  KeyRound,
  RefreshCw,
  Code2,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { JobApplication } from '../types';
import {
  getCandidateEmailTemplate,
  sendCandidateEmail,
  generateMailtoLink,
  generateGmailComposeUrl,
} from '../services/recruitmentEmailService';

interface CandidateEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication | null;
  targetStatus: 'Shortlisted' | 'Hired' | 'Rejected' | 'Under Review' | string;
  onStatusUpdated: (
    applicationId: string,
    status: JobApplication['status'],
    emailMeta?: { sentAt: string; emailType: string }
  ) => Promise<void>;
  onProvisionCandidate?: (application: JobApplication) => void;
  onCreateUser?: (userData: {
    userId: string;
    fullName: string;
    role: 'admin' | 'developer' | 'telecaller';
    department: string;
    phone?: string;
    temporaryPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const CandidateEmailModal: React.FC<CandidateEmailModalProps> = ({
  open,
  onOpenChange,
  application,
  targetStatus,
  onStatusUpdated,
  onProvisionCandidate,
  onCreateUser,
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hireUserId, setHireUserId] = useState('');
  const [hirePassword, setHirePassword] = useState('Welcome@2026!');
  const [hireRole, setHireRole] = useState<'developer' | 'telecaller' | 'admin'>('developer');

  // Pre-fill suggested User ID, Temporary Password, and Role when candidate is opened
  useEffect(() => {
    if (application) {
      const suggestedUserId = application.fullName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.')
        .slice(0, 20);
      setHireUserId(suggestedUserId);
      setHirePassword('Welcome@2026!');
      const defaultRole: 'developer' | 'telecaller' | 'admin' =
        application.department === 'sales' || application.roleTitle?.toLowerCase().includes('telecaller')
          ? 'telecaller'
          : 'developer';
      setHireRole(defaultRole);
    }
  }, [application]);

  // Sync templates when application, targetStatus, hireUserId, hirePassword, or hireRole changes
  useEffect(() => {
    if (application && targetStatus) {
      const template = getCandidateEmailTemplate(
        application,
        targetStatus,
        targetStatus === 'Hired'
          ? {
              userId: hireUserId || application.email.split('@')[0],
              temporaryPassword: hirePassword || 'Welcome@2026!',
              role: hireRole,
              loginUrl: 'https://www.fusionengine.in/portal/login',
            }
          : undefined
      );
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [application, targetStatus, hireUserId, hirePassword, hireRole]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setHirePassword(`Pass@${res}`);
  };

  const autoProvisionIfHired = async () => {
    if (targetStatus === 'Hired' && onCreateUser && application) {
      try {
        const cleanId = (hireUserId.trim() || application.email.split('@')[0]).toLowerCase();
        const roleDept =
          hireRole === 'telecaller'
            ? 'Inside Sales & CRM Pipeline'
            : hireRole === 'admin'
            ? 'Executive Leadership & Administration'
            : 'Engineering';

        await onCreateUser({
          userId: cleanId,
          fullName: application.fullName.trim(),
          role: hireRole,
          department: roleDept,
          phone: application.phone?.trim(),
          temporaryPassword: hirePassword.trim() || 'Welcome@2026!',
        });
      } catch (e) {
        console.warn('Auto-provision note:', e);
      }
    }
  };

  if (!application) return null;

  const getStatusBadge = () => {
    switch (targetStatus) {
      case 'Shortlisted':
        return (
          <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-blue-500" /> Shortlisting Candidate
          </Badge>
        );
      case 'Hired':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 gap-1 text-xs">
            <UserCheck className="w-3.5 h-3.5" /> Extending Offer / Hiring
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/30 gap-1 text-xs">
            <UserX className="w-3.5 h-3.5" /> Candidate Rejection Notice
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Updating Status to {targetStatus}
          </Badge>
        );
    }
  };

  // 1. Send via EmailJS and update status
  const handleSendEmailAndApply = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Subject and email message cannot be empty.');
      return;
    }

    setIsSending(true);
    const emailRes = await sendCandidateEmail({
      toEmail: application.email,
      toName: application.fullName,
      roleTitle: application.roleTitle,
      referenceCode: application.referenceCode,
      status: targetStatus,
      subject: subject.trim(),
      body: body.trim(),
    });
    setIsSending(false);

    const now = new Date().toISOString();
    const emailMeta = {
      sentAt: now,
      emailType: targetStatus,
    };

    if (emailRes.success) {
      toast.success(`Email dispatched to ${application.email}!`);
    } else {
      toast.warning(`Status updated, but direct email delivery returned: ${emailRes.error || 'Network error'}. You can also use the mailto button.`);
    }

    await autoProvisionIfHired();
    await onStatusUpdated(application.id, targetStatus as any, emailMeta);
    onOpenChange(false);
  };

  // 2. Open directly in Gmail Web compose (100% exact subject, NO EmailJS wrapper)
  const handleGmailAndApply = async () => {
    const gmailUrl = generateGmailComposeUrl(application.email, subject, body);
    window.open(gmailUrl, '_blank');

    const now = new Date().toISOString();
    await autoProvisionIfHired();
    await onStatusUpdated(application.id, targetStatus as any, {
      sentAt: now,
      emailType: `${targetStatus} (via Gmail)`,
    });
    toast.success(`Gmail opened with exact subject and status updated to ${targetStatus}!`);
    onOpenChange(false);
  };

  // 3. Open in native mail client (mailto:) and update status
  const handleMailtoAndApply = async () => {
    const mailtoUrl = generateMailtoLink(application.email, subject, body);
    window.open(mailtoUrl, '_blank');

    const now = new Date().toISOString();
    await autoProvisionIfHired();
    await onStatusUpdated(application.id, targetStatus as any, {
      sentAt: now,
      emailType: `${targetStatus} (via Mail Client)`,
    });
    toast.success(`Mail client opened and status updated to ${targetStatus}!`);
    onOpenChange(false);
  };

  // 4. Update status without email
  const handleUpdateOnly = async () => {
    await autoProvisionIfHired();
    await onStatusUpdated(application.id, targetStatus as any);
    toast.info(`Candidate status updated to ${targetStatus} without sending email.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Candidate Status & Email Notification
            </DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Review and personalize the notification email for{' '}
            <strong className="text-foreground">{application.fullName}</strong> ({application.email}).
          </DialogDescription>
        </DialogHeader>

        {/* Candidate Context Pill */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{application.fullName}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-primary font-medium">{application.roleTitle}</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-mono text-muted-foreground">{application.referenceCode}</span>
          </div>
          <div className="text-muted-foreground">
            Recipient: <span className="font-mono text-foreground">{application.email}</span>
          </div>
        </div>

        {/* If Hired: Auto-Provision Login Credentials Card */}
        {targetStatus === 'Hired' && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                Workforce Credentials to Provision & Send:
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                Password Reset on First Login
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  User ID / Username *
                </label>
                <Input
                  value={hireUserId}
                  onChange={(e) => setHireUserId(e.target.value)}
                  className="text-xs font-mono h-8 bg-card"
                  placeholder="e.g. john.doe"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1 flex items-center justify-between">
                  <span>Temporary Password *</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-generate
                  </button>
                </label>
                <Input
                  value={hirePassword}
                  onChange={(e) => setHirePassword(e.target.value)}
                  className="text-xs font-mono h-8 bg-card"
                  placeholder="Temporary password"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Assigned Portal Role *
                </label>
                <Select
                  value={hireRole}
                  onValueChange={(val: 'developer' | 'telecaller' | 'admin') => setHireRole(val)}
                >
                  <SelectTrigger className="text-xs h-8 bg-card">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer" className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Developer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="telecaller" className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                        <span>Telecaller</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin" className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              These credentials and the 5-step login guide are automatically written into the email below and active in the portal immediately.
            </p>
          </div>
        )}

        {/* Agreement Shortcut for Shortlisted Candidates */}
        {targetStatus === 'Shortlisted' && (
          <div className="p-3.5 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-mono">
                  IT Act 2000
                </Badge>
                <span className="font-semibold text-xs text-foreground">Freelancer Onboarding & Service Agreement</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(`/agreement?ref=${application.referenceCode}`, '_blank')}
                className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Agreement Sign Link</span>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A personalized digital signing link (<code className="text-primary font-mono text-[10px] bg-muted px-1 py-0.5 rounded">/agreement?ref={application.referenceCode}</code>) has been included in the email body below. Once the candidate signs on their phone or laptop, their status will automatically update in your portal!
            </p>
          </div>
        )}

        {/* Email Composer */}
        <div className="space-y-3.5 py-1 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center justify-between">
              <span>Email Subject</span>
              <span className="text-[11px] text-muted-foreground font-normal">Pre-filled with official template</span>
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line..."
              className="text-xs h-9 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center justify-between">
              <span>Email Message Body</span>
              <span className="text-[11px] text-muted-foreground font-normal">Editable before sending</span>
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={11}
              className="text-xs font-mono leading-relaxed resize-y"
              placeholder="Candidate email body..."
            />
          </div>

          {/* Email Template Advice Banner */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Recommended for 100% Clean Formatting:</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Use <strong className="text-foreground">"Open in Gmail"</strong> to send this exact subject line and letter directly from your company Gmail with zero contact-form wrappers. If using <strong>"Send via EmailJS"</strong>, remember to set your EmailJS template subject to <code className="text-primary font-mono bg-muted px-1 py-0.5 rounded">{'{{name}}'}</code>.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUpdateOnly}
            className="text-xs text-muted-foreground hover:text-foreground justify-center"
            disabled={isSending}
          >
            Update Without Email
          </Button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGmailAndApply}
              className="text-xs gap-1.5 bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20 font-semibold"
              disabled={isSending}
              title="Open draft directly in Gmail with exact subject and clean letter format"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Gmail (Recommended)
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMailtoAndApply}
              className="text-xs gap-1.5"
              disabled={isSending}
              title="Open draft in default desktop email app"
            >
              <Mail className="w-3.5 h-3.5" />
              Mail App
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSendEmailAndApply}
              className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send via EmailJS
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CandidateEmailModal;
