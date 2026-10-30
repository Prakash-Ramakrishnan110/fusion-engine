-- =====================================================
-- Fusion Engine Technology - Row Level Security (RLS) Test Suite
-- supabase/tests/rls_tests.sql
-- Self-contained test suite: 2 projects, 2 developers, 1 tech lead, 2 telecallers
-- =====================================================

BEGIN;

-- 1. Setup Test Identities
CREATE TEMP TABLE test_ids (
    role TEXT PRIMARY KEY,
    id UUID NOT NULL
);

INSERT INTO test_ids (role, id) VALUES
('admin', '11111111-1111-1111-1111-111111111111'),
('dev1', '22222222-2222-2222-2222-222222222221'),
('dev2', '22222222-2222-2222-2222-222222222222'),
('tech_lead', '33333333-3333-3333-3333-333333333333'),
('tele1', '44444444-4444-4444-4444-444444444441'),
('tele2', '44444444-4444-4444-4444-444444444442');

-- Seed temporary test auth profiles
INSERT INTO profiles (id, user_id, full_name, role, department)
SELECT id, role, 'Test ' || role, 
       CASE WHEN role LIKE 'dev%' THEN 'developer'::user_role
            WHEN role = 'tech_lead' THEN 'developer'::user_role
            WHEN role LIKE 'tele%' THEN 'telecaller'::user_role
            ELSE 'admin'::user_role END,
       'Testing'
FROM test_ids;

-- 2. Setup 2 Projects
DO $$
DECLARE
    v_admin_id UUID := '11111111-1111-1111-1111-111111111111';
    v_dev1_id UUID := '22222222-2222-2222-2222-222222222221';
    v_dev2_id UUID := '22222222-2222-2222-2222-222222222222';
    v_tech_lead_id UUID := '33333333-3333-3333-3333-333333333333';
    v_proj_a UUID;
    v_proj_b UUID;
    v_task_a UUID;
    v_task_b UUID;
    v_vouch_a UUID;
BEGIN
    -- Project Alpha (Dev1 + Tech Lead)
    INSERT INTO projects (code, name, type, contract_value, start_date, end_date, created_by)
    VALUES ('PRJ-TEST-ALPHA', 'Project Alpha', 'client', 200000, CURRENT_DATE, CURRENT_DATE + 30, v_admin_id)
    RETURNING id INTO v_proj_a;

    INSERT INTO project_members (project_id, profile_id, project_role, rate) VALUES
    (v_proj_a, v_dev1_id, 'developer', 50000),
    (v_proj_a, v_tech_lead_id, 'tech_lead', 75000);

    INSERT INTO tasks (project_id, title, assignee_id, reviewer_id, deadline, status)
    VALUES (v_proj_a, 'Alpha Core Task', v_dev1_id, v_tech_lead_id, CURRENT_DATE + 7, 'assigned')
    RETURNING id INTO v_task_a;

    -- Project Beta (Dev2 only)
    INSERT INTO projects (code, name, type, contract_value, start_date, end_date, created_by)
    VALUES ('PRJ-TEST-BETA', 'Project Beta (Secret)', 'client', 350000, CURRENT_DATE, CURRENT_DATE + 60, v_admin_id)
    RETURNING id INTO v_proj_b;

    INSERT INTO project_members (project_id, profile_id, project_role, rate) VALUES
    (v_proj_b, v_dev2_id, 'developer', 80000);

    INSERT INTO tasks (project_id, title, assignee_id, deadline, status)
    VALUES (v_proj_b, 'Beta Secret Task', v_dev2_id, CURRENT_DATE + 14, 'assigned')
    RETURNING id INTO v_task_b;

    -- Financial Voucher on Project Alpha
    INSERT INTO vouchers (voucher_no, project_id, payee_id, gross_amount, tds_rate, tds_amount, net_amount, status)
    VALUES ('FET-TEST-001', v_proj_a, v_dev1_id, 50000, 10, 5000, 45000, 'approved')
    RETURNING id INTO v_vouch_a;
END $$;

-- -----------------------------------------------------
-- ASSERTION 1: Developer 1 CAN see Project Alpha, CANNOT see Project Beta
-- -----------------------------------------------------
DO $$
DECLARE
    v_dev1_id UUID := '22222222-2222-2222-2222-222222222221';
    v_alpha_count INT;
    v_beta_count INT;
BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_dev1_id::text, true);

    SELECT COUNT(*) INTO v_alpha_count FROM projects WHERE code = 'PRJ-TEST-ALPHA';
    SELECT COUNT(*) INTO v_beta_count FROM projects WHERE code = 'PRJ-TEST-BETA';

    IF v_alpha_count != 1 THEN
        RAISE EXCEPTION 'TEST 1 FAILED: Dev 1 should see Project Alpha (got count %)', v_alpha_count;
    END IF;

    IF v_beta_count != 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 1: Dev 1 saw Project Beta! (got count %)', v_beta_count;
    END IF;

    RAISE NOTICE '✓ TEST 1 PASSED: Developer on Project A cannot see Project B.';
END $$;

-- -----------------------------------------------------
-- ASSERTION 2: Developer 2 CAN see Project Beta, CANNOT see Project Alpha tasks
-- -----------------------------------------------------
DO $$
DECLARE
    v_dev2_id UUID := '22222222-2222-2222-2222-222222222222';
    v_alpha_task_count INT;
    v_beta_task_count INT;
BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_dev2_id::text, true);

    SELECT COUNT(*) INTO v_alpha_task_count FROM tasks WHERE title = 'Alpha Core Task';
    SELECT COUNT(*) INTO v_beta_task_count FROM tasks WHERE title = 'Beta Secret Task';

    IF v_alpha_task_count != 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 2: Dev 2 saw Project Alpha tasks!';
    END IF;

    IF v_beta_task_count != 1 THEN
        RAISE EXCEPTION 'TEST 2 FAILED: Dev 2 should see Project Beta task.';
    END IF;

    RAISE NOTICE '✓ TEST 2 PASSED: Developer on Project B cannot access Project A tasks.';
END $$;

-- -----------------------------------------------------
-- ASSERTION 3: Telecaller CANNOT read projects or financial vouchers
-- -----------------------------------------------------
DO $$
DECLARE
    v_tele1_id UUID := '44444444-4444-4444-4444-444444444441';
    v_proj_count INT;
    v_voucher_count INT;
BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_tele1_id::text, true);

    SELECT COUNT(*) INTO v_proj_count FROM projects WHERE code LIKE 'PRJ-TEST-%';
    SELECT COUNT(*) INTO v_voucher_count FROM vouchers WHERE voucher_no = 'FET-TEST-001';

    IF v_proj_count != 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 3: Telecaller saw projects table!';
    END IF;

    IF v_voucher_count != 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 3: Telecaller saw financial vouchers table!';
    END IF;

    RAISE NOTICE '✓ TEST 3 PASSED: Telecaller denied access to projects and finance tables.';
END $$;

-- -----------------------------------------------------
-- ASSERTION 4: Developer 1 cannot see Developer 2 Developer Details / Bank Info
-- -----------------------------------------------------
DO $$
DECLARE
    v_dev1_id UUID := '22222222-2222-2222-2222-222222222221';
    v_dev2_id UUID := '22222222-2222-2222-2222-222222222222';
    v_dev_details_count INT;
BEGIN
    -- Seed confidential bank details for dev2
    SET LOCAL ROLE postgres;
    INSERT INTO developer_details (profile_id, pan, bank_account_no)
    VALUES (v_dev2_id, 'XYZDE9999K', '12345678901234')
    ON CONFLICT (profile_id) DO UPDATE SET pan = EXCLUDED.pan;

    -- Query as Dev1
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_dev1_id::text, true);

    SELECT COUNT(*) INTO v_dev_details_count FROM developer_details WHERE profile_id = v_dev2_id;

    IF v_dev_details_count != 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 4: Dev 1 saw Dev 2 private developer_details!';
    END IF;

    RAISE NOTICE '✓ TEST 4 PASSED: Developer details are strictly confidential.';
END $$;

-- -----------------------------------------------------
-- ASSERTION 5: Immutable Submissions: UPDATE is strictly prohibited
-- -----------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'task_submissions' AND cmd = 'UPDATE'
    ) THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST 5: UPDATE policy detected on task_submissions!';
    END IF;

    RAISE NOTICE '✓ TEST 5 PASSED: task_submissions is strictly insert-only / append-only.';
END $$;

ROLLBACK;
