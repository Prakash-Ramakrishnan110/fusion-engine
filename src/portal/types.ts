import type { Database } from '../lib/database.types.ts';

// Role Definitions (Enforced in Supabase DB: 'admin' | 'developer' | 'telecaller')
export type UserRole = 'admin' | 'developer' | 'telecaller' | 'super_admin' | 'project_manager' | 'finance';

export type DbUserRole = Database['public']['Enums']['user_role'];
export type ProjectStatus = Database['public']['Enums']['project_status'];
export type TaskStatus = Database['public']['Enums']['task_status'] | 'Backlog' | 'Assigned' | 'In Progress' | 'Blocked' | 'Submitted for Review' | 'Changes Requested' | 'Approved' | 'Completed';
export type VoucherStatus = Database['public']['Enums']['voucher_status'] | 'Draft' | 'Approved' | 'Released / Paid';
export type LeadStage = Database['public']['Enums']['lead_stage'] | 'New' | 'Contacted' | 'Qualified' | 'Demo Scheduled' | 'Converted' | 'Rejected';
export type CallOutcome = Database['public']['Enums']['call_outcome'] | 'Interested' | 'Callback Scheduled' | 'Demo Requested' | 'Not Interested' | 'Invalid/Wrong Number' | 'Unreachable' | 'Customer Asked Not to Call Again';
export type LeadOutcome = CallOutcome;

export interface UserPersona {
  id: string;
  userId: string; // login identifier e.g. "admin", "dev_rahul", "tele_priya"
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  department: string;
  phone?: string;
  isActive?: boolean;
  mustChangePassword?: boolean;
  assignedProjectCount?: number;
  engagementType?: 'Full-Time' | 'Part-Time' | 'Contractor' | 'Milestone-Based' | 'Commission-Based';
  // Developer details
  skills?: string[];
  pan?: string;
  bankAccountName?: string;
  bankAccountNo?: string;
  ifsc?: string;
  upiId?: string;
  agreementDocPath?: string;
  ndaDocPath?: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNo?: string;
  address?: string;
  city?: string;
  industry?: string;
  projectCode?: string;
  projectName?: string;
  contractValueINR?: number;
  status?: string;
  sourceLeadId?: string;
  createdAt?: string;
}


export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  defaultMilestones: Array<{
    name: string;
    percentage: number;
    reviewWindowDays?: number;
  }>;
  defaultModules: Array<{
    name: string;
    description: string;
    budgetWeightPct: number;
  }>;
}

