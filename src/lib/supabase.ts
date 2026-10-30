import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';
export type { Database };

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co').trim();
// Strip trailing slashes and redundant /rest/v1 paths
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-placeholder-anon-key').trim();

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://demo-placeholder.supabase.co'
  );
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Maps a plain User ID (e.g. "admin", "rohan", "priya") to internal portal email format
 */
export const formatPortalEmail = (userIdOrEmail: string): string => {
  const trimmed = userIdOrEmail.trim().toLowerCase();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  return `${trimmed}@portal.internal`;
};

/**
 * Extracts plain User ID from email (e.g. "admin@portal.internal" -> "admin")
 */
export const extractUserIdFromEmail = (email: string): string => {
  if (email.endsWith('@portal.internal')) {
    return email.replace('@portal.internal', '');
  }
  return email;
};
