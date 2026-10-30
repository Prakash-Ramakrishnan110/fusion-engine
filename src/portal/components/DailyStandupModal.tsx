import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Calendar, Sparkles, Clock, Building } from 'lucide-react';
import { toast } from 'sonner';

interface DailyStandupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export const DailyStandupModal: React.FC<DailyStandupModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
}) => {
  const { projects, activeProjects, activePersona, currentUser, submitDailyStandup, dailyStandups } = usePortal();
  const user = currentUser || activePersona;

  const availableProjects = activeProjects.length > 0 ? activeProjects : projects;
  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultProjectId || availableProjects[0]?.id || ''
  );
  const [completedToday, setCompletedToday] = useState('');
  const [plannedTomorrow, setPlannedTomorrow] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Please select an assigned project.');
      return;
    }
    if (!completedToday.trim() || !plannedTomorrow.trim()) {
      toast.error('Please enter completed tasks and planned tasks.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitDailyStandup(
      selectedProjectId,
      completedToday.trim(),
      plannedTomorrow.trim(),
      blockers.trim() || undefined
    );
    setIsSubmitting(false);

    if (res.success) {
      setCompletedToday('');
      setPlannedTomorrow('');
      setBlockers('');
      onClose();
    }
  };

  const recentUpdates = dailyStandups.filter(
    (s) => s.projectId === selectedProjectId && s.developerId === user.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              MNC Standard Agile Standup
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Developer Daily Standup & EOD Progress Log
          </DialogTitle>
          <DialogDescription className="text-xs">
            Log your daily progress and highlight design/logic blockers early to eliminate rework and coordination delays.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Project Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Assigned Project *</label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name} ({p.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 1. What was completed today? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              1. What deliverables did you complete today? *
            </label>
            <Textarea
              value={completedToday}
              onChange={(e) => setCompletedToday(e.target.value)}
              placeholder="e.g. Built responsive QR ordering UI, implemented table state persistence, verified zero console warnings..."
              className="text-xs min-h-[75px]"
              required
            />
          </div>

          {/* 2. What will be worked on tomorrow? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              2. What are your planned deliverables for tomorrow? *
            </label>
            <Textarea
              value={plannedTomorrow}
              onChange={(e) => setPlannedTomorrow(e.target.value)}
              placeholder="e.g. Integrate WebSocket KOT ticket listener, write Jest tests for bill splitting..."
              className="text-xs min-h-[75px]"
              required
            />
          </div>

          {/* 3. Blockers / Impediments */}
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
            <label className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              3. Any Blockers, Ambiguities, or Design Questions? (Optional)
            </label>
            <p className="text-[11px] text-muted-foreground">
              Flagging a blocker immediately notifies the Tech Lead and Admin so you receive instant clarification instead of losing dev time.
            </p>
            <Textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. Missing Figma mockup for empty order state; need API token for SMS gateway integration..."
              className="text-xs min-h-[60px] border-rose-500/30 bg-background/60"
            />
          </div>

          {recentUpdates.length > 0 && (
            <div className="pt-2 border-t border-border/40 space-y-2">
              <div className="text-[11px] font-bold text-foreground">Recent Submissions for this Project:</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {recentUpdates.slice(0, 3).map((u) => (
                  <div key={u.id} className="p-2 rounded bg-muted/30 border border-border/40 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                      <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                      {u.hasBlocker && (
                        <Badge variant="outline" className="text-[9px] text-rose-500 border-rose-500/30">
                          Blocker Flagged
                        </Badge>
                      )}
                    </div>
                    <div className="text-foreground"><strong className="text-emerald-500">Done:</strong> {u.completedToday}</div>
                    {u.blockers && <div className="text-rose-400 font-semibold"><strong className="text-rose-500">Blocker:</strong> {u.blockers}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? 'Logging...' : 'Submit Standup Log'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

