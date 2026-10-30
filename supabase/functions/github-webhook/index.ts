import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload = await req.json();
    const event = req.headers.get('x-github-event');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    if (event === 'check_suite' || event === 'check_run') {
      const commitSha = payload.check_run?.head_sha || payload.check_suite?.head_sha;
      const conclusion = payload.check_run?.conclusion || payload.check_suite?.conclusion; // 'success', 'failure'

      if (commitSha) {
        const ciStatus = conclusion === 'success' ? 'passed' : conclusion === 'failure' ? 'failed' : 'pending';

        await supabaseAdmin
          .from('task_submissions')
          .update({ ci_status: ciStatus })
          .ilike('commit_hash', `${commitSha.slice(0, 7)}%`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
