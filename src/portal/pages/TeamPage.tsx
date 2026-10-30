import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { UserPersona, UserRole, JobApplication } from '../types';
import defaultAvatar from '../../assets/default-avatar.svg';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Users,
  Briefcase,
  UserCheck,
  Plus,
  KeyRound,
  ShieldCheck,
  UserX,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Code2,
  FolderKanban,
  AlertTriangle,
  Download,
  FileText,
  Lock,
  Unlock,
  XCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Trash2,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { CandidateEmailModal } from '../components/CandidateEmailModal';

export const TeamPage: React.FC = () => {
  const {
    users,
    tasks,
    projects,
    activePersona,
    currentUser,
    createUser,
    resetUserPassword,
    setUserActive,
    applications,
    recruitmentSettings,
    updateApplicationStatus,
    toggleRecruitmentLock,
    deleteJobApplication,
    deleteUser,
  } = usePortal();

  const user = currentUser || activePersona || (users && users[0]);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Deletion modals state
  const [appToDelete, setAppToDelete] = useState<JobApplication | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserPersona | null>(null);
  const [isDeletingApp, setIsDeletingApp] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);


  // Modal 1: Provision New Account
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'developer' | 'telecaller'>('developer');
  const [newDepartment, setNewDepartment] = useState('Engineering');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [temporaryPassword, setTemporaryPassword] = useState('TempPass@2026!');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Modal 2: Reset Password Dialog (Admin cannot view existing passwords!)
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserPersona | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Hiring & Candidate Applications Tab States
  const [hiringFilter, setHiringFilter] = useState<'All' | 'New' | 'Shortlisted' | 'Hired' | 'Rejected'>('All');
  const [hiringSearch, setHiringSearch] = useState('');

  // Modal 3: Candidate Email Notification Dialog
  const [selectedAppForEmail, setSelectedAppForEmail] = useState<JobApplication | null>(null);
  const [targetStatusForEmail, setTargetStatusForEmail] = useState<string>('Shortlisted');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleTriggerCandidateAction = (
    app: JobApplication,
    status: 'Shortlisted' | 'Hired' | 'Rejected' | string
  ) => {
    setSelectedAppForEmail(app);
    setTargetStatusForEmail(status);
    setIsEmailModalOpen(true);
  };

  const handleProvisionCandidateShortcut = (app: JobApplication) => {
    const suggestedUserId = app.fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '.')
      .replace(/\.+/g, '.')
      .slice(0, 20);

    setNewFullName(app.fullName);
    setNewUserId(suggestedUserId);
    setNewRole(app.department === 'sales' ? 'telecaller' : 'developer');
    setNewDepartment(app.department === 'sales' ? 'Inside Sales & CRM' : 'Engineering');
    setNewPhone(app.phone || '+91 ');
    setTemporaryPassword('Welcome@2026!');
    setIsProvisionOpen(true);
    toast.info(`Candidate details pre-filled for account provisioning!`);
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUserId.trim() || !temporaryPassword.trim()) {
      toast.error('Please enter name, user ID, and temporary password.');
      return;
    }

    setIsProvisioning(true);
    const res = await createUser({
      userId: newUserId.trim().toLowerCase(),
      fullName: newFullName.trim(),
      role: newRole,
      department: newDepartment,
      phone: newPhone.trim(),
      temporaryPassword: temporaryPassword.trim(),
    });
    setIsProvisioning(false);

    if (res.success) {
      toast.success(
        `Account provisioned! User ID: "${newUserId.trim().toLowerCase()}" will be forced to change password on first login.`
      );
      setIsProvisionOpen(false);
      setNewFullName('');
      setNewUserId('');
      setTemporaryPassword('TempPass@2026!');
    } else {
      toast.error(res.error || 'Failed to provision user.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset) return;

    setIsResetting(true);
    const res = await resetUserPassword(selectedUserForReset.id, newResetPassword.trim() || undefined);
    setIsResetting(false);

    if (res.success) {
      toast.success(
        `Password reset for "${selectedUserForReset.name}". Temporary password: "${res.temporaryPassword || newResetPassword}"`
      );
      setSelectedUserForReset(null);
      setNewResetPassword('');
    } else {
      toast.error(res.error || 'Failed to reset password.');
    }
  };

  const handleToggleActive = async (targetUser: UserPersona) => {
    const nextActive = !targetUser.isActive;
    const res = await setUserActive(targetUser.id, nextActive);
    if (res.success) {
      toast.success(
        `User ${targetUser.name} has been ${nextActive ? 'activated' : 'deactivated'}.`
      );
    } else {
      toast.error('Failed to change user status.');
    }
  };

  // Workload calculations across projects
  const developers = users.filter((u) => u.role === 'developer');

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'directory';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {isAdmin ? 'Workforce Directory' : 'Personal Profile'}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {isAdmin ? `${users.length} Active Accounts` : 'Verified Account Profile'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            {isAdmin ? 'Workforce Management & Directory' : 'My Account & Profile'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAdmin
              ? 'Internal team registry, role-based access credentials, workload distribution, and compliance records.'
              : 'Your employee identity, role assignment, login credentials, and statutory payout details.'}
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => setIsProvisionOpen(true)}
            className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Account</span>
          </Button>
        )}
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(val) => setSearchParams({ tab: val })}
        className="space-y-4"
      >
        <TabsList className="bg-muted/40 p-1 flex-wrap">
          <TabsTrigger value="directory" className="text-xs gap-1.5">
            <Users className="w-3.5 h-3.5" /> {isAdmin ? `Team Directory (${users.length})` : 'My Profile'}
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="workload" className="text-xs gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Engineering Workload
            </TabsTrigger>
          )}
          <TabsTrigger value="compliance" className="text-xs gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> KYC & Statutory Bank Records
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="hiring" className="text-xs gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Hiring & Applications ({applications.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* TAB 1: DIRECTORY (All workers visible ONLY to Admin; non-admin sees only own profile) */}
        <TabsContent value="directory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((member) => isAdmin || member.id === user.id)
              .map((member) => {
              const isSelf = member.id === user.id;
              const isDeactivated = member.isActive === false;

              return (
                <Card
                  key={member.id}
                  className={`border transition-all ${
                    isDeactivated
                      ? 'border-border/40 opacity-60 bg-muted/20'
                      : 'border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40'
                  }`}
                >
                  <CardHeader className="p-4 pb-2 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || defaultAvatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar;
                          }}
                        />
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {isSelf && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 text-primary">
                                YOU
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground">
                            ID: {member.userId}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-mono ${
                          member.role === 'admin' || member.role === 'super_admin'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            : member.role === 'developer'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        }`}
                      >
                        {member.role}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {member.title} • {member.department}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="text-[11px] space-y-1 pt-1 border-t border-border/30">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Email:</span>
                        <span className="font-mono text-foreground">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Phone:</span>
                          <span className="font-mono text-foreground">{member.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Account Status:</span>
                        <span
                          className={`font-semibold ${
                            isDeactivated ? 'text-destructive' : 'text-emerald-500'
                          }`}
                        >
                          {isDeactivated ? 'Deactivated' : 'Active & Verified'}
                        </span>
                      </div>
                    </div>

                    {/* Admin Actions: Reset Password, Deactivate/Reactivate, Delete */}
                    {isAdmin && !isSelf && (
                      <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-1.5 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 gap-1"
                          onClick={() => setSelectedUserForReset(member)}
                        >
                          <KeyRound className="w-3 h-3 text-muted-foreground" />
                          <span>Reset Password</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-xs h-7 ${
                              isDeactivated
                                ? 'text-emerald-500 hover:bg-emerald-500/10'
                                : 'text-amber-500 hover:bg-amber-500/10'
                            }`}
                            onClick={() => handleToggleActive(member)}
                          >
                            {isDeactivated ? 'Reactivate' : 'Deactivate'}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-destructive hover:bg-destructive/10 px-2"
                            onClick={() => setUserToDelete(member)}
                            title="Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: WORKLOAD VIEW (Admin) */}
        {isAdmin && (
          <TabsContent value="workload" className="space-y-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
              <CardHeader className="p-4 sm:p-6 border-b border-border/40">
                <CardTitle className="text-base font-bold text-foreground">
                  Developer Workload & Project Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Active deliverable tasks and estimated hours across all engineering builds.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {developers.map((dev) => {
                    const devTasks = tasks.filter((t) => t.assignedToId === dev.id);
                    const pendingTasks = devTasks.filter((t) => t.status !== 'Approved');
                    const totalHours = devTasks.reduce((acc, t) => acc + (t.estimatedHours || 8), 0);

                    return (
                      <div
                        key={dev.id}
                        className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{dev.name}</span>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {devTasks.length} Assigned Tasks
                            </Badge>
                          </div>
                          <span className="font-mono text-muted-foreground font-semibold">
                            ~{totalHours} Estimated Hours
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                          <span>
                            Pending Delivery: <strong className="text-foreground">{pendingTasks.length}</strong>
                          </span>
                          <span>
                            Approved: <strong className="text-emerald-500">{devTasks.length - pendingTasks.length}</strong>
                          </span>
                          <span>
                            Workload Status:{' '}
                            <strong className={pendingTasks.length > 3 ? 'text-amber-500' : 'text-emerald-500'}>
                              {pendingTasks.length > 3 ? 'High Load (Reassign)' : 'Available / Balanced'}
                            </strong>
                          </span>
                        </div>

                        {/* Project Assignments Matrix */}
                        <div className="pt-2 border-t border-border/30">
                          <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                            Assigned Active Projects:
                          </div>
                          {(() => {
                            const assignedProjects = projects.filter((p) =>
                              p.members?.some((m) => m.profileId === dev.id)
                            );
                            if (assignedProjects.length === 0) {
                              return (
                                <span className="text-[11px] text-amber-500 italic">
                                  Not allocated to any active project yet (Free capacity)
                                </span>
                              );
                            }
                            return (
                              <div className="flex flex-wrap gap-1.5">
                                {assignedProjects.map((p) => {
                                  const memInfo = p.members?.find((m) => m.profileId === dev.id);
                                  return (
                                    <Badge
                                      key={p.id}
                                      variant="outline"
                                      className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1 font-normal"
                                    >
                                      <FolderKanban className="w-3 h-3" />
                                      <strong>{p.name}</strong>
                                      {memInfo?.projectRole && (
                                        <span className="opacity-80">({memInfo.projectRole.replace('_', ' ')} • {memInfo.allocationPct}%)</span>
                                      )}
                                    </Badge>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 3: KYC & STATUTORY RECORDS */}
        <TabsContent value="compliance" className="space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
            <CardHeader className="p-4 sm:p-6 border-b border-border/40">
              <CardTitle className="text-base font-bold text-foreground">
                Developer Financial & Statutory KYC Ledger
              </CardTitle>
              <CardDescription className="text-xs">
                Permanent Account Number (PAN) and bank details required for Sec 194J TDS disbursements. Visible strictly to Admin and the respective engineer.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                {users
                  .filter((u) => isAdmin || u.id === user.id)
                  .map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-xl border border-border/50 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          PAN: <span className="font-mono font-semibold text-foreground">{u.pan || 'ABCDE1234F'}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Bank: {u.bankAccountNo ? `A/C ••••${u.bankAccountNo.slice(-4)} (${u.ifsc || 'HDFC'})` : 'HDFC Bank ••••4321'}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 w-fit"
                      >
                        <ShieldCheck className="w-3 h-3 mr-1 inline" /> KYC Verified
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: HIRING LOCKS & CANDIDATE APPLICATIONS */}
        {isAdmin && (
          <TabsContent value="hiring" className="space-y-6">
            {/* Top Control Card: Role Hiring Locks */}
            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
              <CardHeader className="p-4 sm:p-6 border-b border-border/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Role Hiring Locks & Recruitment Controls
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Instantly toggle developer and telecaller application gates. When locked, the public Careers page blocks applications for that role and displays &ldquo;Applications Closed&rdquo;.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit text-[11px] font-mono bg-primary/5 text-primary border-primary/20">
                    <Mail className="w-3 h-3 mr-1 inline" /> fusionenginetechnology@gmail.com
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lock 1: Developer Roles */}
                  <div className="p-4 rounded-2xl border border-border/60 bg-background/50 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-primary" />
                          <span className="font-bold text-sm text-foreground">Developer & Engineering Hiring</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Controls Full-Stack, Frontend, and Backend Contractor job application submissions.
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          recruitmentSettings?.engineeringHiringOpen
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-destructive/10 text-destructive border-destructive/30'
                        }`}
                      >
                        {recruitmentSettings?.engineeringHiringOpen ? (
                          <span className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Applications Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked / Positions Filled
                          </span>
                        )}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground">
                        {recruitmentSettings?.engineeringHiringOpen
                          ? 'Candidates can submit resume and portfolio.'
                          : 'Public form blocked; shows closed badge.'}
                      </span>
                      <Button
                        size="sm"
                        variant={recruitmentSettings?.engineeringHiringOpen ? 'destructive' : 'default'}
                        onClick={() =>
                          toggleRecruitmentLock(
                            'engineering',
                            !recruitmentSettings?.engineeringHiringOpen
                          )
                        }
                        className="text-xs h-8 gap-1.5 cursor-pointer font-semibold shadow-xs"
                      >
                        {recruitmentSettings?.engineeringHiringOpen ? (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Lock Developer Roles
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" /> Open Developer Roles
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Lock 2: Telecaller Roles */}
                  <div className="p-4 rounded-2xl border border-border/60 bg-background/50 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-sm text-foreground">Telecaller & Sales Hiring</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Controls Inside Sales Executive & Telecaller commission partner application submissions.
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          recruitmentSettings?.salesHiringOpen
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-destructive/10 text-destructive border-destructive/30'
                        }`}
                      >
                        {recruitmentSettings?.salesHiringOpen ? (
                          <span className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Applications Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked / Positions Filled
                          </span>
                        )}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground">
                        {recruitmentSettings?.salesHiringOpen
                          ? 'Candidates can submit outreach background.'
                          : 'Public form blocked; shows closed badge.'}
                      </span>
                      <Button
                        size="sm"
                        variant={recruitmentSettings?.salesHiringOpen ? 'destructive' : 'default'}
                        onClick={() =>
                          toggleRecruitmentLock(
                            'sales',
                            !recruitmentSettings?.salesHiringOpen
                          )
                        }
                        className="text-xs h-8 gap-1.5 cursor-pointer font-semibold shadow-xs"
                      >
                        {recruitmentSettings?.salesHiringOpen ? (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Lock Telecaller Roles
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" /> Open Telecaller Roles
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Applications Section */}
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 border border-border/60 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search candidate name, email, phone, role..."
                    value={hiringSearch}
                    onChange={(e) => hiringSearch !== e.target.value && setHiringSearch(e.target.value)}
                    className="h-8 text-xs w-full sm:w-64"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['All', 'New', 'Shortlisted', 'Hired', 'Rejected'] as const).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={hiringFilter === status ? 'default' : 'ghost'}
                      onClick={() => setHiringFilter(status)}
                      className={`text-xs h-7 px-2.5 rounded-lg cursor-pointer ${
                        hiringFilter === status ? 'shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      {status}
                      {status === 'All'
                        ? ` (${applications.length})`
                        : ` (${applications.filter((a) => a.status === status).length})`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Candidate Cards */}
              {(() => {
                const appList = applications || [];
                const q = hiringSearch.trim().toLowerCase();

                const filtered = appList.filter((app) => {
                  if (!app) return false;
                  const matchStatus = hiringFilter === 'All' || app.status === hiringFilter;
                  const matchSearch =
                    !q ||
                    (app.fullName || '').toLowerCase().includes(q) ||
                    (app.email || '').toLowerCase().includes(q) ||
                    (app.phone || '').includes(q) ||
                    (app.roleTitle || '').toLowerCase().includes(q) ||
                    (app.referenceCode || '').toLowerCase().includes(q);
                  return matchStatus && matchSearch;
                });


                if (filtered.length === 0) {
                  return (
                    <Card className="border-border/60 bg-card/40 backdrop-blur text-center p-8">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">
                          {applications.length === 0
                            ? 'No Candidate Applications Yet'
                            : 'No Matching Candidate Applications'}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {applications.length === 0
                            ? 'When prospective developers or telecallers apply via the Careers page (/careers), their full profile, contact details, and resume files (.pdf, .doc, .docx) will automatically appear here.'
                            : 'Try clearing your search query or switching the status filter.'}
                        </p>
                      </div>
                    </Card>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((app) => (
                      <Card
                        key={app.id}
                        className="border border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-all"
                      >
                        <CardContent className="p-5 sm:p-6 space-y-4">
                          {/* Row 1: Candidate Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-foreground">{app.fullName}</h3>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] font-bold ${
                                    app.department === 'sales'
                                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                      : 'bg-primary/10 text-primary border-primary/30'
                                  }`}
                                >
                                  {app.roleTitle}
                                </Badge>
                                <span className="text-[11px] font-mono text-muted-foreground">
                                  {app.referenceCode}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                                <a
                                  href={`mailto:${app.email}`}
                                  className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-primary" /> {app.email}
                                </a>
                                <a
                                  href={`tel:${app.phone}`}
                                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {app.phone}
                                </a>
                                {app.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {app.city}
                                  </span>
                                )}
                                <span className="text-[11px] text-muted-foreground/80">
                                  Applied {new Date(app.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Candidate Actions & Status Controls */}
                            <div className="shrink-0 flex flex-col sm:items-end gap-2">
                              {/* Quick Action Buttons: Shortlist, Hire, Reject */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className={`h-7 px-2.5 text-xs gap-1 font-semibold transition-all cursor-pointer ${
                                    app.status === 'Shortlisted'
                                      ? 'bg-blue-500/20 text-blue-600 border-blue-500/40 shadow-xs'
                                      : 'hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 text-muted-foreground'
                                  }`}
                                  onClick={() => handleTriggerCandidateAction(app, 'Shortlisted')}
                                  title="Shortlist candidate and send invitation email"
                                >
                                  <Star className={`w-3.5 h-3.5 ${app.status === 'Shortlisted' ? 'fill-blue-500 text-blue-500' : ''}`} />
                                  <span>Shortlist</span>
                                </Button>

                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className={`h-7 px-2.5 text-xs gap-1 font-semibold transition-all cursor-pointer ${
                                    app.status === 'Hired'
                                      ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40 shadow-xs'
                                      : 'hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 text-muted-foreground'
                                  }`}
                                  onClick={() => handleTriggerCandidateAction(app, 'Hired')}
                                  title="Hire candidate and send offer email"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Hire</span>
                                </Button>

                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className={`h-7 px-2.5 text-xs gap-1 font-semibold transition-all cursor-pointer ${
                                    app.status === 'Rejected'
                                      ? 'bg-rose-500/20 text-rose-600 border-rose-500/40 shadow-xs'
                                      : 'hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 text-muted-foreground'
                                  }`}
                                  onClick={() => handleTriggerCandidateAction(app, 'Rejected')}
                                  title="Reject candidate and send acknowledgement email"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </Button>

                                <Select
                                  value={app.status}
                                  onValueChange={(val) => {
                                    if (val === 'Shortlisted' || val === 'Hired' || val === 'Rejected') {
                                      handleTriggerCandidateAction(app, val);
                                    } else {
                                      updateApplicationStatus(app.id, val as any);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-7 w-32 text-xs cursor-pointer">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Provision Account button if candidate is Hired */}
                              {app.status === 'Hired' && (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleProvisionCandidateShortcut(app)}
                                  className="h-7 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Provision Account</span>
                                </Button>
                              )}

                              {/* Agreement Status Indicator */}
                              {app.agreementTermsAccepted || app.agreementStatus === 'signed' ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  <span>Agreement Signed ({app.agreementSignature})</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`/agreement?ref=${app.referenceCode}`, '_blank')}
                                    className="h-5 px-1 text-[10px] text-emerald-600 hover:text-emerald-700 underline"
                                  >
                                    View
                                  </Button>
                                </div>
                              ) : app.agreementStatus === 'rejected' || app.agreementRejectedAt ? (
                                <div
                                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-600 dark:text-rose-400 font-medium"
                                  title={app.agreementRejectionReason}
                                >
                                  <XCircle className="w-3 h-3 text-rose-500" />
                                  <span>Offer Declined{app.agreementRejectionReason ? `: ${app.agreementRejectionReason.slice(0, 20)}...` : ''}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`/agreement?ref=${app.referenceCode}`, '_blank')}
                                    className="h-5 px-1 text-[10px] text-rose-600 hover:text-rose-700 underline"
                                  >
                                    View
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/agreement?ref=${app.referenceCode}`, '_blank')}
                                  className="h-7 px-2 text-[11px] gap-1 border-primary/20 text-primary hover:bg-primary/5"
                                  title="Open Agreement Digital Sign Page"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Sign Link</span>
                                </Button>
                              )}

                              {/* Email Status Indicator */}
                              {app.lastEmailSentAt && (
                                <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                  <Mail className="w-3 h-3" />
                                  <span>
                                    Email Sent: {app.lastEmailType} ({new Date(app.lastEmailSentAt).toLocaleDateString()})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Row 2: Experience / Pitch */}
                          {app.experienceSummary && (
                            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs text-foreground/90 leading-relaxed">
                              <span className="font-semibold text-foreground block mb-1">
                                Candidate Experience & Cover Note:
                              </span>
                              {app.experienceSummary}
                            </div>
                          )}

                          {/* Row 3: Resume Document & Links */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                            <div className="flex items-center gap-2">
                              {app.resumeFileData ? (
                                <a
                                  href={app.resumeFileData}
                                  download={app.resumeFileName || `${app.fullName}-Resume.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 text-xs text-primary font-bold border-primary/30 hover:bg-primary/10 cursor-pointer shadow-xs"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    Download Resume ({app.resumeFileName || 'Resume.pdf'})
                                  </Button>
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5" /> No resume file attached
                                </span>
                              )}

                              {app.portfolioUrl && (
                                <a
                                  href={
                                    app.portfolioUrl.startsWith('http')
                                      ? app.portfolioUrl
                                      : `https://${app.portfolioUrl}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-foreground hover:text-primary underline-offset-4 hover:underline font-medium px-2 py-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> Portfolio / GitHub
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {app.expectedCompensation && (
                                <div className="text-xs text-muted-foreground">
                                  Expected Terms: <span className="font-semibold text-foreground">{app.expectedCompensation}</span>
                                </div>
                              )}
                              {isAdmin && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-destructive hover:bg-destructive/10 gap-1 px-2 cursor-pointer"
                                  onClick={() => setAppToDelete(app)}
                                  title="Delete candidate application"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                  <span>Delete</span>
                                </Button>
                              )}
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* MODAL 1: Provision Account */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Provision New User Account
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provision an internal login for an Engineer, Telecaller, or Administrator.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionUser} className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Full Name *</label>
              <Input
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">User ID (Login Identifier) *</label>
              <Input
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="e.g. rahul.sharma or dev_rahul"
                className="text-xs font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Role *</label>
                <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer" className="text-xs">Developer</SelectItem>
                    <SelectItem value="telecaller" className="text-xs">Telecaller</SelectItem>
                    <SelectItem value="admin" className="text-xs">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Department</label>
                <Input
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Engineering"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Phone Number</label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Temporary Password *</label>
              <Input
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                placeholder="Initial password for first login"
                className="text-xs font-mono"
                required
              />
              <span className="text-[10px] text-muted-foreground">
                User will be forced to change password upon their first sign-in.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isProvisioning}>
                {isProvisioning ? 'Provisioning...' : 'Provision Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Reset Password (No view password!) */}
      <Dialog open={Boolean(selectedUserForReset)} onOpenChange={(open) => !open && setSelectedUserForReset(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              Reset Password: {selectedUserForReset?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign a new temporary password for this user. Existing passwords cannot be viewed for security compliance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReset} className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">New Temporary Password</label>
              <Input
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className="text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedUserForReset(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isResetting} className="bg-amber-600 hover:bg-amber-700">
                {isResetting ? 'Resetting...' : 'Confirm Password Reset'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Confirm Delete Candidate Application */}

      <Dialog open={Boolean(appToDelete)} onOpenChange={(open) => !open && setAppToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Candidate Application
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete the job application for{' '}
              <strong className="text-foreground">{appToDelete?.fullName}</strong> ({appToDelete?.referenceCode})?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeletingApp}
              onClick={() => setAppToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeletingApp}
              onClick={async () => {
                if (!appToDelete) return;
                setIsDeletingApp(true);
                await deleteJobApplication(appToDelete.id);
                setIsDeletingApp(false);
                setAppToDelete(null);
              }}
            >
              {isDeletingApp ? 'Deleting...' : 'Delete Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Confirm Delete User Account */}
      <Dialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete User Account
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete the workforce account for{' '}
              <strong className="text-foreground">{userToDelete?.name}</strong> (ID: {userToDelete?.userId})?
              All access for this account will be revoked immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeletingUser}
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeletingUser}
              onClick={async () => {
                if (!userToDelete) return;
                setIsDeletingUser(true);
                const res = await deleteUser(userToDelete.id);
                setIsDeletingUser(false);
                if (res.success) {
                  setUserToDelete(null);
                }
              }}
            >
              {isDeletingUser ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: Candidate Status & Email Notification */}
      <CandidateEmailModal
        open={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        application={selectedAppForEmail}
        targetStatus={targetStatusForEmail}
        onStatusUpdated={async (appId, status, emailMeta) => {
          await updateApplicationStatus(appId, status, undefined, emailMeta);
        }}
        onProvisionCandidate={handleProvisionCandidateShortcut}
        onCreateUser={createUser}
      />
    </div>

  );
};

export default TeamPage;
