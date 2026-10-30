import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { DailyStandupUpdate } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  User,
  FolderKanban,
  Plus,
  Trash2,
  Check,
  CalendarDays,
  History,
  Archive,
  Sparkles,
} from 'lucide-react';
import defaultAvatar from '../../assets/default-avatar.svg';
import { DailyStandupModal } from '../components/DailyStandupModal';
import { toast } from 'sonner';

export const StandupsPage: React.FC = () => {
  const {
    dailyStandups,
    projects,
    users,
    currentUser,
    activePersona,
    deleteDailyStandup,
    clearOldDailyStandups,
  } = usePortal();

  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Modal states
  const [isStandupModalOpen, setIsStandupModalOpen] = useState(false);
  const [standupToDelete, setStandupToDelete] = useState<DailyStandupUpdate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCleanOldModalOpen, setIsCleanOldModalOpen] = useState(false);
  const [cleanDaysThreshold, setCleanDaysThreshold] = useState('30');
  const [isCleaning, setIsCleaning] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all'); // 'all', 'today', 'yesterday', '7days', or specific YYYY-MM-DD
  const [specificDate, setSpecificDate] = useState<string>('');
  const [blockerOnly, setBlockerOnly] = useState<boolean>(false);

  // Grouped standups logic
  const filteredStandups = useMemo(() => {
    return dailyStandups.filter((standup) => {
      // Role Privacy Guard: Workers (developer/telecaller) only see their own standups
      if (!isAdmin) {
        const isMyStandup =
          standup.developerId === user.id ||
          standup.developerId === user.userId ||
          standup.developerName.toLowerCase() === user.name.toLowerCase();
        if (!isMyStandup) {
          return false;
        }
      }

      // Project filter
      if (selectedProjectId !== 'all' && standup.projectId !== selectedProjectId) {
        return false;
      }
      // Developer filter
      if (selectedDeveloperId !== 'all' && standup.developerId !== selectedDeveloperId) {
        return false;
      }
      // Blocker filter
      if (blockerOnly && !standup.hasBlocker) {
        return false;
      }
      // Date filter
      const standupDate = new Date(standup.createdAt);
      const today = new Date();
      const standupDateStr = standupDate.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      if (specificDate) {
        if (standupDateStr !== specificDate) return false;
      } else if (selectedDateFilter === 'today') {
        if (standupDateStr !== todayStr) return false;
      } else if (selectedDateFilter === 'yesterday') {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (standupDateStr !== yesterday) return false;
      } else if (selectedDateFilter === '7days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (standupDate.getTime() < sevenDaysAgo) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDev = standup.developerName.toLowerCase().includes(q);
        const matchProj = standup.projectName.toLowerCase().includes(q);
        const matchWork = standup.completedToday.toLowerCase().includes(q);
        const matchPlan = standup.plannedTomorrow.toLowerCase().includes(q);
        const matchBlock = (standup.blockers || '').toLowerCase().includes(q);
        if (!matchDev && !matchProj && !matchWork && !matchPlan && !matchBlock) {
          return false;
        }
      }
      return true;
    });
  }, [
    dailyStandups,
    selectedProjectId,
    selectedDeveloperId,
    blockerOnly,
    selectedDateFilter,
    specificDate,
    searchQuery,
  ]);

  // Group standups day by day (by date string YYYY-MM-DD descending)
  const groupedByDay = useMemo(() => {
    const groups: { [dateStr: string]: DailyStandupUpdate[] } = {};
    for (const standup of filteredStandups) {
      const dateStr = new Date(standup.createdAt).toISOString().split('T')[0];
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(standup);
    }
    // Sort dates descending
    return Object.entries(groups).sort(
      ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [filteredStandups]);

  // Stats
  const totalBlockers = dailyStandups.filter((s) => s.hasBlocker).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = dailyStandups.filter(
    (s) => new Date(s.createdAt).toISOString().split('T')[0] === todayStr
  ).length;

  const handleDeleteConfirm = async () => {
    if (!standupToDelete) return;
    setIsDeleting(true);
    await deleteDailyStandup(standupToDelete.id);
    setIsDeleting(false);
    setStandupToDelete(null);
  };

  const handleCleanOldReports = async () => {
    const days = parseInt(cleanDaysThreshold, 10) || 30;
    setIsCleaning(true);
    await clearOldDailyStandups(days);
    setIsCleaning(false);
    setIsCleanOldModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Workforce Operations & Oversight
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Day-by-Day Historical Ledger
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Workforce Daily Progress & Standup Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Audit daily developer and telecaller deliverables day by day. Inspect historical progress, resolve blockers early, and archive old reports for future reference.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCleanOldModalOpen(true)}
              className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-destructive border-border/60"
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Clean Old Reports</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setIsStandupModalOpen(true)}
            className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Today's Standup</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Reports Logged
            </CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStandups.length} Reports</div>
            <p className="text-xs text-muted-foreground mt-1">Archived across all engineering sprints</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Logged Today
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{todayCount} Reports</div>
            <p className="text-xs text-muted-foreground mt-1">EOD submissions recorded today</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Blockers
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBlockers > 0 ? 'text-rose-500' : 'text-foreground'}`}>
              {totalBlockers} Flagged
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBlockers > 0 ? 'Requires Tech Lead / Founder unblocking' : 'Zero blockers reported across team'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Workforce
            </CardTitle>
            <User className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length} Workers</div>
            <p className="text-xs text-muted-foreground mt-1">Across Engineering, QA, and Sales CRM</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Timeline Controls */}
      <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search by worker name, project, work done, or blocker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 h-9"
              />
            </div>

            {/* Project Filter */}
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[180px] text-xs h-9">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Projects ({projects.length})
                </SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Worker Filter */}
            <Select value={selectedDeveloperId} onValueChange={setSelectedDeveloperId}>
              <SelectTrigger className="w-[180px] text-xs h-9">
                <SelectValue placeholder="All Team Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Team Members ({users.length})
                </SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id} className="text-xs">
                    {u.name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Blocker Only Toggle */}
            <Button
              type="button"
              variant={blockerOnly ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setBlockerOnly(!blockerOnly)}
              className="text-xs h-9 gap-1.5"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{blockerOnly ? 'Showing Blockers' : 'Filter Blockers'}</span>
            </Button>
          </div>

          {/* Day-by-Day Date Quick Chips & Date Jump */}
          <div className="pt-2 border-t border-border/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground text-[11px] font-semibold mr-1">
                Day Timeline:
              </span>
              <Button
                variant={selectedDateFilter === 'all' && !specificDate ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs h-7 px-2.5 font-medium"
                onClick={() => {
                  setSelectedDateFilter('all');
                  setSpecificDate('');
                }}
              >
                All Days
              </Button>
              <Button
                variant={selectedDateFilter === 'today' && !specificDate ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs h-7 px-2.5 font-medium"
                onClick={() => {
                  setSelectedDateFilter('today');
                  setSpecificDate('');
                }}
              >
                Today
              </Button>
              <Button
                variant={selectedDateFilter === 'yesterday' && !specificDate ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs h-7 px-2.5 font-medium"
                onClick={() => {
                  setSelectedDateFilter('yesterday');
                  setSpecificDate('');
                }}
              >
                Yesterday
              </Button>
              <Button
                variant={selectedDateFilter === '7days' && !specificDate ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs h-7 px-2.5 font-medium"
                onClick={() => {
                  setSelectedDateFilter('7days');
                  setSpecificDate('');
                }}
              >
                Last 7 Days
              </Button>
            </div>

            {/* Jump to specific date */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-[11px]">Jump to Date:</span>
              <Input
                type="date"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  setSelectedDateFilter('specific');
                }}
                className="text-xs h-7 w-36 font-mono"
              />
              {specificDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSpecificDate('');
                    setSelectedDateFilter('all');
                  }}
                  className="text-[10px] h-7 px-1.5 text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Day-by-Day Timeline List */}
      <div className="space-y-6">
        {groupedByDay.length === 0 ? (
          <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
            <CardContent className="text-center py-12 text-muted-foreground text-xs space-y-2">
              <Clock className="w-10 h-10 mx-auto opacity-30 text-primary" />
              <p className="font-semibold text-foreground text-base">No Standup Reports Found</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {specificDate
                  ? `No team reports submitted on ${specificDate}. Try clearing the date filter.`
                  : blockerOnly
                  ? 'There are zero blockers matching your filter.'
                  : 'Team members submit daily standups at EOD. You can log an update anytime using the button above.'}
              </p>
              <Button
                size="sm"
                onClick={() => setIsStandupModalOpen(true)}
                className="mt-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Log Standup Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          groupedByDay.map(([dateStr, standups]) => {
            const formattedDate = new Date(`${dateStr}T12:00:00Z`).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const isToday = dateStr === todayStr;

            return (
              <div key={dateStr} className="space-y-3">
                {/* Day Header Banner */}
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">{formattedDate}</h2>
                    {isToday && (
                      <Badge className="bg-primary/10 text-primary border-primary/25 text-[10px] font-semibold">
                        Today's Work Log
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {standups.length} Report{standups.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Cards for each worker on this day */}
                <div className="grid grid-cols-1 gap-3.5">
                  {standups.map((standup) => {
                    const devUser = users.find((u) => u.id === standup.developerId);
                    const timeStr = new Date(standup.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <Card
                        key={standup.id}
                        className={`border transition-all ${
                          standup.hasBlocker
                            ? 'border-rose-500/40 bg-rose-500/[0.03] shadow-sm'
                            : 'border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40'
                        }`}
                      >
                        <CardHeader className="p-4 pb-2 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Worker Info */}
                            <div className="flex items-center gap-3">
                              <img
                                src={devUser?.avatar || defaultAvatar}
                                alt={standup.developerName}
                                className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultAvatar;
                                }}
                              />
                              <div>
                                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                  <span>{standup.developerName}</span>
                                  {devUser?.title && (
                                    <span className="text-[11px] text-muted-foreground font-normal">
                                      • {devUser.title}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <FolderKanban className="w-3.5 h-3.5 text-primary" />
                                  <span className="font-semibold text-foreground">
                                    {standup.projectName}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badges & Delete Action */}
                            <div className="flex items-center gap-2">
                              {standup.hasBlocker ? (
                                <Badge
                                  variant="outline"
                                  className="bg-rose-500/10 text-rose-500 border-rose-500/30 gap-1 text-[10px] font-semibold animate-pulse"
                                >
                                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                                  Blocker Reported
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1 text-[10px]"
                                >
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  Zero Blockers
                                </Badge>
                              )}

                              <span className="text-muted-foreground font-mono text-[11px]">
                                {timeStr}
                              </span>

                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setStandupToDelete(standup)}
                                  title="Delete this standup report"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-2 space-y-3">
                          {/* 1. Work Completed Today */}
                          <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Completed Today (Deliverables Done)
                            </div>
                            <p className="text-foreground text-xs leading-relaxed pl-5 font-normal">
                              {standup.completedToday}
                            </p>
                          </div>

                          {/* 2. Planned Next / Tomorrow */}
                          <div className="p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/20 text-xs space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              Planned Next / Tomorrow
                            </div>
                            <p className="text-foreground text-xs leading-relaxed pl-5 font-normal">
                              {standup.plannedTomorrow}
                            </p>
                          </div>

                          {/* 3. Blocker Details if present */}
                          {standup.hasBlocker && standup.blockers && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                Blocker & Coordination Needed
                              </div>
                              <p className="text-rose-600 dark:text-rose-300 text-xs leading-relaxed pl-5 font-medium">
                                {standup.blockers}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Log Today's Standup */}
      <DailyStandupModal
        isOpen={isStandupModalOpen}
        onClose={() => setIsStandupModalOpen(false)}
      />

      {/* MODAL 2: Delete Standup Report Confirmation */}
      <Dialog open={Boolean(standupToDelete)} onOpenChange={(open) => !open && setStandupToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Standup Report
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete the standup report for{' '}
              <strong className="text-foreground">{standupToDelete?.developerName}</strong> on{' '}
              <strong className="text-foreground">{standupToDelete?.projectName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStandupToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Bulk Clean Old Reports */}
      <Dialog open={isCleanOldModalOpen} onOpenChange={setIsCleanOldModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Archive className="w-4 h-4 text-destructive" />
              Clean Old Archive Reports
            </DialogTitle>
            <DialogDescription className="text-xs">
              Remove old historical standup updates to keep your daily operations ledger fresh and uncluttered.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <label className="text-xs font-semibold text-foreground block">
              Delete standup reports older than:
            </label>
            <Select value={cleanDaysThreshold} onValueChange={setCleanDaysThreshold}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7" className="text-xs">Older than 7 days</SelectItem>
                <SelectItem value="14" className="text-xs">Older than 14 days</SelectItem>
                <SelectItem value="30" className="text-xs">Older than 30 days (Recommended)</SelectItem>
                <SelectItem value="60" className="text-xs">Older than 60 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              This will remove all standup logs submitted before {cleanDaysThreshold} days ago across all projects. Current active tasks and developer records remain intact.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCleanOldModalOpen(false)}
              disabled={isCleaning}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleCleanOldReports}
              disabled={isCleaning}
            >
              {isCleaning ? 'Cleaning...' : `Delete Older Than ${cleanDaysThreshold} Days`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StandupsPage;

