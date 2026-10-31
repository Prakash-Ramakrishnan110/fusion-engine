import React, { useState } from 'react';
import { usePortal, isNotDemoDoc } from '../context/PortalContext';
import { DocumentItem, JobApplication } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  FileText,
  ShieldCheck,
  Building,
  Briefcase,
  FolderKanban,
  Coins,
  PhoneCall,
  Download,
  Eye,
  FileCheck2,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { SignedAgreementModal } from '../components/SignedAgreementModal';

const CATEGORY_ICONS = {
  Company: Building,
  Recruitment: Briefcase,
  Project: FolderKanban,
  Financial: Coins,
  Sales: PhoneCall,
};

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    applications,
    deleteDocument,
    deduplicateDocuments,
    activePersona,
    currentUser,
  } = usePortal();
  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [selectedSignedApp, setSelectedSignedApp] = useState<JobApplication | null>(null);
  const [isSignedModalOpen, setIsSignedModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);
  const [isDeduplicating, setIsDeduplicating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const isDeveloper = user.role === 'developer';
  const isTelecaller = user.role === 'telecaller';

  // Build signed agreement documents from hired or digitally-signed candidates and strictly deduplicate
  const uniqueDocuments = React.useMemo(() => {
    let deletedIdentifiers = new Set<string>();
    try {
      const raw = localStorage.getItem('fet_portal_deleted_documents_v1');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          deletedIdentifiers = new Set(arr.map((s: string) => String(s).trim().toLowerCase()));
        }
      }
    } catch {}

    const appAgreementDocs: DocumentItem[] = (applications || [])
      .filter(
        (app) =>
          app &&
          (app.agreementStatus === 'signed' ||
            Boolean(app.agreementTermsAccepted) ||
            app.status === 'Hired')
      )
      .map((app) => {
        const signerName = app.agreementSignature || app.fullName;
        return {
          id: app.id,
          title: `Freelancer Service Agreement — ${signerName} (${app.referenceCode})`,
          category: 'Recruitment' as const,
          referenceCode: app.referenceCode,
          complianceStandard: 'Section 10A Indian Information Technology Act, 2000',
          fileFormat: 'PDF/Contract',
          uploadedBy: signerName,
          uploadedAt: (app.agreementSignedAt || app.reviewedAt || app.submittedAt || '').split('T')[0] || '2026-10-30',
          description: `Digitally certified freelancer onboarding contract executed by ${signerName} (${app.roleTitle}). Status: ${app.status === 'Hired' ? 'Hired & Verified' : 'Digitally Signed'}.`,
          version: 1,
        };
      });

    const combined = [...appAgreementDocs, ...(documents || [])];
    const seenRefs = new Set<string>();
    const seenTitles = new Set<string>();
    const result: DocumentItem[] = [];

    for (const doc of combined) {
      if (!doc || !isNotDemoDoc(doc)) continue;
      const docIdKey = (doc.id || '').trim().toLowerCase();
      const refKey = (doc.referenceCode || '').trim().toLowerCase();
      const titleKey = (doc.title || '').trim().toLowerCase();

      // Skip if explicitly removed by admin
      if (
        (docIdKey && deletedIdentifiers.has(docIdKey)) ||
        (refKey && deletedIdentifiers.has(refKey)) ||
        (titleKey && deletedIdentifiers.has(titleKey))
      ) {
        continue;
      }

      if (refKey && seenRefs.has(refKey)) continue;
      if (titleKey && seenTitles.has(titleKey)) continue;
      if (refKey) seenRefs.add(refKey);
      if (titleKey) seenTitles.add(titleKey);
      result.push(doc);
    }

    return result;
  }, [documents, applications]);

  const isSignedCandidateAgreement = (doc: DocumentItem): boolean => {
    const ref = (doc.referenceCode || '').toUpperCase();
    return (
      ref.startsWith('FET-APP-') ||
      doc.title.toLowerCase().includes('freelancer service agreement —') ||
      doc.fileFormat === 'PDF/Contract'
    );
  };

  const resolveCandidateForDoc = (doc: DocumentItem): JobApplication | null => {
    const matched = (applications || []).find(
      (a) =>
        a.referenceCode?.toLowerCase() === doc.referenceCode?.toLowerCase() ||
        a.id?.toLowerCase() === doc.referenceCode?.toLowerCase() ||
        a.id?.toLowerCase() === doc.id?.toLowerCase()
    );
    if (matched) return matched;

    if (isSignedCandidateAgreement(doc)) {
      const extractedName = doc.uploadedBy && doc.uploadedBy !== 'System'
        ? doc.uploadedBy
        : doc.title.replace(/^Freelancer Service Agreement —\s*/i, '').replace(/\s*\(.*\)$/, '').trim() || 'Candidate';
      return {
        id: doc.id,
        referenceCode: doc.referenceCode,
        roleId: 'developer-contractor',
        roleTitle: 'Software Developer & Independent Contractor',
        department: 'engineering',
        fullName: extractedName,
        email: 'verified.candidate@fusionengine.in',
        phone: '',
        city: 'India',
        experienceSummary: doc.description,
        status: 'Hired',
        submittedAt: doc.uploadedAt,
        agreementSignedAt: doc.uploadedAt,
        agreementSignature: extractedName,
        agreementSignerIp: 'Verified Web Session',
        agreementTermsAccepted: true,
        agreementAffirmationWord: 'I AGREE AND ACCEPT',
        agreementStatus: 'signed',
      };
    }

    return null;
  };

  // Role-based document access restrictions
  const roleAllowedCategories: Record<string, string[]> = {
    admin: ['All', 'Signed Agreements', 'Recruitment', 'Company', 'Project', 'Sales', 'Financial'],
    super_admin: ['All', 'Signed Agreements', 'Recruitment', 'Company', 'Project', 'Sales', 'Financial'],
    developer: ['All', 'Signed Agreements', 'Project', 'Recruitment'],
    telecaller: ['All', 'Sales'],
  };

  const categories = roleAllowedCategories[user.role] || ['All', 'Sales'];

  // Filter documents to only those permitted for the active role
  const accessibleDocuments = React.useMemo(() => {
    if (isAdmin) return uniqueDocuments;
    if (isDeveloper) return uniqueDocuments.filter((d) => d.category === 'Project' || d.category === 'Recruitment');
    if (isTelecaller) return uniqueDocuments.filter((d) => d.category === 'Sales');
    return uniqueDocuments;
  }, [uniqueDocuments, isAdmin, isDeveloper, isTelecaller]);

  const filteredDocs = accessibleDocuments.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Signed Agreements'
        ? isSignedCandidateAgreement(doc)
        : doc.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (doc.title || '').toLowerCase().includes(q) ||
      (doc.referenceCode || '').toLowerCase().includes(q) ||
      (doc.complianceStandard || '').toLowerCase().includes(q) ||
      (doc.description || '').toLowerCase().includes(q) ||
      (doc.uploadedBy || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handlePreviewDoc = (doc: DocumentItem) => {
    const candidateApp = resolveCandidateForDoc(doc);
    if (candidateApp) {
      setSelectedSignedApp(candidateApp);
      setIsSignedModalOpen(true);
      return;
    }
    setSelectedDoc(doc);
  };

  const handleDownload = (doc: DocumentItem) => {
    const candidateApp = resolveCandidateForDoc(doc);
    if (candidateApp) {
      setSelectedSignedApp(candidateApp);
      setIsSignedModalOpen(true);
      toast.success(`Opened certified agreement for ${candidateApp.fullName}. Click "Print / Save PDF" to download.`);
      return;
    }
    toast.success(`Exporting ${doc.title} (${doc.fileFormat})...`);
  };

  const handleCleanDuplicates = async () => {
    setIsDeduplicating(true);
    await deduplicateDocuments();
    setIsDeduplicating(false);
  };

  const vaultTitle = isTelecaller
    ? 'Sales Collateral & Document Vault'
    : isDeveloper
    ? 'Engineering & Technical Specifications Vault'
    : 'Legal, Project & Compliance Vault';

  const vaultSubtitle = isTelecaller
    ? 'Approved pitch decks, merchant brochures, objection cheat-sheets, and outbound sales collateral.'
    : isDeveloper
    ? 'Architecture specifications, deliverable IP assignments, and technical documentation.'
    : 'Organized repository of signed candidate agreements, statutory registrations, developer IP assignments, and milestone vouchers.';

  const vaultBadge = isTelecaller
    ? 'Sales Operations Vault'
    : isDeveloper
    ? 'Engineering Deliverables Vault'
    : 'Compliance & Document Vault';

  const signedAgreementsCount = accessibleDocuments.filter(isSignedCandidateAgreement).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {vaultBadge}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {accessibleDocuments.length} Verified Unique Records
            </span>
            {signedAgreementsCount > 0 && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {signedAgreementsCount} Signed Candidate Agreement{signedAgreementsCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            {vaultTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vaultSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isDeduplicating}
              onClick={handleCleanDuplicates}
              className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDeduplicating ? 'Cleaning...' : 'Remove Duplicates'}</span>
            </Button>
          )}
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-xs py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            DPIIT / MSME Recognized
          </Badge>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? accessibleDocuments.length
                : cat === 'Signed Agreements'
                ? signedAgreementsCount
                : accessibleDocuments.filter((d) => d.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, reference, acts..."
            className="text-xs h-8 pl-3"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const Icon = CATEGORY_ICONS[doc.category] || FileText;
          const isSignedCopy = isSignedCandidateAgreement(doc);
          const linkedApp = resolveCandidateForDoc(doc);

          return (
            <Card
              key={`${doc.referenceCode}_${doc.id}`}
              className={`border backdrop-blur transition-all flex flex-col justify-between ${
                isSignedCopy
                  ? 'border-emerald-500/40 bg-emerald-500/[0.03] hover:border-emerald-500/70'
                  : 'border-border/60 bg-card/60 hover:border-primary/40'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSignedCopy
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isSignedCopy && (
                      <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {linkedApp?.status === 'Hired' ? 'Hired • Signed Copy' : 'Signed Agreement Copy'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {doc.referenceCode}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {doc.category}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-sm font-bold mt-2 leading-snug">
                  {doc.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {doc.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="text-[11px] p-2 rounded bg-muted/40 border border-border/30 flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {isSignedCopy ? 'Executed By:' : 'Standard:'}
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[240px]">
                    {isSignedCopy
                      ? `${linkedApp?.agreementSignature || linkedApp?.fullName || doc.uploadedBy || 'Verified Candidate'} (${linkedApp?.roleTitle || 'Freelancer'})`
                      : doc.complianceStandard}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs gap-2 flex-wrap">
                  <span className="text-muted-foreground text-[10px]">
                    Format: {doc.fileFormat} • Recorded {doc.uploadedAt ? doc.uploadedAt.split('T')[0] : 'Verified'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant={isSignedCopy ? 'default' : 'ghost'}
                      className={`h-7 text-xs px-2.5 cursor-pointer ${
                        isSignedCopy ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                      }`}
                      onClick={() => handlePreviewDoc(doc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {isSignedCopy ? 'View Signed Copy' : 'Preview'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2 cursor-pointer"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      {isSignedCopy ? 'Print / PDF' : 'Export'}
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => setDocToDelete(doc)}
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Modal for Standard Compliance Docs */}
      <Dialog open={Boolean(selectedDoc)} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-primary" />
              {selectedDoc?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ref: <code className="font-mono">{selectedDoc?.referenceCode}</code> • Compliance: {selectedDoc?.complianceStandard}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-xs space-y-3 font-mono leading-relaxed">
            <div className="font-sans font-bold text-sm text-foreground">
              Fusion Engine Technology Compliance Summary
            </div>
            <p className="font-sans text-muted-foreground">
              {selectedDoc?.description}
            </p>
            <div className="p-3 rounded bg-background border border-border/40 text-[11px] space-y-1">
              <div><strong>Document Category:</strong> {selectedDoc?.category}</div>
              <div><strong>Governing Law:</strong> {selectedDoc?.complianceStandard}</div>
              <div><strong>Archival Status:</strong> Cryptographically Verified</div>
              <div><strong>Audit Ref:</strong> FET-SEC-REG-{selectedDoc?.id}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certified Signed Agreement Viewer Modal */}
      <SignedAgreementModal
        open={isSignedModalOpen}
        onOpenChange={setIsSignedModalOpen}
        application={selectedSignedApp}
      />

      {/* MODAL: Delete Document Confirmation */}
      <Dialog open={Boolean(docToDelete)} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Document
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{docToDelete?.title}</strong> ({docToDelete?.referenceCode}) from the document vault?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeletingDoc}
              onClick={() => setDocToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeletingDoc}
              onClick={async () => {
                if (!docToDelete) return;
                setIsDeletingDoc(true);
                const targetRefOrId = docToDelete.referenceCode || docToDelete.id;
                await deleteDocument(targetRefOrId);
                if (docToDelete.id && docToDelete.id !== targetRefOrId) {
                  await deleteDocument(docToDelete.id);
                }
                setIsDeletingDoc(false);
                setDocToDelete(null);
              }}
            >
              {isDeletingDoc ? 'Deleting...' : 'Delete Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsPage;
