import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FolderKanban, CheckSquare, PhoneCall, FileText, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { projects, tasks, leads, documents, setSelectedProjectId } = usePortal();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const matchedProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) : [];
  const matchedTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : [];
  const matchedLeads = q ? leads.filter((l) => l.businessName.toLowerCase().includes(q) || l.contactPerson.toLowerCase().includes(q) || l.phone.includes(q)) : [];
  const matchedDocs = q ? documents.filter((d) => d.title.toLowerCase().includes(q) || d.referenceCode.toLowerCase().includes(q)) : [];

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    navigate('/portal/projects');
    onClose();
  };

  const handleSelectTask = () => {
    navigate('/portal/tasks');
    onClose();
  };

  const handleSelectLead = () => {
    navigate('/portal/telecaller');
    onClose();
  };

  const handleSelectDoc = () => {
    navigate('/portal/documents');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border/40">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tasks, leads, or documents..."
              className="pl-9 pr-4 py-2 h-10 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Type to search across projects, tasks, leads, and document records.
            </div>
          )}

          {/* Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-primary" />
                <span>Projects ({matchedProjects.length})</span>
              </div>
              <div className="space-y-1">
                {matchedProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProject(p.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground ml-2">{p.code}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Tasks ({matchedTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={handleSelectTask}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold truncate">{t.title}</div>
                      <div className="text-[10px] text-muted-foreground">{t.projectName} • {t.assignedToName}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{t.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>CRM Leads ({matchedLeads.length})</span>
              </div>
              <div className="space-y-1">
                {matchedLeads.map((l) => (
                  <button
                    key={l.id}
                    onClick={handleSelectLead}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold">{l.businessName}</div>
                      <div className="text-[10px] text-muted-foreground">{l.contactPerson} • {l.phone} • {l.city}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{l.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Documents ({matchedDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={handleSelectDoc}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold">{d.title}</div>
                      <div className="text-[10px] text-muted-foreground">{d.referenceCode} • {d.category}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{d.fileFormat}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedProjects.length === 0 && matchedTasks.length === 0 && matchedLeads.length === 0 && matchedDocs.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
