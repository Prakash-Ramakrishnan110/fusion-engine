import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const ResetPasswordSchema = z.object({
  user_id: z.string().min(1, 'Target user ID or profile UUID is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters long').optional(),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verify caller is Super Admin
    const { user: adminUser } = await verifyAdminCaller(req);

    // 2. Validate input
    const body = await req.json();
    const validated = ResetPasswordSchema.parse({
      user_id: body.user_id || body.userId,
      new_password: body.new_password || body.newPassword,
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 3. Locate target user by UUID or by user_id
    let targetAuthId = validated.user_id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validated.user_id);

    if (!isUuid) {
      const { data: profile, error: findError } = await supabaseAdmin
        .from('profiles')
        .select('id, user_id')
        .eq('user_id', validated.user_id.toLowerCase())
        .single();

      if (findError || !profile) {
        return new Response(
          JSON.stringify({ error: `User with ID "${validated.user_id}" not found.` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      targetAuthId = profile.id;
    }

    // Generate random temporary password if not explicitly supplied
    const tempPassword = validated.new_password || `Temp@${Math.random().toString(36).substring(2, 8)}!2026`;

    // 4. Update password via Supabase Auth Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetAuthId, {
      password: tempPassword,
    });

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Force password change on next login
    await supabaseAdmin
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', targetAuthId);

    // 6. Audit entry
    await supabaseAdmin.from('audit_log').insert({
      actor_id: adminUser.id,
      action: 'PASSWORD_RESET_BY_ADMIN',
      entity_type: 'profiles',
      entity_id: targetAuthId,
      details: 'Admin reset password; user forced to change on login.',
    });

    return new Response(
      JSON.stringify({
        success: true,
        temporaryPassword: tempPassword,
        message: 'Password successfully reset. User must change password upon next login.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    const status = err.name === 'ZodError' ? 400 : err.message.includes('Forbidden') ? 403 : err.message.includes('Unauthorized') ? 401 : 500;
    return new Response(
      JSON.stringify({ error: err.message, details: err.errors }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
