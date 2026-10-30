-- =====================================================
-- Fusion Engine Technology - Enterprise Multi-Project ERP/CRM
-- Migration 002_enterprise_expansion.sql
-- Covers Phase A (Security & Realtime), Phase B (Teams & Provisioning),
-- Phase C (AI Scripts & Normalized CSV), Phase D (Anti-Repeat Call Protection),
-- Phase E (Project Briefs & Engineering Standards), Phase F (Integrations Vault)
-- =====================================================

-- -----------------------------------------------------
-- 1. REALTIME REPLICATION (Phase A)
-- -----------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE leads;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- -----------------------------------------------------
-- 2. TEAMS TABLE & PROFILES PROTECTION (Phase A & B)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    lead_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- Protect critical profile fields: Non-admins cannot alter role, is_active, team_id, or must_change_password
CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow service role or admins to update anything
    IF (auth.jwt() ->> 'role' = 'service_role') OR is_admin() THEN
        RETURN NEW;
    END IF;

    -- If caller is regular authenticated user updating their own profile
    IF auth.uid() = OLD.id THEN
        NEW.role := OLD.role;
        NEW.is_active := OLD.is_active;
        NEW.team_id := OLD.team_id;
        NEW.user_id := OLD.user_id;
        NEW.failed_login_attempts := OLD.failed_login_attempts;
        NEW.locked_until := OLD.locked_until;
        -- Allow user to clear must_change_password when updating their password
    ELSE
        RAISE EXCEPTION 'Access denied: You can only edit your own profile.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON profiles;
CREATE TRIGGER trg_protect_profile_fields
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION protect_profile_fields();

-- -----------------------------------------------------
-- 3. PHASE D: ANTI-REPEAT-CALL PROTECTION TABLES & COLUMNS
-- -----------------------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS attempt_count INT NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS connected_count INT NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_connected_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_eligible_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE leads ADD COLUMN IF NOT EXISTS cooldown_reason TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS alt_phones TEXT[] DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_normalized TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS group_key TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone_normalized TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;

-- Normalize phones on existing leads
UPDATE leads SET phone_normalized = regexp_replace(phone, '\D', '', 'g') WHERE phone_normalized IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_phone_normalized ON leads(phone_normalized);
CREATE INDEX IF NOT EXISTS idx_leads_next_eligible ON leads(next_eligible_at);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_group_key ON leads(group_key);

-- Contact Suppressions Table (DNC, legal, permanent)
CREATE TABLE IF NOT EXISTS contact_suppressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_normalized TEXT UNIQUE NOT NULL,
    raw_phone TEXT,
    reason TEXT NOT NULL CHECK (reason IN ('dnc_request', 'invalid', 'existing_client', 'legal', 'admin', 'trai_dnd')),
    until TIMESTAMPTZ, -- null = permanent suppression
    lifted_at TIMESTAMPTZ,
    lift_reason TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_suppressions_phone ON contact_suppressions(phone_normalized);

-- Call Rules Table (Single configurable row with change logs)
CREATE TABLE IF NOT EXISTS call_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    max_calls_per_day_per_lead INT NOT NULL DEFAULT 1,
    unreachable_retry_hours INT NOT NULL DEFAULT 4,
    max_unreachable_attempts INT NOT NULL DEFAULT 3,
    unreachable_pause_days INT NOT NULL DEFAULT 7,
    not_interested_cooldown_days INT NOT NULL DEFAULT 90,
    calling_window_start TIME NOT NULL DEFAULT '09:00:00',
    calling_window_end TIME NOT NULL DEFAULT '20:00:00',
    lock_minutes INT NOT NULL DEFAULT 20,
    allow_cross_telecaller_calls BOOLEAN NOT NULL DEFAULT false,
    version INT NOT NULL DEFAULT 1,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default call rules if empty
