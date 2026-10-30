-- =====================================================
-- Fusion Engine Technology - Enterprise Multi-Project ERP/CRM
-- Migration 001_init.sql
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'developer', 'telecaller');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'on_hold', 'completed', 'archived');
CREATE TYPE task_status AS ENUM ('assigned', 'in_progress', 'submitted', 'changes_requested', 'approved');
CREATE TYPE voucher_status AS ENUM ('draft', 'pending_approval', 'approved', 'paid', 'rejected');
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'interested', 'demo', 'proposal', 'won', 'lost');
CREATE TYPE call_outcome AS ENUM ('interested', 'callback_scheduled', 'demo_requested', 'not_interested', 'invalid_number', 'unreachable');

-- 2. SEQUENCES
CREATE SEQUENCE IF NOT EXISTS project_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS voucher_no_seq START 1;

-- 3. TABLES

-- Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'developer',
    department TEXT NOT NULL DEFAULT 'Engineering',
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    must_change_password BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Developer Details (Confidential: Admin & Developer only)
CREATE TABLE developer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    pan TEXT,
    bank_account_name TEXT,
    bank_account_no TEXT,
    ifsc TEXT,
    upi_id TEXT,
    agreement_doc_path TEXT,
    nda_doc_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gst_no TEXT,
    address TEXT,
    source_lead_id UUID,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Project Templates
CREATE TABLE project_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    default_modules JSONB NOT NULL DEFAULT '[]',
    default_milestones JSONB NOT NULL DEFAULT '[]',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'client' CHECK (type IN ('client', 'internal')),
    description TEXT,
    contract_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status project_status NOT NULL DEFAULT 'active',
    template_id UUID REFERENCES project_templates(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Project Modules
CREATE TABLE project_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    budget_weight_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Project Members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_role TEXT NOT NULL DEFAULT 'developer' CHECK (project_role IN ('tech_lead', 'developer', 'qa')),
    pay_model TEXT NOT NULL DEFAULT 'milestone_share' CHECK (pay_model IN ('per_task', 'per_module', 'milestone_share', 'hourly')),
    rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    allocation_pct INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_project_member UNIQUE (project_id, profile_id)
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    module_id UUID REFERENCES project_modules(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    acceptance_criteria TEXT,
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_hours NUMERIC(6, 1) DEFAULT 0,
    deadline DATE NOT NULL,
    status task_status NOT NULL DEFAULT 'assigned',
    depends_on UUID[] DEFAULT '{}',
    payout_amount NUMERIC(10, 2) DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Task Submissions (IMMUTABLE - Non destructive deliverable versions)
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    github_pr_url TEXT NOT NULL,
    commit_hash TEXT NOT NULL,
    demo_url TEXT,
    tests_passed INT DEFAULT 0,
    tests_total INT DEFAULT 0,
    notes TEXT,
    proof_files TEXT[] DEFAULT '{}',
    submitted_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_task_version UNIQUE (task_id, version)
);

-- Task Reviews (IMMUTABLE - Technical gate review log)
CREATE TABLE task_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'changes_requested')),
    comments TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Task Comments
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Vouchers (Dual-Gate Gate 2 Disbursements)
CREATE TABLE vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_no TEXT UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    payee_id UUID NOT NULL REFERENCES profiles(id),
    gross_amount NUMERIC(12, 2) NOT NULL,
    tds_rate NUMERIC(4, 2) NOT NULL DEFAULT 10.0,
    tds_amount NUMERIC(12, 2) NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    status voucher_status NOT NULL DEFAULT 'draft',
    utr_reference TEXT,
    payment_mode TEXT CHECK (payment_mode IN ('IMPS', 'UPI', 'NEFT', 'RTGS')),
    paid_on DATE,
    pdf_path TEXT,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Documents Vault
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('contract', 'work_order', 'invoice', 'nda', 'kyc', 'other')),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Leads (CRM Pipeline)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    category TEXT NOT NULL DEFAULT 'Restaurant',
    city TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'Manual Outreach',
    stage lead_stage NOT NULL DEFAULT 'new',
    score INT NOT NULL DEFAULT 10,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    locked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    locked_at TIMESTAMPTZ,
    lock_expires_at TIMESTAMPTZ,
    decision_maker_confirmed BOOLEAN NOT NULL DEFAULT false,
    pain_points TEXT[] DEFAULT '{}',
    next_callback_at TIMESTAMPTZ,
    is_dnc BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    converted_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Lead Activities (APPEND-ONLY)
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'note', 'stage_change', 'lock', 'unlock')),
    outcome call_outcome,
    notes TEXT,
    duration_sec INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Qualification Requests (Sales Commission Eligibility)
