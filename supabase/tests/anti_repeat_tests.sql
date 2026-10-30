-- =====================================================
-- Fusion Engine Technology - Anti-Repeat Call Protection Test Suite
-- supabase/tests/anti_repeat_tests.sql
-- =====================================================

BEGIN;

DO $$
DECLARE
    v_admin_id UUID := '11111111-1111-1111-1111-111111111111';
    v_tele1_id UUID := '44444444-4444-4444-4444-444444444441';
    v_tele2_id UUID := '44444444-4444-4444-4444-444444444442';
    v_lead_id UUID;
    v_lock_res1 JSONB;
    v_lock_res2 JSONB;
    v_lead_rec RECORD;
BEGIN
    -- Seed temporary profiles
    INSERT INTO profiles (id, user_id, full_name, role) VALUES
    (v_admin_id, 'admin_test', 'Admin Test', 'admin'),
    (v_tele1_id, 'tele1_test', 'Telecaller 1', 'telecaller'),
    (v_tele2_id, 'tele2_test', 'Telecaller 2', 'telecaller')
    ON CONFLICT (id) DO NOTHING;

    -- Create test lead
    INSERT INTO leads (business_name, contact_person, phone, phone_normalized, stage, score)
    VALUES ('Bistro Test', 'Ramesh', '+91 9988776655', '9988776655', 'new', 10)
    RETURNING id INTO v_lead_id;

    -- TEST A: Telecaller 1 locks lead
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_tele1_id::text, true);

    v_lock_res1 := lock_lead(v_lead_id);
    IF (v_lock_res1 ->> 'success')::BOOLEAN != true THEN
        RAISE EXCEPTION 'TEST A FAILED: Telecaller 1 failed to acquire lock: %', v_lock_res1;
    END IF;
    RAISE NOTICE '✓ TEST A PASSED: Telecaller 1 acquired lock successfully.';

    -- TEST B: Telecaller 2 attempts to lock while held by Telecaller 1 -> MUST BE REJECTED
    PERFORM set_config('request.jwt.claim.sub', v_tele2_id::text, true);

    v_lock_res2 := lock_lead(v_lead_id);
    IF (v_lock_res2 ->> 'success')::BOOLEAN = true OR (v_lock_res2 ->> 'code') != 'LOCKED_BY_OTHER' THEN
        RAISE EXCEPTION 'SECURITY BREACH TEST B: Telecaller 2 was able to lock a lead held by Telecaller 1! Result: %', v_lock_res2;
    END IF;
    RAISE NOTICE '✓ TEST B PASSED: Concurrent lock conflict prevented. Second telecaller rejected.';

    -- TEST C: Telecaller 1 logs call as "not_interested" -> MUST set 90 days cooldown & sticky ownership
    PERFORM set_config('request.jwt.claim.sub', v_tele1_id::text, true);

    PERFORM log_call(v_lead_id, 'not_interested', ARRAY['High recurring fee'], true, NULL, 'Spoke with owner, not interested right now', 180);

    SELECT * INTO v_lead_rec FROM leads WHERE id = v_lead_id;

    IF v_lead_rec.locked_by IS NOT NULL THEN
        RAISE EXCEPTION 'TEST C FAILED: Lock was not released after logging call!';
    END IF;

    IF v_lead_rec.next_eligible_at <= timezone('utc'::text, now()) + INTERVAL '80 days' THEN
        RAISE EXCEPTION 'TEST C FAILED: 90-day cooldown not set on not_interested outcome! Next: %', v_lead_rec.next_eligible_at;
    END IF;
    RAISE NOTICE '✓ TEST C PASSED: 90-day anti-repeat cooldown enforced on Not Interested.';

    -- TEST D: Attempting to call while in cooldown -> MUST BE REJECTED
    v_lock_res1 := lock_lead(v_lead_id);
    IF (v_lock_res1 ->> 'success')::BOOLEAN = true OR (v_lock_res1 ->> 'code') != 'IN_COOLDOWN' THEN
        RAISE EXCEPTION 'TEST D FAILED: Call allowed during cooldown period! Result: %', v_lock_res1;
    END IF;
    RAISE NOTICE '✓ TEST D PASSED: Dialing during cooldown strictly blocked.';

    -- TEST E: Invalid number automatically adds to contact_suppressions
    PERFORM log_call(v_lead_id, 'invalid_number', NULL, false, NULL, 'Number does not exist', 10);

    IF NOT EXISTS (SELECT 1 FROM contact_suppressions WHERE phone_normalized = '9988776655') THEN
        RAISE EXCEPTION 'TEST E FAILED: Invalid phone was not added to contact_suppressions table!';
    END IF;
    RAISE NOTICE '✓ TEST E PASSED: Invalid phone permanently suppressed in contact_suppressions.';
END $$;

ROLLBACK;