INSERT INTO call_rules (id, max_calls_per_day_per_lead, unreachable_retry_hours, max_unreachable_attempts, unreachable_pause_days, not_interested_cooldown_days, lock_minutes)
SELECT '00000000-0000-0000-0000-000000000099', 1, 4, 3, 7, 90, 20
WHERE NOT EXISTS (SELECT 1 FROM call_rules);

-- -----------------------------------------------------
-- 4. PHASE C: RAW CSV, BUSINESS TYPES & AI CALL SCRIPTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS business_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    default_pain_points TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS import_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    total_rows INT NOT NULL DEFAULT 0,
    added_count INT NOT NULL DEFAULT 0,
    skipped_count INT NOT NULL DEFAULT 0,
    error_count INT NOT NULL DEFAULT 0,
    error_log JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS call_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_type_id UUID REFERENCES business_types(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'English',
    opening TEXT NOT NULL,
    pitch_30s TEXT NOT NULL,
    pitch_3min TEXT NOT NULL,
    probe_questions TEXT[] NOT NULL DEFAULT '{}',
    pain_point_hooks TEXT[] NOT NULL DEFAULT '{}',
    objection_handlers JSONB NOT NULL DEFAULT '{}'::jsonb,
    closing_cta TEXT NOT NULL,
    whatsapp_followup TEXT NOT NULL,
    voicemail_script TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
    version INT NOT NULL DEFAULT 1,
    generated_by_model TEXT,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(business_type_id, language, version)
);

CREATE TABLE IF NOT EXISTS lead_script_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    personalized_opening TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT NOT NULL,
    tokens_in INT NOT NULL DEFAULT 0,
    tokens_out INT NOT NULL DEFAULT 0,
    cost_estimate_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial standard business types
INSERT INTO business_types (name, slug, default_pain_points) VALUES
('Fine Dining & Multi-Branch Restaurant', 'restaurant_fine_dining', ARRAY['Slow KOT sync in rush hours', 'High POS subscription renewals', 'Multi-branch ingredient inventory deductions']),
('Quick Service Restaurant & Cafe', 'restaurant_qsr_cafe', ARRAY['Long billing queues at counter', 'Paper menu printing costs', 'Missing contactless QR ordering']),
('Pub, Bar & Microbrewery', 'pub_bar_brewery', ARRAY['Delayed drink ticket delivery to bar', 'Split billing confusion for groups', 'Table reservation chaos']),
('Cloud Kitchen & Takeaway', 'cloud_kitchen', ARRAY['Channel order aggregator delays', 'Raw food cost wastage', 'Thermal receipt printer errors'])
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------
-- 5. PHASE E: PROJECT BRIEFS & ENGINEERING STANDARDS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    goal TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    user_roles TEXT[] NOT NULL DEFAULT '{}',
    integrations TEXT[] NOT NULL DEFAULT '{}',
    tech_stack TEXT NOT NULL DEFAULT 'React, TypeScript, Node.js, Supabase, PostgreSQL',
    deadline DATE,
    budget_inr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    constraints TEXT,
    raw_document_url TEXT,
    proposed_plan JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'plan_generated', 'published', 'archived')),
    version INT NOT NULL DEFAULT 1,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS engineering_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_naming TEXT NOT NULL DEFAULT 'feature/PROJ-XXX-short-title',
    commit_convention TEXT NOT NULL DEFAULT 'Conventional Commits (feat, fix, refactor, test, docs)',
    pr_template TEXT NOT NULL,
    min_unit_test_coverage_pct INT NOT NULL DEFAULT 80,
    definition_of_done_checklist TEXT[] NOT NULL DEFAULT ARRAY[
        'All acceptance criteria met with verifiable proof',
        'Unit tests written and passing locally & in CI',
        'Clean code formatted without lint errors',
        'PR reviewed and approved by Tech Lead',
        'Demo environment verified'
    ],
    starter_repo_url TEXT,
    version INT NOT NULL DEFAULT 1,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed standard engineering standards
INSERT INTO engineering_standards (id, pr_template) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '## Summary
Describe changes implemented.

## Verification & Test Proofs
- [ ] Automated tests passing
- [ ] Acceptance criteria satisfied
- [ ] No regression observed'
) ON CONFLICT (id) DO NOTHING;

