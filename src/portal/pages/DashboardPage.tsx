import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  PhoneCall,
  Coins,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Flame,
  FileCheck2,
  Sparkles,
  GitPullRequest,
  CheckCheck,
  Plus,
  BookOpen,
  Briefcase,
  Users,
  CheckSquare,
  MessageSquare,
  Calendar,
  Zap,
  Receipt,
  UserCheck,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectWizardModal } from '../components/ProjectWizardModal';
import { TeamStandupFeed } from '../components/TeamStandupFeed';
import { DailyStandupModal } from '../components/DailyStandupModal';

export const DashboardPage: React.FC = () => {
  const { activePersona, currentUser, projects, tasks, leads, vouchers, auditLogs, applications } = usePortal();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isStandupModalOpen, setIsStandupModalOpen] = useState(false);

  const user = currentUser || activePersona;
  const isDeveloper = user.role === 'developer';
  const isTelecaller = user.role === 'telecaller';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Admin metrics
  const activeProjectsCount = projects.filter(
    (p) => p.status === 'Active' || p.status === 'active'
  ).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === 'Approved' || t.status === 'Completed' || t.status === 'approved'
  ).length;
  const pendingReviewTasks = tasks.filter(
    (t) => t.status === 'Submitted for Review' || t.status === 'submitted'
  ).length;
  const changesRequestedTasks = tasks.filter(
    (t) => t.status === 'Changes Requested' || t.status === 'changes_requested'
  ).length;

  const qualifiedLeads = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'interested'
  ).length;
  const convertedLeads = leads.filter(
    (l) => l.status === 'Converted' || l.status === 'won'
  ).length;
  const demosScheduled = leads.filter(
    (l) => l.status === 'Demo Scheduled' || l.status === 'demo'
  ).length;
  const lockedContacts = leads.filter((l) => l.isLocked).length;

  const totalPaidINR = vouchers
    .filter((v) => v.status === 'Released / Paid')
    .reduce((sum, v) => sum + (Number(v.netPayableINR) || 0), 0);

  const pendingDisbursementINR = vouchers
    .filter((v) => v.status === 'Approved')
    .reduce((sum, v) => sum + (Number(v.netPayableINR) || 0), 0);

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Developer metrics
  const myProjects = projects.filter((p) =>
    p.members?.some(
      (m) =>
        m.profileId === user.id ||
        m.userId === user.id ||
        m.profileName?.toLowerCase() === user.name.toLowerCase()
    )
  );
  const myTasks = tasks.filter(
    (t) =>
      t.assignedToId === user.id ||
      t.assignedToId === user.userId ||
      t.assignedToName?.toLowerCase() === user.name.toLowerCase()
  );
  const myCompletedTasks = myTasks.filter(
    (t) => t.status === 'Approved' || t.status === 'approved'
  ).length;
  const myPendingReview = myTasks.filter(
    (t) => t.status === 'Submitted for Review' || t.status === 'submitted'
  ).length;
  const myActiveTasks = myTasks.filter(
    (t) => t.status !== 'Approved' && t.status !== 'approved'
  );
  const myVouchers = vouchers.filter(
    (v) =>
      v.recipientId === user.id ||
      v.recipientId === user.userId ||
      v.recipientName?.toLowerCase() === user.name.toLowerCase()
  );
  const myTotalEarnedINR = myVouchers
    .filter((v) => v.status === 'Released / Paid')
    .reduce((sum, v) => sum + (Number(v.netPayableINR) || 0), 0);
  const myPendingPayoutINR = myVouchers
    .filter((v) => v.status === 'Approved')
    .reduce((sum, v) => sum + (Number(v.netPayableINR) || 0), 0);

  // Telecaller metrics
  const myLeads = leads.filter(
    (l) =>
      l.ownerId === user.id ||
      l.assignedToId === user.id ||
      l.ownerId === user.userId ||
      l.assignedToId === user.userId ||
      l.ownerName?.toLowerCase() === user.name.toLowerCase() ||
      l.assignedToName?.toLowerCase() === user.name.toLowerCase()
  );
  const myLockedLeads = leads.filter(
    (l) =>
      l.isLocked &&
      (l.lockedById === user.id ||
        l.lockedById === user.userId ||
        l.lockedByName?.toLowerCase() === user.name.toLowerCase())
  ).length;
  const myCallbacksDue = myLeads.filter(
    (l) => l.nextCallbackAt && l.status !== 'Converted' && l.status !== 'Rejected'
  );
  const myConvertedLeads = myLeads.filter(
    (l) => l.status === 'Converted' || l.status === 'won'
  ).length;
  const myQualifiedLeads = myLeads.filter(
    (l) =>
      l.status === 'Qualified' ||
      l.status === 'Demo Scheduled' ||
      l.status === 'interested' ||
      l.status === 'demo'
  ).length;

  const formatSafeDateTime = (dateStr?: string) => {
    if (!dateStr) return 'Scheduled';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Scheduled';
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSafeTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Just now';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Persona Context */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-wider text-[10px]">
              Active Session: {user.role.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-muted-foreground">| Fusion Engine Technology</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {isAdmin &&
              'You have full Founder control over project milestones, task signoffs, telecaller incentive approvals, and financial disbursements.'}
            {isDeveloper &&
              'Track your assigned tasks, verify Definition of Done (DoD) criteria, submit GitHub PRs, and review milestone escrow earnings.'}
            {isTelecaller &&
              'Manage your restaurant prospect pipeline, take 20-min exclusive dialing locks, use dynamic AI pitches, and earn conversion commissions.'}
            {user.role === 'project_manager' &&
              'You have Technical Lead review authority. Verify developer PRs, review test proofs, and trigger Gate 1 approvals.'}
            {user.role === 'finance' &&
              'Verify official vouchers (FET-MS-2026-XXXX), deduct 10% TDS, and record bank UTR/IMPS transaction references.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <>
              <Button asChild size="sm" className="shadow-sm">
                <Link to="/portal/projects">
                  <FolderKanban className="w-4 h-4 mr-1.5" />
                  Manage Projects
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/portal/finance">
                  <Coins className="w-4 h-4 mr-1.5 text-amber-500" />
                  Disbursements
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary">
                <Link to="/portal/team">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  Workforce & Hiring ({applications.length})
                </Link>
              </Button>
            </>
          )}

          {isDeveloper && (
            <Button asChild size="sm" className="shadow-sm">
              <Link to="/portal/tasks">
                <CheckSquare className="w-4 h-4 mr-1.5" />
                My Tasks & Deliverables ({myActiveTasks.length})
              </Link>
            </Button>
          )}

          {isTelecaller && (
            <Button asChild size="sm" className="shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/portal/telecaller">
                <PhoneCall className="w-4 h-4 mr-1.5" />
                Start Calling Workspace
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROLE 1: TELECALLER DASHBOARD                                              */}
      {/* ========================================================================= */}
      {isTelecaller && (
        <div className="space-y-6">
          {/* 4 Clean Telecaller KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-emerald-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pipeline Directory
                </CardTitle>
                <Users className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.length} Prospects</div>
                <p className="text-xs text-muted-foreground mt-1">Available restaurant database</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My Active Leads
                </CardTitle>
                <PhoneCall className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{myLeads.length} Leads</div>
                <p className="text-xs text-muted-foreground mt-1">{myLockedLeads} currently locked by you</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-amber-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Scheduled Callbacks
                </CardTitle>
                <Calendar className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{myCallbacksDue.length} Follow-ups</div>
                <p className="text-xs text-muted-foreground mt-1">Personal sticky outreach queue</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-blue-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Qualified & Converted
                </CardTitle>
                <UserCheck className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{myConvertedLeads + myQualifiedLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">{myConvertedLeads} converted to active clients</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* My Immediate Callbacks */}
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-500" />
                      My Follow-Up Queue & Callbacks
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Leads with scheduled follow-ups assigned directly to your outreach desk.
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link to="/portal/telecaller">
                      Open Calling Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {myLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs space-y-2">
                      <PhoneCall className="w-8 h-8 mx-auto opacity-30 text-emerald-500" />
                      <p className="font-semibold text-foreground text-sm">No Active Claimed Leads Yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Head over to the Calling Workspace to dial restaurant prospects, take exclusive locks, and follow up.
                      </p>
                      <Button asChild size="sm" className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link to="/portal/telecaller">Open Calling Workspace</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myLeads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-xl border border-border/50 bg-background/50 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-foreground truncate">{lead.businessName}</span>
                              <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                                {lead.category || 'Restaurant'}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-mono">{lead.city}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{lead.contactPerson}</span>
                              <span>•</span>
                              <span className="font-mono text-[11px]">{lead.phone}</span>
                            </div>
                            {lead.nextCallbackAt && (
                              <div className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>Callback: {formatSafeDateTime(lead.nextCallbackAt)} ({lead.followUpStage || 'Follow-Up'})</span>
                              </div>
                            )}
                          </div>
                          <Button asChild size="sm" variant="outline" className="text-xs h-7 shrink-0 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                            <Link to="/portal/telecaller">
                              Call & Follow Up
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dynamic AI Restaurant Pitch Quick Reference */}
              <Card className="border-border/60 bg-gradient-to-br from-card/80 to-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Dynamic AI Pitch Recommendations by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-500" />
                        Fine Dining & Restro-Bars
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Pitch tableside KOT tablets, eliminate billing counter bottleneck during Saturday rushes, cut table checkout wait time by 40%.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        QSR & Fast Food Counters
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Pitch 3-second rapid billing, zero thermal roll jamming, offline local sync so billing never halts if Wi-Fi drops.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-purple-500" />
                        Cloud Kitchen Multi-Brand
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Pitch unified Swiggy + Zomato auto-accept screen on 1 tablet, shared central raw-material pantry stock depletion.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Cafes & Bakeries
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Pitch automated WhatsApp loyalty point reminders, birthday pastry offer blasts with direct click-to-reorder.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Telecaller Protocol */}
            <div className="space-y-6">
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Telecaller Calling Protocol
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sticky contact locking rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <div className="p-2.5 rounded-lg border border-border/30 bg-background/40 space-y-1">
                    <span className="font-semibold text-foreground">1. Exclusive 20-Min Lock:</span>
                    <p className="text-[11px]">When you start dialing, the lead is locked under your name so other agents cannot call simultaneously.</p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/30 bg-background/40 space-y-1">
                    <span className="font-semibold text-foreground">2. Sticky Follow-Up Ownership:</span>
                    <p className="text-[11px]">Any lead you speak with remains permanently assigned to you for subsequent callbacks and client conversion credit.</p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/30 bg-background/40 space-y-1">
                    <span className="font-semibold text-foreground">3. 1-Click WhatsApp Walkthroughs:</span>
                    <p className="text-[11px]">Send pre-formatted vertical pitch demos directly to decision-maker WhatsApp numbers with one click.</p>
                  </div>
                  <Button asChild className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                    <Link to="/portal/telecaller">Go to Calling Workspace</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE 2: DEVELOPER DASHBOARD                                               */}
      {/* ========================================================================= */}
      {isDeveloper && (
        <div className="space-y-6">
          {/* 4 Clean Developer KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My Assigned Projects
                </CardTitle>
                <FolderKanban className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myProjects.length} Projects</div>
                <p className="text-xs text-muted-foreground mt-1">Active workspace allocations</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-indigo-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My Active Tasks
                </CardTitle>
                <GitPullRequest className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myActiveTasks.length} Deliverables</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {myPendingReview} submitted for Gate 1 review
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-emerald-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Gate 1 Approved
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">{myCompletedTasks} Tasks</div>
                <p className="text-xs text-muted-foreground mt-1">Sign-off complete & voucher eligible</p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-amber-500/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  My Milestone Payouts
                </CardTitle>
                <Receipt className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{myTotalEarnedINR.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{myPendingPayoutINR.toLocaleString('en-IN')} approved / pending release
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* My Sprint Deliverables */}
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-primary" />
                      My Sprint Deliverables & Code Tasks
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Your assigned modules, MNC user stories, Definition of Done (DoD), and payout values.
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="text-xs h-8">
                    <Link to="/portal/tasks">
                      Go to Tasks Board <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {myTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs space-y-2">
                      <CheckSquare className="w-8 h-8 mx-auto opacity-30 text-primary" />
                      <p className="font-semibold text-foreground text-sm">No Tasks Assigned Yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Your project tech lead will allocate modular tasks to you. Check the projects tab to review your team assignments.
                      </p>
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <Link to="/portal/projects">View My Projects</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myTasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/40 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-muted-foreground">{task.projectName}</span>
                              <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/25 font-mono">
                                {task.module}
                              </Badge>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-semibold ${
                                task.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                  : task.status === 'Submitted for Review'
                                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              }`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <div className="font-bold text-xs text-foreground">{task.title}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</div>
                          <div className="pt-2 flex items-center justify-between text-xs border-t border-border/30">
                            <span className="font-mono text-emerald-500 text-[11px] font-semibold">
                              Payout: ₹{(task.payoutAmountINR || 37500).toLocaleString('en-IN')}
                            </span>
                            <Button asChild size="sm" className="text-xs h-7 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
                              <Link to={`/portal/tasks?submitTaskId=${task.id}`}>
                                <Send className="w-3 h-3 mr-1" />
                                Type Work Done & Submit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dual-Gate Technical Standards Banner */}
              <Card className="border-border/60 bg-gradient-to-br from-card/80 to-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    MNC Engineering Standards & Definition of Done (DoD)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        Zero Layout Shifts & Pixel Perfection
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Match approved Figma tokens exactly. Ensure 100% responsive behavior across mobile, tablet, and POS counter terminals.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Dual-Gate Technical Sign-off (Gate 1)
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Submit GitHub PR with passing unit tests. Gate 1 approval automatically generates your official milestone payout voucher.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: My Assigned Projects & Team Chat */}
            <div className="space-y-6">
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Project Team Chat & Channels
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Direct alignment with your Tech Lead & QA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myProjects.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No active project assignments.</p>
                  ) : (
                    myProjects.map((p) => (
                      <div key={p.id} className="p-3 rounded-lg border border-border/30 bg-background/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                            {p.status}
                          </Badge>
                        </div>
                        <div className="font-bold text-xs text-foreground truncate">{p.name}</div>
                        <Button asChild size="sm" variant="outline" className="w-full text-xs h-7 border-primary/30 text-primary">
                          <Link to="/portal/projects">Open Team Chat</Link>
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE 3: ADMIN & SUPER ADMIN EXECUTIVE DASHBOARD                           */}
      {/* ========================================================================= */}
      {isAdmin && (
        <>
          {/* Executive KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Project Health */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Projects & Health
                </CardTitle>
                <FolderKanban className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjectsCount} Active</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>Delivery Status:</span>
                  <span className="font-semibold text-foreground">{overallProgress}% Completed</span>
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Task Delivery</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* Deliverables / Dual Gate */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Task Deliverables
                </CardTitle>
                <GitPullRequest className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline gap-2">
                  <span>{pendingReviewTasks}</span>
                  <span className="text-xs font-normal text-muted-foreground">Awaiting Review</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px]">
                    {changesRequestedTasks} Revisions
                  </Badge>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
                    {completedTasks} Gate 1 Approved
                  </Badge>
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Dual-Gate verification active
                </div>
              </CardContent>
            </Card>

            {/* Telecaller Pipeline */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sales & Telecalling
                </CardTitle>
                <PhoneCall className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline gap-2">
                  <span>{qualifiedLeads}</span>
                  <span className="text-xs font-normal text-muted-foreground">Qualified Leads</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/10 text-[10px]">
                    {demosScheduled} Demos
                  </Badge>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
                    {convertedLeads} Converted
                  </Badge>
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Active Contact Locks:</span>
                  <span className="font-semibold text-foreground">{lockedContacts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Financial Disbursements */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Disbursed Payments
                </CardTitle>
                <Coins className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{totalPaidINR.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total released via UTR/IMPS</p>
                <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  <span className="text-amber-500 font-medium">Pending Release:</span>
                  <span className="font-semibold">₹{pendingDisbursementINR.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Hiring & Applications */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Candidate Applications
                </CardTitle>
                <Briefcase className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline gap-2 text-foreground">
                  <span>{applications.length}</span>
                  <span className="text-xs font-normal text-muted-foreground">Applicants</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Careers form & resume submissions</p>
                <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  <span className="text-primary font-medium">New Submissions:</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/25">
                    {applications.filter((a) => a.status === 'New').length} New
                  </Badge>
                </div>
                <div className="mt-2 pt-1">
                  <Button asChild size="sm" variant="ghost" className="w-full text-xs h-7 p-0 justify-between text-primary font-bold hover:underline cursor-pointer">
                    <Link to="/portal/team?tab=hiring">
                      <span>View All Candidates</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Project Overview & Milestone Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-primary" />
                      Engineering Projects & Deliverables
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Active customer engagements, statutory milestone allocations, and delivery tracking.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsWizardOpen(true)}
                    className="text-xs h-8 gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Onboard New Project</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs space-y-2">
                      <FolderKanban className="w-8 h-8 mx-auto opacity-30 text-primary" />
                      <p className="font-semibold text-foreground text-sm">No Active Projects</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Click "+ Onboard New Project" to set up your custom project, allocate deliverable milestones under Contract Act 1872, and generate developer tasks.
                      </p>
                      <Button size="sm" onClick={() => setIsWizardOpen(true)} className="mt-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Create Your Project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.map((proj) => {
                        const pTasks = tasks.filter((t) => t.projectId === proj.id);
                        const pApproved = pTasks.filter(
                          (t) => t.status === 'Approved' || t.status === 'Completed' || t.status === 'approved'
                        ).length;
                        const pPct = pTasks.length > 0 ? Math.round((pApproved / pTasks.length) * 100) : 0;

                        return (
                          <div
                            key={proj.id}
                            className="p-3.5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/40 transition-all space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-muted-foreground">{proj.code}</span>
                              <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-semibold">
                                {proj.status}
                              </Badge>
                            </div>
                            <div>
                              <div className="font-bold text-xs text-foreground truncate">{proj.name}</div>
                              <div className="text-[11px] text-muted-foreground truncate">
                                Client: {proj.clientName || 'General Client'} • ₹{((Number(proj.contractValueINR) || 0) / 1000).toFixed(0)}k Budget
                              </div>
                            </div>
                            {(proj.startDate || proj.targetEndDate) && (
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded">
                                <span>Start: {proj.startDate || 'TBD'}</span>
                                <span>Due: {proj.targetEndDate || 'TBD'}</span>
                              </div>
                            )}

                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Delivery ({pApproved}/{pTasks.length} tasks)</span>
                                <span className="font-mono font-bold text-foreground">{pPct}%</span>
                              </div>
                              <Progress value={pPct} className="h-1.5" />
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[11px] border-t border-border/30">
                              <span className="text-muted-foreground text-[10px]">
                                {proj.milestones?.length || 0} Milestones
                              </span>
                              <Link
                                to="/portal/projects"
                                className="text-primary hover:underline font-medium text-[11px] flex items-center gap-1"
                              >
                                Manage Project <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end border-t border-border/30 text-xs">
                    <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                      <Link to="/portal/projects" className="flex items-center gap-1">
                        View Complete Project Directory <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Startup Dual-Gate Explanation Banner */}
              <Card className="border-border/60 bg-gradient-to-br from-card/80 to-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Startup Dual-Gate Verification Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        Gate 1: Technical Signoff
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Tech Lead inspects GitHub PR, runs unit & e2e test proofs on staging build. Once verified, marks task Approved.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/40 bg-background/40 space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        Gate 2: Financial Voucher
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Founder reviews milestone scope, verifies IP assignment, generates voucher (<code className="text-[10px]">FET-MS-2026-XXXX</code>), and accounts team enters bank UTR.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workforce Daily Progress & Standup Reports */}
              <TeamStandupFeed onOpenNewStandup={() => setIsStandupModalOpen(true)} />
            </div>

            {/* Right Col: Live Immutable Audit Trail */}
            <div className="space-y-6">
              <Card className="border-border/60 bg-card/60">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">Activity Audit Stream</CardTitle>
                    <CardDescription className="text-xs">Immutable event ledger</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {auditLogs.length} Events
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs space-y-1">
                      <Clock className="w-6 h-6 mx-auto opacity-40 mb-1 text-primary" />
                      <p className="font-semibold text-foreground">Audit Stream Clean & Ready</p>
                      <p className="text-[11px] text-muted-foreground">
                        Activity events, approvals, and signoffs will log here automatically.
                      </p>
                    </div>
                  ) : (
                    auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="text-xs p-2.5 rounded-lg border border-border/30 bg-background/40 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-primary">{log.actorName}</span>
                          <span className="text-muted-foreground font-mono text-[10px]">
                            {formatSafeTime(log.timestamp)}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground font-semibold">
                          {log.action}
                        </div>
                        <p className="text-muted-foreground text-[11px] line-clamp-2">
                          {log.details}
                        </p>
                      </div>
                    ))
                  )}

                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link to="/portal/projects">
                      View Projects Activity <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Project Creation Wizard */}
      <ProjectWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      {/* Daily Standup Modal */}
      <DailyStandupModal
        isOpen={isStandupModalOpen}
        onClose={() => setIsStandupModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
