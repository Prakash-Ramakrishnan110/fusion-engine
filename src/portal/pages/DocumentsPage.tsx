import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { DocumentItem } from '../types';
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
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
  Company: Building,
  Recruitment: Briefcase,
  Project: FolderKanban,
  Financial: Coins,
  Sales: PhoneCall,
};

export const DocumentsPage: React.FC = () => {
  const { documents, deleteDocument, activePersona, currentUser } = usePortal();
  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');


  const isDeveloper = user.role === 'developer';
  const isTelecaller = user.role === 'telecaller';

  // Automatic deduplication by referenceCode & title
  const uniqueDocuments = React.useMemo(() => {
    const seen = new Set<string>();
    return documents.filter((doc) => {
      const key = `${doc.referenceCode.trim().toLowerCase()}_${doc.title.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [documents]);

  // Role-based document access restrictions
  const roleAllowedCategories: Record<string, string[]> = {
    admin: ['All', 'Company', 'Recruitment', 'Project', 'Sales', 'Financial'],
    super_admin: ['All', 'Company', 'Recruitment', 'Project', 'Sales', 'Financial'],
    developer: ['All', 'Project', 'Recruitment'],
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
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.complianceStandard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    toast.success(`Exporting ${doc.title} (${doc.fileFormat})...`);
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
    : 'Organized repository of statutory registrations, developer IP assignments, sales scripts, and milestone vouchers.';

  const vaultBadge = isTelecaller
    ? 'Sales Operations Vault'
    : isDeveloper
    ? 'Engineering Deliverables Vault'
    : 'Compliance & Document Vault';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {vaultBadge}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {accessibleDocuments.length} Verified Records
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            {vaultTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vaultSubtitle}
          </p>
        </div>

        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-xs py-1 px-3">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          DPIIT / MSME Recognized
        </Badge>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const count = cat === 'All' ? accessibleDocuments.length : accessibleDocuments.filter(d => d.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
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
            placeholder="Search documents, reference, acts..."
            className="text-xs h-8 pl-3"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const Icon = CATEGORY_ICONS[doc.category] || FileText;

          return (
            <Card
              key={doc.id}
              className="border-border/60 bg-card/60 backdrop-blur hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
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
                <div className="text-[11px] p-2 rounded bg-muted/40 border border-border/30 flex justify-between">
                  <span className="text-muted-foreground">Standard:</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">
                    {doc.complianceStandard}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[10px]">
                    Format: {doc.fileFormat} • Added {doc.uploadedAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Export
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

      {/* Preview Modal */}
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
                await deleteDocument(docToDelete.id);
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
