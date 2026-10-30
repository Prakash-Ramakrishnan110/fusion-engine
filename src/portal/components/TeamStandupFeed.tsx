import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { DailyStandupUpdate } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ShieldCheck,
  Check,
} from 'lucide-react';
import defaultAvatar from '../../assets/default-avatar.svg';

interface TeamStandupFeedProps {
  onOpenNewStandup?: () => void;
  maxItems?: number;
  compact?: boolean;
}

export const TeamStandupFeed: React.FC<TeamStandupFeedProps> = ({
  onOpenNewStandup,
  maxItems,
  compact = false,
}) => {
  const { dailyStandups, projects, users, currentUser, activePersona } = usePortal();
  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [blockerOnly, setBlockerOnly] = useState<boolean>(false);

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

      if (selectedProjectId !== 'all' && standup.projectId !== selectedProjectId) {
        return false;
      }
      if (blockerOnly && !standup.hasBlocker) {
        return false;
      }
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
  }, [dailyStandups, selectedProjectId, blockerOnly, searchQuery, isAdmin, user]);

  const displayList = maxItems ? filteredStandups.slice(0, maxItems) : filteredStandups;

  const totalBlockers = (isAdmin
    ? dailyStandups
    : dailyStandups.filter(
        (s) =>
          s.developerId === user.id ||
          s.developerId === user.userId ||
          s.developerName.toLowerCase() === user.name.toLowerCase()
      )
  ).filter((s) => s.hasBlocker).length;

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                {isAdmin ? 'Workforce Standups & EOD Progress Logs' : 'My Daily Progress & Standups'}
              </Badge>
              {totalBlockers > 0 && (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/30 text-[10px] animate-pulse">
                  {totalBlockers} Active Blocker{totalBlockers > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-primary" />
              {isAdmin ? 'Workforce Daily Progress & Standup Reports' : 'My Daily Progress & Standup Reports'}
            </CardTitle>
            <CardDescription className="text-xs">
              {isAdmin
                ? 'Live progress feeds from developers and telecallers. Review completed milestones and clear technical blockers.'
                : 'Your personal daily progress ledger and sprint work updates.'}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {onOpenNewStandup && (
              <Button
                size="sm"
                onClick={onOpenNewStandup}
                className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Today's Standup</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        {!compact && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search by worker name, project, or task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 h-8"
              />
            </div>

            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[180px] text-xs h-8">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Projects ({dailyStandups.length})
                </SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant={blockerOnly ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setBlockerOnly(!blockerOnly)}
              className="text-xs h-8 gap-1.5"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{blockerOnly ? 'Showing Blockers' : 'Filter Blockers'}</span>
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3.5">
        {displayList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs space-y-2">
            <Clock className="w-8 h-8 mx-auto opacity-30 text-primary" />
            <p className="font-semibold text-foreground text-sm">No Standup Updates Found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {blockerOnly
                ? 'Great news! There are zero blockers flagged.'
                : isAdmin
                ? 'Workforce daily progress ledger is currently empty. Team members submit daily standups at EOD.'
                : 'You have not submitted a standup report yet. Click the button above to log today\'s progress.'}
            </p>
            {onOpenNewStandup && (
              <Button size="sm" variant="outline" onClick={onOpenNewStandup} className="mt-2 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Post First Standup
              </Button>
            )}
          </div>
        ) : (
          displayList.map((standup) => {
            const devUser = users.find((u) => u.id === standup.developerId);
            const timeAgo = new Date(standup.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={standup.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  standup.hasBlocker
                    ? 'border-rose-500/40 bg-rose-500/[0.03] shadow-sm'
                    : 'border-border/50 bg-background/50 hover:border-primary/40'
                }`}
              >
                {/* Header row: Worker + Project + Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={devUser?.avatar || defaultAvatar}
                      alt={standup.developerName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultAvatar;
                      }}
                    />
                    <div>
                      <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <span>{standup.developerName}</span>
                        {devUser?.title && (
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({devUser.title})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <FolderKanban className="w-3 h-3 text-primary" />
                        <span className="font-medium text-foreground">{standup.projectName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    {standup.hasBlocker ? (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/30 gap-1 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        Blocker Reported
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1 font-normal">
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                        Zero Blockers
                      </Badge>
                    )}
                    <span className="text-muted-foreground font-mono">{timeAgo}</span>
                  </div>
                </div>

                {/* Body 1: Work Completed Today */}
                <div className="p-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Completed Today (Work Done)
                  </div>
                  <p className="text-foreground text-[11px] leading-relaxed pl-5 font-normal">
                    {standup.completedToday}
                  </p>
                </div>

                {/* Body 2: Planned Next / Tomorrow */}
                <div className="p-2.5 rounded-lg bg-blue-500/[0.06] border border-blue-500/20 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    Planned Next / Tomorrow
                  </div>
                  <p className="text-foreground text-[11px] leading-relaxed pl-5 font-normal">
                    {standup.plannedTomorrow}
                  </p>
                </div>

                {/* Body 3: Blockers (if any) */}
                {standup.hasBlocker && standup.blockers && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Blocker & Needs Coordination
                    </div>
                    <p className="text-rose-600 dark:text-rose-300 text-[11px] leading-relaxed pl-5 font-medium">
                      {standup.blockers}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

