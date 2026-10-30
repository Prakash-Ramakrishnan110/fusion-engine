import React from 'react';
import { usePortal } from '../context/PortalContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, ChevronDown, Check, Layers, Plus, Sparkles } from 'lucide-react';

interface ProjectSwitcherProps {
  onOpenNewProjectWizard?: () => void;
}

export const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({ onOpenNewProjectWizard }) => {
  const { currentUser, activePersona, projects, selectedProjectId, setSelectedProjectId } = usePortal();
  const user = currentUser || activePersona;

  // Telecaller is CRM-only; no project switcher needed
  if (user?.role === 'telecaller') {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        CRM Outreach Mode
      </div>
    );
  }

  // Developer sees only assigned projects
  const availableProjects = user?.role === 'developer'
    ? projects.filter((p) => p.members?.some((m) => m.profileId === user.id))
    : projects;

  const currentProject = selectedProjectId === 'all'
    ? null
    : availableProjects.find((p) => p.id === selectedProjectId);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-card/60 hover:bg-card border-border/60 text-xs font-medium gap-2 max-w-[240px] truncate"
        >
          <FolderKanban className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">
            {selectedProjectId === 'all'
              ? 'All Projects'
              : currentProject
              ? `${currentProject.code || 'PRJ'} - ${currentProject.name}`
              : 'Select Project'}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-1.5">
        <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
          <span>Project Workspace</span>
          <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
            {availableProjects.length} Active
          </Badge>
        </DropdownMenuLabel>

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => setSelectedProjectId('all')}
            className={`flex items-center justify-between text-xs py-2 px-2.5 rounded-md cursor-pointer ${
              selectedProjectId === 'all' ? 'bg-primary/10 text-primary font-semibold' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              <span>All Projects (Global Aggregate)</span>
            </div>
            {selectedProjectId === 'all' && <Check className="w-3.5 h-3.5 text-primary" />}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {availableProjects.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No projects assigned to your account.
            </div>
          ) : (
            availableProjects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              return (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`flex items-start justify-between text-xs py-2 px-2.5 rounded-md cursor-pointer ${
                    isSelected ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {p.clientName || 'Internal Client'} • ₹{(p.contractValueINR / 1000).toFixed(0)}k
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />}
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        {isAdmin && onOpenNewProjectWizard && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenNewProjectWizard}
              className="flex items-center gap-2 text-xs py-2 px-2.5 rounded-md text-primary font-medium hover:bg-primary/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Onboard New Project Wizard</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
