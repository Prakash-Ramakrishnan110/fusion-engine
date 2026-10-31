import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import defaultAvatar from '../../assets/default-avatar.svg';
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
import {
  Building2,
  Search,
  KeyRound,
  LogOut,
  ShieldAlert,
  Code2,
  PhoneCall,
  User,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Plus,
  Check,
  UserCheck,
  Edit3,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PortalSidebar } from './PortalSidebar';
import { Menu } from 'lucide-react';
import { ProjectSwitcher } from './ProjectSwitcher';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsPopover } from './NotificationsPopover';
import { ChangePasswordModal } from './ChangePasswordModal';
import { ProjectWizardModal } from './ProjectWizardModal';

export const PortalHeader: React.FC = () => {
  const { currentUser, activePersona, updateProfile, logout } = usePortal();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Edit profile form state
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editDept, setEditDept] = useState(user.department || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleOpenEditProfile = () => {
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditDept(user.department || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    setIsSavingProfile(true);
    await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      department: editDept.trim(),
    });
    setIsSavingProfile(false);
    setIsEditProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out from portal.');
    } finally {
      navigate('/portal/login', { replace: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Organization Branding & Project Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                title="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 max-w-[85vw] bg-card border-r border-border">
              <PortalSidebar
                className="flex w-full h-full flex-col border-none bg-card"
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Link to="/portal" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src="/header-logo.png"
              alt="Fusion Engine Technology"
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <span className="hidden lg:inline-flex text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              ERP v2.0
            </span>
          </Link>

          {/* Role-Based Project Switcher */}
          <div className="hidden md:block">
            <ProjectSwitcher onOpenNewProjectWizard={() => setIsWizardOpen(true)} />
          </div>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-9 px-3 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/50 text-xs text-muted-foreground flex items-center justify-between transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search projects, tasks, leads...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-card px-1.5 py-0.5 rounded border border-border/60">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search mobile icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden w-8 h-8 p-0"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* Admin "+ New Project" Wizard Shortcut */}
          {isAdmin && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              className="hidden lg:inline-flex text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Button>
          )}

          {/* Realtime Notifications Bell */}
          <NotificationsPopover />

          {/* Public Website Link */}
          <Button variant="ghost" size="sm" asChild className="hidden xl:inline-flex text-xs h-8 text-muted-foreground hover:text-foreground">
            <Link to="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Website
            </Link>
          </Button>

          {/* User Account / Role Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-9 px-2.5 bg-card/70 border-border/60 hover:bg-accent/40 transition-colors"
              >
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-primary/40 bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultAvatar;
                  }}
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                    <span className="truncate max-w-[110px]">{user.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 px-1 font-mono uppercase ${
                        user.role === 'admin' || user.role === 'super_admin'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : user.role === 'developer'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-1.5">
              <DropdownMenuLabel className="p-2 bg-muted/30 rounded-md text-xs space-y-0.5 mb-1">
                <div className="font-bold text-foreground">{user.name}</div>
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  User ID: {user.userId}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Department: {user.department || 'Operations'}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Edit Profile */}
              <DropdownMenuItem
                onClick={handleOpenEditProfile}
                className="text-xs flex items-center gap-2 cursor-pointer py-2 font-medium text-foreground hover:bg-accent/40"
              >
                <Edit3 className="w-3.5 h-3.5 text-primary" />
                <span>Edit Profile Details</span>
              </DropdownMenuItem>

              {/* Change Password */}
              <DropdownMenuItem
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-xs flex items-center gap-2 cursor-pointer py-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Change Password</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Sign Out */}
              <DropdownMenuItem
                onSelect={handleLogout}
                onClick={handleLogout}
                className="text-xs flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer py-2 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Edit My Profile
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update your display name, contact phone number, and departmental role.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Full Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Prakash (Super Admin)"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Phone Number</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Department</label>
                <Input
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  placeholder="Executive Leadership / Engineering / Sales"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSavingProfile}
                className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <ProjectWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
};

export default PortalHeader;
