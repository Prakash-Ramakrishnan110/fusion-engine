import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const SetUserActiveSchema = z.object({
  profile_id: z.string().uuid('Valid profile UUID required'),
  is_active: z.boolean(),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user: adminUser } = await verifyAdminCaller(req);

    const body = await req.json();
    const validated = SetUserActiveSchema.parse({
      profile_id: body.profile_id || body.profileId,
      is_active: body.is_active !== undefined ? body.is_active : body.isActive,
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Update profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: validated.is_active })
      .eq('id', validated.profile_id);

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Write audit log
    await supabaseAdmin.from('audit_log').insert({
      actor_id: adminUser.id,
      action: validated.is_active ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entity_type: 'profiles',
      entity_id: validated.profile_id,
      after: { is_active: validated.is_active },
    });

    return new Response(
      JSON.stringify({ success: true, is_active: validated.is_active }),
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