export interface ProjectModule {
  id: string;
  projectId: string;
  name: string;
  description: string;
  budgetWeightPct: number;
  sortOrder: number;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface ProjectMember {
  id: string;
  projectId: string;
  profileId: string;
  userId?: string; // alias/backward-compatibility for profileId
  projectRole: 'tech_lead' | 'developer' | 'frontend' | 'backend' | 'fullstack' | 'qa' | 'ui_ux';
  payModel: 'per_task' | 'per_module' | 'milestone_share' | 'hourly';
  rate: number;
  allocationPct: number;
  profileName?: string;
  profileAvatar?: string;
  profileRole?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  percentageAllocation: number; // Sums to 100%
  agreedAmountINR: number;
  scope?: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Submitted' | 'Gate 1 Approved' | 'Gate 2 Approved' | 'Paid';
  reviewWindowDays?: number;
  voucherNumber?: string;
  paymentReference?: string;
  paidAt?: string;
}

export interface Project {
  id: string;
  code: string; // Auto-generated: PRJ-YYYY-NNN
  name: string;
  clientId?: string;
  clientName?: string;
  type: 'client' | 'internal';
  description: string;
  status: 'Planning' | 'Active' | 'Review' | 'Completed' | 'draft' | 'active' | 'on_hold' | 'completed' | 'archived';
  contractValueINR: number;
  totalBudgetINR: number; // alias for contractValueINR
  startDate: string;
  targetEndDate: string;
  techLeadId?: string;
  templateId?: string;
  modules: string[];
  moduleDetails?: ProjectModule[];
  members?: ProjectMember[];
  milestones: Milestone[];
  createdById?: string;
  createdAt?: string;
}

export interface DeliverableSubmission {
  id?: string;
  version: number | string; // v1, v2...
  submittedAt: string;
  developerId?: string;
  developerName?: string;
  prUrl?: string;
  prLink?: string;
  commitHash: string;
  demoUrl?: string;
  testProofs?: string;
  testsPassing?: boolean;
  testsCount?: number;
  proofNotes?: string;
  testsPassed?: number;
  testsTotal?: number;
  notes?: string;
  proofFiles?: string[];
  feedback?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  decision?: 'Approved' | 'Changes Requested';
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  projectName: string;
  moduleId?: string;
  module: string;
  title: string;
  description: string;
  acceptanceCriteria?: string;
  assignedToId: string;
  assignedToName: string;
  reviewerId?: string;
  reviewerName?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: TaskStatus;
  progressPercentage: number;
  estimatedHours?: number;
  payoutAmountINR?: number;
  deadline: string;
  dependsOn?: string[]; // array of prerequisite task IDs
  milestoneId: string;
  submissions: DeliverableSubmission[];
  comments?: TaskComment[];
  gate1Approved: boolean;
  gate1ApprovedBy?: string;
  gate1ApprovedAt?: string;
  createdAt: string;
}

export interface LeadInteraction {
  id: string;
  timestamp: string;
  telecallerId: string;
  telecallerName: string;
  outcome: CallOutcome;
  notes: string;
  painPoints: string[];
  decisionMakerVerified: boolean;
  durationSec?: number;
  nextFollowUp?: string;
}

export interface TelecallerLead {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  category: string;
  city: string;
  source: string;
  assignedToId?: string;
  assignedToName?: string;
  ownerId?: string; // Sticky Telecaller Assignment
  ownerName?: string;
  followUpStage?: '1st Touch' | 'Interest Confirmed' | 'Objections Handled' | 'Demo Scheduled' | 'Contract Review' | 'Closing Deal';
  followUpPriority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: LeadStage | LeadStatus;
  stage?: LeadStage | LeadStatus;
  score?: number;
  isLocked: boolean;
  lockedById?: string;
  lockedByName?: string;
  lockedBy?: string;
  lockedAt?: string;
  lockExpiresAt?: string;
  decisionMakerConfirmed?: boolean;
  decisionMakerVerified?: boolean;
  painPoints?: string[];
  nextCallbackAt?: string;
  lastContactedAt?: string;
  isDnc?: boolean;
  tags?: string[];
  convertedClientId?: string;
  convertedProjectId?: string;
  interactions: LeadInteraction[];
  isQualifiedApproved: boolean;
  qualificationApprovedBy?: string;
  qualificationApprovedAt?: string;
  conversionAmountINR?: number;
  commissionPaidINR?: number;
  createdAt?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Demo Scheduled' | 'Converted' | 'Rejected';

export interface PaymentVoucher {
  id: string;
  voucherNumber: string; // e.g. FET-MS-2026-0104
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  milestoneId?: string;
  milestoneName?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole | string;
  recipientPan?: string;
  recipientBank?: string;
  recipientBankAccount?: string;
  recipientIfsc?: string;
  recipientUpi?: string;
  milestoneOrLeadRef?: string;
  grossAmountINR: number;
  amountINR?: number; // alias for grossAmountINR
  tdsRatePct?: number; // default 10% under Sec 194J
  tdsRatePercent?: number;
  tdsDeductionINR?: number;
  tdsAmountINR?: number;
  netPayableINR: number;
  status: 'Draft' | 'Approved' | 'Released / Paid';
  paymentMode?: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  transactionReferenceUTR?: string;
  utrReference?: string;
  disbursedDate?: string;
  complianceStatement?: string;
  pdfPath?: string;
  generatedBy?: string;
  approvedBy?: string;
  releasedBy?: string;
  releasedAt?: string;
  paidOn?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  projectId?: string;
  projectName?: string;
  category: 'Company' | 'Recruitment' | 'Project' | 'Financial' | 'Sales' | 'contract' | 'work_order' | 'invoice' | 'nda' | 'kyc' | 'other';
  title: string;
  referenceCode: string;
  complianceStandard?: string;
  fileFormat: string;
  filePath?: string;
  uploadedBy?: string;
  uploadedAt: string;
  description: string;
  version?: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  entityId?: string;
  projectId?: string;
  details: string;
  beforeJson?: any;
  afterJson?: any;
}

export interface NotificationItem {
  id: string;
  userId?: string | null;
  title: string;
  body: string;
  link?: string;
  category?: 'recruitment' | 'task' | 'finance' | 'lead' | 'system' | string;
  readAt?: string | null;
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  trigger: 'qualified_lead' | 'demo' | 'closed_deal';
  amountOrPct: number;
  isPercent: boolean;
  active: boolean;
}

export interface TelecallerCommission {
  id: string;
  telecallerId: string;
  leadId: string;
  leadBusinessName?: string;
  ruleId: string;
  amountINR: number;
  voucherId?: string;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  referenceCode: string; // e.g. FET-APP-891024
  roleId: string; // 'fullstack-developer' | 'frontend-engineer' | 'backend-api-developer' | 'telecaller-sales-executive'
  roleTitle: string;
  department: 'engineering' | 'sales' | 'product';
  fullName: string;
  email: string;
  phone: string;
  city: string;
  portfolioUrl?: string;
  expectedCompensation?: string;
  experienceSummary: string;
  resumeFileName?: string;
  resumeFileData?: string; // Base64 data URI
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Hired' | 'Rejected';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  lastEmailSentAt?: string;
  lastEmailType?: 'Shortlisted' | 'Hired' | 'Rejected' | 'Under Review' | string;
  agreementSignedAt?: string;
  agreementSignature?: string; // Digital signature name or canvas data URI
  agreementSignerIp?: string;
  agreementTermsAccepted?: boolean;
  agreementAffirmationWord?: string;
  agreementStatus?: 'pending' | 'signed' | 'rejected';
  agreementRejectedAt?: string;
  agreementRejectionReason?: string;
  agreementDocumentText?: string;
}

export interface RecruitmentSettings {
  engineeringHiringOpen: boolean;
  salesHiringOpen: boolean;
  noticeMessage?: string;
  notificationEmail: string;
}

export interface ProjectChatMessage {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  message: string;
  tag?: 'general' | 'design' | 'bug' | 'blocker' | 'update';
  attachmentUrl?: string;
  createdAt: string;
}

export interface DailyStandupUpdate {
  id: string;
  projectId: string;
  projectName: string;
  developerId: string;
  developerName: string;
  completedToday: string;
  plannedTomorrow: string;
  blockers?: string;
  hasBlocker: boolean;
  createdAt: string;
}

export interface ProjectDesignSpec {
  figmaUrl?: string;
  prototypeUrl?: string;
  designSystemNotes?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

