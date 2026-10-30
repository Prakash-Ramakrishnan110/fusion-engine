-- ==============================================================================
-- FUSION ENGINE TECHNOLOGY - SUPABASE NOTIFICATIONS OPTIMIZATION
-- Migration: 005_notifications_optimization.sql
-- Description: Optimizes notifications table for broadcast alerts and real-time syncing
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/wpmfpyjwyzawwwtvwlot/sql
-- ==============================================================================

-- 1. Ensure notifications table exists
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    category TEXT DEFAULT 'system',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Allow user_id to be NULL for broadcast / general admin alerts
ALTER TABLE public.notifications ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add category column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.notifications ADD COLUMN category TEXT DEFAULT 'system';
    END IF;
END $$;

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications (user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications (created_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow delete notifications" ON public.notifications;

CREATE POLICY "Allow select notifications"
    ON public.notifications FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert notifications"
    ON public.notifications FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update notifications"
    ON public.notifications FOR UPDATE
    TO anon, authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete notifications"
    ON public.notifications FOR DELETE
    TO anon, authenticated
    USING (true);
