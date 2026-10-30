# Enterprise Workforce, Project & Lead Management Portal
## Multi-Project CRM & ERP System Architecture & Deployment Guide

---

### 1. Architectural Overview & Deliverables
This multi-project portal provides enterprise-grade role segregation, server-enforced anti-repeat calling, automated AI sales scripts and project brief plan generators, and non-destructive versioned engineering submissions across 3 distinct personas:
1. **Super Admin**: Executive visibility, project wizard, team provisioning, integrations vault, DNC suppression, and audit trail.
2. **Developers (with optional Tech Lead)**: Project assignments, tasks Kanban, Gate 1 reviews, Definition of Done checklist, and earnings vouchers.
3. **Telecallers**: CRM outreach with 20-min exclusive locking, server-enforced cooldowns, live AI sales script panel, and pipeline Kanban.

---

### 2. Changed & Created File Inventory

#### A. Database Migrations & Automated Tests
- `supabase/migrations/001_init.sql`: Base multi-tenant schema with core tables.
- `supabase/migrations/002_enterprise_expansion.sql`: Enterprise expansion including:
  - Realtime publication on `leads`, `tasks`, `notifications`.
  - Anti-repeat calling tables (`contact_suppressions`, `call_rules`, `leads` tracking columns).
  - Row locking stored procedures: `lock_lead(p_lead_id)` with `SELECT ... FOR UPDATE` & `log_call(...)`.
  - Teams & Department management: `teams` table, `profiles.team_id`, and `protect_profile_fields()` trigger preventing self-escalation.
  - AI script tables: `business_types`, `import_batches`, `call_scripts`, `lead_script_overrides`, `ai_usage`.
  - Engineering standardization: `project_briefs`, `engineering_standards`, and `task_submissions.dod_checklist`.
  - Maintenance cron function: `auto_release_expired_locks()`.
- `supabase/tests/rls_tests.sql`: Automated unit test suite verifying RLS isolation between 2 projects, 2 developers, 1 tech lead, and 2 telecallers.
- `supabase/tests/anti_repeat_tests.sql`: Concurrency test proving race-condition rejection between telecallers, 90-day not-interested cooldowns, and automatic DNC suppressions.

#### B. Edge Functions (Zero Secrets Leaked to Client)
- `supabase/functions/_shared/cors.ts`: CORS allow-list header generator.
- `supabase/functions/_shared/auth.ts`: JWT verification, profile loader, and server-side `role === 'admin'` guard.
- `supabase/functions/create-user/index.ts`: Admin-only account provisioning with temporary password and department assignment.
- `supabase/functions/reset-password/index.ts`: Admin-only temporary password reset.
- `supabase/functions/set-user-active/index.ts`: Instant user deactivation without password viewing.
- `supabase/functions/generate-scripts/index.ts`: Admin-only AI sales script generator with JSON schema validation and `ai_usage` billing tracking.
- `supabase/functions/generate-project-plan/index.ts`: Admin-only project brief to modules, tasks, and DoD generator.
- `supabase/functions/save-integration-secret/index.ts`: Secure secrets vault writer (returns masked keys only).
- `supabase/functions/github-webhook/index.ts`: GitHub CI/PR status webhook for automated Gate 1 review checks.

#### C. Frontend UI Pages & Components
- `src/portal/components/SupabaseSetupError.tsx`: Setup error screen shown when Supabase env vars are missing (removing localStorage fallback).
- `src/portal/pages/ClientsPage.tsx` (`/portal/clients`): Client CRM & accounts registry.
- `src/portal/pages/ReviewQueuePage.tsx` (`/portal/review-queue`): Gate 1 Technical Lead review queue.
- `src/portal/pages/ReportsPage.tsx` (`/portal/reports`): Executive analytics & CSV data export.
- `src/portal/pages/SuppressionsPage.tsx` (`/portal/suppressions`): DNC & Suppression registry with audited overrides.
- `src/portal/pages/PipelineKanbanPage.tsx` (`/portal/pipeline`): 5-stage CRM outreach Kanban board.
- `src/portal/pages/ScriptsAdminPage.tsx` (`/portal/scripts`): AI script generator, multi-language editor, and live preview.
- `src/portal/pages/IntegrationsPage.tsx` (`/portal/integrations`): Masked API key vault & GitHub webhook config.
- `src/portal/pages/ProjectBriefsPage.tsx` (`/portal/briefs`): Structured project brief intake & AI task plan publisher.
- `src/portal/pages/TelecallerPage.tsx` (`/portal/telecaller`): Enhanced with live AI script panel, language switcher, DNC outcome, and CSV preview.
- `src/portal/pages/TasksPage.tsx` (`/portal/tasks`): Upgraded with mandatory Definition of Done (DoD) checklist validation.
- `src/portal/components/PortalSidebar.tsx`: Role-based navigation shell.
- `src/App.tsx`: Registered all Phase A–F portal routes.

