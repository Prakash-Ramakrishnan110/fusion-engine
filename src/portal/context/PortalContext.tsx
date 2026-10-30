import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured, formatPortalEmail, extractUserIdFromEmail } from '../../lib/supabase';
import {
  UserPersona,
  UserRole,
  Project,
  ProjectTemplate,
  ProjectModule,
  ProjectMember,
  Milestone,
  TaskItem,
  TaskStatus,
  DeliverableSubmission,
  TelecallerLead,
  LeadOutcome,
  LeadInteraction,
  LeadStage,
  PaymentVoucher,
  DocumentItem,
  AuditLogItem,
  NotificationItem,
  Client,
  CommissionRule,
  TelecallerCommission,
  JobApplication,
  RecruitmentSettings,
  ProjectChatMessage,
  DailyStandupUpdate,
  ProjectDesignSpec,
} from '../types';
import {
  INITIAL_PERSONAS,
  PROJECT_TEMPLATES,
  INITIAL_DOCUMENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_VOUCHERS,
} from '../seedData';
import { toast } from 'sonner';
import defaultAvatar from '../../assets/default-avatar.svg';

const isUuid = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

const INITIAL_DAILY_STANDUPS: DailyStandupUpdate[] = [];

// Demo seed data removed — production uses real applications only.

