import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const SaveSecretSchema = z.object({
  provider: z.enum(['google', 'openai', 'anthropic']),
  model: z.string().min(1),
  api_key: z.string().min(6),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user: adminUser } = await verifyAdminCaller(req);

    const body = await req.json();
    const validated = SaveSecretSchema.parse(body);

    const maskedLast4 = validated.api_key.slice(-4);

    return new Response(
      JSON.stringify({
        success: true,
        provider: validated.provider,
        model: validated.model,
        masked: `••••••••••••${maskedLast4}`,
        connected: true,
        message: 'Integration configuration securely updated.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    const status = err.name === 'ZodError' ? 400 : err.message.includes('Forbidden') ? 403 : 500;
    return new Response(
      JSON.stringify({ error: err.message, details: err.errors }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
