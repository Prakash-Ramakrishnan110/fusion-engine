import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Project, ProjectMember, UserPersona } from '../types';
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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Trash2, CheckCircle2, ShieldCheck, Code2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectDeveloperAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

interface MemberRow {
  profileId: string;
  projectRole: ProjectMember['projectRole'];
  allocationPct: number;
  rate: number;
  payModel: ProjectMember['payModel'];
}

export const ProjectDeveloperAllocationModal: React.FC<ProjectDeveloperAllocationModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { users, projects, assignDevelopersToProject } = usePortal();

  // Eligible developers & engineers (excluding pure telecallers)
  const eligibleDevelopers = users.filter((u) => u.role === 'developer' || u.role === 'admin' || u.role === 'super_admin');

  const [memberRows, setMemberRows] = useState<MemberRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project?.members && project.members.length > 0) {
      setMemberRows(
        project.members.map((m) => ({
          profileId: m.profileId,
          projectRole: m.projectRole,
          allocationPct: m.allocationPct || 50,
          rate: m.rate || 35000,
          payModel: m.payModel || 'per_module',
        }))
      );
    } else {
      // Default to first eligible developer if roster is empty
      if (eligibleDevelopers.length > 0) {
        setMemberRows([
          {
            profileId: eligibleDevelopers[0].id,
            projectRole: 'tech_lead',
            allocationPct: 100,
            rate: 45000,
            payModel: 'per_module',
          },
        ]);
      } else {
        setMemberRows([]);
      }
    }
  }, [project, isOpen]);

  const handleAddMember = () => {
    // Find first developer not yet added
    const alreadyAddedIds = memberRows.map((r) => r.profileId);
    const availableDev = eligibleDevelopers.find((d) => !alreadyAddedIds.includes(d.id)) || eligibleDevelopers[0];

    if (!availableDev) {
      toast.error('No more developers available in workforce directory.');
      return;
    }

    setMemberRows((prev) => [
      ...prev,
      {
        profileId: availableDev.id,
        projectRole: 'developer',
        allocationPct: 50,
        rate: 35000,
        payModel: 'per_module',
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setMemberRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof MemberRow, value: any) => {
    setMemberRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (memberRows.length === 0) {
      toast.error('Please assign at least one team member to this project.');
      return;
    }

    // Check for duplicate assignments
    const profileIds = memberRows.map((r) => r.profileId);
    const hasDuplicates = new Set(profileIds).size !== profileIds.length;
    if (hasDuplicates) {
      toast.error('Duplicate developer selected. Each team member should be assigned once per project with an allocation percentage.');
      return;
    }

    setIsSaving(true);
    const res = await assignDevelopersToProject(project.id, memberRows);
    setIsSaving(false);

    if (res.success) {
      onClose();
    } else {
      toast.error(res.error || 'Failed to save project team.');
    }
  };

  // Helper to count how many other projects a developer is on
  const getDevProjectCount = (profileId: string) => {
    return projects.filter(
      (p) => p.id !== project.id && p.members?.some((m) => m.profileId === profileId)
    ).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Multi-Developer Project Assignment
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{project.code}</span>
          </div>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Allocate Developers & Assign Roles: {project.name}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Select engineers from your workforce directory, specify their exact project specialization (Frontend, Backend, QA, Tech Lead), and balance workload capacity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              Assigned Engineers ({memberRows.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMember}
              className="text-xs h-7 gap-1 text-primary border-primary/30 hover:bg-primary/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Developer</span>
            </Button>
          </div>

          <div className="space-y-3">
            {memberRows.map((row, index) => {
              const currentDev = users.find((u) => u.id === row.profileId);
              const otherProjectsCount = getDevProjectCount(row.profileId);

              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    {/* Developer Selection */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Developer</label>
                      <Select
                        value={row.profileId}
                        onValueChange={(val) => handleRowChange(index, 'profileId', val)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue placeholder="Select Developer" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleDevelopers.map((dev) => {
                            const count = getDevProjectCount(dev.id);
                            return (
                              <SelectItem key={dev.id} value={dev.id} className="text-xs">
                                {dev.name} ({dev.title || dev.role}) - {count} other project{count !== 1 ? 's' : ''}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span>Workload:</span>
                        <span className={otherProjectsCount >= 2 ? 'text-amber-500 font-semibold' : 'text-emerald-500'}>
                          {otherProjectsCount} other active project{otherProjectsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Role in Project */}
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Project Role</label>
                      <Select
                        value={row.projectRole}
                        onValueChange={(val: any) => handleRowChange(index, 'projectRole', val)}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech_lead" className="text-xs font-semibold text-purple-400">Tech Lead / Architect</SelectItem>
                          <SelectItem value="frontend" className="text-xs">Frontend Engineer</SelectItem>
                          <SelectItem value="backend" className="text-xs">Backend API Engineer</SelectItem>
                          <SelectItem value="fullstack" className="text-xs">Fullstack Engineer</SelectItem>
                          <SelectItem value="qa" className="text-xs text-blue-400">QA & Test Automation</SelectItem>
                          <SelectItem value="ui_ux" className="text-xs text-amber-400">UI/UX Designer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Allocation % */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Allocation %</label>
                      <Input
                        type="number"
                        min="10"
                        max="100"
                        step="10"
                        value={row.allocationPct}
                        onChange={(e) => handleRowChange(index, 'allocationPct', Number(e.target.value))}
                        className="text-xs h-8 font-mono"
                      />
                    </div>

                    {/* Compensation Rate */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Rate (₹)</label>
                      <Input
                        type="number"
                        value={row.rate}
                        onChange={(e) => handleRowChange(index, 'rate', Number(e.target.value))}
                        className="text-xs h-8 font-mono"
                      />
                    </div>

                    {/* Delete Row Button */}
                    <div className="sm:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRow(index)}
                        disabled={memberRows.length <= 1}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/40 text-[11px] text-muted-foreground flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Project Boundary Isolation:</strong> Assigned engineers gain dedicated access to this project's tasks, repos, and private team chat room. Developers not assigned to this project will focus on their respective assigned deliverables.
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving ? 'Allocating Team...' : 'Save Team Allocation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