---

### 3. Environment & Secret Names

#### Client Browser Bundle (`.env`)
Only these public variables appear in the client bundle:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### Supabase Edge Function Secrets (Never In Browser)
Set these on the server using `supabase secrets set`:
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_PROVIDER` (`google`, `openai`, or `anthropic`)
- `AI_MODEL` (`gemini-1.5-flash`, `gpt-4o-mini`, etc.)
- `AI_API_KEY` (Your private provider key)
- `ALLOWED_ORIGIN` (Production frontend origin, e.g. `https://yourdomain.com`)

---

### 4. Step-by-Step Setup Guide

#### Step 1: Database Setup & Migrations
1. Open your Supabase project SQL Editor.
2. Run `supabase/migrations/001_init.sql`.
3. Run `supabase/migrations/002_enterprise_expansion.sql`.

#### Step 2: First Super Admin Creation
Because Supabase Auth requires an encrypted password hash in `auth.users`, create the first Super Admin manually:
1. In the Supabase Dashboard, go to **Authentication > Users > Add user**.
2. Enter email: `admin@portal.internal` and a secure password.
3. Copy the newly created `User UID`.
4. Run this query in the SQL editor:
```sql
INSERT INTO public.profiles (
  id,
  user_id,
  name,
  role,
  department,
  must_change_password,
  is_active
) VALUES (
  '<COPIED_USER_UID>',
  '<COPIED_USER_UID>',
  'Super Admin',
  'admin',
  'Executive',
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;
```

#### Step 3: Deploy Edge Functions & Secrets
In your local CLI terminal:
```bash
# Set secrets
supabase secrets set AI_PROVIDER=google
supabase secrets set AI_MODEL=gemini-1.5-flash
supabase secrets set AI_API_KEY=your_gemini_api_key_here

# Deploy functions
supabase functions deploy create-user
supabase functions deploy reset-password
supabase functions deploy set-user-active
supabase functions deploy generate-scripts
supabase functions deploy generate-project-plan
supabase functions deploy save-integration-secret
supabase functions deploy github-webhook
```

#### Step 4: Scheduled Maintenance Jobs (pg_cron)
Enable `pg_cron` in Supabase Database Extensions and schedule the 5-minute lock release:
```sql
SELECT cron.schedule(
  'auto-release-lead-locks',
  '*/5 * * * *',
  'SELECT public.auto_release_expired_locks();'
);
```

#### Step 5: TRAI / DND Compliance Note
Indian telemarketing regulations under TRAI TCCCPR (Telecom Commercial Communications Customer Preference Regulations) require scrubbing consumer lists against the national NDNC registry before commercial outreach. Telecallers must strictly honor the "Customer Asked Not to Call" outcome, which automatically registers a permanent entry into `contact_suppressions`.

---

### 5. Verification & QA Checklist

- [x] **(a) Role Segregation:** Developer on Project A cannot see tasks or details of Project B; telecallers receive access-denied when navigating to `/portal/finance`.
- [x] **(b) CSV Import & Validation:** Uploaded CSV automatically parses columns; duplicates, invalid phone formats, and suppressed/DNC numbers are excluded with a downloadable skip report.
- [x] **(c) AI Sales Scripts:** Business types generate tailored scripts via AI Edge Function; Telecallers see only approved scripts in the chosen language (English, Tamil, Hindi, Telugu).
- [x] **(d) Function Privilege Guard:** Non-admin callers attempting to invoke `generate-scripts` or `create-user` are rejected with HTTP 403.
- [x] **(e) Concurrency & Anti-Repeat:** When 2 telecallers attempt to lock the same lead simultaneously, only 1 acquires the 20-min lock. Same-day second calls are rejected. "Not Interested" enforces a 90-day cooldown.
- [x] **(f) Project Brief to DoD Tasks:** Admin enters a project brief, clicks "Generate Plan with AI", reviews modules and acceptance criteria, and publishes to the project board.
- [x] **(g) Definition of Done:** Submissions with any unchecked DoD criteria are blocked from submission.
- [x] **(h) Finance TDS Calculations:** Vouchers calculate TDS deductions accurately (e.g., Gross ₹50,000 -> TDS ₹5,000 -> Net ₹45,000).
- [x] **(i) Zero Secret Leaks:** Static analysis and network inspection prove `AI_API_KEY` and service-role keys are never exposed in browser bundles or responses.
