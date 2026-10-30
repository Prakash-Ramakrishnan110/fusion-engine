import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  PhoneCall,
  Coins,
  FileText,
  Users,
  UserCheck,
  Receipt,
  BookOpen,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: (context: ReturnType<typeof usePortal>) => number | string | null;
  allowedRoles: Array<'admin' | 'super_admin' | 'developer' | 'telecaller'>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface PortalSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({ className, onNavigate }) => {
  const portalContext = usePortal();
  const { currentUser, activePersona } = portalContext;
  const user = currentUser || activePersona;
  const role = user.role;

  // Streamlined Admin Navigation: Only Core Essential Operations
  const adminSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/portal', icon: LayoutDashboard, allowedRoles: ['admin', 'super_admin'] },
      ],
    },
    {
      title: 'ENGINEERING & PROJECTS',
      items: [
        {
          name: 'Projects',
          path: '/portal/projects',
          icon: FolderKanban,
          badge: (ctx) => ctx.projects.length,
          allowedRoles: ['admin', 'super_admin'],
        },
        {
          name: 'Tasks Board',
          path: '/portal/tasks',
          icon: CheckSquare,
          badge: (ctx) => {
            const submitted = ctx.tasks.filter((t) => t.status === 'Submitted for Review').length;
            return submitted > 0 ? submitted : null;
          },
          allowedRoles: ['admin', 'super_admin'],
        },
      ],
    },
    {
      title: 'SALES & OUTREACH',
      items: [
        {
          name: 'CRM Workspace',
          path: '/portal/telecaller',
          icon: PhoneCall,
          badge: (ctx) => {
            const newLeads = ctx.leads.filter((l) => l.status === 'New').length;
            return newLeads > 0 ? newLeads : null;
          },
          allowedRoles: ['admin', 'super_admin'],
        },
        {
          name: 'Clients & Accounts',
          path: '/portal/clients',
          icon: UserCheck,
          allowedRoles: ['admin', 'super_admin'],
        },
      ],
    },
    {
      title: 'MANAGEMENT & FINANCE',
      items: [
        {
          name: 'Workforce Directory',
          path: '/portal/team',
          icon: Users,
          badge: (ctx) => ctx.users.length,
          allowedRoles: ['admin', 'super_admin'],
        },
        {
          name: 'Daily Standups & Reports',
          path: '/portal/standups',
          icon: Clock,
          badge: (ctx) => {
            const blockers = (ctx.dailyStandups || []).filter((s) => s.hasBlocker).length;
            return blockers > 0 ? `${blockers} Blocker${blockers > 1 ? 's' : ''}` : null;
          },
          allowedRoles: ['admin', 'super_admin'],
        },
        {
          name: 'Finance & Vouchers',
          path: '/portal/finance',
          icon: Coins,
          badge: (ctx) => {
            const approved = ctx.vouchers.filter((v) => v.status === 'Approved').length;
            return approved > 0 ? approved : null;
          },
          allowedRoles: ['admin', 'super_admin'],
        },
        {
          name: 'Document Vault',
          path: '/portal/documents',
          icon: FileText,
          badge: (ctx) => ctx.documents.length,
          allowedRoles: ['admin', 'super_admin'],
        },
      ],
    },
  ];

  const developerSections: NavSection[] = [
    {
      title: 'ENGINEERING & TASKS',
      items: [
        { name: 'My Dashboard', path: '/portal', icon: LayoutDashboard, allowedRoles: ['developer'] },
        {
          name: 'My Tasks',
          path: '/portal/tasks',
          icon: CheckSquare,
          badge: (ctx) => {
            const myTasks = ctx.tasks.filter(
              (t) => t.assignedToId === user.id && t.status !== 'Approved'
            ).length;
            return myTasks > 0 ? myTasks : null;
          },
          allowedRoles: ['developer'],
        },
        {
          name: 'My Projects',
          path: '/portal/projects',
          icon: FolderKanban,
          badge: (ctx) => {
            const assigned = ctx.projects.filter((p) =>
              p.members?.some((m) => m.profileId === user.id)
            ).length;
            return assigned > 0 ? assigned : null;
          },
          allowedRoles: ['developer'],
        },
      ],
    },
    {
      title: 'COMPENSATION & PROFILE',
      items: [
        {
          name: 'My Earnings & Vouchers',
          path: '/portal/finance',
          icon: Receipt,
          badge: (ctx) => {
            const myVouchers = ctx.vouchers.filter((v) => v.recipientId === user.id).length;
            return myVouchers > 0 ? myVouchers : null;
          },
          allowedRoles: ['developer'],
        },
        {
          name: 'Developer Profile',
          path: '/portal/team',
          icon: Users,
          allowedRoles: ['developer'],
        },
      ],
    },
  ];

  const telecallerSections: NavSection[] = [
    {
      title: 'OUTREACH & CRM',
      items: [
        {
          name: 'Outreach Dashboard',
          path: '/portal',
          icon: LayoutDashboard,
          allowedRoles: ['telecaller'],
        },
        {
          name: 'CRM Workspace',
          path: '/portal/telecaller',
          icon: PhoneCall,
          badge: (ctx) => {
            const active = ctx.leads.filter((l) => l.isLocked).length;
            return active > 0 ? `${active} lock` : null;
          },
          allowedRoles: ['telecaller'],
        },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        {
          name: 'My Profile',
          path: '/portal/team',
          icon: Users,
          allowedRoles: ['telecaller'],
        },
      ],
    },
  ];

  const location = useLocation();

  // Select sections based on current active role
  const sections =
    role === 'telecaller'
      ? telecallerSections
      : role === 'developer'
      ? developerSections
      : adminSections;

  const isItemActive = (itemPath: string, routerIsActive: boolean) => {
    if (itemPath === '/portal') {
      return location.pathname === '/portal';
    }
    if (itemPath.includes('?tab=')) {
      const [pathPart, queryPart] = itemPath.split('?');
      return location.pathname === pathPart && location.search.includes(queryPart);
    }
    if (itemPath === '/portal/team') {
      return location.pathname === '/portal/team' && !location.search.includes('tab=hiring');
    }
    return routerIsActive;
  };

  return (
    <aside className={className || "hidden md:flex w-64 border-r border-border/40 bg-card/40 flex-col shrink-0 h-full min-h-0"}>
      {/* Role Context Header */}
      <div className="p-3.5 border-b border-border/30 bg-muted/15 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Active Workspace
          </span>
          <Badge
            variant="outline"
            className={`text-[9px] font-mono px-1.5 py-0 ${
              role === 'admin' || role === 'super_admin'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : role === 'developer'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
            }`}
          >
            {role.toUpperCase()}
          </Badge>
        </div>
        <div className="text-xs font-semibold text-foreground truncate">
          {role === 'telecaller'
            ? 'Inside Sales & CRM Pipeline'
            : role === 'developer'
            ? 'Engineering & Submissions'
            : 'Super Admin Executive Portal'}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar">
        {sections.map((section, sIdx) => (
          <div key={section.title || sIdx} className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const badgeValue = item.badge ? item.badge(portalContext) : null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onNavigate?.()}
                  end={item.path === '/portal'}
                  className={({ isActive: routerIsActive }) => {
                    const active = isItemActive(item.path, routerIsActive);
                    return `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      active
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`;
                  }}
                >
                  {({ isActive: routerIsActive }) => {
                    const active = isItemActive(item.path, routerIsActive);
                    return (
                      <>
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                              active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {badgeValue !== null && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ml-1.5 ${
                              active
                                ? 'bg-primary-foreground/20 text-primary-foreground font-bold'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {badgeValue}
                          </span>
                        )}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>


      {/* Footer System Status */}
      <div className="p-3 border-t border-border/30 bg-muted/10 text-[11px] text-muted-foreground space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span>Security Protocol</span>
          <span className="font-mono text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> RLS Active
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground truncate">
          Logged in: <span className="font-mono text-foreground font-medium">{user.userId}</span>
        </div>
      </div>
    </aside>
  );
};

export default PortalSidebar;
