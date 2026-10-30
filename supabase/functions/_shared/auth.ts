// supabase/functions/_shared/auth.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AdminCaller {
  user: any;
  profile: {
    id: string;
    user_id: string;
    role: string;
    full_name: string;
  };
}

export const verifyAdminCaller = async (req: Request): Promise<AdminCaller> => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    throw new Error('Invalid or missing Bearer token');
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    throw new Error('Unauthorized: Invalid JWT token');
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, user_id, role, full_name, is_active')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Profile not found for authenticated user');
  }

  if (!profile.is_active) {
    throw new Error('Account deactivated by administrator');
  }

  if (profile.role !== 'admin') {
    throw new Error('Forbidden: Super Admin privilege required for this action');
  }

  return { user, profile };
};