CREATE TABLE qualification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    commission_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Commission Rules
CREATE TABLE commission_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger TEXT NOT NULL CHECK (trigger IN ('qualified_lead', 'demo', 'closed_deal')),
    amount_or_pct NUMERIC(10, 2) NOT NULL,
    is_percentage BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Commissions
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telecaller_id UUID NOT NULL REFERENCES profiles(id),
    lead_id UUID NOT NULL REFERENCES leads(id),
    rule_id UUID REFERENCES commission_rules(id),
    amount NUMERIC(10, 2) NOT NULL,
    voucher_id UUID REFERENCES vouchers(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Call Targets
CREATE TABLE call_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telecaller_id UUID NOT NULL REFERENCES profiles(id),
    date DATE NOT NULL,
    target_calls INT NOT NULL DEFAULT 50,
    target_connects INT NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_telecaller_date UNIQUE (telecaller_id, date)
);

-- Sales Scripts
CREATE TABLE sales_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pitch', 'probe', 'objection')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Audit Log (APPEND-ONLY)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    before JSONB,
    after JSONB,
    ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. DATABASE TRIGGERS & AUTO-INCREMENTS

-- Auto-generate Project Code: PRJ-YYYY-NNN
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT := to_char(CURRENT_DATE, 'YYYY');
    seq_val INT := nextval('project_code_seq');
