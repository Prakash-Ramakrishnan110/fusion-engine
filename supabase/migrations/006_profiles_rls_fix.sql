-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - SUPABASE PROFILES PERMISSION & SEED
-- Migration: 006_profiles_rls_fix.sql
-- Description: Enables Admin & Portal to create/store user profiles in Supabase
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

-- 1. Ensure RLS allows inserting and updating profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- Anyone authenticated or portal admin can read profiles
CREATE POLICY "profiles_select" 
    ON public.profiles FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- Allow portal and admin to create workforce / team profiles
CREATE POLICY "profiles_insert" 
    ON public.profiles FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Allow portal and admin to update profiles
CREATE POLICY "profiles_update" 
    ON public.profiles FOR UPDATE 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- Allow admin to remove deactivated profiles
CREATE POLICY "profiles_delete" 
    ON public.profiles FOR DELETE 
    TO anon, authenticated 
    USING (true);

-- 2. Allow developer details (bank/UPI) management
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

-- 3. Seed Prakash Ramakrishnan as Founder & Super Admin in Supabase profiles
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

-- 4. Confirm profiles table contents
SELECT id, user_id, full_name, role, department, is_active FROM public.profiles;
