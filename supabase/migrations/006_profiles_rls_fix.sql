-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - SUPABASE PROFILES FIX
-- Migration: 006_profiles_rls_fix.sql
-- Description: Unlinks strict auth.users foreign key to allow direct portal profile creation & seeds Founder
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

-- 1. Drop the strict auth.users foreign key constraint that was blocking inserts
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Set default UUID generator if not already set
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Configure Row Level Security (RLS) policies for full Portal access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

CREATE POLICY "profiles_select" 
    ON public.profiles FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "profiles_insert" 
    ON public.profiles FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

CREATE POLICY "profiles_update" 
    ON public.profiles FOR UPDATE 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "profiles_delete" 
    ON public.profiles FOR DELETE 
    TO anon, authenticated 
    USING (true);

-- 3. Configure developer details (bank/UPI) RLS policies
ALTER TABLE public.developer_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dev_details_admin" ON public.developer_details;
DROP POLICY IF EXISTS "dev_details_self" ON public.developer_details;
DROP POLICY IF EXISTS "dev_details_update_self" ON public.developer_details;
DROP POLICY IF EXISTS "dev_details_all" ON public.developer_details;

CREATE POLICY "dev_details_all" 
    ON public.developer_details FOR ALL 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- 4. Seed Founder & Super Admin profile (Prakash Ramakrishnan)
INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    role,
    department,
    phone,
    is_active,
    must_change_password
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'prakash.r',
    'Prakash Ramakrishnan',
    'admin',
    'Executive Leadership',
    '+917418132954',
    true,
    false
) ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    is_active = true,
    must_change_password = false;

-- 5. Confirm profiles table contents
SELECT id, user_id, full_name, role, department, is_active FROM public.profiles;
