import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const CreateUserSchema = z.object({
  user_id: z.string().min(2).max(50).regex(/^[a-zA-Z0-9._-]+$/, 'User ID can only contain letters, numbers, periods, hyphens, and underscores'),
  full_name: z.string().min(2).max(100),
  role: z.enum(['admin', 'developer', 'telecaller']),
  department: z.string().optional().default('Engineering'),
  team_id: z.string().uuid().optional().nullable(),
  temp_password: z.string().min(8, 'Password must be at least 8 characters long'),
  phone: z.string().optional().nullable(),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verify caller is verified Super Admin server-side
    const { user: adminUser } = await verifyAdminCaller(req);

    // 2. Validate input payload with Zod
    const body = await req.json();
    const validated = CreateUserSchema.parse({
      user_id: body.user_id || body.userId,
      full_name: body.full_name || body.fullName,
      role: body.role,
      department: body.department,
      team_id: body.team_id || body.teamId,
      temp_password: body.temp_password || body.temporaryPassword,
      phone: body.phone,
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const internalEmail = `${validated.user_id.toLowerCase()}@portal.internal`;

    // 3. Create user in auth.users
    const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: validated.temp_password,
      email_confirm: true,
      user_metadata: {
        user_id: validated.user_id.toLowerCase(),
        full_name: validated.full_name,
        role: validated.role,
      },
    });

    if (createError || !newAuthUser.user) {
      return new Response(
        JSON.stringify({ error: createError?.message || 'Failed to create user in auth' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Upsert Profile
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: newAuthUser.user.id,
      user_id: validated.user_id.toLowerCase(),
      full_name: validated.full_name,
      role: validated.role,
      department: validated.department,
      team_id: validated.team_id || null,
      phone: validated.phone || null,
      is_active: true,
      must_change_password: true,
    });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. If Developer, insert developer_details record
    if (validated.role === 'developer') {
      await supabaseAdmin.from('developer_details').insert({
        profile_id: newAuthUser.user.id,
        skills: [],
      });
    }

    // 6. Log in Audit Trail
    await supabaseAdmin.from('audit_log').insert({
      actor_id: adminUser.id,
      action: 'USER_PROVISIONED',
      entity_type: 'profiles',
      entity_id: newAuthUser.user.id,
      after: {
        user_id: validated.user_id.toLowerCase(),
        full_name: validated.full_name,
        role: validated.role,
        department: validated.department,
        team_id: validated.team_id,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newAuthUser.user.id,
        login_id: validated.user_id.toLowerCase(),
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