BEGIN
    IF NEW.code IS NULL OR NEW.code = '' THEN
        NEW.code := 'PRJ-' || year_str || '-' || lpad(seq_val::text, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_project_code
BEFORE INSERT ON projects
FOR EACH ROW EXECUTE FUNCTION generate_project_code();

-- Auto-increment Task Submission Version
CREATE OR REPLACE FUNCTION increment_task_submission_version()
RETURNS TRIGGER AS $$
DECLARE
    max_ver INT;
BEGIN
    SELECT COALESCE(MAX(version), 0) INTO max_ver FROM task_submissions WHERE task_id = NEW.task_id;
    NEW.version := max_ver + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_task_submission_version
BEFORE INSERT ON task_submissions
FOR EACH ROW EXECUTE FUNCTION increment_task_submission_version();

-- Updated_at timestamp refresher
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_vouchers_updated BEFORE UPDATE ON vouchers FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 5. RPC FUNCTIONS

-- Helper Functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_project_member(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin() OR EXISTS (
        SELECT 1 FROM project_members WHERE project_id = p_project_id AND profile_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_tech_lead(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin() OR EXISTS (
        SELECT 1 FROM project_members 
        WHERE project_id = p_project_id AND profile_id = auth.uid() AND project_role = 'tech_lead'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Lead Locking (20-minute expiry)
CREATE OR REPLACE FUNCTION lock_lead(p_lead_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_lead leads%ROWTYPE;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    SELECT * INTO v_lead FROM leads WHERE id = p_lead_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lead not found');
    END IF;

    -- Check if locked by someone else and lock has not expired
    IF v_lead.locked_by IS NOT NULL 
       AND v_lead.locked_by != auth.uid() 
       AND v_lead.lock_expires_at > v_now THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lead is locked by another telecaller');
    END IF;

    -- Acquire Lock
    UPDATE leads 
    SET locked_by = auth.uid(),
        locked_at = v_now,
        lock_expires_at = v_now + INTERVAL '20 minutes'
    WHERE id = p_lead_id;

    -- Record Activity
    INSERT INTO lead_activities (lead_id, user_id, type)
    VALUES (p_lead_id, auth.uid(), 'lock');

    RETURN jsonb_build_object('success', true, 'locked_at', v_now, 'expires_at', v_now + INTERVAL '20 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Release Lead Lock
CREATE OR REPLACE FUNCTION release_lead(p_lead_id UUID)
RETURNS JSONB AS $$
BEGIN
    UPDATE leads 
    SET locked_by = NULL,
        locked_at = NULL,
        lock_expires_at = NULL
    WHERE id = p_lead_id AND (locked_by = auth.uid() OR is_admin());

    INSERT INTO lead_activities (lead_id, user_id, type)
    VALUES (p_lead_id, auth.uid(), 'unlock');

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log Call Interaction & Auto Score
CREATE OR REPLACE FUNCTION log_call(
    p_lead_id UUID,
    p_outcome call_outcome,
    p_pain_points TEXT[],
    p_decision_maker BOOLEAN,
    p_callback_at TIMESTAMPTZ DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_duration_sec INT DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
    v_new_stage lead_stage;
    v_score_add INT := 0;
BEGIN
    -- Determine stage & score based on outcome
    IF p_outcome = 'interested' THEN
        v_new_stage := 'interested';
        v_score_add := 25;
    ELSIF p_outcome = 'demo_requested' THEN
        v_new_stage := 'demo';
        v_score_add := 50;
    ELSIF p_outcome = 'callback_scheduled' THEN
        v_new_stage := 'contacted';
        v_score_add := 10;
    ELSIF p_outcome IN ('not_interested', 'invalid_number') THEN
        v_new_stage := 'lost';
    ELSE
        v_new_stage := 'contacted';
    END IF;

    IF p_decision_maker THEN
        v_score_add := v_score_add + 20;
    END IF;
    IF array_length(p_pain_points, 1) > 0 THEN
        v_score_add := v_score_add + (array_length(p_pain_points, 1) * 5);
    END IF;

    -- Update Lead
    UPDATE leads
    SET stage = v_new_stage,
        score = score + v_score_add,
        decision_maker_confirmed = p_decision_maker,
        pain_points = p_pain_points,
        next_callback_at = p_callback_at,
        assigned_to = COALESCE(assigned_to, auth.uid()),
        locked_by = NULL,
        locked_at = NULL,
        lock_expires_at = NULL
    WHERE id = p_lead_id;

    -- Record activity
    INSERT INTO lead_activities (lead_id, user_id, type, outcome, notes, duration_sec)
    VALUES (p_lead_id, auth.uid(), 'call', p_outcome, p_notes, p_duration_sec);

    RETURN jsonb_build_object('success', true, 'stage', v_new_stage);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Convert Lead to Client & Project
CREATE OR REPLACE FUNCTION convert_lead_to_client_project(p_lead_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_lead leads%ROWTYPE;
    v_client_id UUID;
    v_project_id UUID;
BEGIN
    SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lead not found');
    END IF;

    -- 1. Create client
    INSERT INTO clients (name, contact_person, phone, email, source_lead_id, created_by)
    VALUES (v_lead.business_name, v_lead.contact_person, v_lead.phone, v_lead.email, v_lead.id, auth.uid())
    RETURNING id INTO v_client_id;

    -- 2. Mark lead as won & converted
    UPDATE leads 
    SET stage = 'won', 
        converted_client_id = v_client_id 
    WHERE id = p_lead_id;

    RETURN jsonb_build_object('success', true, 'client_id', v_client_id, 'client_name', v_lead.business_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Project from Wizard (Single Transaction)
CREATE OR REPLACE FUNCTION create_project_from_wizard(p_payload JSONB)
RETURNS JSONB AS $$
DECLARE
    v_project_id UUID;
    v_client_id UUID;
    v_mod JSONB;
    v_ms JSONB;
    v_mem JSONB;
    v_contract_val NUMERIC(12, 2);
    v_pct_sum NUMERIC(5, 2) := 0;
BEGIN
    -- Verify Admin permission
    IF NOT is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized. Admin only.');
    END IF;

    v_contract_val := (p_payload->>'contract_value')::NUMERIC;
    v_client_id := (p_payload->>'client_id')::UUID;

    -- 1. Validate milestones percentage total equals 100%
    FOR v_ms IN SELECT * FROM jsonb_array_elements(p_payload->'milestones') LOOP
        v_pct_sum := v_pct_sum + (v_ms->>'percentage')::NUMERIC;
    END LOOP;

    IF v_pct_sum != 100.00 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Milestones must sum to exactly 100%. Current sum: ' || v_pct_sum);
    END IF;

    -- 2. Insert Project
    INSERT INTO projects (
        name, client_id, type, description, contract_value, start_date, end_date, template_id, created_by
    ) VALUES (
        p_payload->>'name',
        v_client_id,
        COALESCE(p_payload->>'type', 'client'),
        p_payload->>'description',
        v_contract_val,
        (p_payload->>'start_date')::DATE,
        (p_payload->>'end_date')::DATE,
        (p_payload->>'template_id')::UUID,
        auth.uid()
    ) RETURNING id INTO v_project_id;

    -- 3. Insert Modules
    IF p_payload ? 'modules' THEN
        FOR v_mod IN SELECT * FROM jsonb_array_elements(p_payload->'modules') LOOP
            INSERT INTO project_modules (project_id, name, description, budget_weight_pct, sort_order)
            VALUES (
                v_project_id,
                v_mod->>'name',
                v_mod->>'description',
                COALESCE((v_mod->>'budget_weight_pct')::NUMERIC, 0),
                COALESCE((v_mod->>'sort_order')::INT, 0)
            );
        END LOOP;
    END IF;

    -- 4. Insert Milestones
    FOR v_ms IN SELECT * FROM jsonb_array_elements(p_payload->'milestones') LOOP
        INSERT INTO milestones (project_id, name, percentage, amount, due_date)
        VALUES (
            v_project_id,
            v_ms->>'name',
            (v_ms->>'percentage')::NUMERIC,
            (v_contract_val * ((v_ms->>'percentage')::NUMERIC / 100.0)),
            (v_ms->>'due_date')::DATE
        );
    END LOOP;

    -- 5. Insert Team Members
    IF p_payload ? 'members' THEN
        FOR v_mem IN SELECT * FROM jsonb_array_elements(p_payload->'members') LOOP
            INSERT INTO project_members (project_id, profile_id, project_role, pay_model, rate, allocation_pct)
            VALUES (
                v_project_id,
                (v_mem->>'profile_id')::UUID,
                COALESCE(v_mem->>'project_role', 'developer'),
                COALESCE(v_mem->>'pay_model', 'milestone_share'),
                COALESCE((v_mem->>'rate')::NUMERIC, 0),
                COALESCE((v_mem->>'allocation_pct')::INT, 100)
            );
        END LOOP;
    END IF;

    -- 6. Write Audit Log
    INSERT INTO audit_log (actor_id, action, entity_type, entity_id, project_id, after)
    VALUES (auth.uid(), 'PROJECT_CREATED_FROM_WIZARD', 'projects', v_project_id, v_project_id, p_payload);

    RETURN jsonb_build_object('success', true, 'project_id', v_project_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate Official Voucher (FET-MS-YYYY-XXXX)
CREATE OR REPLACE FUNCTION generate_voucher(
    p_project_id UUID,
    p_payee_id UUID,
    p_milestone_id UUID DEFAULT NULL,
    p_gross_amount NUMERIC(12, 2) DEFAULT 0,
    p_tds_rate NUMERIC(4, 2) DEFAULT 10.0
)
RETURNS JSONB AS $$
DECLARE
    v_voucher_no TEXT;
    v_tds_amount NUMERIC(12, 2);
    v_net_amount NUMERIC(12, 2);
    v_seq_val INT := nextval('voucher_no_seq');
    v_year_str TEXT := to_char(CURRENT_DATE, 'YYYY');
    v_voucher_id UUID;
BEGIN
    IF NOT is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized. Admin only.');
    END IF;

    v_voucher_no := 'FET-MS-' || v_year_str || '-' || lpad(v_seq_val::text, 4, '0');
    v_tds_amount := round((p_gross_amount * (p_tds_rate / 100.0)), 2);
    v_net_amount := p_gross_amount - v_tds_amount;

    INSERT INTO vouchers (
        voucher_no, project_id, milestone_id, payee_id, gross_amount, tds_rate, tds_amount, net_amount, status, approved_by
    ) VALUES (
        v_voucher_no, p_project_id, p_milestone_id, p_payee_id, p_gross_amount, p_tds_rate, v_tds_amount, v_net_amount, 'approved', auth.uid()
    ) RETURNING id INTO v_voucher_id;

    RETURN jsonb_build_object('success', true, 'voucher_id', v_voucher_id, 'voucher_no', v_voucher_no, 'net_amount', v_net_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deduplicate Leads (Admin only)
CREATE OR REPLACE FUNCTION dedupe_leads()
RETURNS JSONB AS $$
DECLARE
    v_removed_count INT := 0;
BEGIN
    IF NOT is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized. Admin only.');
    END IF;

    WITH duplicates AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as r_num
        FROM leads
    )
    DELETE FROM leads WHERE id IN (SELECT id FROM duplicates WHERE r_num > 1);
    GET DIAGNOSTICS v_removed_count = ROW_COUNT;

    RETURN jsonb_build_object('success', true, 'removed_count', v_removed_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read for active users, update own or admin
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid() OR is_admin());

-- Developer Details: Admin or own developer profile only
CREATE POLICY "dev_details_admin" ON developer_details FOR ALL USING (is_admin());
CREATE POLICY "dev_details_self" ON developer_details FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "dev_details_update_self" ON developer_details FOR UPDATE USING (profile_id = auth.uid());

-- Projects: Admin sees all, Developers see only assigned projects
CREATE POLICY "projects_admin" ON projects FOR ALL USING (is_admin());
CREATE POLICY "projects_member_select" ON projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = projects.id AND profile_id = auth.uid())
);

-- Project Modules: Member select, Admin manage
CREATE POLICY "modules_select" ON project_modules FOR SELECT USING (is_project_member(project_id));
CREATE POLICY "modules_admin" ON project_modules FOR ALL USING (is_admin());

-- Project Members: Member select, Admin manage
CREATE POLICY "members_select" ON project_members FOR SELECT USING (is_project_member(project_id));
CREATE POLICY "members_admin" ON project_members FOR ALL USING (is_admin());

-- Milestones: Member select, Admin manage
CREATE POLICY "milestones_select" ON milestones FOR SELECT USING (is_project_member(project_id));
CREATE POLICY "milestones_admin" ON milestones FOR ALL USING (is_admin());

-- Tasks: Member select, Assignee update status, Tech Lead / Admin full
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (is_project_member(project_id));
CREATE POLICY "tasks_assignee_update" ON tasks FOR UPDATE USING (
    assignee_id = auth.uid() OR is_tech_lead(project_id) OR is_admin()
);
CREATE POLICY "tasks_admin_lead_manage" ON tasks FOR ALL USING (is_tech_lead(project_id) OR is_admin());

-- Task Submissions: IMMUTABLE (INSERT & SELECT only; NO UPDATE or DELETE)
CREATE POLICY "submissions_select" ON task_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_submissions.task_id AND is_project_member(tasks.project_id))
);
CREATE POLICY "submissions_insert" ON task_submissions FOR INSERT WITH CHECK (
    submitted_by = auth.uid()
);

-- Task Reviews: IMMUTABLE (Tech Lead & Admin only)
CREATE POLICY "reviews_select" ON task_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON task_reviews FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND (is_admin() OR EXISTS (
        SELECT 1 FROM task_submissions s
        JOIN tasks t ON t.id = s.task_id
        WHERE s.id = task_reviews.submission_id AND is_tech_lead(t.project_id)
    ))
);

-- Task Comments
CREATE POLICY "comments_select" ON task_comments FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_comments.task_id AND is_project_member(tasks.project_id))
);
CREATE POLICY "comments_insert" ON task_comments FOR INSERT WITH CHECK (author_id = auth.uid());

-- Vouchers: Admin full, Developer sees only own vouchers
CREATE POLICY "vouchers_admin" ON vouchers FOR ALL USING (is_admin());
CREATE POLICY "vouchers_payee_select" ON vouchers FOR SELECT USING (payee_id = auth.uid());

-- Leads: Telecallers & Admin
CREATE POLICY "leads_admin" ON leads FOR ALL USING (is_admin());
CREATE POLICY "leads_telecaller_select" ON leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'telecaller')
);
CREATE POLICY "leads_telecaller_update" ON leads FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'telecaller')
);

-- Lead Activities: Append-only
CREATE POLICY "lead_act_select" ON lead_activities FOR SELECT USING (true);
CREATE POLICY "lead_act_insert" ON lead_activities FOR INSERT WITH CHECK (user_id = auth.uid());

-- Sales Scripts: Read by telecallers & admin
CREATE POLICY "scripts_select" ON sales_scripts FOR SELECT USING (true);
CREATE POLICY "scripts_admin" ON sales_scripts FOR ALL USING (is_admin());

-- Notifications: User sees only own
CREATE POLICY "notifications_self" ON notifications FOR ALL USING (user_id = auth.uid());

-- Audit Log: APPEND-ONLY for everyone
CREATE POLICY "audit_select" ON audit_log FOR SELECT USING (is_admin());
CREATE POLICY "audit_insert" ON audit_log FOR INSERT WITH CHECK (true);
-- Notice: NO UPDATE or DELETE policies are created for audit_log, task_submissions, or task_reviews.

-- Storage Buckets Configuration (via storage schema if available)
INSERT INTO storage.buckets (id, name, public) VALUES 
('project-documents', 'project-documents', false),
('submission-proofs', 'submission-proofs', false),
('voucher-pdfs', 'voucher-pdfs', false),
('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;
