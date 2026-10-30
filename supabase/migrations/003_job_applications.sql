-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - SUPABASE DATABASE MIGRATION
-- Migration: 003_job_applications.sql
-- Description: Central table for job applications, hiring pipeline, and digital agreements
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.job_applications (
    id TEXT PRIMARY KEY,
    reference_code TEXT NOT NULL UNIQUE,
    role_id TEXT NOT NULL,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'engineering',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    portfolio_url TEXT,
    expected_compensation TEXT,
    experience_summary TEXT,
    resume_file_name TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    last_email_sent_at TIMESTAMPTZ,
    last_email_type TEXT,
    agreement_signed_at TIMESTAMPTZ,
    agreement_signature TEXT,
    agreement_signer_ip TEXT,
    agreement_terms_accepted BOOLEAN DEFAULT false,
    agreement_affirmation_word TEXT,
    agreement_status TEXT NOT NULL DEFAULT 'pending',
    agreement_rejected_at TIMESTAMPTZ,
    agreement_rejection_reason TEXT,
    agreement_rejection_notes TEXT,
    agreement_document_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Optimization indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_ref ON public.job_applications (reference_code);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON public.job_applications (email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications (status);
CREATE INDEX IF NOT EXISTS idx_job_applications_submitted ON public.job_applications (submitted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can submit applications" ON public.job_applications;
DROP POLICY IF EXISTS "Public and candidates can read applications" ON public.job_applications;
DROP POLICY IF EXISTS "Public and candidates can update agreements" ON public.job_applications;
DROP POLICY IF EXISTS "Allow all delete on applications" ON public.job_applications;

-- Policy 1: Anyone can apply from the careers page
CREATE POLICY "Public can submit applications"
    ON public.job_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy 2: Candidates and Portal admins can view applications
CREATE POLICY "Public and candidates can read applications"
    ON public.job_applications
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy 3: Candidates can update their digital signature and admins can update status
CREATE POLICY "Public and candidates can update agreements"
    ON public.job_applications
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Admins can remove applications
CREATE POLICY "Allow all delete on applications"
    ON public.job_applications
    FOR DELETE
    TO anon, authenticated
    USING (true);