-- Add Definition of Done checklist tracking to task_submissions
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS dod_checklist JSONB DEFAULT '{}'::jsonb;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS ci_status TEXT DEFAULT 'pending' CHECK (ci_status IN ('pending', 'passed', 'failed', 'skipped'));

-- -----------------------------------------------------
-- 6. PHASE D: HARDENED ATOMIC lock_lead & log_call RPCs
-- -----------------------------------------------------

-- Drop old lock_lead
DROP FUNCTION IF EXISTS lock_lead(UUID);

CREATE OR REPLACE FUNCTION lock_lead(p_lead_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_caller_role user_role;
    v_lead RECORD;
    v_rules RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_now_time TIME := v_now::TIME;
    v_lock_exp TIMESTAMPTZ;
    v_is_suppressed BOOLEAN;
BEGIN
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated.';
    END IF;

    SELECT role INTO v_caller_role FROM profiles WHERE id = v_caller_id;
    SELECT * INTO v_rules FROM call_rules LIMIT 1;
    IF v_rules IS NULL THEN
        RAISE EXCEPTION 'Call rules are not configured.';
    END IF;

    -- Row lock lead with SELECT ... FOR UPDATE to avoid race conditions
    SELECT * INTO v_lead FROM leads WHERE id = p_lead_id FOR UPDATE;

    IF v_lead IS NULL THEN
        RAISE EXCEPTION 'Lead not found.';
    END IF;

    -- Check 1: Suppression / DNC check
    SELECT EXISTS (
        SELECT 1 FROM contact_suppressions 
        WHERE phone_normalized = v_lead.phone_normalized 
        AND (until IS NULL OR until > v_now)
    ) INTO v_is_suppressed;

    IF v_is_suppressed OR v_lead.is_dnc THEN
        RETURN jsonb_build_object('success', false, 'code', 'SUPPRESSED_OR_DNC', 'message', 'This phone number is on the Do-Not-Call (DNC) or suppression list.');
    END IF;

    -- Check 2: Existing Client Check
    IF v_lead.stage = 'won' OR v_lead.converted_client_id IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'code', 'ALREADY_CLIENT', 'message', 'This lead is already converted to an active ERP Client.');
    END IF;

    -- Check 3: Calling window (Only applicable to telecallers, admins can bypass)
    IF v_caller_role != 'admin' THEN
        IF v_now_time < v_rules.calling_window_start OR v_now_time > v_rules.calling_window_end THEN
            RETURN jsonb_build_object('success', false, 'code', 'OUTSIDE_WINDOW', 'message', format('Calls are only permitted between %s and %s IST.', v_rules.calling_window_start, v_rules.calling_window_end));
        END IF;
    END IF;

    -- Check 4: Already locked by someone else and lock has not expired
    IF v_lead.locked_by IS NOT NULL AND v_lead.locked_by != v_caller_id AND v_lead.lock_expires_at > v_now THEN
        RETURN jsonb_build_object('success', false, 'code', 'LOCKED_BY_OTHER', 'message', 'This lead is currently locked by another telecaller.');
    END IF;

    -- Check 5: Next eligible time (Cooldown / Max calls per day)
    IF v_lead.next_eligible_at IS NOT NULL AND v_lead.next_eligible_at > v_now AND v_caller_role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'code', 'IN_COOLDOWN', 'message', format('Lead is in cooldown until %s. Reason: %s', v_lead.next_eligible_at, coalesce(v_lead.cooldown_reason, 'Rate limit')));
    END IF;

    -- Check 6: Sticky Ownership (If lead is owned by another telecaller)
    IF v_lead.owner_id IS NOT NULL AND v_lead.owner_id != v_caller_id AND NOT v_rules.allow_cross_telecaller_calls AND v_caller_role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'code', 'OWNED_BY_ANOTHER', 'message', 'Lead is assigned exclusively to another telecaller.');
    END IF;

    -- Compute new lock expiration
    v_lock_exp := v_now + (v_rules.lock_minutes || ' minutes')::INTERVAL;

    UPDATE leads SET
        locked_by = v_caller_id,
        locked_at = v_now,
        lock_expires_at = v_lock_exp,
        owner_id = coalesce(owner_id, v_caller_id)
    WHERE id = p_lead_id;

    -- Write activity audit
    INSERT INTO lead_activities (lead_id, user_id, type, outcome, notes)
    VALUES (p_lead_id, v_caller_id, 'lock', 'interested', 'Acquired exclusive calling lock');

    RETURN jsonb_build_object(
        'success', true,
        'code', 'LOCKED',
        'lock_expires_at', v_lock_exp,
        'message', 'Exclusive lock acquired.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old log_call before re-creating with enhanced anti-repeat logic
DROP FUNCTION IF EXISTS log_call(UUID, call_outcome, TEXT[], BOOLEAN, TIMESTAMPTZ, TEXT, INT);
DROP FUNCTION IF EXISTS log_call;

-- Hardened log_call implementation
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
    v_caller_id UUID := auth.uid();
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_lead RECORD;
    v_rules RECORD;
    v_new_stage lead_stage;
    v_score_delta INT := 0;
    v_next_eligible TIMESTAMPTZ;
    v_cooldown_reason TEXT;
    v_dnc BOOLEAN := false;
BEGIN
    SELECT * INTO v_lead FROM leads WHERE id = p_lead_id FOR UPDATE;
    SELECT * INTO v_rules FROM call_rules LIMIT 1;

    -- Compute score & stage
    v_new_stage := CASE 
        WHEN p_outcome = 'interested' THEN 'interested'::lead_stage
        WHEN p_outcome = 'demo_requested' THEN 'demo'::lead_stage
        WHEN p_outcome = 'callback_scheduled' THEN 'contacted'::lead_stage
        WHEN p_outcome IN ('not_interested', 'invalid_number') THEN 'lost'::lead_stage
        ELSE v_lead.stage
    END;

    IF p_decision_maker THEN v_score_delta := v_score_delta + 25; END IF;
    IF p_pain_points IS NOT NULL THEN v_score_delta := v_score_delta + (cardinality(p_pain_points) * 10); END IF;
    IF p_outcome = 'demo_requested' THEN v_score_delta := v_score_delta + 35; END IF;

    -- Anti-repeat cooldown logic
    IF p_outcome = 'callback_scheduled' AND p_callback_at IS NOT NULL THEN
        v_next_eligible := p_callback_at;
        v_cooldown_reason := 'Scheduled callback';
    ELSIF p_outcome = 'not_interested' THEN
        v_next_eligible := v_now + (v_rules.not_interested_cooldown_days || ' days')::INTERVAL;
        v_cooldown_reason := 'Not interested cooldown';
    ELSIF p_outcome = 'unreachable' THEN
        IF (v_lead.attempt_count + 1) >= v_rules.max_unreachable_attempts THEN
            v_next_eligible := v_now + (v_rules.unreachable_pause_days || ' days')::INTERVAL;
            v_cooldown_reason := 'Exceeded max unreachable attempts';
        ELSE
            v_next_eligible := v_now + (v_rules.unreachable_retry_hours || ' hours')::INTERVAL;
            v_cooldown_reason := 'Unreachable retry';
        END IF;
    ELSIF p_outcome = 'invalid_number' THEN
        v_dnc := true;
        v_next_eligible := NULL;
        v_cooldown_reason := 'Invalid phone number';
        -- Add to suppressions
        INSERT INTO contact_suppressions (phone_normalized, reason, created_by)
        VALUES (v_lead.phone_normalized, 'invalid', v_caller_id)
        ON CONFLICT (phone_normalized) DO NOTHING;
    ELSE
        -- 1 call per day rule
        v_next_eligible := v_now + INTERVAL '1 day';
        v_cooldown_reason := 'Daily call frequency limit';
    END IF;

    -- Update lead
    UPDATE leads SET
        stage = v_new_stage,
        score = coalesce(score, 0) + v_score_delta,
        locked_by = NULL,
        locked_at = NULL,
        lock_expires_at = NULL,
        decision_maker_confirmed = coalesce(decision_maker_confirmed, false) OR p_decision_maker,
        pain_points = array_cat(coalesce(pain_points, '{}'), coalesce(p_pain_points, '{}')),
        next_callback_at = p_callback_at,
        next_eligible_at = v_next_eligible,
        cooldown_reason = v_cooldown_reason,
        attempt_count = attempt_count + 1,
        connected_count = CASE WHEN p_outcome IN ('interested', 'demo_requested', 'callback_scheduled', 'not_interested') THEN connected_count + 1 ELSE connected_count END,
        last_attempt_at = v_now,
        last_connected_at = CASE WHEN p_outcome IN ('interested', 'demo_requested', 'callback_scheduled', 'not_interested') THEN v_now ELSE last_connected_at END,
        is_dnc = coalesce(is_dnc, false) OR v_dnc,
        owner_id = coalesce(owner_id, v_caller_id)
    WHERE id = p_lead_id;

    -- Log append-only activity
    INSERT INTO lead_activities (lead_id, user_id, type, outcome, notes, duration_sec)
    VALUES (p_lead_id, v_caller_id, 'call', p_outcome, p_notes, p_duration_sec);

    RETURN jsonb_build_object(
        'success', true,
        'stage', v_new_stage,
        'next_eligible_at', v_next_eligible,
        'cooldown_reason', v_cooldown_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- 7. SCHEDULED EXPIRY CLEANUP FUNCTION
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION auto_release_expired_locks()
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    UPDATE leads
    SET locked_by = NULL,
        locked_at = NULL,
        lock_expires_at = NULL
    WHERE locked_by IS NOT NULL 
      AND lock_expires_at IS NOT NULL 
      AND lock_expires_at <= timezone('utc'::text, now());

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- 8. ROW LEVEL SECURITY ON NEW TABLES
-- -----------------------------------------------------
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_script_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_standards ENABLE ROW LEVEL SECURITY;

-- TEAMS RLS: Everyone reads, admin manages
CREATE POLICY "teams_read" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "teams_admin_all" ON teams FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- CONTACT SUPPRESSIONS: Everyone reads, admin writes (append-only)
CREATE POLICY "suppressions_read" ON contact_suppressions FOR SELECT TO authenticated USING (true);
CREATE POLICY "suppressions_insert" ON contact_suppressions FOR INSERT TO authenticated WITH CHECK (is_admin() OR auth.uid() = created_by);
CREATE POLICY "suppressions_admin_update" ON contact_suppressions FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- CALL RULES: Everyone reads, admin writes
CREATE POLICY "call_rules_read" ON call_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "call_rules_admin" ON call_rules FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- BUSINESS TYPES: Everyone reads, admin writes
CREATE POLICY "business_types_read" ON business_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "business_types_admin" ON business_types FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- IMPORT BATCHES: Admin reads & writes
CREATE POLICY "import_batches_admin" ON import_batches FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- CALL SCRIPTS: Telecaller sees approved scripts only; Admin sees all
CREATE POLICY "call_scripts_select" ON call_scripts FOR SELECT TO authenticated
USING (is_admin() OR status = 'approved');
CREATE POLICY "call_scripts_admin" ON call_scripts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- PROJECT BRIEFS: Admin only
CREATE POLICY "project_briefs_admin" ON project_briefs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ENGINEERING STANDARDS: Everyone reads, admin writes
CREATE POLICY "eng_standards_read" ON engineering_standards FOR SELECT TO authenticated USING (true);
CREATE POLICY "eng_standards_admin" ON engineering_standards FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- AI USAGE: Admin reads, system inserts
CREATE POLICY "ai_usage_admin" ON ai_usage FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "ai_usage_insert" ON ai_usage FOR INSERT TO authenticated WITH CHECK (true);
