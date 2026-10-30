import React from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPopover: React.FC = () => {
  const { notifications, markNotificationRead } = usePortal();

  // Synthetic notifications if DB table is empty so user has visual feedback
  const displayNotifications = notifications.length > 0
    ? notifications
    : [
        {
          id: 'notif_1',
          userId: 'usr',
          title: 'System Initialized',
          body: 'Multi-project ERP & CRM ready with Supabase backend and RLS.',
          createdAt: new Date().toISOString(),
          readAt: null,
          link: '/portal',
        },
      ];

  const unreadCount = displayNotifications.filter((n) => !n.readAt).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0 rounded-full hover:bg-muted">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 shadow-xl border-border/60">
        <div className="p-3 border-b border-border/40 flex items-center justify-between bg-muted/20">
          <span className="text-xs font-bold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/20">
          {displayNotifications.map((notif) => {
            const isUnread = !notif.readAt;
            return (
              <div
                key={notif.id}
                className={`p-3 text-xs transition-colors ${isUnread ? 'bg-primary/5 font-medium' : 'hover:bg-muted/30'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-foreground font-semibold">{notif.title}</span>
                  {isUnread && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-[10px] text-primary hover:underline flex items-center gap-0.5 shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{notif.body}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Just now
                  </span>
                  {notif.link && (
                    <Link to={notif.link} className="text-primary hover:underline flex items-center gap-0.5">
                      View <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
