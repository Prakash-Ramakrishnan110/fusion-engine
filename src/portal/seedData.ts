import { UserPersona, Project, TaskItem, TelecallerLead, PaymentVoucher, DocumentItem, AuditLogItem, ProjectTemplate } from './types';
import defaultAvatar from '../assets/default-avatar.svg';

// Production seed: Super Admin, Demo Developer, and Demo Telecaller accounts
export const INITIAL_PERSONAS: UserPersona[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    userId: 'prakash.r',
    name: 'Prakash Ramakrishnan',
    email: 'prakash.ramakrishnan@fusionengine.in',
    role: 'super_admin',
    title: 'Founder & Super Admin',
    avatar: defaultAvatar,
    department: 'Executive Leadership',
    engagementType: 'Full-Time',
    phone: '+91 7418132954',
    isActive: true,
  },
];

// Project Templates (Restaurant Management SaaS is a TEMPLATE with 6 modules, not a hardcoded locked project)
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Restaurant Management SaaS Template',
    description: 'Enterprise multi-tenant restaurant automation suite: QR table ordering, live KOT sync, POS counter billing, and inventory tracking.',
    defaultModules: [
      {
        name: 'Restaurant Onboarding & Multi-Branch Catalog',
        description: 'Branch setup, tax configs, menu categories',
        budgetWeightPct: 15,
      },
      {
        name: 'QR-Code Table Ordering & Guest Self-Service',
        description: 'Dynamic encrypted table QR, digital menu, mobile order queue',
        budgetWeightPct: 20,
      },
      {
        name: 'Kitchen Order Ticket (KOT) Real-Time Sync',
        description: 'Live socket kitchen display, station routing, acoustic alerts',
        budgetWeightPct: 20,
      },
      {
        name: 'POS Counter Billing & GST Thermal Invoicing',
        description: 'Split billing, CGST/SGST calculations, thermal 80mm ESC/POS print',
        budgetWeightPct: 20,
      },
      {
        name: 'Table Reservations & Dynamic Floorplan Map',
        description: 'Seating grid layout, slot reservation manager',
        budgetWeightPct: 10,
      },
      {
        name: 'Inventory Control & Recipe Ingredient Tracking',
        description: 'Raw ingredient deductions per dish served, low-stock reorder',
        budgetWeightPct: 15,
      },
    ],
    defaultMilestones: [
      {
        name: 'Milestone 1: Architecture, UI/UX & DB Schema',
        percentage: 20,
        reviewWindowDays: 5,
      },
      {
        name: 'Milestone 2: Backend REST/GraphQL APIs & Auth',
        percentage: 30,
        reviewWindowDays: 5,
      },
      {
        name: 'Milestone 3: Frontend Implementation & Workflows',
        percentage: 30,
        reviewWindowDays: 5,
      },
      {
        name: 'Milestone 4: E2E Testing, CI/CD & Handover',
        percentage: 20,
        reviewWindowDays: 5,
      },
    ],
  },
];

// Production Initial State - Clean baseline for live projects
export const INITIAL_PROJECTS: Project[] = [];

// Production Initial State - Clean baseline for deliverable tasks
export const INITIAL_TASKS: TaskItem[] = [];

// Production Initial State - Clean baseline for telecaller outreach pipeline
export const INITIAL_LEADS: TelecallerLead[] = [];

// Production Initial State - Clean baseline for milestone payment vouchers
export const INITIAL_VOUCHERS: PaymentVoucher[] = [];

// Clean, deduplicated statutory and compliance documents
export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_001',
    category: 'Company',
    title: 'Udyam MSME Registration Certificate',
    referenceCode: 'UDYAM-TN-02-0089124',
    complianceStandard: 'Ministry of MSME, Govt. of India',
    fileFormat: 'PDF Signed',
    uploadedAt: '2026-01-10',
    description: 'Statutory registration establishing Fusion Engine Technology as an eligible Micro Enterprise under Startup India guidelines.',
  },
  {
    id: 'doc_002',
    category: 'Recruitment',
    title: 'Developer Independent Contractor & IP Assignment Agreement',
    referenceCode: 'FET-LEG-AGR-004',
    complianceStandard: 'Indian Contract Act 1872 & Copyright Act 1957',
    fileFormat: 'PDF Template',
    uploadedAt: '2026-01-15',
    description: 'Standard deliverable-based contract with complete Intellectual Property assignment and non-disclosure terms.',
  },
  {
    id: 'doc_003',
    category: 'Sales',
    title: 'Telecaller Merchant Pitch Deck & Objection Guide',
    referenceCode: 'FET-SLS-SCR-01',
    complianceStandard: 'Internal Sales Operations Standard',
    fileFormat: 'DOCX / PDF',
    uploadedAt: '2026-02-01',
    description: 'Standard 3-minute pitch targeting restaurant owners with pain points, competitor comparison, and closing rebuttals.',
  },
  {
    id: 'doc_004',
    category: 'Financial',
    title: 'Milestone Payment Voucher Standard Specification',
    referenceCode: 'FET-FIN-VOUCH-V1',
    complianceStandard: 'Income Tax Act Sec 194J / TDS Reconciliation',
    fileFormat: 'Standardized Template',
    uploadedAt: '2026-02-05',
    description: 'Dual-signoff voucher capturing developer PAN, UTR reference, gross milestone sum, and net disbursed payout.',
  },
  {
    id: 'doc_005',
    category: 'Project',
    title: 'Restaurant SaaS Software Architecture & SRS Document',
    referenceCode: 'FET-PRJ-SRS-2026-01',
    complianceStandard: 'ISO/IEC/IEEE 29148 Standard',
    fileFormat: 'PDF Technical Spec',
    uploadedAt: '2026-03-01',
    description: 'Complete system requirements specification for multi-tenant KOT sync, split billing, and QR guest ordering.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];