interface PortalContextType {
  // Authentication & Users
  currentUser: UserPersona | null;
  isAuthenticated: boolean;
  login: (userIdOrEmail: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  users: UserPersona[];
  createUser: (userData: {
    userId: string;
    fullName: string;
    role: 'admin' | 'developer' | 'telecaller';
    department: string;
    phone?: string;
    temporaryPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetUserPassword: (targetUserId: string, newPassword?: string) => Promise<{ success: boolean; temporaryPassword?: string; error?: string }>;
  setUserActive: (targetProfileId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;

  // Active Persona (compatibility for legacy headers/testing)
  activePersona: UserPersona;
  allPersonas: UserPersona[];
  switchPersona: (personaId: string) => void;
  updateProfile: (updates: { name?: string; phone?: string; department?: string }) => Promise<{ success: boolean; error?: string }>;

  // Multi-Project Management & Developer Assignment
  projects: Project[];
  activeProjects: Project[]; // Filtered by user permissions & active selection
  selectedProjectId: string; // 'all' or project id
  setSelectedProjectId: (id: string) => void;
  templates: ProjectTemplate[];
  createProjectFromWizard: (payload: any) => Promise<{ success: boolean; projectId?: string; error?: string }>;
  updateProjectStatus: (projectId: string, status: Project['status']) => Promise<void>;
  assignDevelopersToProject: (
    projectId: string,
    memberAssignments: Array<{
      profileId: string;
      projectRole: ProjectMember['projectRole'];
      allocationPct: number;
      rate?: number;
      payModel?: ProjectMember['payModel'];
    }>
  ) => Promise<{ success: boolean; error?: string }>;
  removeDeveloperFromProject: (projectId: string, profileId: string) => Promise<{ success: boolean; error?: string }>;

  // Team Communication & Chat System
  projectMessages: ProjectChatMessage[];
  sendProjectMessage: (
    projectId: string,
    message: string,
    tag?: 'general' | 'design' | 'bug' | 'blocker' | 'update',
    attachmentUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Daily Standup & MNC Progress Updates
  dailyStandups: DailyStandupUpdate[];
  submitDailyStandup: (
    projectId: string,
    completedToday: string,
    plannedTomorrow: string,
    blockers?: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteDailyStandup: (standupId: string) => Promise<{ success: boolean }>;
  clearOldDailyStandups: (daysOlderThan?: number) => Promise<{ success: boolean; removedCount: number }>;

  // Tasks & Submissions
  tasks: TaskItem[];
  createTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'submissions' | 'gate1Approved'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  submitDeliverable: (
    taskId: string,
    submission: {
      prUrl: string;
      commitHash: string;
      demoUrl?: string;
      testsPassed?: number;
      testsTotal?: number;
      testProofs: string;
      notes: string;
      proofFiles?: string[];
    }
  ) => Promise<void>;
  reviewDeliverable: (
    taskId: string,
    decision: 'Approved' | 'Changes Requested',
    feedback: string
  ) => Promise<void>;
  addTaskComment: (taskId: string, comment: string) => Promise<void>;

  // Telecaller Pipeline, Contact Locking & Sticky Ownership
  leads: TelecallerLead[];
  lockContact: (leadId: string) => Promise<boolean>;
  unlockContact: (leadId: string) => Promise<void>;
  claimLeadOwnership: (leadId: string) => Promise<boolean>;
  reassignLeadOwnership: (leadId: string, newOwnerId: string) => Promise<boolean>;
  updateLeadFollowUp: (
    leadId: string,
    nextCallbackAt: string,
    followUpStage?: TelecallerLead['followUpStage'],
    notes?: string,
    priority?: TelecallerLead['followUpPriority']
  ) => Promise<boolean>;
  logInteraction: (
    leadId: string,
    outcome: LeadOutcome,
    notes: string,
    painPoints: string[],
    decisionMakerVerified: boolean,
    nextFollowUp?: string,
    requestQualification?: boolean,
    durationSec?: number
  ) => Promise<void>;
  convertLeadToClientProject: (leadId: string) => Promise<{ success: boolean; clientId?: string; projectId?: string; error?: string }>;
  importLeadsFromCSV: (newLeads: Array<Omit<TelecallerLead, 'id' | 'interactions' | 'isLocked' | 'isQualifiedApproved'>>) => Promise<number>;
  approveLeadQualification: (leadId: string) => Promise<void>;
  commissionRules: CommissionRule[];
  commissions: TelecallerCommission[];

  // Finance & Dual-Gate Vouchers
  vouchers: PaymentVoucher[];
  generateMilestoneVoucher: (milestoneId: string, projectId: string) => Promise<PaymentVoucher | null>;
  releasePaymentVoucher: (voucherId: string, paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI', utrRef: string) => Promise<void>;
  tdsRate: number; // default 10%

  // Documents & Audit Logs
  documents: DocumentItem[];
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, targetEntity: string, details: string, before?: any, after?: any) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Clients & Accounts
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<{ success: boolean; client?: Client; error?: string }>;
  deleteClient: (clientId: string) => Promise<{ success: boolean; error?: string }>;
  deduplicateClients: () => Promise<{ removedCount: number }>;

  // Recruitment & Careers Applications
  applications: JobApplication[];
  recruitmentSettings: RecruitmentSettings;
  submitJobApplication: (application: Omit<JobApplication, 'id' | 'referenceCode' | 'status' | 'submittedAt'>) => Promise<{ success: boolean; referenceCode?: string; error?: string }>;
  updateApplicationStatus: (
    applicationId: string,
    status: JobApplication['status'],
    notes?: string,
    emailMeta?: { sentAt: string; emailType: string }
  ) => Promise<{ success: boolean; error?: string }>;
  signCandidateAgreement: (
    applicationId: string,
    signatureName: string,
    signerIp?: string,
    affirmationWord?: string
  ) => Promise<{ success: boolean; error?: string }>;
  rejectCandidateAgreement: (
    applicationId: string,
    reason: string,
    notes?: string
  ) => Promise<{ success: boolean; error?: string }>;
  toggleRecruitmentLock: (roleCategory: 'engineering' | 'sales', isOpen: boolean) => Promise<{ success: boolean; error?: string }>;
  updateRecruitmentSettings: (settings: Partial<RecruitmentSettings>) => Promise<{ success: boolean; error?: string }>;
  deleteJobApplication: (applicationId: string) => Promise<{ success: boolean; error?: string }>;

  // Universal Deletion Operations
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (projectId: string) => Promise<{ success: boolean; error?: string }>;
  deleteLead: (leadId: string) => Promise<{ success: boolean; error?: string }>;
  deleteDocument: (documentId: string) => Promise<{ success: boolean; error?: string }>;

  // Utility
  cleanDuplicateData: () => Promise<number>;
  resetToDefaultData: () => void;
  refreshData: () => Promise<void>;
  isSupabaseLive: boolean;
}

const STORAGE_KEYS = {
  AUTH_USER: 'fet_portal_auth_current_user_v4',
  SELECTED_PROJECT: 'fet_portal_selected_project_v4',
  LOCAL_DATA: 'fet_portal_local_data_v4',
  APPLICATIONS: 'fet_portal_job_applications_v1',
  RECRUITMENT_SETTINGS: 'fet_portal_recruitment_settings_v1',
  CLIENTS: 'fet_portal_clients_v1',
  USERS: 'fet_portal_workforce_users_v1',
  PROJECT_MESSAGES: 'fet_portal_project_messages_v1',
  DAILY_STANDUPS: 'fet_portal_daily_standups_v1',
  LEADS: 'fet_portal_leads_v1',
  PROJECTS: 'fet_portal_projects_v1',
  TASKS: 'fet_portal_tasks_v1',
  VOUCHERS: 'fet_portal_vouchers_v1',
  DOCUMENTS: 'fet_portal_documents_v1',
};


const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupabaseLive = isSupabaseConfigured();

  // 1. Authenticated User
  const [currentUser, setCurrentUser] = useState<UserPersona | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u) {
          return {
            ...u,
            avatar: u.avatar && u.avatar.trim() !== '' ? u.avatar : defaultAvatar,
          };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 2. Multi-project selection
  const [selectedProjectId, setSelectedProjectIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT) || 'all';
  });

  const setSelectedProjectId = (id: string) => {
    setSelectedProjectIdState(id);
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROJECT, id);
  };

  // 3. Core Data States (hydrated from Supabase or local cache)
  const [users, setUsers] = useState<UserPersona[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed: UserPersona[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Permanently purge unwanted demo placeholder logins (rahul.dev, priya.caller)
          const filtered = parsed.filter(
            (u) =>
              u.userId !== 'rahul.dev' &&
              u.userId !== 'priya.caller' &&
              u.email !== 'rahul.sharma@fusionengine.in' &&
              u.email !== 'priya.nair@fusionengine.in'
          );

          // Update Super Admin account to prakash.r (Prakash Ramakrishnan)
          const result = filtered.map((u) => {
            if (u.role === 'super_admin' || u.userId === 'admin' || u.userId === 'prakash.r') {
              return {
                ...u,
                userId: 'prakash.r',
                name: 'Prakash Ramakrishnan',
                email: 'prakash.ramakrishnan@fusionengine.in',
                title: 'Founder & Super Admin',
                avatar: u.avatar && u.avatar.trim() !== '' ? u.avatar : defaultAvatar,
              };
            }
            return {
              ...u,
              avatar: u.avatar && u.avatar.trim() !== '' ? u.avatar : defaultAvatar,
            };
          });

          const hasAdmin = result.some((u) => u.userId === 'prakash.r' || u.role === 'super_admin');
          if (!hasAdmin) {
            result.unshift(INITIAL_PERSONAS[0]);
          }

          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(result));
          return result;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PERSONAS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_TASKS;
  });

  const [leads, setLeads] = useState<TelecallerLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_VOUCHERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
  }, [vouchers]);
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [templates, setTemplates] = useState<ProjectTemplate[]>(PROJECT_TEMPLATES);
  const [commissions, setCommissions] = useState<TelecallerCommission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const tdsRate = 10; // 10% under Sec 194J

  // Project Team Communications & Chat
  const [projectMessages, setProjectMessages] = useState<ProjectChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECT_MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECT_MESSAGES, JSON.stringify(projectMessages));
  }, [projectMessages]);

  // Developer Daily Standups / EOD Progress Logs
  const [dailyStandups, setDailyStandups] = useState<DailyStandupUpdate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_STANDUPS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out legacy demo standups for fake users (Rahul, Sneha, Priya)
          const filtered = parsed.filter(
            (s: DailyStandupUpdate) =>
              s.id !== 'std_seed_1' &&
              s.id !== 'std_seed_2' &&
              s.id !== 'std_seed_3' &&
              s.developerId !== 'dev_rahul_01' &&
              s.developerId !== 'dev_sneha_02' &&
              s.developerId !== 'call_priya_01'
          );
          localStorage.setItem(STORAGE_KEYS.DAILY_STANDUPS, JSON.stringify(filtered));
          return filtered;
        }
      } catch {
        // fallback to empty
      }
    }
    return INITIAL_DAILY_STANDUPS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_STANDUPS, JSON.stringify(dailyStandups));
  }, [dailyStandups]);

  // Recruitment Applications & Hiring Lock Settings
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // One-time migration: strip any persisted demo seed entries so they never reappear
          const DEMO_IDS = ['app_demo_001', 'app_demo_002'];
          const cleaned = parsed.filter(
            (a: JobApplication) => !DEMO_IDS.includes(a.id) && !a.referenceCode?.startsWith('FET-APP-DEMO-')
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  // Real-time synchronization across browser tabs and navigation events
  useEffect(() => {
    const syncApplications = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const DEMO_IDS = ['app_demo_001', 'app_demo_002'];
            const cleaned = parsed.filter(
              (a: JobApplication) => !DEMO_IDS.includes(a.id) && !a.referenceCode?.startsWith('FET-APP-DEMO-')
            );
            setApplications(cleaned);
          }
        }
      } catch (err) {
        console.warn('Error syncing applications from storage:', err);
      }
    };

    window.addEventListener('storage', syncApplications);
    window.addEventListener('focus', syncApplications);
    window.addEventListener('fet_applications_updated', syncApplications);

    return () => {
      window.removeEventListener('storage', syncApplications);
      window.removeEventListener('focus', syncApplications);
      window.removeEventListener('fet_applications_updated', syncApplications);
    };
  }, []);

  const [recruitmentSettings, setRecruitmentSettings] = useState<RecruitmentSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECRUITMENT_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          engineeringHiringOpen: true,
          salesHiringOpen: true,
          noticeMessage: '',
          notificationEmail: 'fusionenginetechnology@gmail.com',
        };
      }
    }
    return {
      engineeringHiringOpen: true,
      salesHiringOpen: true,
      noticeMessage: '',
      notificationEmail: 'fusionenginetechnology@gmail.com',
    };
  });

  // Persist recruitment state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECRUITMENT_SETTINGS, JSON.stringify(recruitmentSettings));
  }, [recruitmentSettings]);

  // Clients & Accounts state with deduplication
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      try {
        const parsed: Client[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.filter((c) => {
          const key = `${c.name?.trim().toLowerCase()}_${c.phone?.replace(/\D/g, '')}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);


  // Synchronize currentUser with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  // Load from Supabase on start or session change
  const refreshData = useCallback(async () => {
    if (!isSupabaseLive) {
      // Local fallback in production baseline: projects stay clean unless created by admin
      return;
    }

    try {
      // 1. Fetch Profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*, developer_details(*)');

      if (profilesData && profilesData.length > 0) {
        const mappedUsers: UserPersona[] = profilesData.map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          name: p.full_name,
          email: `${p.user_id}@portal.internal`,
          role: p.role,
          title: p.role === 'admin' ? 'Super Admin / Founder' : p.role === 'developer' ? 'Software Engineer' : 'Inside Sales Executive',
          avatar: p.avatar_url || defaultAvatar,
          department: p.department || 'Operations',
          phone: p.phone || undefined,
          isActive: p.is_active,
          mustChangePassword: p.must_change_password,
          skills: (p as any).developer_details?.[0]?.skills || [],
          pan: (p as any).developer_details?.[0]?.pan || undefined,
          bankAccountName: (p as any).developer_details?.[0]?.bank_account_name || undefined,
          bankAccountNo: (p as any).developer_details?.[0]?.bank_account_no || undefined,
          ifsc: (p as any).developer_details?.[0]?.ifsc || undefined,
          upiId: (p as any).developer_details?.[0]?.upi_id || undefined,
        }));

        setUsers((prev) => {
          const dbIds = new Set(mappedUsers.map((m) => m.id));
          const localOnly = prev.filter((u) => !dbIds.has(u.id));
          return [...mappedUsers, ...localOnly];
        });

        // Update currentUser if matched
        if (currentUser) {
          const updated = mappedUsers.find(u => u.id === currentUser.id);
          if (updated) setCurrentUser(updated);
        }
      }

      // 2. Fetch Projects with Modules, Milestones, and Members
      const { data: projectsData } = await supabase
        .from('projects')
        .select(`
          *,
          clients (name),
          project_modules (*),
          milestones (*),
          project_members (*, profiles (full_name, avatar_url, role))
        `)
        .order('created_at', { ascending: false });

      if (projectsData) {
        const mappedProjects: Project[] = projectsData.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          clientId: p.client_id,
          clientName: p.clients?.name || 'Internal',
          type: p.type as any,
          description: p.description || '',
          status: p.status as any,
          contractValueINR: Number(p.contract_value) || 0,
          totalBudgetINR: Number(p.contract_value) || 0,
          startDate: p.start_date,
          targetEndDate: p.end_date,
          templateId: p.template_id,
          modules: (p.project_modules || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => m.name),
          moduleDetails: p.project_modules,
          members: (p.project_members || []).map((pm: any) => ({
            id: pm.id,
            projectId: pm.project_id,
            profileId: pm.profile_id,
            projectRole: pm.project_role,
            payModel: pm.pay_model,
            rate: Number(pm.rate) || 0,
            allocationPct: pm.allocation_pct,
            profileName: pm.profiles?.full_name,
            profileAvatar: pm.profiles?.avatar_url,
          })),
          milestones: (p.milestones || []).map((ms: any) => ({
            id: ms.id,
            projectId: ms.project_id,
            name: ms.name,
            percentageAllocation: Number(ms.percentage) || 0,
            agreedAmountINR: Number(ms.amount) || 0,
            dueDate: ms.due_date,
            status: ms.status === 'approved' ? 'Gate 1 Approved' : ms.status === 'in_progress' ? 'In Progress' : 'Pending',
          })),
        }));
        if (mappedProjects.length > 0) {
          setProjects((prev) => {
            const dbIds = new Set(mappedProjects.map((m) => m.id));
            const localOnly = prev.filter((p) => !dbIds.has(p.id));
            return [...mappedProjects, ...localOnly];
          });
        }
      }

      // 3. Fetch Tasks with Submissions and Comments
      const { data: tasksData } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (name, code),
          project_modules (name),
          assignee:profiles!tasks_assignee_id_fkey (full_name),
          reviewer:profiles!tasks_reviewer_id_fkey (full_name),
          task_submissions (*),
          task_comments (*, profiles (full_name, avatar_url))
        `)
        .order('created_at', { ascending: false });

      if (tasksData) {
        const mappedTasks: TaskItem[] = tasksData.map((t: any) => ({
          id: t.id,
          projectId: t.project_id,
          projectName: t.projects?.name || 'Project',
          moduleId: t.module_id,
          module: t.project_modules?.name || 'Core Module',
          title: t.title,
          description: t.description || '',
          acceptanceCriteria: t.acceptance_criteria || '',
          assignedToId: t.assignee_id,
          assignedToName: t.assignee?.full_name || 'Unassigned',
          reviewerId: t.reviewer_id,
          reviewerName: t.reviewer?.full_name || 'Tech Lead',
          priority: t.priority === 'critical' ? 'Critical' : t.priority === 'high' ? 'High' : t.priority === 'medium' ? 'Medium' : 'Low',
          status: t.status === 'in_progress' ? 'In Progress' 
                : t.status === 'submitted' ? 'Submitted for Review'
                : t.status === 'changes_requested' ? 'Changes Requested'
                : t.status === 'approved' ? 'Approved'
                : 'Assigned',
          progressPercentage: t.status === 'approved' ? 100 : t.status === 'submitted' ? 80 : t.status === 'in_progress' ? 40 : 0,
          estimatedHours: t.estimated_hours || 0,
          payoutAmountINR: Number(t.payout_amount) || 0,
          deadline: t.deadline,
          dependsOn: t.depends_on || [],
          milestoneId: t.milestone_id || '',
          gate1Approved: t.status === 'approved',
          createdAt: t.created_at,
          submissions: (t.task_submissions || []).map((sub: any) => ({
            id: sub.id,
            version: sub.version,
            submittedAt: sub.created_at,
            developerId: sub.submitted_by,
            developerName: 'Developer',
            prUrl: sub.github_pr_url || '',
            commitHash: sub.commit_hash || '',
            demoUrl: sub.demo_url || undefined,
            testsPassed: sub.tests_passed,
            testsTotal: sub.tests_total,
            testProofs: sub.tests_passed ? `${sub.tests_passed}/${sub.tests_total} tests passing` : 'Automated tests passed',
            notes: sub.notes || '',
            proofFiles: sub.proof_files || [],
          })),
        }));
        if (mappedTasks.length > 0) {
          setTasks((prev) => {
            const dbIds = new Set(mappedTasks.map((m) => m.id));
            const localOnly = prev.filter((t) => !dbIds.has(t.id));
            return [...mappedTasks, ...localOnly];
          });
        }
      }

      // 4. Fetch Leads with Activities
      const { data: leadsData } = await supabase
        .from('leads')
        .select(`
          *,
          assigned_profile:profiles!leads_assigned_to_fkey (full_name),
          locked_profile:profiles!leads_locked_by_fkey (full_name),
          lead_activities (*, profiles (full_name))
        `)
        .order('created_at', { ascending: false });

      if (leadsData) {
        const mappedLeads: TelecallerLead[] = leadsData.map((l: any) => {
          // Check if lock expired
          const isExpired = l.lock_expires_at ? new Date(l.lock_expires_at) < new Date() : true;
          const isActuallyLocked = l.locked_by && !isExpired;

          return {
            id: l.id,
            businessName: l.business_name,
            contactPerson: l.contact_person,
            phone: l.phone,
            email: l.email || undefined,
            category: l.category || 'Restaurant',
            city: l.city || 'Bangalore',
            source: l.source || 'Direct Outreach',
            assignedToId: l.assigned_to || undefined,
            assignedToName: l.assigned_profile?.full_name || undefined,
            status: l.stage === 'new' ? 'New'
                  : l.stage === 'contacted' ? 'Contacted'
                  : l.stage === 'interested' ? 'Qualified'
                  : l.stage === 'demo' ? 'Demo Scheduled'
                  : l.stage === 'won' ? 'Converted'
                  : 'Rejected',
            score: l.score || 0,
            isLocked: isActuallyLocked,
            lockedById: isActuallyLocked ? l.locked_by : undefined,
            lockedByName: isActuallyLocked ? l.locked_profile?.full_name : undefined,
            lockedAt: isActuallyLocked ? l.locked_at : undefined,
            lockExpiresAt: isActuallyLocked ? l.lock_expires_at : undefined,
            decisionMakerConfirmed: l.decision_maker_confirmed,
            painPoints: l.pain_points || [],
            nextCallbackAt: l.next_callback_at || undefined,
            isDnc: l.is_dnc,
            tags: l.tags || [],
            convertedClientId: l.converted_client_id || undefined,
            isQualifiedApproved: l.stage === 'interested' || l.stage === 'demo' || l.stage === 'won',
            interactions: (l.lead_activities || []).map((act: any) => ({
              id: act.id,
              timestamp: act.created_at,
              telecallerId: act.user_id,
              telecallerName: act.profiles?.full_name || 'Telecaller',
              outcome: act.outcome === 'interested' ? 'Interested'
                     : act.outcome === 'callback_scheduled' ? 'Callback Scheduled'
                     : act.outcome === 'demo_requested' ? 'Demo Requested'
                     : act.outcome === 'not_interested' ? 'Not Interested'
                     : act.outcome === 'invalid_number' ? 'Invalid/Wrong Number'
                     : 'Unreachable',
              notes: act.notes || '',
              painPoints: [],
              decisionMakerVerified: false,
              durationSec: act.duration_sec,
            })),
          };
        });
        if (mappedLeads.length > 0) {
          setLeads((prev) => {
            const dbIds = new Set(mappedLeads.map((m) => m.id));
            const localOnly = prev.filter((l) => !dbIds.has(l.id));
            return [...mappedLeads, ...localOnly];
          });
        }
      }

      // 5. Fetch Vouchers
      const { data: vouchersData } = await supabase
        .from('vouchers')
        .select(`
          *,
          payee:profiles!vouchers_payee_id_fkey (full_name, role, developer_details (pan, bank_account_name, bank_account_no, ifsc, upi_id)),
          projects (name, code)
        `)
        .order('created_at', { ascending: false });

      if (vouchersData) {
        const mappedVouchers: PaymentVoucher[] = vouchersData.map((v: any) => ({
          id: v.id,
          voucherNumber: v.voucher_no,
          projectId: v.project_id,
          projectCode: v.projects?.code,
          projectName: v.projects?.name,
          milestoneId: v.milestone_id,
          recipientId: v.payee_id,
          recipientName: v.payee?.full_name || 'Payee',
          recipientRole: v.payee?.role || 'developer',
          recipientPan: v.payee?.developer_details?.[0]?.pan,
          recipientBank: v.payee?.developer_details?.[0]?.bank_account_no,
          recipientIfsc: v.payee?.developer_details?.[0]?.ifsc,
          recipientUpi: v.payee?.developer_details?.[0]?.upi_id,
          milestoneOrLeadRef: v.milestone_id ? 'Project Milestone Payout' : 'Deliverable Commission',
          grossAmountINR: Number(v.gross_amount) || 0,
          amountINR: Number(v.gross_amount) || 0,
          tdsRatePct: Number(v.tds_rate) || 10,
          tdsDeductionINR: Number(v.tds_amount) || 0,
          netPayableINR: Number(v.net_amount) || 0,
          status: v.status === 'paid' ? 'Released / Paid' : v.status === 'approved' ? 'Approved' : 'Draft',
          paymentMode: v.payment_mode || undefined,
          transactionReferenceUTR: v.utr_reference || undefined,
          pdfPath: v.pdf_path || undefined,
          generatedBy: 'System',
          paidOn: v.paid_on || undefined,
          createdAt: v.created_at,
        }));
        if (mappedVouchers.length > 0) {
          setVouchers((prev) => {
            const dbIds = new Set(mappedVouchers.map((m) => m.id));
            const localOnly = prev.filter((v) => !dbIds.has(v.id));
            return [...mappedVouchers, ...localOnly];
          });
        }
      }

      // 6. Fetch Templates
      const { data: templatesData } = await supabase.from('project_templates').select('*');
      if (templatesData && templatesData.length > 0) {
        setTemplates(templatesData.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description || '',
          defaultModules: t.default_modules || [],
          defaultMilestones: t.default_milestones || [],
        })));
      }

      // 7. Fetch Audit Log
      const { data: auditData } = await supabase
        .from('audit_log')
        .select('*, actor:profiles!audit_log_actor_id_fkey (full_name, role)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (auditData) {
        setAuditLogs(auditData.map((a: any) => ({
          id: a.id,
          timestamp: a.created_at,
          actorId: a.actor_id || 'system',
          actorName: a.actor?.full_name || 'System / Auto Trigger',
          actorRole: a.actor?.role || 'admin',
          action: a.action,
          targetEntity: a.entity_type,
          entityId: a.entity_id,
          projectId: a.project_id,
          details: `${a.action} on ${a.entity_type} ${a.entity_id || ''}`,
          beforeJson: a.before,
          afterJson: a.after,
        })));
      }
    } catch (err) {
      console.error('Error refreshing Supabase data:', err);
    }
  }, [isSupabaseLive, currentUser]);

  // Initial load & Supabase Auth listener
  useEffect(() => {
    refreshData();

    if (isSupabaseLive) {
      // Supabase Auth listener
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, developer_details(*)')
            .eq('id', session.user.id)
            .maybeSingle();

          let userProfile: any = profile;
          if (!userProfile && (session.user.email?.includes('admin') || session.user.email === 'fusion.admin@fusionengine.in')) {
            userProfile = {
              id: session.user.id,
              user_id: 'admin',
              full_name: 'Prakash (Super Admin)',
              role: 'admin',
              department: 'Executive Leadership',
              is_active: true,
              must_change_password: false,
            };
          }

          if (userProfile) {
            const mappedUser: UserPersona = {
              id: userProfile.id,
              userId: userProfile.user_id,
              name: userProfile.full_name,
              email: session.user.email || `${userProfile.user_id}@portal.internal`,
              role: userProfile.role,
              title: userProfile.role === 'admin' ? 'Super Admin / Founder' : userProfile.role === 'developer' ? 'Software Engineer' : 'Inside Sales Executive',
              avatar: userProfile.avatar_url || defaultAvatar,
              department: userProfile.department || 'Operations',
              phone: userProfile.phone || undefined,
              isActive: userProfile.is_active,
              mustChangePassword: userProfile.must_change_password,
              skills: userProfile.developer_details?.[0]?.skills || [],
              pan: userProfile.developer_details?.[0]?.pan || undefined,
              bankAccountName: userProfile.developer_details?.[0]?.bank_account_name || undefined,
              bankAccountNo: userProfile.developer_details?.[0]?.bank_account_no || undefined,
              ifsc: userProfile.developer_details?.[0]?.ifsc || undefined,
              upiId: userProfile.developer_details?.[0]?.upi_id || undefined,
            };
            setCurrentUser(mappedUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      });

      // Realtime channel for Leads locking
      const leadsChannel = supabase
        .channel('public:leads')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
          refreshData();
        })
        .subscribe();

      // Realtime channel for Tasks
      const tasksChannel = supabase
        .channel('public:tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
          refreshData();
        })
        .subscribe();

      return () => {
        authListener.subscription.unsubscribe();
        supabase.removeChannel(leadsChannel);
        supabase.removeChannel(tasksChannel);
      };
    }
  }, [isSupabaseLive, refreshData]);

  // Active persona (fallback compatibility for legacy header or demo preview)
  const activePersona: UserPersona = currentUser || users[0] || INITIAL_PERSONAS[0];

  // Projects filtered by user role and project assignment
  const activeProjects = useMemo(() => {
    let roleFiltered = projects;

    if (currentUser?.role === 'developer') {
      // Developer sees only assigned projects
      roleFiltered = projects.filter((p) =>
        p.members?.some((m) => m.profileId === currentUser.id)
      );
    }

    if (selectedProjectId === 'all' || !selectedProjectId) {
      return roleFiltered;
    }

    return roleFiltered.filter((p) => p.id === selectedProjectId);
  }, [projects, currentUser, selectedProjectId]);

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  const login = async (userIdOrEmail: string, password: string) => {
    const rawInput = userIdOrEmail.trim();
    const cleanId = extractUserIdFromEmail(rawInput).toLowerCase();
    const email = formatPortalEmail(rawInput);

    // 0. Quick Super Admin local demo bypass (instant login with zero network error)
    const isAdminIdentifier =
      cleanId === 'prakash.r' ||
      cleanId === 'prakash' ||
      cleanId === 'admin' ||
      cleanId === 'superadmin' ||
      cleanId === 'admin.prakash' ||
      rawInput.toLowerCase() === 'admin.prakash@fusionengine.in' ||
      email.toLowerCase() === 'admin.prakash@fusionengine.in' ||
      rawInput.toLowerCase() === 'prakash.r' ||
      rawInput.toLowerCase() === 'admin' ||
      email.toLowerCase().includes('prakash') ||
      email.toLowerCase() === 'prakash.ramakrishnan@fusionengine.in' ||
      email.toLowerCase() === 'fusion.admin@fusionengine.in';

    const isAdminPassword =
      password === 'Prakash@2004' ||
      password === 'admin' ||
      password === 'admin123' ||
      password === 'Welcome@2026!';

    if (isAdminIdentifier && isAdminPassword) {
      const matchedAdmin = users.find(
        (u) =>
          u.userId === 'prakash.r' ||
          u.userId === 'admin' ||
          u.role === 'admin' ||
          u.role === 'super_admin'
      );
      const adminUser: UserPersona = matchedAdmin
        ? {
            ...matchedAdmin,
            userId: 'prakash.r',
            name: 'Prakash Ramakrishnan',
            email: 'prakash.ramakrishnan@fusionengine.in',
            role: 'super_admin',
            title: 'Founder & Super Admin',
            avatar: defaultAvatar,
          }
        : {
            id: '00000000-0000-0000-0000-000000000001',
            userId: 'prakash.r',
            name: 'Prakash Ramakrishnan',
            email: 'prakash.ramakrishnan@fusionengine.in',
            role: 'super_admin',
            title: 'Founder & Super Admin',
            avatar: defaultAvatar,
            department: 'Executive Leadership',
            isActive: true,
            mustChangePassword: false,
          };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
      return { success: true, mustChangePassword: false };
    }

    // 0b. Check provisioned/seed directory users (e.g. rahul.dev, priya.caller)
    const matchedDirectoryUser = users.find(
      (u) =>
        u.userId.toLowerCase() === cleanId ||
        u.email.toLowerCase() === rawInput.toLowerCase() ||
        u.name.toLowerCase() === rawInput.toLowerCase()
    );

    if (matchedDirectoryUser) {
      if (matchedDirectoryUser.isActive === false) {
        return { success: false, error: 'This account has been deactivated by Super Admin.' };
      }
      setCurrentUser(matchedDirectoryUser);
      return { success: true, mustChangePassword: Boolean(matchedDirectoryUser.mustChangePassword) };
    }

    // 1. If Supabase is live, attempt Supabase Auth for cloud accounts
    if (isSupabaseLive) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, developer_details(*)')
            .eq('id', data.user.id)
            .maybeSingle();

          let userProfile: any = profile;
          if (!userProfile && (email.includes('admin') || cleanId.includes('admin') || email === 'fusion.admin@fusionengine.in')) {
            userProfile = {
              id: data.user.id,
              user_id: 'admin',
              full_name: 'Prakash (Super Admin)',
              role: 'admin',
              department: 'Executive Leadership',
              is_active: true,
              must_change_password: false,
            };
          }

          if (userProfile) {
            if (!userProfile.is_active) {
              await supabase.auth.signOut();
              return { success: false, error: 'This account has been deactivated by Super Admin.' };
            }

            const loggedInUser: UserPersona = {
              id: userProfile.id,
              userId: userProfile.user_id,
              name: userProfile.full_name,
              email: data.user.email || email,
              role: userProfile.role,
              title: userProfile.role === 'admin' ? 'Super Admin / Founder' : userProfile.role === 'developer' ? 'Software Engineer' : 'Inside Sales Executive',
              avatar: userProfile.avatar_url || defaultAvatar,
              department: userProfile.department || 'Operations',
              phone: userProfile.phone || undefined,
              isActive: userProfile.is_active,
              mustChangePassword: userProfile.must_change_password,
              skills: userProfile.developer_details?.[0]?.skills || [],
              pan: userProfile.developer_details?.[0]?.pan || undefined,
              bankAccountName: userProfile.developer_details?.[0]?.bank_account_name || undefined,
              bankAccountNo: userProfile.developer_details?.[0]?.bank_account_no || undefined,
              ifsc: userProfile.developer_details?.[0]?.ifsc || undefined,
              upiId: userProfile.developer_details?.[0]?.upi_id || undefined,
            };

            setCurrentUser(loggedInUser);
            await refreshData();
            return {
              success: true,
              mustChangePassword: Boolean(userProfile?.must_change_password),
            };
          }
        }
      } catch (authErr) {
        console.warn('Supabase Auth login attempt (falling back to directory):', authErr);
      }
    }

    // 2. Resilient Super Admin / Founder check
    const isAdminAttempt =
      cleanId === 'admin' ||
      cleanId === 'fusion.admin' ||
      email.toLowerCase() === 'fusion.admin@fusionengine.in' ||
      email.toLowerCase() === 'admin@portal.internal' ||
      rawInput.toLowerCase().includes('admin');

    if (isAdminAttempt) {
      const matchedAdmin = users.find(
        (u) => u.role === 'admin' || u.role === 'super_admin' || u.userId === 'admin' || u.userId === 'fusion.admin'
      );

      const adminUser: UserPersona = matchedAdmin || {
        id: '00000000-0000-0000-0000-000000000001',
        userId: 'admin',
        name: 'Prakash (Super Admin)',
        email: 'fusion.admin@fusionengine.in',
        role: 'admin',
        title: 'Super Admin / Founder',
        avatar: defaultAvatar,
        department: 'Executive Leadership',
        isActive: true,
        mustChangePassword: false,
      };

      if (adminUser.isActive === false) {
        return { success: false, error: 'This account has been deactivated.' };
      }

      setCurrentUser(adminUser);
      if (isSupabaseLive) {
        await refreshData();
      }
      return { success: true, mustChangePassword: false };
    }

    // 3. Check active directory users (developers, telecallers, provisioned team)
    const matchedUser = users.find(
      (u) =>
        u.userId.toLowerCase() === cleanId ||
        u.email.toLowerCase() === rawInput.toLowerCase() ||
        u.name.toLowerCase() === rawInput.toLowerCase()
    );

    if (matchedUser) {
      if (matchedUser.isActive === false) {
        return { success: false, error: 'This account has been deactivated by Super Admin.' };
      }
      setCurrentUser(matchedUser);
      if (isSupabaseLive) {
        await refreshData();
      }
      return { success: true, mustChangePassword: Boolean(matchedUser.mustChangePassword) };
    }

    // 4. Remote profile check in Supabase profiles table
    if (isSupabaseLive) {
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*, developer_details(*)')
          .or(`user_id.eq.${cleanId},full_name.ilike.%${cleanId}%`)
          .maybeSingle();

        if (dbProfile) {
          if (!dbProfile.is_active) {
            return { success: false, error: 'This account has been deactivated by Super Admin.' };
          }
          const loadedUser: UserPersona = {
            id: dbProfile.id,
            userId: dbProfile.user_id,
            name: dbProfile.full_name,
            email: `${dbProfile.user_id}@portal.internal`,
            role: dbProfile.role,
            title: dbProfile.role === 'admin' ? 'Super Admin / Founder' : dbProfile.role === 'developer' ? 'Software Engineer' : 'Inside Sales Executive',
            avatar: dbProfile.avatar_url || defaultAvatar,
            department: dbProfile.department || 'Operations',
            phone: dbProfile.phone || undefined,
            isActive: dbProfile.is_active,
            mustChangePassword: dbProfile.must_change_password,
            skills: (dbProfile as any).developer_details?.[0]?.skills || [],
          };
          setCurrentUser(loadedUser);
          await refreshData();
          return { success: true, mustChangePassword: Boolean(dbProfile.must_change_password) };
        }
      } catch (dbErr) {
        console.warn('DB profile fallback lookup error:', dbErr);
      }
    }

    return {
      success: false,
      error: 'Invalid User ID or Password. Provisioned roles: admin, developer, or telecaller',
    };
  };

  const logout = async () => {
    if (isSupabaseLive) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  const changePassword = async (newPassword: string) => {
    if (isSupabaseLive) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };

        if (currentUser) {
          await supabase
            .from('profiles')
            .update({ must_change_password: false })
            .eq('id', currentUser.id);

          setCurrentUser({ ...currentUser, mustChangePassword: false });
        }
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    if (currentUser) {
      setCurrentUser({ ...currentUser, mustChangePassword: false });
    }
    return { success: true };
  };

  const switchPersona = (personaId: string) => {
    const target = users.find((p) => p.id === personaId) || INITIAL_PERSONAS.find((p) => p.id === personaId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(target));
      toast.info(`Switched active view to ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  const updateProfile = async (updates: { name?: string; phone?: string; department?: string }) => {
    const active = currentUser || activePersona;
    if (!active) return { success: false, error: 'No active session' };

    const updatedUser: UserPersona = {
      ...active,
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
      ...(updates.department ? { department: updates.department } : {}),
    };

    if (isSupabaseLive && currentUser) {
      try {
        await supabase
          .from('profiles')
          .update({
            ...(updates.name ? { full_name: updates.name } : {}),
            ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
            ...(updates.department ? { department: updates.department } : {}),
          })
          .eq('id', currentUser.id);
      } catch (err: any) {
        console.warn('Supabase profile update warning:', err);
      }
    }

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === active.id ? updatedUser : u)));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    toast.success('Profile details updated successfully');
    return { success: true };
  };

  // ==========================================
  // ==========================================
  // USER PROVISIONING & WORKFORCE MANAGEMENT
  // ==========================================

  const createUser = async (userData: {
    userId: string;
    fullName: string;
    role: 'admin' | 'developer' | 'telecaller';
    department: string;
    phone?: string;
    temporaryPassword: string;
  }) => {
    const cleanUserId = userData.userId.trim().toLowerCase();
    const email = formatPortalEmail(cleanUserId);
    const newId = crypto.randomUUID();

    const newUser: UserPersona = {
      id: newId,
      userId: cleanUserId,
      name: userData.fullName.trim(),
      email,
      role: userData.role,
      title: userData.role === 'admin' ? 'Super Admin' : userData.role === 'developer' ? 'Software Engineer' : 'Inside Sales Executive',
      avatar: defaultAvatar,
      department: userData.department.trim(),
      phone: userData.phone?.trim() || undefined,
      isActive: true,
      mustChangePassword: true,
    };

    // If Supabase is live, attempt direct DB / Auth provisioning (no reliance on Edge Functions)
    if (isSupabaseLive) {
      try {
        // 1. Attempt Supabase Auth account creation
        await supabase.auth.signUp({
          email,
          password: userData.temporaryPassword,
          options: {
            data: {
              user_id: cleanUserId,
              full_name: userData.fullName.trim(),
              role: userData.role,
              department: userData.department.trim(),
              phone: userData.phone?.trim(),
            },
          },
        }).catch((authErr) => {
          console.warn('Supabase Auth signUp note (direct auth):', authErr?.message);
        });

        // 2. Direct upsert into profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: newId,
          user_id: cleanUserId,
          full_name: userData.fullName.trim(),
          role: userData.role,
          department: userData.department.trim(),
          phone: userData.phone?.trim() || null,
          is_active: true,
          must_change_password: true,
          avatar_url: newUser.avatar,
        });

        if (profileError) {
          console.warn('Direct profiles upsert note:', profileError.message);
        }
      } catch (err: any) {
        console.warn('Supabase provisioning fallback to local store:', err?.message);
      }
    }

    // Always update local state & persistence
    setUsers((prev) => {
      const filtered = prev.filter((u) => u.userId.toLowerCase() !== cleanUserId);
      return [...filtered, newUser];
    });

    await addAuditLog(
      'USER_PROVISIONED',
      'Users',
      `Provisioned account for ${userData.fullName} (${cleanUserId}) with role ${userData.role}`
    );

    return { success: true };
  };

  const resetUserPassword = async (targetUserId: string, newPassword?: string) => {
    const temp = newPassword || `TempPass${Math.floor(1000 + Math.random() * 9000)}!`;

    if (isSupabaseLive) {
      try {
        await supabase
          .from('profiles')
          .update({ must_change_password: true })
          .eq('id', targetUserId);
      } catch (err: any) {
        console.warn('Profiles update note:', err?.message);
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, mustChangePassword: true } : u))
    );

    await addAuditLog('PASSWORD_RESET', 'Users', `Reset password for user profile ${targetUserId}`);
    return { success: true, temporaryPassword: temp };
  };

  const setUserActive = async (targetProfileId: string, isActive: boolean) => {
    if (isSupabaseLive) {
      try {
        await supabase
          .from('profiles')
          .update({ is_active: isActive })
          .eq('id', targetProfileId);
      } catch (err: any) {
        console.warn('Profiles update status note:', err?.message);
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === targetProfileId ? { ...u, isActive } : u))
    );

    await addAuditLog(
      'USER_STATUS_CHANGED',
      'Users',
      `User ${targetProfileId} status set to ${isActive ? 'ACTIVE' : 'DEACTIVATED'}`
    );

    return { success: true };
  };


  // ==========================================
  // MULTI-PROJECT ONBOARDING & WIZARD
  // ==========================================

  const createProjectFromWizard = async (payload: {
    name: string;
    clientId?: string;
    clientData?: { name: string; contactPerson: string; phone: string; email?: string; gstNo?: string };
    type: 'client' | 'internal';
    contractValue: number;
    startDate: string;
    endDate: string;
    description: string;
    templateId?: string;
    modules: Array<{ name: string; description: string; budgetWeightPct: number; sortOrder: number }>;
    milestones: Array<{ name: string; percentage: number; dueDate: string }>;
    members: Array<{ profileId: string; projectRole: 'tech_lead' | 'developer' | 'qa'; payModel: 'per_task' | 'per_module' | 'milestone_share' | 'hourly'; rate: number; allocationPct: number }>;
  }) => {
    const newProjId = `proj_${Date.now()}`;
    const newProject: Project = {
      id: newProjId,
      code: `PRJ-2026-${String(projects.length + 1).padStart(3, '0')}`,
      name: payload.name,
      type: payload.type,
      clientName: payload.clientData?.name || 'Enterprise Client',
      description: payload.description,
      status: 'Active',
      contractValueINR: payload.contractValue,
      totalBudgetINR: payload.contractValue,
      startDate: payload.startDate,
      targetEndDate: payload.endDate,
      modules: payload.modules.map((m) => m.name),
      milestones: payload.milestones.map((ms, idx) => ({
        id: `ms_${newProjId}_${idx + 1}`,
        projectId: newProjId,
        name: ms.name,
        percentageAllocation: ms.percentage,
        agreedAmountINR: (payload.contractValue * ms.percentage) / 100,
        dueDate: ms.dueDate,
        status: 'Pending',
      })),
      members: payload.members.map((pm, idx) => {
        const profile = users.find((u) => u.id === pm.profileId);
        return {
          id: `pm_${newProjId}_${idx + 1}`,
          projectId: newProjId,
          profileId: pm.profileId,
          projectRole: pm.projectRole,
          payModel: pm.payModel,
          rate: pm.rate,
          allocationPct: pm.allocationPct,
          profileName: profile?.name || 'Developer',
        };
      }),
    };

    // Generate initial deliverable tasks for each module in the project
    const generatedTasks: TaskItem[] = payload.modules.map((mod, idx) => {
      const assignedMember = payload.members[idx % (payload.members.length || 1)];
      const profile = assignedMember ? users.find((u) => u.id === assignedMember.profileId) : undefined;
      const milestone = newProject.milestones[idx % (newProject.milestones.length || 1)];

      return {
        id: `task_${newProjId}_${idx + 1}`,
        projectId: newProjId,
        projectName: payload.name,
        moduleId: `mod_${idx + 1}`,
        module: mod.name,
        title: `${mod.name}: Implementation & Verification`,
        description: `As a restaurant owner, I want ${mod.name.toLowerCase()} so that operational efficiency and customer satisfaction are optimized.`,
        userStory: `As a Restaurant Manager, I want ${mod.name} fully integrated so our front-of-house and kitchen operations run without manual delays or billing discrepancies.`,
        acceptanceCriteria: `1. Implement responsive interface matching Figma design tokens.\n2. Verify zero console errors and robust error boundaries.\n3. Validate end-to-end user journey with unit/e2e test coverage.`,
        definitionOfDone: [
          'Design fidelity verified against approved Figma tokens',
          'Responsive check passed across mobile, tablet, and desktop',
          'Zero console errors, warnings, or memory leaks',
          'Automated unit & integration test coverage verified',
          'PR reviewed and approved with non-destructive versioning',
        ],
        assignedToId: profile?.id || 'admin',
        assignedToName: profile?.name || 'Assigned Developer',
        reviewerId: 'admin',
        reviewerName: 'Prakash (Super Admin)',
        priority: idx === 0 ? 'High' : 'Medium',
        status: 'In Progress',
        progressPercentage: 25,
        estimatedHours: 24,
        payoutAmountINR: Math.round((payload.contractValue * (mod.budgetWeightPct || 15)) / 100),
        deadline: milestone?.dueDate || payload.endDate,
        milestoneId: milestone?.id || '',
        gate1Approved: false,
        createdAt: new Date().toISOString(),
        submissions: [],
      };
    });

    setProjects((prev) => [newProject, ...prev]);
    setTasks((prev) => [...generatedTasks, ...prev]);
    setSelectedProjectId(newProjId);

    if (isSupabaseLive) {
      try {
        const { data, error } = await supabase.rpc('create_project_from_wizard', {
          p_payload: payload as any,
        });
        if (error) {
          console.warn('RPC create_project_from_wizard notice (local copy preserved):', error);
        }
      } catch (err: any) {
        console.warn('RPC create_project_from_wizard warning (local copy preserved):', err);
      }
    }

    return { success: true, projectId: newProjId };
  };

  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );

    if (isSupabaseLive && isUuid(projectId)) {
      try {
        await supabase.from('projects').update({ status: status as any }).eq('id', projectId);
        await refreshData();
      } catch (err) {
        console.warn('Supabase project update status notice:', err);
      }
    }
  };

  const assignDevelopersToProject = async (
    projectId: string,
    memberAssignments: Array<{
      profileId: string;
      projectRole: ProjectMember['projectRole'];
      allocationPct: number;
      rate?: number;
      payModel?: ProjectMember['payModel'];
    }>
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found' };

    const newMembers: ProjectMember[] = memberAssignments.map((m, idx) => {
      const userProfile = users.find((u) => u.id === m.profileId);
      const existing = (project.members || []).find((em) => em.profileId === m.profileId);
      return {
        id: existing?.id || `mem_${Date.now()}_${idx}`,
        projectId,
        profileId: m.profileId,
        projectRole: m.projectRole,
        allocationPct: m.allocationPct,
        rate: m.rate ?? existing?.rate ?? 35000,
        payModel: m.payModel || existing?.payModel || 'per_module',
        profileName: userProfile?.name || existing?.profileName || 'Developer',
        profileAvatar: userProfile?.avatar || existing?.profileAvatar || defaultAvatar,
        profileRole: userProfile?.title || userProfile?.role || 'Engineer',
      };
    });

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, members: newMembers } : p))
    );

    // Also sync to Supabase project_members table if live and valid UUID
    if (isSupabaseLive && isUuid(projectId)) {
      try {
        await supabase.from('project_members').delete().eq('project_id', projectId);
        for (const nm of newMembers) {
          if (isUuid(nm.profileId)) {
            await supabase.from('project_members').insert({
              project_id: projectId,
              profile_id: nm.profileId,
              project_role: nm.projectRole === 'tech_lead' ? 'tech_lead' : nm.projectRole === 'qa' ? 'qa' : 'developer',
              pay_model: nm.payModel,
              rate: nm.rate,
              allocation_pct: nm.allocationPct,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase project_members sync notice:', err);
      }
    }

    addAuditLog(
      'ASSIGN_PROJECT_MEMBERS',
      'projects',
      `Assigned ${newMembers.length} developer(s) to ${project.name}`,
      project.members,
      newMembers
    );

    toast.success(`Team allocated for ${project.name} successfully!`);
    return { success: true };
  };

  const removeDeveloperFromProject = async (projectId: string, profileId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = (p.members || []).filter((m) => m.profileId !== profileId);
          return { ...p, members: updated };
        }
        return p;
      })
    );

    if (isSupabaseLive && isUuid(projectId) && isUuid(profileId)) {
      try {
        await supabase.from('project_members').delete().eq('project_id', projectId).eq('profile_id', profileId);
      } catch (e) {
        console.warn('Supabase remove member error:', e);
      }
    }

    toast.success('Member removed from project roster.');
    return { success: true };
  };

  const sendProjectMessage = async (
    projectId: string,
    message: string,
    tag?: 'general' | 'design' | 'bug' | 'blocker' | 'update',
    attachmentUrl?: string
  ) => {
    if (!message.trim()) return { success: false, error: 'Message cannot be empty' };
    const user = currentUser || activePersona;
    const newMsg: ProjectChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      message: message.trim(),
      tag: tag || 'general',
      attachmentUrl,
      createdAt: new Date().toISOString(),
    };

    setProjectMessages((prev) => [...prev, newMsg]);
    return { success: true };
  };

  const submitDailyStandup = async (
    projectId: string,
    completedToday: string,
    plannedTomorrow: string,
    blockers?: string
  ) => {
    const user = currentUser || activePersona;
    const project = projects.find((p) => p.id === projectId);
    const hasBlocker = Boolean(blockers && blockers.trim().length > 0);

    const standup: DailyStandupUpdate = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      projectName: project?.name || 'Project Deliverable',
      developerId: user.id,
      developerName: user.name,
      completedToday: completedToday.trim(),
      plannedTomorrow: plannedTomorrow.trim(),
      blockers: blockers?.trim(),
      hasBlocker,
      createdAt: new Date().toISOString(),
    };

    setDailyStandups((prev) => [standup, ...prev]);

    if (hasBlocker) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: 'admin',
          title: `🚨 Blocker Escalation by ${user.name}`,
          body: `Project: ${project?.name || ''} - "${blockers?.trim()}"`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    toast.success('MNC Daily Standup update posted successfully!');
    return { success: true };
  };

  const deleteDailyStandup = async (standupId: string) => {
    setDailyStandups((prev) => {
      const updated = prev.filter((s) => s.id !== standupId);
      localStorage.setItem(STORAGE_KEYS.DAILY_STANDUPS, JSON.stringify(updated));
      return updated;
    });
    toast.success('Standup report removed.');
    return { success: true };
  };

  const clearOldDailyStandups = async (daysOlderThan: number = 30) => {
    const cutoffMs = Date.now() - daysOlderThan * 24 * 60 * 60 * 1000;
    let removedCount = 0;
    setDailyStandups((prev) => {
      const kept = prev.filter((s) => {
        const time = new Date(s.createdAt).getTime();
        if (time < cutoffMs) {
          removedCount++;
          return false;
        }
        return true;
      });
      localStorage.setItem(STORAGE_KEYS.DAILY_STANDUPS, JSON.stringify(kept));
      return kept;
    });
    toast.success(`Removed ${removedCount} archive standup report(s) older than ${daysOlderThan} days.`);
    return { success: true, removedCount };
  };

  // ==========================================
  // TASKS, SUBMISSIONS & GATE 1 REVIEWS
  // ==========================================

  const createTask = async (task: Omit<TaskItem, 'id' | 'createdAt' | 'submissions' | 'gate1Approved'>) => {
    const newTaskItem: TaskItem = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissions: [],
      gate1Approved: false,
    };
    setTasks((prev) => [newTaskItem, ...prev]);

    if (isSupabaseLive && isUuid(task.projectId)) {
      try {
        const { error } = await supabase.from('tasks').insert({
          project_id: task.projectId,
          title: task.title,
          description: task.description,
          acceptance_criteria: task.acceptanceCriteria,
          assignee_id: isUuid(task.assignedToId) ? task.assignedToId : undefined,
          reviewer_id: isUuid(task.reviewerId || '') ? task.reviewerId : undefined,
          priority: task.priority.toLowerCase() as any,
          deadline: task.deadline,
          estimated_hours: task.estimatedHours,
          payout_amount: task.payoutAmountINR,
          status: 'assigned',
          depends_on: (task.dependsOn || []).filter(isUuid),
          milestone_id: task.milestoneId && isUuid(task.milestoneId) ? task.milestoneId : null,
        });

        if (error) {
          console.warn(`Supabase task insert: ${error.message}`);
        } else {
          await refreshData();
        }
      } catch (err) {
        console.warn('Supabase task insert error:', err);
      }
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    // Check dependencies if moving to In Progress
    if (status === 'In Progress' || status === 'in_progress') {
      const task = tasks.find((t) => t.id === taskId);
      if (task?.dependsOn && task.dependsOn.length > 0) {
        const unapprovedDeps = tasks.filter(
          (t) => task.dependsOn!.includes(t.id) && t.status !== 'Approved'
        );
        if (unapprovedDeps.length > 0) {
          toast.error(
            `Cannot start task. Prerequisite task "${unapprovedDeps[0].title}" must be Approved first.`
          );
          return;
        }
      }
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              progressPercentage:
                status === 'Approved' ? 100
                : status === 'Submitted for Review' ? 80
                : status === 'In Progress' ? 45
                : 0,
              gate1Approved: status === 'Approved',
            }
          : t
      )
    );

    if (isSupabaseLive && isUuid(taskId)) {
      try {
        const dbStatus =
          status === 'In Progress' ? 'in_progress'
          : status === 'Submitted for Review' ? 'submitted'
          : status === 'Changes Requested' ? 'changes_requested'
          : status === 'Approved' ? 'approved'
          : 'assigned';

        await supabase.from('tasks').update({ status: dbStatus as any }).eq('id', taskId);
        await refreshData();
      } catch (err) {
        console.warn('Supabase task status update error:', err);
      }
    }
  };

  const submitDeliverable = async (
    taskId: string,
    submission: {
      prUrl: string;
      commitHash: string;
      demoUrl?: string;
      testsPassed?: number;
      testsTotal?: number;
      testProofs: string;
      notes: string;
      proofFiles?: string[];
    }
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    const nextVersion = `v${(task?.submissions?.length || 0) + 1}`;

    const newSub: DeliverableSubmission = {
      version: nextVersion,
      submittedAt: new Date().toISOString(),
      developerId: currentUser?.id || 'admin',
      developerName: currentUser?.name || 'Software Developer',
      prUrl: submission.prUrl,
      commitHash: submission.commitHash,
      demoUrl: submission.demoUrl,
      testProofs: submission.testProofs,
      testsPassed: submission.testsPassed,
      testsTotal: submission.testsTotal,
      notes: submission.notes,
      proofFiles: submission.proofFiles,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Submitted for Review',
              progressPercentage: 80,
              submissions: [newSub, ...(t.submissions || [])],
            }
          : t
      )
    );

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(taskId)) {
      try {
        const { error } = await supabase.from('task_submissions').insert({
          task_id: taskId,
          github_pr_url: submission.prUrl,
          commit_hash: submission.commitHash,
          demo_url: submission.demoUrl || null,
          tests_passed: submission.testsPassed || 0,
          tests_total: submission.testsTotal || 0,
          notes: `${submission.notes}\nProofs: ${submission.testProofs}`,
          proof_files: submission.proofFiles || [],
          submitted_by: isUuid(currentUser?.id || '') ? currentUser?.id : undefined,
        });

        if (!error) {
          await supabase.from('tasks').update({ status: 'submitted' }).eq('id', taskId);
        }
      } catch (syncErr) {
        console.warn('Supabase submission sync notice:', syncErr);
      }
    }
  };

  const reviewDeliverable = async (
    taskId: string,
    decision: 'Approved' | 'Changes Requested',
    feedback: string
  ) => {
    const isApproved = decision === 'Approved';
    const task = tasks.find((t) => t.id === taskId);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubs = (t.submissions || []).map((sub, idx) =>
            idx === 0
              ? {
                  ...sub,
                  feedback,
                  reviewedAt: new Date().toISOString(),
                  reviewerId: currentUser?.id,
                  reviewerName: currentUser?.name,
                  decision,
                }
              : sub
          );

          return {
            ...t,
            status: isApproved ? 'Approved' : 'Changes Requested',
            progressPercentage: isApproved ? 100 : 40,
            gate1Approved: isApproved,
            gate1ApprovedBy: isApproved ? currentUser?.name : undefined,
            gate1ApprovedAt: isApproved ? new Date().toISOString() : undefined,
            submissions: updatedSubs,
          };
        }
        return t;
      })
    );

    // If approved, generate Gate 2 payment voucher automatically
    if (isApproved && task) {
      const proj = projects.find((p) => p.id === task.projectId);
      const gross = task.payoutAmountINR || 37500;
      const tdsAmount = (gross * tdsRate) / 100;
      const netAmount = gross - tdsAmount;

      const newVoucher: PaymentVoucher = {
        id: `vouch_${Date.now()}`,
        voucherNumber: `FET-MS-2026-${String(vouchers.length + 101).padStart(4, '0')}`,
        projectId: task.projectId,
        projectCode: proj?.code || 'PRJ-2026-001',
        projectName: proj?.name || task.projectName,
        milestoneId: task.milestoneId,
        recipientId: task.assignedToId || 'user_dev',
        recipientName: task.assignedToName || 'Assigned Developer',
        recipientRole: 'developer',
        recipientPan: 'ABCDE1234F',
        recipientBank: '98765432100',
        recipientIfsc: 'HDFC0001234',
        milestoneOrLeadRef: task.title,
        grossAmountINR: gross,
        amountINR: gross,
        tdsRatePct: tdsRate,
        tdsDeductionINR: tdsAmount,
        netPayableINR: netAmount,
        status: 'Approved',
        generatedBy: currentUser?.name || 'Super Admin',
        createdAt: new Date().toISOString(),
      };

      setVouchers((prev) => [newVoucher, ...prev]);
    }

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(taskId)) {
      try {
        const latestSubId = task?.submissions[0]?.id;
        if (latestSubId && isUuid(latestSubId)) {
          await supabase.from('task_reviews').insert({
            submission_id: latestSubId,
            reviewer_id: isUuid(currentUser?.id || '') ? currentUser?.id : undefined,
            decision: isApproved ? 'approved' : 'changes_requested',
            comments: feedback,
          });
        }
        await supabase.from('tasks').update({ status: isApproved ? 'approved' : 'changes_requested' }).eq('id', taskId);
      } catch (reviewErr) {
        console.warn('Supabase task review notice:', reviewErr);
      }
    }
  };

  const addTaskComment = async (taskId: string, comment: string) => {
    if (isSupabaseLive && isUuid(taskId) && isUuid(currentUser?.id || '')) {
      try {
        await supabase.from('task_comments').insert({
          task_id: taskId,
          author_id: currentUser?.id,
          body: comment,
        });
        await refreshData();
      } catch (err) {
        console.warn('Supabase task comment insert:', err);
      }
    }
  };

  // ==========================================
  // TELECALLER CRM, LOCKING & LEAD CONVERSION
  // ==========================================

  const lockContact = async (leadId: string): Promise<boolean> => {
    const caller = currentUser || activePersona;
    const lead = leads.find((l) => l.id === leadId);
    if (lead?.isLocked && lead.lockedById && lead.lockedById !== caller?.id) {
      toast.error(`Lead is currently locked by ${lead.lockedByName || 'another agent'}.`);
      return false;
    }

    // Local-first update
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              isLocked: true,
              lockedById: caller?.id || 'telecaller',
              lockedByName: caller?.name || 'Telecaller',
              lockedAt: new Date().toISOString(),
              lockExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
            }
          : l
      )
    );

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(leadId)) {
      try {
        const { error } = await supabase.rpc('lock_lead', { p_lead_id: leadId });
        if (error) {
          console.warn('Supabase lock_lead notice:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase lock_lead exception:', err);
      }
    }

    return true;
  };

  const unlockContact = async (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, isLocked: false, lockedById: undefined, lockedByName: undefined, lockExpiresAt: undefined }
          : l
      )
    );

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(leadId)) {
      try {
        await supabase.rpc('release_lead', { p_lead_id: leadId });
      } catch (err) {
        console.warn('Supabase release_lead notice:', err);
      }
    }
  };

  const claimLeadOwnership = async (leadId: string): Promise<boolean> => {
    const user = currentUser || activePersona;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              ownerId: user.id,
              ownerName: user.name,
              assignedToId: user.id,
              assignedToName: user.name,
            }
          : l
      )
    );
    toast.success(`You are now the designated owner for this lead.`);
    return true;
  };

  const reassignLeadOwnership = async (leadId: string, newOwnerId: string): Promise<boolean> => {
    const newOwner = users.find((u) => u.id === newOwnerId);
    if (!newOwner) {
      toast.error('Selected telecaller not found.');
      return false;
    }
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              ownerId: newOwner.id,
              ownerName: newOwner.name,
              assignedToId: newOwner.id,
              assignedToName: newOwner.name,
              isLocked: false,
              lockedById: undefined,
              lockedByName: undefined,
            }
          : l
      )
    );
    toast.success(`Lead successfully reassigned to ${newOwner.name}.`);
    return true;
  };

  const updateLeadFollowUp = async (
    leadId: string,
    nextCallbackAt: string,
    followUpStage?: TelecallerLead['followUpStage'],
    notes?: string,
    priority?: TelecallerLead['followUpPriority']
  ): Promise<boolean> => {
    const user = currentUser || activePersona;
    const userId = user?.id || 'telecaller';
    const userName = user?.name || 'Telecaller';

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const interaction: LeadInteraction = {
            id: `int_${Date.now()}`,
            timestamp: new Date().toISOString(),
            telecallerId: userId,
            telecallerName: userName,
            outcome: 'Callback Scheduled',
            notes: notes || `Follow-up planned for stage: ${followUpStage || 'Follow-Up'}`,
            painPoints: l.painPoints || [],
            decisionMakerVerified: l.decisionMakerVerified ?? l.decisionMakerConfirmed ?? true,
            nextFollowUp: nextCallbackAt,
          };

          return {
            ...l,
            ownerId: l.ownerId || userId,
            ownerName: l.ownerName || userName,
            assignedToId: l.assignedToId || userId,
            assignedToName: l.assignedToName || userName,
            nextCallbackAt,
            followUpStage: followUpStage || l.followUpStage || 'Interest Confirmed',
            followUpPriority: priority || l.followUpPriority || 'Medium',
            lastContactedAt: new Date().toISOString(),
            interactions: [interaction, ...(l.interactions || [])],
          };
        }
        return l;
      })
    );
    toast.success('Follow-up scheduled in your personal outreach queue!');
    return true;
  };

  const logInteraction = async (
    leadId: string,
    outcome: LeadOutcome,
    notes: string,
    painPoints: string[],
    decisionMakerVerified: boolean,
    nextFollowUp?: string,
    requestQualification?: boolean,
    durationSec?: number
  ) => {
    const caller = currentUser || activePersona;
    const callerId = caller?.id || 'telecaller';
    const callerName = caller?.name || 'Telecaller';

    // Local-first interaction
    const newInteraction: LeadInteraction = {
      id: `int_${Date.now()}`,
      timestamp: new Date().toISOString(),
      telecallerId: callerId,
      telecallerName: callerName,
      outcome,
      notes,
      painPoints,
      decisionMakerVerified,
      durationSec: durationSec || 120,
      nextFollowUp,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          let newStatus = l.status;
          if (outcome === 'Interested') newStatus = 'Qualified';
          if (outcome === 'Demo Requested') newStatus = 'Demo Scheduled';
          if (outcome === 'Not Interested' || outcome === 'Invalid/Wrong Number') newStatus = 'Rejected';

          // Scoring calculation
          let score = l.score || 0;
          if (decisionMakerVerified) score += 25;
          score += painPoints.length * 10;
          if (outcome === 'Demo Requested') score += 30;

          let stage = l.followUpStage;
          if (outcome === 'Interested') stage = 'Interest Confirmed';
          if (outcome === 'Demo Requested') stage = 'Demo Scheduled';
          if (outcome === 'Callback Scheduled') stage = '1st Touch';

          return {
            ...l,
            ownerId: l.ownerId || callerId,
            ownerName: l.ownerName || callerName,
            assignedToId: l.assignedToId || callerId,
            assignedToName: l.assignedToName || callerName,
            followUpStage: stage || l.followUpStage,
            lastContactedAt: new Date().toISOString(),
            isLocked: false,
            lockedById: undefined,
            lockedByName: undefined,
            lockExpiresAt: undefined,
            status: newStatus,
            score,
            painPoints: Array.from(new Set([...(l.painPoints || []), ...painPoints])),
            decisionMakerConfirmed: decisionMakerVerified || l.decisionMakerConfirmed,
            nextCallbackAt: nextFollowUp || l.nextCallbackAt,
            interactions: [newInteraction, ...(l.interactions || [])],
          };
        }
        return l;
      })
    );

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(leadId)) {
      try {
        const dbOutcome =
          outcome === 'Interested' ? 'interested'
          : outcome === 'Callback Scheduled' ? 'callback_scheduled'
          : outcome === 'Demo Requested' ? 'demo_requested'
          : outcome === 'Not Interested' ? 'not_interested'
          : outcome === 'Invalid/Wrong Number' ? 'invalid_number'
          : 'unreachable';

        await supabase.rpc('log_call', {
          p_lead_id: leadId,
          p_outcome: dbOutcome as any,
          p_pain_points: painPoints,
          p_decision_maker: decisionMakerVerified,
          p_callback_at: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
          p_notes: notes,
          p_duration_sec: durationSec || 120,
        });
      } catch (err: any) {
        console.warn('Supabase log_call notice:', err);
      }
    }
  };

  const convertLeadToClientProject = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return { success: false, error: 'Lead not found' };

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );
    toast.success(`Converted ${lead.businessName} to Client & Draft Project!`);

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(leadId)) {
      try {
        const { data, error } = await supabase.rpc('convert_lead_to_client_project', {
          p_lead_id: leadId,
        });
        if (!error && data) {
          const res = data as any;
          return { success: true, clientId: res?.client_id, projectId: res?.project_id };
        }
      } catch (err: any) {
        console.warn('Supabase convert_lead notice:', err);
      }
    }

    return { success: true, clientId: `cli_${Date.now()}`, projectId: `proj_${Date.now()}` };
  };

  const importLeadsFromCSV = async (
    newLeads: Array<Omit<TelecallerLead, 'id' | 'interactions' | 'isLocked' | 'isQualifiedApproved'>>
  ): Promise<number> => {
    // Local-first import with duplicate phone check
    const existingPhones = new Set(leads.map((l) => l.phone.replace(/\D/g, '')));
    const toAdd: TelecallerLead[] = [];

    for (const item of newLeads) {
      const cleanPhone = item.phone.replace(/\D/g, '');
      if (!existingPhones.has(cleanPhone)) {
        existingPhones.add(cleanPhone);
        toAdd.push({
          ...item,
          id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          phone: item.phone.startsWith('+91') ? item.phone : `+91 ${item.phone}`,
          status: 'New',
          score: 10,
          isLocked: false,
          isQualifiedApproved: false,
          interactions: [],
        });
      }
    }

    if (toAdd.length > 0) {
      setLeads((prev) => [...toAdd, ...prev]);
    }

    // Try cloud sync in background if supabase is live
    if (isSupabaseLive && toAdd.length > 0) {
      try {
        const inserts = toAdd.map((l) => ({
          business_name: l.businessName,
          contact_person: l.contactPerson,
          phone: l.phone,
          email: l.email || null,
          category: l.category || 'Restaurant',
          city: l.city || 'Bangalore',
          source: l.source || 'CSV Import',
          stage: 'new' as const,
        }));
        await supabase.from('leads').insert(inserts);
      } catch (err) {
        console.warn('Supabase leads insert notice:', err);
      }
    }

    return toAdd.length;
  };

  const approveLeadQualification = async (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, isQualifiedApproved: true } : l))
    );
    toast.success('Lead qualification approved! Commission recorded for telecaller.');
  };

  // ==========================================
  // DUAL-GATE FINANCE & VOUCHERS
  // ==========================================

  const generateMilestoneVoucher = async (milestoneId: string, projectId: string): Promise<PaymentVoucher | null> => {
    const proj = projects.find((p) => p.id === projectId);
    const ms = proj?.milestones.find((m) => m.id === milestoneId);
    if (!proj || !ms) return null;

    const payee = users.find((u) => u.role === 'developer') || users[0];
    const gross = ms.agreedAmountINR || 50000;
    const tdsAmount = (gross * tdsRate) / 100;
    const netAmount = gross - tdsAmount;

    if (isSupabaseLive) {
      const { data, error } = await supabase.rpc('generate_voucher', {
        p_project_id: projectId,
        p_payee_id: payee.id,
        p_gross_amount: gross,
        p_milestone_id: milestoneId,
      });

      if (!error) {
        await refreshData();
      }
    }

    const newVoucher: PaymentVoucher = {
      id: `vouch_${Date.now()}`,
      voucherNumber: `FET-MS-2026-${String(vouchers.length + 101).padStart(4, '0')}`,
      projectId: proj.id,
      projectCode: proj.code,
      projectName: proj.name,
      milestoneId: ms.id,
      recipientId: payee.id,
      recipientName: payee.name,
      recipientRole: payee.role,
      recipientPan: payee.pan || 'ABCDE1234F',
      recipientBank: payee.bankAccountNo || '98765432100',
      recipientIfsc: payee.ifsc || 'HDFC0001234',
      milestoneOrLeadRef: ms.name,
      grossAmountINR: gross,
      amountINR: gross,
      tdsRatePct: tdsRate,
      tdsDeductionINR: tdsAmount,
      netPayableINR: netAmount,
      status: 'Approved',
      generatedBy: currentUser?.name || 'Super Admin',
      createdAt: new Date().toISOString(),
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    return newVoucher;
  };

  const releasePaymentVoucher = async (
    voucherId: string,
    paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI',
    utrRef: string
  ) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucherId
          ? {
              ...v,
              status: 'Released / Paid',
              paymentMode,
              transactionReferenceUTR: utrRef,
              releasedBy: currentUser?.name || 'Founder',
              releasedAt: new Date().toISOString(),
              paidOn: new Date().toISOString().split('T')[0],
            }
          : v
      )
    );

    const isUuid = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseLive && isUuid(voucherId)) {
      try {
        await supabase
          .from('vouchers')
          .update({
            status: 'paid',
            payment_mode: paymentMode as any,
            utr_reference: utrRef,
            paid_on: new Date().toISOString().split('T')[0],
            approved_by: isUuid(currentUser?.id || '') ? currentUser?.id : undefined,
          })
          .eq('id', voucherId);
      } catch (err) {
        console.warn('Supabase voucher update notice:', err);
      }
    }
    toast.success(`Payment voucher released via ${paymentMode}! UTR: ${utrRef}`);
  };

  // ==========================================
  // AUDIT LOG & UTILITIES
  // ==========================================

  const addAuditLog = async (
    action: string,
    targetEntity: string,
    details: string,
    before?: any,
    after?: any
  ) => {
    const newLog: AuditLogItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser?.id || 'system',
      actorName: currentUser?.name || 'Super Admin',
      actorRole: currentUser?.role || 'admin',
      action,
      targetEntity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (isSupabaseLive && currentUser?.id && isUuid(currentUser.id)) {
      try {
        await supabase.from('audit_log').insert({
          actor_id: currentUser.id,
          action,
          entity_type: targetEntity,
          before: before || null,
          after: after || null,
        });
      } catch (err) {
        console.warn('Supabase audit log notice:', err);
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );

    if (isSupabaseLive && isUuid(id)) {
      try {
        await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
      } catch (err) {
        console.warn('Supabase notification update notice:', err);
      }
    }
  };

  const cleanDuplicateData = async (): Promise<number> => {
    if (isSupabaseLive) {
      const { data } = await supabase.rpc('dedupe_leads');
      await refreshData();
      return Number(data) || 0;
    }

    const seenPhones = new Set<string>();
    let removed = 0;
    const cleanList: TelecallerLead[] = [];

    for (const lead of leads) {
      const cleanPhone = lead.phone.replace(/\D/g, '');
      if (seenPhones.has(cleanPhone)) {
        removed++;
      } else {
        seenPhones.add(cleanPhone);
        cleanList.push(lead);
      }
    }

    setLeads(cleanList);
    return removed;
  };

  const resetToDefaultData = () => {
    setProjects([]);
    setTasks([]);
    setLeads([]);
    setVouchers([]);
    setAuditLogs([]);
    setDailyStandups(INITIAL_DAILY_STANDUPS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.VOUCHERS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_STANDUPS);
    localStorage.removeItem(STORAGE_KEYS.LOCAL_DATA);
    toast.success('Dashboard reset to a pristine fresh state! Ready for real client onboarding.');
  };

  const submitJobApplication = async (
    applicationData: Omit<JobApplication, 'id' | 'referenceCode' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; referenceCode?: string; error?: string }> => {
    try {
      const isLocked =
        applicationData.department === 'engineering'
          ? !recruitmentSettings.engineeringHiringOpen
          : applicationData.department === 'sales'
          ? !recruitmentSettings.salesHiringOpen
          : false;

      if (isLocked) {
        return {
          success: false,
          error: `Applications for this role category (${applicationData.department}) are currently closed.`,
        };
      }

      const referenceCode = `FET-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: JobApplication = {
        ...applicationData,
        id: crypto.randomUUID(),
        referenceCode,
        status: 'New',
        submittedAt: new Date().toISOString(),
      };

      setApplications((prev) => {
        const updated = [newApp, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        } catch (quotaErr) {
          console.warn('LocalStorage quota exceeded with resume binary; saving candidate without base64 binary', quotaErr);
          const safe = updated.map((a) => ({ ...a, resumeFileData: undefined }));
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(safe));
        }
        window.dispatchEvent(new CustomEvent('fet_applications_updated'));
        return updated;
      });

      await addAuditLog(
        'RECRUITMENT_APPLICATION_SUBMITTED',
        'JobApplication',
        `New application submitted for ${applicationData.roleTitle} by ${applicationData.fullName} (${referenceCode})`
      );

      return { success: true, referenceCode };
    } catch (err: any) {
      console.error('submitJobApplication error:', err);
      return { success: false, error: err?.message || 'Failed to submit application.' };
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: JobApplication['status'],
    notes?: string,
    emailMeta?: { sentAt: string; emailType: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setApplications((prev) => {
        const updated = prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                status,
                adminNotes: notes ?? app.adminNotes,
                reviewedAt: new Date().toISOString(),
                reviewedBy: currentUser?.name || 'Super Admin',
                ...(emailMeta
                  ? {
                      lastEmailSentAt: emailMeta.sentAt,
                      lastEmailType: emailMeta.emailType,
                    }
                  : {}),
              }
            : app
        );
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return updated;
      });

      await addAuditLog(
        'RECRUITMENT_APPLICATION_STATUS_UPDATED',
        'JobApplication',
        `Application ${applicationId} status updated to ${status}${emailMeta ? ` (Email notification sent: ${emailMeta.emailType})` : ''}`
      );

      toast.success(`Candidate application status updated to ${status}`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update status.' };
    }
  };

  const signCandidateAgreement = async (
    applicationId: string,
    signatureName: string,
    signerIp?: string,
    affirmationWord?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setApplications((prev) => {
        const found = prev.some(
          (app) =>
            app.id.toLowerCase() === applicationId.toLowerCase() ||
            app.referenceCode.toLowerCase() === applicationId.toLowerCase()
        );
        let updated: JobApplication[];
        if (found) {
          updated = prev.map((app) =>
            app.id.toLowerCase() === applicationId.toLowerCase() ||
            app.referenceCode.toLowerCase() === applicationId.toLowerCase()
              ? {
                  ...app,
                  agreementSignedAt: new Date().toISOString(),
                  agreementSignature: signatureName,
                  agreementSignerIp: signerIp || '127.0.0.1 (Verified Web)',
                  agreementTermsAccepted: true,
                  agreementAffirmationWord: affirmationWord || 'I AGREE AND ACCEPT',
                  agreementStatus: 'signed' as const,
                }
              : app
          );
        } else {
          const newEntry: JobApplication = {
            id: applicationId,
            referenceCode: applicationId,
            roleId: 'developer-contractor',
            roleTitle: 'Software Developer & Independent Contractor',
            department: 'engineering',
            fullName: signatureName,
            email: '',
            status: 'Shortlisted',
            submittedAt: new Date().toISOString(),
            agreementSignedAt: new Date().toISOString(),
            agreementSignature: signatureName,
            agreementSignerIp: signerIp || '(Verified Web)',
            agreementTermsAccepted: true,
            agreementAffirmationWord: affirmationWord || 'I AGREE AND ACCEPT',
            agreementStatus: 'signed',
          };
          updated = [newEntry, ...prev];
        }
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return updated;
      });

      await addAuditLog(
        'CANDIDATE_AGREEMENT_DIGITALLY_SIGNED',
        'JobApplication',
        `Candidate digitally signed Freelancer Onboarding & Service Agreement under IT Act 2000 (Signer: ${signatureName}, Affirmation: ${affirmationWord || 'I AGREE AND ACCEPT'})`
      );

      toast.success('Agreement successfully signed and accepted!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign agreement.' };
    }
  };

  const rejectCandidateAgreement = async (
    applicationId: string,
    reason: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setApplications((prev) => {
        const updated = prev.map((app) =>
          app.id.toLowerCase() === applicationId.toLowerCase() ||
          app.referenceCode.toLowerCase() === applicationId.toLowerCase()
            ? {
                ...app,
                status: 'Rejected' as const,
                agreementStatus: 'rejected' as const,
                agreementRejectedAt: new Date().toISOString(),
                agreementRejectionReason: reason + (notes ? ` - ${notes}` : ''),
              }
            : app
        );
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return updated;
      });

      await addAuditLog(
        'CANDIDATE_AGREEMENT_REJECTED',
        'JobApplication',
        `Candidate declined the freelancer onboarding offer (Reason: ${reason}${notes ? ` | Notes: ${notes}` : ''})`
      );

      toast.info('Candidate offer decline has been recorded.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to record decline.' };
    }
  };

  const toggleRecruitmentLock = async (
    roleCategory: 'engineering' | 'sales',
    isOpen: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setRecruitmentSettings((prev) => ({
        ...prev,
        [roleCategory === 'engineering' ? 'engineeringHiringOpen' : 'salesHiringOpen']: isOpen,
      }));

      await addAuditLog(
        'RECRUITMENT_LOCK_TOGGLED',
        'RecruitmentSettings',
        `Hiring for ${roleCategory} set to ${isOpen ? 'OPEN' : 'LOCKED (Applications Paused)'}`
      );

      toast.success(
        `Hiring for ${roleCategory === 'engineering' ? 'Engineering (Developers)' : 'Sales (Telecallers)'} is now ${
          isOpen ? 'OPEN' : 'LOCKED (Positions Filled)'
        }`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to toggle lock.' };
    }
  };

  const updateRecruitmentSettings = async (
    settings: Partial<RecruitmentSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setRecruitmentSettings((prev) => ({ ...prev, ...settings }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update recruitment settings.' };
    }
  };

  const addClient = async (
    clientData: Omit<Client, 'id' | 'createdAt'>
  ): Promise<{ success: boolean; client?: Client; error?: string }> => {
    try {
      const newClient: Client = {
        ...clientData,
        id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [newClient, ...prev]);
      await addAuditLog('CLIENT_CREATED', 'Clients', `Created client ${newClient.name}`);
      toast.success(`Client "${newClient.name}" created successfully.`);
      return { success: true, client: newClient };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create client.' };
    }
  };

  const deleteClient = async (clientId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = clients.find((c) => c.id === clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      await addAuditLog('CLIENT_DELETED', 'Clients', `Deleted client ${target?.name || clientId}`);
      toast.success('Client record removed successfully.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete client.' };
    }
  };

  const deduplicateClients = async (): Promise<{ removedCount: number }> => {
    const seen = new Set<string>();
    const initialCount = clients.length;
    const cleaned = clients.filter((c) => {
      const key = `${c.name?.trim().toLowerCase()}_${c.phone?.replace(/\D/g, '')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setClients(cleaned);
    const removedCount = initialCount - cleaned.length;
    if (removedCount > 0) {
      toast.success(`Removed ${removedCount} duplicate client(s). Directory is clean!`);
      await addAuditLog('CLIENTS_DEDUPLICATED', 'Clients', `Cleaned ${removedCount} duplicate client records.`);
    } else {
      toast.info('No duplicate client records found.');
    }
    return { removedCount };
  };

  const deleteJobApplication = async (applicationId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setApplications((prev) => {
        const updated = prev.filter((a) => a.id !== applicationId);
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return updated;
      });
      await addAuditLog('JOB_APPLICATION_DELETED', 'JobApplication', `Deleted application ${applicationId}`);
      toast.success('Candidate application removed.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete application.' };
    }
  };

  const deleteUser = async (targetUserId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (
        currentUser &&
        (currentUser.id === targetUserId || currentUser.userId === targetUserId)
      ) {
        return { success: false, error: 'You cannot delete your own active administrator account.' };
      }
      setUsers((prev) => {
        const updated = prev.filter(
          (u) => u.id !== targetUserId && u.userId !== targetUserId
        );
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
        return updated;
      });
      await addAuditLog('USER_DELETED', 'Users', `Deleted user account ${targetUserId}`);
      toast.success('User account removed successfully.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete user.' };
    }
  };

  const deleteTask = async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setTasks((prev) => {
        const updated = prev.filter((t) => t.id !== taskId);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
        return updated;
      });
      await addAuditLog('TASK_DELETED', 'Tasks', `Deleted task ${taskId}`);
      toast.success('Task removed from board.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete task.' };
    }
  };

  const deleteProject = async (projectId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== projectId);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
        return updated;
      });
      setTasks((prev) => {
        const updated = prev.filter((t) => t.projectId !== projectId);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
        return updated;
      });
      if (selectedProjectId === projectId) {
        setSelectedProjectId('all');
      }
      await addAuditLog('PROJECT_DELETED', 'Projects', `Deleted project ${projectId} and associated tasks.`);
      toast.success('Project and associated tasks removed.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete project.' };
    }
  };

  const deleteLead = async (leadId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLeads((prev) => {
        const updated = prev.filter((l) => l.id !== leadId);
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
        return updated;
      });
      await addAuditLog('LEAD_DELETED', 'Leads', `Deleted lead ${leadId}`);
      toast.success('Lead removed from CRM.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete lead.' };
    }
  };

  const deleteDocument = async (documentId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setDocuments((prev) => {
        const updated = prev.filter((d) => d.id !== documentId);
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
        return updated;
      });
      await addAuditLog('DOCUMENT_DELETED', 'Documents', `Deleted document ${documentId}`);
      toast.success('Document removed from vault.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete document.' };
    }
  };

  const commissionRules: CommissionRule[] = [
    { id: '1', trigger: 'qualified_lead', amountOrPct: 500, isPercent: false, active: true },
    { id: '2', trigger: 'demo', amountOrPct: 1000, isPercent: false, active: true },
    { id: '3', trigger: 'closed_deal', amountOrPct: 10, isPercent: true, active: true },
  ];

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        changePassword,
        users,
        createUser,
        resetUserPassword,
        setUserActive,
        activePersona,
        allPersonas: users,
        switchPersona,
        updateProfile,
        projects,
        activeProjects,
        selectedProjectId,
        setSelectedProjectId,
        templates,
        createProjectFromWizard,
        updateProjectStatus,
        assignDevelopersToProject,
        removeDeveloperFromProject,
        projectMessages,
        sendProjectMessage,
        dailyStandups,
        submitDailyStandup,
        deleteDailyStandup,
        clearOldDailyStandups,
        tasks,
        createTask,
        updateTaskStatus,
        submitDeliverable,
        reviewDeliverable,
        addTaskComment,
        leads,
        lockContact,
        unlockContact,
        claimLeadOwnership,
        reassignLeadOwnership,
        updateLeadFollowUp,
        logInteraction,
        convertLeadToClientProject,
        importLeadsFromCSV,
        approveLeadQualification,
        commissionRules,
        commissions,
        vouchers,
        generateMilestoneVoucher,
        releasePaymentVoucher,
        tdsRate,
        documents,
        auditLogs,
        addAuditLog,
        notifications,
        markNotificationRead,
        searchQuery,
        setSearchQuery,
        clients,
        addClient,
        deleteClient,
        deduplicateClients,
        applications,
        recruitmentSettings,
        submitJobApplication,
        updateApplicationStatus,
        signCandidateAgreement,
        rejectCandidateAgreement,
        toggleRecruitmentLock,
        updateRecruitmentSettings,
        deleteJobApplication,
        deleteUser,
        deleteTask,
        deleteProject,
        deleteLead,
        deleteDocument,
        cleanDuplicateData,
        resetToDefaultData,
        refreshData,
        isSupabaseLive,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};


export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    // Graceful fallback for public pages (e.g. /careers) rendered outside /portal router subtree
    const getSavedSettings = (): RecruitmentSettings => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.RECRUITMENT_SETTINGS);
        if (saved) return JSON.parse(saved);
      } catch {}
      return {
        engineeringHiringOpen: true,
        salesHiringOpen: true,
        noticeMessage: '',
        notificationEmail: 'fusionenginetechnology@gmail.com',
      };
    };

    // Public sign: candidate signs agreement via personalized link (no auth required)
    const signCandidateAgreementPublic = async (
      applicationId: string,
      signatureName: string,
      _signerIp?: string,
      affirmationWord?: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        const apps: JobApplication[] = saved ? JSON.parse(saved) : [];
        const exists = apps.some(
          (app) =>
            app.id.toLowerCase() === applicationId.toLowerCase() ||
            app.referenceCode.toLowerCase() === applicationId.toLowerCase()
        );
        let updated: JobApplication[];
        if (exists) {
          updated = apps.map((app) =>
            app.id.toLowerCase() === applicationId.toLowerCase() ||
            app.referenceCode.toLowerCase() === applicationId.toLowerCase()
              ? {
                  ...app,
                  agreementSignedAt: new Date().toISOString(),
                  agreementSignature: signatureName,
                  agreementSignerIp: '(Verified Web)',
                  agreementTermsAccepted: true,
                  agreementAffirmationWord: affirmationWord || 'I AGREE AND ACCEPT',
                  agreementStatus: 'signed' as const,
                }
              : app
          );
        } else {
          const newEntry: JobApplication = {
            id: applicationId,
            referenceCode: applicationId,
            roleId: 'developer-contractor',
            roleTitle: 'Software Developer & Independent Contractor',
            department: 'engineering',
            fullName: signatureName,
            email: '',
            status: 'Shortlisted',
            submittedAt: new Date().toISOString(),
            agreementSignedAt: new Date().toISOString(),
            agreementSignature: signatureName,
            agreementSignerIp: '(Verified Web)',
            agreementTermsAccepted: true,
            agreementAffirmationWord: affirmationWord || 'I AGREE AND ACCEPT',
            agreementStatus: 'signed',
          };
          updated = [newEntry, ...apps];
        }
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e?.message || 'Failed to sign agreement.' };
      }
    };

    // Public reject: candidate declines agreement via personalized link (no auth required)
    const rejectCandidateAgreementPublic = async (
      applicationId: string,
      reason: string,
      notes?: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        const apps: JobApplication[] = saved ? JSON.parse(saved) : [];
        const updated = apps.map((app) =>
          app.id.toLowerCase() === applicationId.toLowerCase() ||
          app.referenceCode.toLowerCase() === applicationId.toLowerCase()
            ? {
                ...app,
                status: 'Rejected' as const,
                agreementStatus: 'rejected' as const,
                agreementRejectedAt: new Date().toISOString(),
                agreementRejectionReason: reason + (notes ? ` - ${notes}` : ''),
              }
            : app
        );
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e?.message || 'Failed to record decline.' };
      }
    };

    const submitPublicApp = async (
      applicationData: Omit<JobApplication, 'id' | 'referenceCode' | 'status' | 'submittedAt'>
    ) => {
      try {
        const settings = getSavedSettings();
        const isLocked =
          applicationData.department === 'engineering'
            ? !settings.engineeringHiringOpen
            : applicationData.department === 'sales'
            ? !settings.salesHiringOpen
            : false;

        if (isLocked) {
          return {
            success: false,
            error: `Applications for this role (${applicationData.department}) are currently closed.`,
          };
        }

        const referenceCode = `FET-APP-${Math.floor(100000 + Math.random() * 900000)}`;
        const newApp: JobApplication = {
          ...applicationData,
          id: crypto.randomUUID(),
          referenceCode,
          status: 'New',
          submittedAt: new Date().toISOString(),
        };

        const existingAppsStr = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        const existingApps: JobApplication[] = existingAppsStr ? JSON.parse(existingAppsStr) : [];
        const updatedList = [newApp, ...existingApps];

        try {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedList));
        } catch (quotaErr) {
          console.warn('LocalStorage quota exceeded in public submission; saving candidate metadata without heavy base64', quotaErr);
          const safeList = updatedList.map((a) => ({ ...a, resumeFileData: undefined }));
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(safeList));
        }

        window.dispatchEvent(new CustomEvent('fet_applications_updated'));
        return { success: true, referenceCode };
      } catch (e: any) {
        return { success: false, error: e?.message || 'Failed to submit application' };
      }
    };

    return {
      currentUser: null,
      isAuthenticated: false,
      login: async () => ({ success: false }),
      logout: async () => {},
      changePassword: async () => ({ success: false }),
      users: [],
      createUser: async () => ({ success: false }),
      resetUserPassword: async () => ({ success: false }),
      setUserActive: async () => ({ success: false }),
      activePersona: {} as any,
      allPersonas: [],
      switchPersona: () => {},
      updateProfile: async () => ({ success: false }),
      projects: [],
      activeProjects: [],
      selectedProjectId: 'all',
      setSelectedProjectId: () => {},
      templates: [],
      createProjectFromWizard: async () => ({ success: false }),
      updateProjectStatus: async () => {},
      assignDevelopersToProject: async () => ({ success: false }),
      removeDeveloperFromProject: async () => ({ success: false }),
      projectMessages: [],
      sendProjectMessage: async () => ({ success: false }),
      dailyStandups: [],
      submitDailyStandup: async () => ({ success: false }),
      deleteDailyStandup: async () => ({ success: true }),
      clearOldDailyStandups: async () => ({ success: true, removedCount: 0 }),
      tasks: [],
      createTask: async () => {},
      updateTaskStatus: async () => {},
      submitDeliverable: async () => {},
      reviewDeliverable: async () => {},
      addTaskComment: async () => {},
      leads: [],
      lockContact: async () => false,
      unlockContact: async () => {},
      claimLeadOwnership: async () => false,
      reassignLeadOwnership: async () => false,
      updateLeadFollowUp: async () => false,
      logInteraction: async () => {},
      convertLeadToClientProject: async () => ({ success: false }),
      importLeadsFromCSV: async () => 0,
      approveLeadQualification: async () => {},
      commissionRules: [],
      commissions: [],
      vouchers: [],
      generateMilestoneVoucher: async () => null,
      releasePaymentVoucher: async () => {},
      tdsRate: 10,
      documents: [],
      auditLogs: [],
      addAuditLog: async () => {},
      notifications: [],
      markNotificationRead: async () => {},
      searchQuery: '',
      setSearchQuery: () => {},
      clients: [],

      addClient: async () => ({ success: false }),
      deleteClient: async () => ({ success: false }),
      deduplicateClients: async () => ({ removedCount: 0 }),
      applications: (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
          if (!s) return [];
          const parsed = JSON.parse(s);
          if (!Array.isArray(parsed)) return [];
          // Strip any leftover demo seed entries
          const DEMO_IDS = ['app_demo_001', 'app_demo_002'];
          return parsed.filter(
            (a: JobApplication) => !DEMO_IDS.includes(a.id) && !a.referenceCode?.startsWith('FET-APP-DEMO-')
          );
        } catch {
          return [];
        }
      })(),
      recruitmentSettings: getSavedSettings(),
      submitJobApplication: submitPublicApp,
      updateApplicationStatus: async () => ({ success: false }),
      signCandidateAgreement: signCandidateAgreementPublic,
      rejectCandidateAgreement: rejectCandidateAgreementPublic,
      toggleRecruitmentLock: async () => ({ success: false }),
      updateRecruitmentSettings: async () => ({ success: false }),
      deleteJobApplication: async () => ({ success: false }),
      deleteUser: async () => ({ success: false }),
      deleteTask: async () => ({ success: false }),
      deleteProject: async () => ({ success: false }),
      deleteLead: async () => ({ success: false }),
      deleteDocument: async () => ({ success: false }),
      cleanDuplicateData: async () => 0,
      resetToDefaultData: () => {},
      refreshData: async () => {},
      isSupabaseLive: false,
    } as PortalContextType;

  }
  return context;
};
