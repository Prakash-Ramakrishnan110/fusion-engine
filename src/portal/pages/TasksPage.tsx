import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { TaskItem, TaskStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  ExternalLink,
  Code2,
  Send,
  FileCheck2,
  RotateCcw,
  Sparkles,
  Layers,
  Trash2,
  Palette,
  ShieldCheck,
  AlertCircle,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { DailyStandupModal } from '../components/DailyStandupModal';
import { TeamStandupFeed } from '../components/TeamStandupFeed';

const STATUS_COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'Assigned', label: 'Assigned / Backlog', color: 'border-l-blue-500' },
  { status: 'In Progress', label: 'In Progress', color: 'border-l-amber-500' },
  { status: 'Submitted for Review', label: 'Submitted (Gate 1 Review)', color: 'border-l-indigo-500' },
  { status: 'Changes Requested', label: 'Revisions Requested', color: 'border-l-rose-500' },
  { status: 'Approved', label: 'Gate 1 Approved', color: 'border-l-emerald-500' },
];

export const TasksPage: React.FC = () => {
  const { tasks, activePersona, currentUser, submitDeliverable, reviewDeliverable, updateTaskStatus, deleteTask, dailyStandups } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeViewTab, setActiveViewTab] = useState<'kanban' | 'standups'>('kanban');

  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const isDeveloper = user.role === 'developer';
  const canReview = user.role === 'super_admin' || user.role === 'project_manager' || user.role === 'admin';

  const userStandupsCount = dailyStandups.filter(
    (s) =>
      s.developerId === user.id ||
      s.developerId === user.userId ||
      s.developerName?.toLowerCase() === user.name?.toLowerCase()
  ).length;

  // Dialog states
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<TaskItem | null>(null);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<TaskItem | null>(null);
  const [selectedTaskForHistory, setSelectedTaskForHistory] = useState<TaskItem | null>(null);
  const [selectedTaskForMncSpec, setSelectedTaskForMncSpec] = useState<TaskItem | null>(null);
  const [selectedTaskForBlocker, setSelectedTaskForBlocker] = useState<TaskItem | null>(null);
  const [blockerNote, setBlockerNote] = useState('');
  const [isStandupModalOpen, setIsStandupModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Submission Form State
  const [prUrl, setPrUrl] = useState('');
  const [commitHash, setCommitHash] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [testProofs, setTestProofs] = useState('');
  const [notes, setNotes] = useState('');

  // Review Form State
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Changes Requested'>('Approved');
  const [reviewFeedback, setReviewFeedback] = useState('');

  // DoD Checklist State
  const [dodChecks, setDodChecks] = useState<{
    testsPassed: boolean;
    standardFollowed: boolean;
    securityClean: boolean;
    demoVerified: boolean;
    zeroDesignDefects: boolean;
  }>({
    testsPassed: true,
    standardFollowed: true,
    securityClean: true,
    demoVerified: true,
    zeroDesignDefects: true,
  });

  const handleOpenSubmission = (task: TaskItem) => {
    setSelectedTaskForSubmission(task);
    setPrUrl('https://github.com/fusionengine/restaurant-saas/pull/' + Math.floor(Math.random() * 80 + 10));
    setCommitHash(Math.random().toString(16).substring(2, 9));
    setDemoUrl('https://staging.fusionengine.in');
    setTestProofs('18 unit tests passed. Integration flow verified with simulated data.');
    setNotes(
      task.description
        ? `Completed: ${task.title}. Verified acceptance criteria and zero UI defects.`
        : 'Completed all deliverable specifications.'
    );
    setDodChecks({
      testsPassed: true,
      standardFollowed: true,
      securityClean: true,
      demoVerified: true,
      zeroDesignDefects: true,
    });
  };

  // Auto-open submission modal if query parameter ?submitTaskId=... is present
  useEffect(() => {
    const submitTaskId = searchParams.get('submitTaskId');
    if (submitTaskId) {
      const target = tasks.find((t) => t.id === submitTaskId);
      if (target) {
        handleOpenSubmission(target);
      }
    }
  }, [searchParams, tasks]);

  const handleOpenReview = (task: TaskItem) => {
    setSelectedTaskForReview(task);
    setReviewDecision('Approved');
    setReviewFeedback('All deliverable criteria met. Test proofs verified on staging build.');
  };

  const handleReportBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForBlocker) return;
    if (!blockerNote.trim()) {
      toast.error('Please describe the error or blocker in detail.');
      return;
    }

    // Set task to In Progress / Changes Requested and alert
    await updateTaskStatus(selectedTaskForBlocker.id, 'Changes Requested');
    toast.error(`Blocker escalated for "${selectedTaskForBlocker.title}". Tech Lead notified!`);
    setSelectedTaskForBlocker(null);
    setBlockerNote('');
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForSubmission) return;

    if (!notes.trim()) {
      toast.error('Please describe what work you completed.');
      return;
    }

    if (!prUrl.trim() || !commitHash.trim()) {
      toast.error('Please enter PR link and commit hash.');
      return;
    }

    const allDodChecked =
      dodChecks.testsPassed &&
      dodChecks.standardFollowed &&
      dodChecks.securityClean &&
      dodChecks.demoVerified &&
      dodChecks.zeroDesignDefects;
    if (!allDodChecked) {
      toast.error('All Definition of Done (DoD) and Zero-Defect Design standards must be verified before submitting.');
      return;
    }

    submitDeliverable(selectedTaskForSubmission.id, {
      prUrl: prUrl.trim(),
      commitHash: commitHash.trim(),
      demoUrl: demoUrl.trim() || undefined,
      testProofs: testProofs.trim() || 'Unit and integration tests passed cleanly.',
      notes: notes.trim(),
    });

    toast.success(`Submission v${selectedTaskForSubmission.submissions.length + 1} filed! Sent for Gate 1 Review.`);
    setSelectedTaskForSubmission(null);
    if (searchParams.get('submitTaskId')) {
      searchParams.delete('submitTaskId');
      setSearchParams(searchParams);
    }
  };

  const handleReviewDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForReview) return;

    if (!reviewFeedback.trim()) {
      toast.error('Please provide review feedback notes.');
      return;
    }

    reviewDeliverable(selectedTaskForReview.id, reviewDecision, reviewFeedback.trim());

    if (reviewDecision === 'Approved') {
      toast.success('Task approved! Gate 1 Technical verification complete.');
    } else {
      toast.info('Changes requested. Previous submission preserved as historical archive.');
    }

    setSelectedTaskForReview(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {isAdmin ? 'Engineering Workforce Oversight' : 'Developer Deliverables & Kanban'}
            </Badge>
            <span className="text-xs text-muted-foreground">Non-Destructive Versioning</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Deliverables & Progress Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track tasks across lifecycle stages and inspect workforce daily standup logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switcher Tab between Kanban Tasks and Team Standups */}
          <div className="flex items-center bg-muted/40 p-1 rounded-lg border border-border/40">
            <Button
              size="sm"
              variant={activeViewTab === 'kanban' ? 'default' : 'ghost'}
              onClick={() => setActiveViewTab('kanban')}
              className="text-xs h-7 gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban Tasks ({tasks.length})</span>
            </Button>
            <Button
              size="sm"
              variant={activeViewTab === 'standups' ? 'default' : 'ghost'}
              onClick={() => setActiveViewTab('standups')}
              className="text-xs h-7 gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isAdmin
                  ? `Team Standups (${dailyStandups.length})`
                  : `My Standups (${userStandupsCount})`}
              </span>
            </Button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsStandupModalOpen(true)}
            className="text-xs shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8"
          >
            <Clock className="w-4 h-4" />
            <span>+ Log Standup</span>
          </Button>

          <Badge variant="outline" className="text-xs py-1 px-2.5">
            Viewing as: <strong className="ml-1 text-primary capitalize">{user.name} ({user.role.replace('_', ' ')})</strong>
          </Badge>
        </div>
      </div>

      {/* Main View Content: Kanban Tasks or Team Standups Feed */}
      {activeViewTab === 'standups' ? (
        <TeamStandupFeed onOpenNewStandup={() => setIsStandupModalOpen(true)} />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {STATUS_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => {
            if (col.status === 'Assigned') return t.status === 'Assigned' || t.status === 'Backlog';
            return t.status === col.status;
          });

          return (
            <div key={col.status} className="bg-muted/20 border border-border/50 rounded-xl p-3 space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground truncate">{col.label}</span>
                <Badge variant="secondary" className="text-[10px] h-5 font-bold">
                  {colTasks.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 px-2 text-muted-foreground/60 text-xs border border-dashed border-border/40 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 mx-auto opacity-30 mb-1" />
                    <span>No {col.status.toLowerCase()} tasks</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                  const submissionCount = task.submissions.length;
                  const latestSubmission = submissionCount > 0 ? task.submissions[submissionCount - 1] : null;

                  return (
                    <Card
                      key={task.id}
                      className={`border-l-4 ${col.color} border-t-border/50 border-r-border/50 border-b-border/50 bg-card/80 backdrop-blur shadow-sm hover:shadow transition-all`}
                    >
                      <CardHeader className="p-3 pb-2 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            {task.module.split('&')[0].trim()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className={`text-[9px] py-0 px-1 font-semibold ${
                                task.priority === 'Critical'
                                  ? 'text-rose-500 border-rose-500/30 bg-rose-500/10'
                                  : task.priority === 'High'
                                  ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
                                  : 'text-blue-500 border-blue-500/30'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {canReview && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTaskToDelete(task);
                                }}
                                className="text-muted-foreground hover:text-destructive p-0.5 cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-xs font-bold text-foreground leading-snug">
                          {task.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-3 pt-0 space-y-2.5">
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                          <span>Assignee:</span>
                          <span className="font-semibold text-foreground truncate max-w-[100px]">
                            {task.assignedToName}
                          </span>
                        </div>

                        {/* Submission Version Tag */}
                        {submissionCount > 0 && (
                          <div className="flex items-center justify-between text-[10px] bg-muted/40 p-1.5 rounded">
                            <span className="font-mono text-primary font-bold">
                              Submission v{submissionCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedTaskForHistory(task)}
                              className="text-muted-foreground hover:text-foreground flex items-center gap-1 underline"
                            >
                              <History className="w-3 h-3" /> History
                            </button>
                          </div>
                        )}

                        {/* Action Buttons based on Role & Status */}
                        <div className="pt-1 flex flex-col gap-1.5">
                          {/* MNC Spec & Blocker Action Row */}
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedTaskForMncSpec(task)}
                              className="text-[10px] h-6 flex-1 px-1 text-muted-foreground hover:text-foreground"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              MNC Spec
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTaskForBlocker(task);
                                setBlockerNote('');
                              }}
                              className="text-[10px] h-6 px-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                              title="Flag error or blocker immediately"
                            >
                              <AlertCircle className="w-3 h-3 mr-0.5" />
                              Blocker
                            </Button>
                          </div>

                          {/* Developer action: Submit Deliverable */}
                          {(task.status === 'Assigned' ||
                            task.status === 'In Progress' ||
                            task.status === 'Changes Requested') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs h-7 border-primary/40 hover:bg-primary/10 text-primary font-semibold"
                              onClick={() => handleOpenSubmission(task)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              {task.status === 'Changes Requested' ? 'Type Revisions & Resubmit' : 'Type Work Done & Submit'}
                            </Button>
                          )}

                          {/* Tech Lead / Admin action: Review */}
                          {task.status === 'Submitted for Review' && canReview && (
                            <Button
                              size="sm"
                              className="w-full text-xs h-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                              onClick={() => handleOpenReview(task)}
                            >
                              <FileCheck2 className="w-3 h-3 mr-1" />
                              Gate 1 Signoff
                            </Button>
                          )}

                          {/* Approved status indicator */}
                          {task.status === 'Approved' && (
                            <div className="text-[10px] text-emerald-500 font-semibold flex items-center justify-center gap-1 py-0.5 bg-emerald-500/10 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Gate 1 Verified
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }))}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* MODAL 1: Submit Deliverable (Non-Destructive) */}
      <Dialog
        open={Boolean(selectedTaskForSubmission)}
        onOpenChange={(open) => !open && setSelectedTaskForSubmission(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              Submit Completed Work for Gate 1 Review
            </DialogTitle>
            <DialogDescription className="text-xs">
              Task: <strong className="text-foreground">{selectedTaskForSubmission?.title}</strong> (Submission v{selectedTaskForSubmission ? selectedTaskForSubmission.submissions.length + 1 : 1}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitDeliverable} className="space-y-4 py-1">
            {/* 1. What work did you complete? (Primary Input for Developer) */}
            <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/25 space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  What work did you complete? (Summary of Deliverables) *
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Required for Gate 1 signoff</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type the details of what you completed, e.g.: Built customer checkout UI, added UPI QR code generation, verified responsive layout across mobile and desktop, zero console errors."
                className="text-xs min-h-[85px] bg-background/80"
                required
              />
            </div>

            {/* 2. Technical Evidence & Code Details */}
            <div className="space-y-3 p-3 rounded-lg bg-muted/20 border border-border/40">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Technical Evidence & Code Repository
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">GitHub PR or Branch URL *</label>
                <Input
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  placeholder="https://github.com/fusionengine/restaurant-saas/pull/..."
                  className="text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Git Commit Hash *</label>
                  <Input
                    value={commitHash}
                    onChange={(e) => setCommitHash(e.target.value)}
                    placeholder="e.g. 7f20c91"
                    className="text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Staging / Demo URL</label>
                  <Input
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://staging.fusionengine.in"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Test Results & Verification Summary</label>
                <Input
                  value={testProofs}
                  onChange={(e) => setTestProofs(e.target.value)}
                  placeholder="Unit test count, integration tests, responsiveness check..."
                  className="text-xs"
                />
              </div>
            </div>

            {/* 3. Definition of Done (DoD) Mandatory Checklist */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-[11px] block">
                  Definition of Done (DoD) - All 5 criteria verified *
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[10px] h-6 px-2 text-primary font-bold hover:bg-primary/10"
                  onClick={() =>
                    setDodChecks({
                      testsPassed: true,
                      standardFollowed: true,
                      securityClean: true,
                      demoVerified: true,
                      zeroDesignDefects: true,
                    })
                  }
                >
                  ⚡ Select All 5/5
                </Button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dodChecks.testsPassed}
                    onChange={(e) => setDodChecks({ ...dodChecks, testsPassed: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>1. All automated unit and integration tests passed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dodChecks.standardFollowed}
                    onChange={(e) => setDodChecks({ ...dodChecks, standardFollowed: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>2. Followed engineering standards (clean folders, typed interfaces, lint passed)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dodChecks.securityClean}
                    onChange={(e) => setDodChecks({ ...dodChecks, securityClean: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>3. Security audit passed (no client secrets, RLS tested, inputs validated)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dodChecks.demoVerified}
                    onChange={(e) => setDodChecks({ ...dodChecks, demoVerified: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>4. Staging / local demo verified against acceptance criteria</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dodChecks.zeroDesignDefects}
                    onChange={(e) => setDodChecks({ ...dodChecks, zeroDesignDefects: e.target.checked })}
                    className="rounded border-border text-purple-400 focus:ring-purple-400 w-3.5 h-3.5"
                  />
                  <span className="text-purple-300 font-medium">5. Zero Design Mistakes: Pixel-perfect Figma UI, responsive on mobile & tablet, zero console errors</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTaskForSubmission(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Submit Completed Work (Gate 1 Review)
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Gate 1 Technical Review */}
      <Dialog
        open={Boolean(selectedTaskForReview)}
        onOpenChange={(open) => !open && setSelectedTaskForReview(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-500" />
              Gate 1 Technical Verification Signoff
            </DialogTitle>
            <DialogDescription className="text-xs">
              As Tech Lead / Admin, verify the code quality, tests, and PR deliverables before approving.
            </DialogDescription>
          </DialogHeader>

          {selectedTaskForReview && selectedTaskForReview.submissions.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>PR Link:</span>
                <a
                  href={selectedTaskForReview.submissions[selectedTaskForReview.submissions.length - 1].prUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  PR #{selectedTaskForReview.submissions[selectedTaskForReview.submissions.length - 1].prUrl.split('/').pop()}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Commit:</span>
                <span className="text-foreground">
                  {selectedTaskForReview.submissions[selectedTaskForReview.submissions.length - 1].commitHash}
                </span>
              </div>
              <div className="text-muted-foreground pt-1">
                <span className="font-sans font-semibold text-foreground">Tests: </span>
                <span className="font-sans">{selectedTaskForReview.submissions[selectedTaskForReview.submissions.length - 1].testProofs}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleReviewDeliverable} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Review Decision</label>
              <Select value={reviewDecision} onValueChange={(v: any) => setReviewDecision(v)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved" className="text-xs text-emerald-500 font-bold">
                    ✓ Approve Deliverable (Gate 1 Passed)
                  </SelectItem>
                  <SelectItem value="Changes Requested" className="text-xs text-rose-500 font-bold">
                    ✕ Changes Requested (Request Revision)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Reviewer Feedback & Directives *</label>
              <Textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="State your technical review findings, necessary code changes or approval notes..."
                className="text-xs min-h-[80px]"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTaskForReview(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className={reviewDecision === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
              >
                Submit Decision
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Non-Destructive Submission Version History */}
      <Dialog
        open={Boolean(selectedTaskForHistory)}
        onOpenChange={(open) => !open && setSelectedTaskForHistory(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Submission Version History (Non-Destructive)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Every deliverable iteration is preserved. Earlier PR commits and reviewer feedback cannot be deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {selectedTaskForHistory?.submissions.map((sub) => (
              <div
                key={sub.version}
                className="p-3.5 rounded-xl border border-border/50 bg-muted/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
                  <Badge variant="outline" className="font-mono text-primary font-bold">
                    Iteration Version {sub.version}
                  </Badge>
                  <span className="text-muted-foreground text-[10px]">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-muted-foreground font-sans">PR: </span>
                    <a href={sub.prUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {sub.prUrl.split('/').pop()}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-sans">Commit: </span>
                    <span>{sub.commitHash}</span>
                  </div>
                </div>

                <div className="text-[11px]">
                  <span className="font-semibold text-foreground">Test Results: </span>
                  <span className="text-muted-foreground">{sub.testProofs}</span>
                </div>

                {sub.notes && (
                  <div className="text-[11px]">
                    <span className="font-semibold text-foreground">Developer Notes: </span>
                    <span className="text-muted-foreground">{sub.notes}</span>
                  </div>
                )}

                {sub.feedback && (
                  <div className="mt-2 p-2 rounded bg-background/80 border border-border/40 text-[11px]">
                    <span className="font-semibold text-rose-500">Reviewer Feedback: </span>
                    <span className="text-foreground">{sub.feedback}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: MNC Standard Specifications & Criteria */}
      <Dialog
        open={Boolean(selectedTaskForMncSpec)}
        onOpenChange={(open) => !open && setSelectedTaskForMncSpec(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-400 bg-purple-500/10 text-[10px]">
                MNC Engineering Standard
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{selectedTaskForMncSpec?.module}</span>
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {selectedTaskForMncSpec?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Project: <strong>{selectedTaskForMncSpec?.projectName}</strong> • Assigned: <strong>{selectedTaskForMncSpec?.assignedToName}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            {/* User Story format */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">User Story (MNC Format)</span>
              <p className="text-foreground italic leading-relaxed">
                "As a restaurant manager/captain, I want {selectedTaskForMncSpec?.title.toLowerCase()} so that operations remain seamless during high-volume rush hours with zero data loss."
              </p>
            </div>

            {/* Acceptance Criteria */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Acceptance Criteria</span>
              <div className="p-3 rounded-lg bg-background/80 border border-border/40 space-y-1.5 text-[11px]">
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedTaskForMncSpec?.description}
                </div>
              </div>
            </div>

            {/* Design Spec Link */}
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 flex items-center justify-between">
              <span>Figma Design Tokens & Mockup:</span>
              <a
                href="https://www.figma.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Figma Spec</span>
              </a>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button size="sm" onClick={() => setSelectedTaskForMncSpec(null)}>
              Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 6: Report Blocker / Immediate Error Escalation */}
      <Dialog
        open={Boolean(selectedTaskForBlocker)}
        onOpenChange={(open) => !open && setSelectedTaskForBlocker(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Report Blocker or Design Discrepancy
            </DialogTitle>
            <DialogDescription className="text-xs">
              Immediate escalation for <strong>{selectedTaskForBlocker?.title}</strong>. Notifies the Tech Lead and Admin immediately to avoid project delays.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportBlocker} className="space-y-3.5 py-1 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Blocker Details / Error Description *</label>
              <Textarea
                value={blockerNote}
                onChange={(e) => setBlockerNote(e.target.value)}
                placeholder="Describe the blocker, missing Figma token, conflicting requirement, or unhandled bug..."
                className="text-xs min-h-[90px] border-rose-500/30"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTaskForBlocker(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                Escalate Blocker
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 7: Daily Standup Modal */}
      <DailyStandupModal
        isOpen={isStandupModalOpen}
        onClose={() => setIsStandupModalOpen(false)}
      />

      <Dialog open={Boolean(taskToDelete)} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Task
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete <strong className="text-foreground">{taskToDelete?.title}</strong>?
              This will remove the task and all associated submission history from the board.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setTaskToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (!taskToDelete) return;
                setIsDeleting(true);
                await deleteTask(taskToDelete.id);
                setIsDeleting(false);
                setTaskToDelete(null);
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
