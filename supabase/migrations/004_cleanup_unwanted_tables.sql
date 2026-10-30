-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - SUPABASE CLEANUP MIGRATION
-- Migration: 004_cleanup_unwanted_tables.sql
-- Description: Drops unused / redundant enterprise placeholder tables from Supabase.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

-- 1. Unused sales & telecalling experiment tables
DROP TABLE IF EXISTS public.qualification_requests CASCADE;
DROP TABLE IF EXISTS public.lead_script_overrides CASCADE;
DROP TABLE IF EXISTS public.sales_scripts CASCADE;
DROP TABLE IF EXISTS public.call_rules CASCADE;
DROP TABLE IF EXISTS public.call_targets CASCADE;
DROP TABLE IF EXISTS public.import_batches CASCADE;
DROP TABLE IF EXISTS public.contact_suppressions CASCADE;

-- 2. Unused commission calculation tables (calculated dynamically in code)
DROP TABLE IF EXISTS public.commissions CASCADE;
DROP TABLE IF EXISTS public.commission_rules CASCADE;

-- 3. Unused workspace & team placeholder tables
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.ai_usage CASCADE;
DROP TABLE IF EXISTS public.project_briefs CASCADE;
DROP TABLE IF EXISTS public.engineering_standards CASCADE;

-- Confirmation query to view the remaining clean, essential tables
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_name ASC;
