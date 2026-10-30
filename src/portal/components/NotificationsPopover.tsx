import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  Trash2,
  Briefcase,
  FolderKanban,
  CreditCard,
  Flame,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  recruitment: {
    bg: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    text: 'text-blue-500',
    icon: Briefcase,
    label: 'Recruitment',
  },
  task: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    text: 'text-emerald-500',
    icon: FolderKanban,
    label: 'Deliverable',
  },
  finance: {
    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
    text: 'text-purple-500',
    icon: CreditCard,
    label: 'Finance',
  },
  lead: {
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    text: 'text-amber-500',
    icon: Flame,
    label: 'Sales Lead',
  },
  system: {
    bg: 'bg-slate-500/10 border-slate-500/30 text-slate-500',
    text: 'text-slate-500',
    icon: ShieldAlert,
    label: 'System',
  },
};

const formatTimeAgo = (dateStr: string): string => {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};

export const NotificationsPopover: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = usePortal();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.readAt) 
    : notifications;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-9 h-9 p-0 rounded-full hover:bg-muted"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-88 sm:w-96 p-0 shadow-2xl border-border/60 bg-card/95 backdrop-blur-md">
        {/* Top Header */}
        <div className="p-3 border-b border-border/40 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono bg-primary/10 text-primary border-primary/20">
                {unreadCount} unread
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllNotificationsRead()}
                className="h-6 px-1.5 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                title="Mark all as read"
              >
                <CheckCheck className="w-3 h-3 text-primary" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearNotifications()}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 bg-muted/10 text-[11px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification Scrollable List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/20">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
              <p className="text-xs font-semibold text-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'All caught up!'}
              </p>
              <p className="text-[11px] max-w-[220px]">
                {filter === 'unread'
                  ? 'You have addressed all active alerts and reminders.'
                  : 'Candidate applications, agreements, and deliverables will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUnread = !notif.readAt;
              const catKey = (notif.category || 'system').toLowerCase();
              const catStyle = CATEGORY_STYLES[catKey] || CATEGORY_STYLES.system;
              const Icon = catStyle.icon;

              return (
                <div
                  key={notif.id}
                  className={`p-3 text-xs transition-colors relative ${
                    isUnread ? 'bg-primary/5 font-medium' : 'hover:bg-muted/30 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Category Icon */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${catStyle.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-foreground font-semibold text-xs leading-snug truncate">
                          {notif.title}
                        </span>
                        {isUnread && (
                          <button
                            type="button"
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 shrink-0"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3 text-primary" />
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                        {notif.body}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimeAgo(notif.createdAt)}
                        </span>

                        {notif.link && (
                          <Link
                            to={notif.link}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              setIsOpen(false);
                            }}
                            className="text-primary font-semibold hover:underline flex items-center gap-0.5 transition-colors"
                          >
                            View Details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
