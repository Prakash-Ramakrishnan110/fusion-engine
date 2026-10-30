-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - MASTER END-TO-END SUPABASE SYNC
-- Migration: 007_master_full_sync.sql
-- Description: Unifies database schemas with frontend and enables cloud persistence
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

-- 1. DAILY STANDUPS TABLE
CREATE TABLE IF NOT EXISTS public.daily_standups (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    project_name TEXT,
    developer_id TEXT,
    developer_name TEXT,
    completed_today TEXT NOT NULL,
    planned_tomorrow TEXT NOT NULL,
    blockers TEXT,
    has_blocker BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.daily_standups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "daily_standups_all" ON public.daily_standups;
CREATE POLICY "daily_standups_all" ON public.daily_standups FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 1a. CLIENTS TABLE (Add missing portal fields)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'city') THEN
        ALTER TABLE public.clients ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'industry') THEN
        ALTER TABLE public.clients ADD COLUMN industry TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'status') THEN
        ALTER TABLE public.clients ADD COLUMN status TEXT DEFAULT 'Active';
    END IF;
END $$;

-- 2. LEADS TABLE (Add missing CRM fields)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'lead_score') THEN
        ALTER TABLE public.leads ADD COLUMN lead_score INT DEFAULT 50;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'lead_value') THEN
        ALTER TABLE public.leads ADD COLUMN lead_value NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'pain_points') THEN
        ALTER TABLE public.leads ADD COLUMN pain_points TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'decision_maker_confirmed') THEN
        ALTER TABLE public.leads ADD COLUMN decision_maker_confirmed BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'next_callback_at') THEN
        ALTER TABLE public.leads ADD COLUMN next_callback_at TIMESTAMPTZ;
    END IF;
END $$;

-- 3. DOCUMENTS TABLE (Add compliance and legal fields)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'reference_code') THEN
        ALTER TABLE public.documents ADD COLUMN reference_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'compliance_standard') THEN
        ALTER TABLE public.documents ADD COLUMN compliance_standard TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_format') THEN
        ALTER TABLE public.documents ADD COLUMN file_format TEXT DEFAULT 'PDF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'description') THEN
        ALTER TABLE public.documents ADD COLUMN description TEXT;
    END IF;
END $$;

ALTER TABLE public.documents ALTER COLUMN file_path DROP NOT NULL;
ALTER TABLE public.documents ALTER COLUMN uploaded_by DROP NOT NULL;

-- Drop the restrictive category CHECK so portal can store 'other' for agreements
-- (The portal sends category: 'other' for signed agreements)
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_category_check;

-- Drop the existing uploaded_by FK (references profiles) to allow null / text IDs
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_uploaded_by_fkey;

-- 4. OPEN ROW LEVEL SECURITY (RLS) FOR FULL PORTAL ACCESS
-- Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients_all" ON public.clients;
CREATE POLICY "clients_all" ON public.clients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Projects, Modules, Members & Milestones
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_all" ON public.projects;
CREATE POLICY "projects_all" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.project_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "project_modules_all" ON public.project_modules;
CREATE POLICY "project_modules_all" ON public.project_modules FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "project_members_all" ON public.project_members;
CREATE POLICY "project_members_all" ON public.project_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "milestones_all" ON public.milestones;
CREATE POLICY "milestones_all" ON public.milestones FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Tasks & Deliverables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tasks_all" ON public.tasks;
CREATE POLICY "tasks_all" ON public.tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "task_submissions_all" ON public.task_submissions;
CREATE POLICY "task_submissions_all" ON public.task_submissions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.task_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "task_reviews_all" ON public.task_reviews;
CREATE POLICY "task_reviews_all" ON public.task_reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "task_comments_all" ON public.task_comments;
CREATE POLICY "task_comments_all" ON public.task_comments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Leads & CRM Activities
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_all" ON public.leads;
CREATE POLICY "leads_all" ON public.leads FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lead_activities_all" ON public.lead_activities;
CREATE POLICY "lead_activities_all" ON public.lead_activities FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Vouchers & Finance
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vouchers_all" ON public.vouchers;
CREATE POLICY "vouchers_all" ON public.vouchers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Documents Vault
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "documents_all" ON public.documents;
CREATE POLICY "documents_all" ON public.documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_all" ON public.notifications;
CREATE POLICY "notifications_all" ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Confirmation query to verify status
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_name ASC;

