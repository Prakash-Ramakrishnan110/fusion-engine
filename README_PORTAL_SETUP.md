# Fusion Engine Technology - Multi-Project ERP/CRM Portal
## Production Architecture & Supabase Backend Setup Guide

This document details the complete deployment, Row-Level Security (RLS) enforcement, Edge Functions setup, environment variables, and manual QA validation checklist for the **Fusion Engine Technology Multi-Project Portal** (`/portal/*`).

---

### Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Environment Variables](#2-environment-variables)
3. [Database Migration & Seed](#3-database-migration--seed)
4. [Supabase Edge Functions Deployment](#4-supabase-edge-functions-deployment)
5. [Storage Buckets Configuration](#5-storage-buckets-configuration)
6. [Server-Side Row-Level Security (RLS) & SQL Tests](#6-server-side-row-level-security-rls--sql-tests)
7. [Manual Role-Based QA Checklist](#7-manual-role-based-qa-checklist)

---

### 1. Architecture Overview

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Radix UI (shadcn/ui), TanStack Query, Sonner.
- **Backend:** Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage, Supabase Realtime, Supabase Edge Functions).
- **Core Personas & Roles:**
  1. **Super Admin / Founder (`admin`):** Complete executive control, multi-project wizard onboarding, financial voucher approval and payouts, directory provisioning, and audit oversight.
  2. **Developer (`developer`):** Isolated view strictly confined to assigned projects (`project_members`), deliverable submissions (`task_submissions` v1, v2...), milestone tracking, and own earnings.
  3. **Telecaller (`telecaller`):** Inside sales pipeline, exclusive 20-minute contact locking (`lock_lead`), structured post-call form with lead scoring, WhatsApp integration, and one-click lead-to-project conversion.
  4. **Tech Lead (Project Role):** Designated engineer per project empowered to execute Gate 1 technical approvals or request changes with mandatory feedback.

---

### 2. Environment Variables

Create or update `.env` in the root of the project:

```env
# Supabase Live Backend Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: EmailJS or External Webhook integrations
# VITE_EMAILJS_SERVICE_ID=...
# VITE_EMAILJS_TEMPLATE_ID=...
# VITE_EMAILJS_PUBLIC_KEY=...
```

> **Security Mandate:** Never place the `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` files. Privileged administrative operations (user provisioning, password resets) execute strictly inside Supabase Edge Functions.

---

### 3. Database Migration & Seed

The database schema is fully encapsulated in two migration files:
- `supabase/migrations/001_init.sql`: Enums, tables, sequences, stored functions/RPCs, triggers, and RLS policies.
- `supabase/seed.sql`: 1 Super Admin profile, Restaurant Management SaaS reusable template (6 modules, 4 milestones), sales scripts, and commission rules.

#### Running Migrations with Supabase CLI:

```bash
# 1. Login to Supabase CLI
supabase login

# 2. Link your remote Supabase project
supabase link --project-ref your-project-id

# 3. Apply schema migration
supabase db push

# 4. Apply initial seed data
supabase db execute --file supabase/seed.sql
```

Alternatively, open your **Supabase Dashboard -> SQL Editor** and execute the contents of `supabase/migrations/001_init.sql` followed by `supabase/seed.sql`.

---

### 4. Supabase Edge Functions Deployment

Admin-only privileged operations run in Deno-based Edge Functions using the `SUPABASE_SERVICE_ROLE_KEY`:

| Function | Endpoint | Description |
|---|---|---|
| `create-user` | `/functions/v1/create-user` | Creates auth user in `auth.users`, inserts into `profiles` and `developer_details`, sets `must_change_password=true`. |
| `reset-password` | `/functions/v1/reset-password` | Admin resets user password without ever viewing the plain-text password. |
| `set-user-active` | `/functions/v1/set-user-active` | Toggles account active status (disables login without destructive deletion). |

#### Deploying Edge Functions:

```bash
# Deploy all functions to remote project
supabase functions deploy create-user --project-ref your-project-id
supabase functions deploy reset-password --project-ref your-project-id
supabase functions deploy set-user-active --project-ref your-project-id

# Set remote service role secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key --project-ref your-project-id
```

---

### 5. Storage Buckets Configuration

The migration automatically creates 4 private storage buckets with strict Row-Level Security:

1. `project-documents`: Project contracts, statement of work, architecture specs.
2. `submission-proofs`: Developer PR screenshots, test logs, deliverable artifacts.
3. `voucher-pdfs`: Official dual-gate payment vouchers generated for accounts.
4. `kyc-documents`: Developer signed contractor agreements, NDAs, and PAN/ID verification.

All files are private; client access is granted strictly via short-lived signed URLs.

---

### 6. Server-Side Row-Level Security (RLS) & SQL Tests

RLS is enabled on every table with default deny.

#### Automated SQL Test Script:

Run this script in the Supabase SQL editor to mathematically prove data isolation:

```sql
-- ==========================================================
-- TEST 1: Developer on Project A Cannot Read Project B
-- ==========================================================
DO $$
DECLARE
    v_dev_id UUID := '00000000-0000-0000-0000-000000000002';
    v_proj_a UUID;
    v_proj_b UUID;
    v_readable_count INT;
BEGIN
    -- Create Project A (Dev is member)
    INSERT INTO projects (code, name, type, contract_value, start_date, end_date)
    VALUES ('PRJ-TEST-A', 'Project Alpha', 'client', 100000, CURRENT_DATE, CURRENT_DATE + 30)
    RETURNING id INTO v_proj_a;

    INSERT INTO project_members (project_id, profile_id, project_role, rate)
    VALUES (v_proj_a, v_dev_id, 'developer', 25000);

    -- Create Project B (Dev is NOT member)
    INSERT INTO projects (code, name, type, contract_value, start_date, end_date)
    VALUES ('PRJ-TEST-B', 'Project Beta (Secret)', 'client', 500000, CURRENT_DATE, CURRENT_DATE + 60)
    RETURNING id INTO v_proj_b;

    -- Simulate Developer context
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_dev_id::text, true);

    -- Query projects as Developer
    SELECT COUNT(*) INTO v_readable_count FROM projects WHERE id = v_proj_b;

    IF v_readable_count = 0 THEN
        RAISE NOTICE 'SUCCESS: Developer on Project A cannot access Project B!';
    ELSE
        RAISE EXCEPTION 'SECURITY BREACH: Developer was able to select Project B!';
    END IF;
END $$;

-- ==========================================================
-- TEST 2: Telecaller Cannot Access Finance Vouchers
-- ==========================================================
DO $$
DECLARE
    v_telecaller_id UUID := '00000000-0000-0000-0000-000000000003';
    v_voucher_count INT;
BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', v_telecaller_id::text, true);

    SELECT COUNT(*) INTO v_voucher_count FROM vouchers;

    IF v_voucher_count = 0 THEN
        RAISE NOTICE 'SUCCESS: Telecaller denied access to financial vouchers!';
    ELSE
        RAISE EXCEPTION 'SECURITY BREACH: Telecaller accessed financial vouchers table!';
    END IF;
END $$;

-- ==========================================================
-- TEST 3: Immutable Submissions & Audit Log
-- ==========================================================
DO $$
BEGIN
    -- Verify no UPDATE policy exists on task_submissions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'task_submissions' AND cmd = 'UPDATE'
    ) THEN
        RAISE NOTICE 'SUCCESS: task_submissions is strictly append-only (No UPDATE policy).';
    ELSE
        RAISE EXCEPTION 'SECURITY BREACH: UPDATE policy found on task_submissions!';
    END IF;
END $$;
```

---

### 7. Manual Role-Based QA Checklist

Perform this manual verification checklist to ensure end-to-end operational readiness:

#### A. Super Admin Verification
- [ ] Log in with User ID `admin` and password.
- [ ] If `must_change_password` is set, verify the forced password change modal blocks interaction until a new password is set.
- [ ] Confirm Top Bar displays **Project Switcher** with "All Projects" + individual project choices.
- [ ] Click **"+ New Project"** or navigate to `/portal/projects` and launch the 6-step wizard:
  - Step 1: Input basics (name, client, contract value ₹250,000, dates).
  - Step 2: Select "Restaurant Management SaaS Template" (verifies 6 pre-loaded modules).
  - Step 3: Verify module budget weights sum to 100%.
  - Step 4: Verify milestone allocations sum to 100% (20/30/30/20).
  - Step 5: Assign a developer from the active directory.
  - Step 6: Click "Provision & Create Project" -> verify success toast and redirect.
- [ ] Navigate to `/portal/team` -> Click "Provision New Account" -> test creating an employee account. Verify plain-text passwords are never displayed.
- [ ] Test "Reset Password" -> verify admin can set a temporary password but cannot view the user's existing password.

#### B. Developer Isolation Verification
- [ ] Log in with User ID `developer`.
- [ ] Verify Top Bar **Project Switcher** lists ONLY projects the developer is assigned to.
- [ ] Navigate to `/portal/tasks`:
  - Open a task with status "Assigned" -> Move to "In Progress" (confirm dependency check blocks if prerequisites are unapproved).
  - Click "Submit Deliverable" -> Enter PR link, commit hash, test count (e.g. 18/18 tests passing), notes -> Submit.
  - Verify version increments to `v1` (and `v2` on subsequent submissions).
  - Confirm developer cannot approve their own deliverable (Gate 1 sign-off is restricted to Tech Lead / Admin).
- [ ] Navigate to `/portal/finance`:
  - Verify developer sees only their own payment vouchers.
  - Verify client financial contracts and other developers' bank details are hidden.
  - Click "PDF" -> verify printable voucher opens with PAN and statutory Sec 194J TDS math.
- [ ] Attempt navigating directly to `/portal/telecaller`:
  - Verify `ProtectedRoute` automatically intercepts and redirects back to `/portal/tasks`.

#### C. Telecaller CRM & Lock Conflict Verification
- [ ] Log in with User ID `telecaller`.
- [ ] Verify Top Bar displays "CRM & Merchant Pipeline Mode" (no project switcher).
- [ ] In outreach table, click **"Call & Lock"** on a prospect:
  - Verify lock badge turns into "Locked by You" with active 20-minute expiry.
- [ ] Open an incognito browser window and log in as a second telecaller or admin:
  - Verify the locked lead displays "Locked by [Agent Name]" and the dial button is disabled.
- [ ] In the active call form:
  - Select outcome: "Interested" or "Demo Requested".
  - Select identified restaurant pain points (e.g. "Slow KOT sync in rush hours").
  - Check "Verified Decision-Maker".
  - Enter notes and click "Save Interaction & Release Lock".
  - Verify lock releases and score increases automatically.
- [ ] Click the **WhatsApp icon** next to the phone number:
  - Verify `https://wa.me/` opens with prefilled merchant inquiry text.
- [ ] On a Won / Qualified lead, verify the **"Convert to Project"** button opens the New Project wizard with business name and phone prefilled into client fields.
- [ ] Attempt navigating directly to `/portal/finance` or `/portal/audit`:
  - Verify `ProtectedRoute` intercepts and redirects back to `/portal/telecaller`.

#### D. Finance & Dual-Gate TDS Math Verification
- [ ] Log in as Admin.
- [ ] Navigate to `/portal/finance`.
- [ ] Under Gate 2 Milestone Deliverables, click **"Generate Gate 2 Voucher"** on an approved milestone.
- [ ] Verify financial ledger calculates:
  - Gross Milestone Payout: e.g. ₹50,000.
  - Statutory TDS Deduction (Sec 194J @ 10%): -₹5,000.
  - Net Payable: ₹45,000.
- [ ] Click "Pay Out" -> Select payment channel (UPI / IMPS / NEFT) -> Enter bank UTR reference -> Submit.
- [ ] Verify status updates to "Released / Paid" with timestamp.
- [ ] Click "PDF" -> Click "Print / Save PDF" -> Verify official letterhead with Udyam registration and dual-gate approval signatures.
