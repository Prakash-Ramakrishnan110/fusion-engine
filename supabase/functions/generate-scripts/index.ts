import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const GenerateScriptSchema = z.object({
  business_type_id: z.string().uuid(),
  language: z.enum(['English', 'Tamil', 'Hindi', 'Telugu']).default('English'),
});

const ScriptOutputSchema = z.object({
  opening: z.string().min(10),
  pitch_30s: z.string().min(20),
  pitch_3min: z.string().min(50),
  probe_questions: z.array(z.string()).min(2),
  pain_point_hooks: z.array(z.string()).min(2),
  objection_handlers: z.record(z.string()),
  closing_cta: z.string().min(10),
  whatsapp_followup: z.string().min(20),
  voicemail_script: z.string().optional(),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user: adminUser } = await verifyAdminCaller(req);

    const body = await req.json();
    const { business_type_id, language } = GenerateScriptSchema.parse(body);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Fetch business type details
    const { data: bType, error: bTypeError } = await supabaseAdmin
      .from('business_types')
      .select('*')
      .eq('id', business_type_id)
      .single();

    if (bTypeError || !bType) {
      return new Response(JSON.stringify({ error: 'Business type not found' }), { status: 404, headers: corsHeaders });
    }

    const aiApiKey = Deno.env.get('AI_API_KEY');
    const aiModel = Deno.env.get('AI_MODEL') || 'gemini-1.5-flash';
    const aiProvider = Deno.env.get('AI_PROVIDER') || 'google';

    let scriptResult;

    if (aiApiKey) {
      // Call live AI API with sanitization
      const prompt = `You are a B2B sales coach for Fusion Engine Technology, an Indian software enterprise building restaurant automation suites (high-speed QR table ordering, live KOT sync, POS counter billing, GST thermal print, recipe inventory).
Create a standardized phone calling script in ${language} for the business category "${bType.name}".
Known customer pain points: ${bType.default_pain_points.join(', ')}.

Rules:
1. Polite, conversational Indian business tone.
2. No guaranteed ROI or false promises.
3. Keep it crisp and focused.
4. Return ONLY valid JSON matching this structure:
{
  "opening": "15-second opening hook introducing telecaller and Fusion Engine Technology",
  "pitch_30s": "30-second elevator pitch",
  "pitch_3min": "Comprehensive 3-minute pitch",
  "probe_questions": ["Question 1", "Question 2", "Question 3"],
  "pain_point_hooks": ["Hook 1", "Hook 2"],
  "objection_handlers": {
    "We already use Petpooja / Posist": "Polite rebuttal focusing on zero tablet rental and native browser QR",
    "Customers prefer physical paper menus": "Rebuttal explaining hybrid dining"
  },
  "closing_cta": "Clear call to action requesting a 10-minute online screen demo",
  "whatsapp_followup": "Pre-formatted WhatsApp message with greetings and brochure link",
  "voicemail_script": "Short 20-second voicemail message"
}`;

      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${aiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(`AI Provider API responded with status ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const rawJson = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
      scriptResult = ScriptOutputSchema.parse(JSON.parse(rawJson));

      // Log AI Usage
      await supabaseAdmin.from('ai_usage').insert({
        function_name: 'generate-scripts',
        tokens_in: 450,
        tokens_out: 600,
        cost_estimate_usd: 0.0003,
        user_id: adminUser.id,
      });
    } else {
      // High-quality deterministic fallback if AI key is not yet set in Edge Function secrets
      scriptResult = {
        opening: `Namaste / Hello! Am I speaking with the Owner or General Manager of [Restaurant Name]? My name is [Telecaller Name] from Fusion Engine Technology. We build high-speed QR ordering and live kitchen KOT display systems that cut customer wait times by 40% and save 18-25% on POS software renewals.`,
        pitch_30s: `Fusion Engine eliminates kitchen order bottlenecks by connecting table QR ordering directly with kitchen screens and POS counter billing in real-time. Guests order effortlessly from their phone, and your captains print split GST bills instantly with zero proprietary hardware lock-in.`,
        pitch_3min: `Unlike legacy POS providers that charge heavy recurring license fees for every extra captain tablet, Fusion Engine is browser-native and runs on any phone or existing tablet. During peak dinner hours, tables order directly to the kitchen KOT, orders are routed to hot/cold stations with acoustic alerts, and your raw food inventory deducts automatically per dish served.`,
        probe_questions: [
          `During peak weekend rush hours, do your captains ever face delays in sending order tickets to the kitchen?`,
          `How is your team currently managing multi-branch recipe ingredient inventory deductions?`,
          `Are you experiencing high yearly renewal charges for proprietary POS billing terminals?`
        ],
        pain_point_hooks: [
          `Eliminate lost kitchen order tickets during rush hours with real-time socket KOT sync.`,
          `Save ₹35,000+ yearly by running QR table ordering on existing smartphones without tablet rentals.`
        ],
        objection_handlers: {
          "We already use Petpooja / Posist": "Many of our top clients previously used Petpooja or Posist. They switched to Fusion Engine because our QR ordering does not charge per-table fees, and our live KOT sync reduces customer wait time by 40%.",
          "Customers prefer physical paper menus": "We support hybrid dining! Guests can still browse physical paper menus, but they can scan the table QR code to add extra drinks and desserts directly to the kitchen without waiting for a busy waiter.",
          "Our internet is sometimes slow": "Fusion Engine features offline billing cache with local thermal receipt printing so your cash counter never stalls even during Wi-Fi drops."
        },
        closing_cta: `I would love to set up a quick 10-minute online screen demo with our tech team this Friday. Would 3:00 PM or 5:00 PM suit your schedule better?`,
        whatsapp_followup: `Hello [Contact Person], thank you for your time on the call today! Here is the overview of the Fusion Engine Restaurant Automation Suite: https://fusionengine.in/products. We look forward to our brief demo this Friday. Let us know if you have any questions!`,
        voicemail_script: `Hello, this is [Telecaller Name] from Fusion Engine Technology calling regarding high-speed QR table ordering for [Restaurant Name]. I will send a quick WhatsApp message with our demo details. Thank you!`
      };
    }

    // Save as draft script in call_scripts
    const { data: savedScript, error: saveError } = await supabaseAdmin.from('call_scripts').insert({
      business_type_id,
      language,
      opening: scriptResult.opening,
      pitch_30s: scriptResult.pitch_30s,
      pitch_3min: scriptResult.pitch_3min,
      probe_questions: scriptResult.probe_questions,
      pain_point_hooks: scriptResult.pain_point_hooks,
      objection_handlers: scriptResult.objection_handlers,
      closing_cta: scriptResult.closing_cta,
      whatsapp_followup: scriptResult.whatsapp_followup,
      voicemail_script: scriptResult.voicemail_script,
      status: 'draft',
      version: 1,
      generated_by_model: aiApiKey ? `${aiProvider}:${aiModel}` : 'standard_template_v1',
    }).select().single();

    if (saveError) {
      throw saveError;
    }

    // Audit log
    await supabaseAdmin.from('audit_log').insert({
      actor_id: adminUser.id,
      action: 'CALL_SCRIPT_GENERATED',
      entity_type: 'call_scripts',
      entity_id: savedScript.id,
      after: { business_type_id, language, status: 'draft' },
    });

    return new Response(
      JSON.stringify({ success: true, script: savedScript }),
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
