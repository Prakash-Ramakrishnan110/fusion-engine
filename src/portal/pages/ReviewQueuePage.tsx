import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { TaskItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  GitPullRequest,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck2,
  FolderKanban,
} from 'lucide-react';
import { toast } from 'sonner';

export const ReviewQueuePage: React.FC = () => {
  const { tasks, activePersona, currentUser, reviewDeliverable } = usePortal();
  const user = currentUser || activePersona;

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [decision, setDecision] = useState<'Approved' | 'Changes Requested'>('Approved');
  const [feedback, setFeedback] = useState('All acceptance criteria verified and tests passing on staging build.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submissions awaiting Gate 1 Tech Lead review
  const pendingReviews = tasks.filter((t) => t.status === 'Submitted for Review');

  const handleOpenReview = (task: TaskItem) => {
    setSelectedTask(task);
    setDecision('Approved');
    setFeedback('All deliverable criteria met. Verified PR and automated test proofs.');
  };

  const handleConfirmReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!feedback.trim()) {
      toast.error('Mandatory review comments are required for technical sign-off.');
      return;
    }

    setIsSubmitting(true);
    await reviewDeliverable(selectedTask.id, decision, feedback.trim());
    setIsSubmitting(false);

    toast.success(`Gate 1 review recorded: ${decision}!`);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">
              Gate 1 Technical Review
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {pendingReviews.length} Submissions Pending
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Tech Lead Review Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify PR links, unit test coverage logs, and deliverable artifacts before granting Gate 1 technical approval.
          </p>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-3">
          Sign-off Role: <strong className="ml-1 text-primary capitalize">{user.role}</strong>
        </Badge>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-3">
        {pendingReviews.length === 0 ? (
          <Card className="border-border/60 bg-card/60 text-center py-12">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 opacity-80 mb-2" />
            <h3 className="font-bold text-sm text-foreground">Review Queue is Clear!</h3>
            <p className="text-xs text-muted-foreground mt-1">
              All submitted engineering deliverables have been reviewed. Outstanding PRs will appear here in real-time.
            </p>
          </Card>
        ) : (
          pendingReviews.map((task) => {
            const latestSub = task.submissions?.[0];

            return (
              <Card key={task.id} className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{task.projectName}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-[10px] font-mono text-indigo-500 bg-indigo-500/10">
                          {latestSub?.version || 'v1'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground mt-1">
                        {task.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Module: <strong>{task.module}</strong> • Developer: <strong>{task.assignedToName}</strong>
                      </CardDescription>
                    </div>

                    <Button size="sm" onClick={() => handleOpenReview(task)} className="gap-1.5 shadow-sm">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Review Deliverable</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3 text-xs">
                  {/* Submission Details Bar */}
                  {latestSub ? (
                    <div className="p-3 rounded-lg bg-background/50 border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">GitHub Pull Request</span>
                        {latestSub.prUrl ? (
                          <a
                            href={latestSub.prUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline font-mono text-[11px] flex items-center gap-1"
                          >
                            <GitPullRequest className="w-3 h-3" />
                            View PR Code <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="font-mono text-muted-foreground">None provided</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground block">Commit Hash & CI</span>
                        <span className="font-mono text-foreground font-semibold">
                          {latestSub.commitHash || 'main-head'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground block">Test Verification</span>
                        <span className="font-semibold text-emerald-500">
                          {latestSub.testProofs || 'Automated tests passed'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-[11px]">No submission details recorded.</div>
                  )}

                  {/* Acceptance Criteria */}
                  <div className="text-[11px]">
                    <span className="font-semibold text-foreground">Acceptance Criteria: </span>
                    <span className="text-muted-foreground">{task.acceptanceCriteria || task.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* MODAL: Tech Lead Gate 1 Review Dialog */}
      <Dialog open={Boolean(selectedTask)} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Gate 1 Technical Sign-off: {selectedTask?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Project: <strong>{selectedTask?.projectName}</strong> • Developer: <strong>{selectedTask?.assignedToName}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReview} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Technical Decision *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDecision('Approved')}
                  className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                    decision === 'Approved'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold'
                      : 'border-border/60 hover:bg-muted/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Gate 1 Approved</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('Changes Requested')}
                  className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                    decision === 'Changes Requested'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 font-bold'
                      : 'border-border/60 hover:bg-muted/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-rose-500" />
                    <span>Request Changes</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Technical Feedback & Review Comments *</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Detail code review observations, test verification results, or required changes..."
                className="text-xs min-h-[90px]"
                required
              />
              <span className="text-[10px] text-muted-foreground">
                Comments are permanent and logged in the immutable audit stream.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTask(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className={decision === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
              >
                {isSubmitting ? 'Recording...' : `Confirm ${decision}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewQueuePage;
