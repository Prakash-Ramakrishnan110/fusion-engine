import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { verifyAdminCaller } from '../_shared/auth.ts';

const GeneratePlanSchema = z.object({
  brief_id: z.string().uuid().optional(),
  client_name: z.string().min(2),
  goal: z.string().min(10),
  features: z.array(z.string()).min(1),
  user_roles: z.array(z.string()).optional().default(['Customer', 'Admin', 'Staff']),
  tech_stack: z.string().optional().default('React, TypeScript, Supabase, PostgreSQL'),
  budget_inr: z.number().optional().default(250000),
  deadline: z.string().optional(),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user: adminUser } = await verifyAdminCaller(req);

    const body = await req.json();
    const validated = GeneratePlanSchema.parse(body);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // AI or standard structured engineering breakdown
    const proposedPlan = {
      modules: [
        {
          name: 'Core System Setup & Authentication Architecture',
          description: 'PostgreSQL schema, Supabase Auth, RBAC middleware, and base routing.',
          budget_weight_pct: 20,
          sort_order: 1,
        },
        {
          name: 'Primary Business Workflows & Data Models',
          description: 'Domain CRUD services, state machines, and relational queries.',
          budget_weight_pct: 30,
          sort_order: 2,
        },
        {
          name: 'Client Interface & Interactive Dashboard',
          description: 'Responsive user views, real-time status updates, and interactive forms.',
          budget_weight_pct: 30,
          sort_order: 3,
        },
        {
          name: 'Testing, Hardening & Staging Deployment',
          description: 'E2E test suite, performance tuning, and production CI/CD setup.',
          budget_weight_pct: 20,
          sort_order: 4,
        },
      ],
      milestones: [
        { name: 'Milestone 1: Architectural Blueprint & Schemas', percentage: 20 },
        { name: 'Milestone 2: Backend APIs & State Engine', percentage: 30 },
        { name: 'Milestone 3: Complete UI & Integration Workflows', percentage: 30 },
        { name: 'Milestone 4: Acceptance Testing & Production Handover', percentage: 20 },
      ],
      tasks: [
        {
          title: 'Implement PostgreSQL Migration & RLS Security Policies',
          module_index: 0,
          milestone_index: 0,
          description: 'Set up tables, relations, and strict Row-Level Security.',
          acceptance_criteria: 'All tables have RLS enabled and default deny for unauthorized roles.',
          estimated_hours: 16,
          priority: 'High',
        },
        {
          title: 'Build Core API Services & Realtime Channels',
          module_index: 1,
          milestone_index: 1,
          description: 'Develop transactional stored functions and WebSocket triggers.',
          acceptance_criteria: 'Automated tests verify real-time state broadcasts within 200ms.',
          estimated_hours: 24,
          priority: 'High',
        },
        {
          title: 'Design Responsive Client Interfaces & Forms',
          module_index: 2,
          milestone_index: 2,
          description: 'Implement modern React components with Zod validation.',
          acceptance_criteria: 'Forms validate user inputs with clear visual error states.',
          estimated_hours: 28,
          priority: 'Medium',
        },
        {
          title: 'Conduct E2E Playwright Suite & Performance Audits',
          module_index: 3,
          milestone_index: 3,
          description: 'Execute end-to-end user journeys and verify test coverage.',
          acceptance_criteria: 'All critical paths pass with zero console errors.',
          estimated_hours: 18,
          priority: 'High',
        },
      ],
      risks: [
        'Third-party payment gateway latency or downtime',
        'Complex state synchronization across concurrent mobile devices',
      ],
    };

    let briefId = validated.brief_id;
    if (briefId) {
      await supabaseAdmin.from('project_briefs').update({
        proposed_plan: proposedPlan,
        status: 'plan_generated',
      }).eq('id', briefId);
    } else {
      const { data: newBrief } = await supabaseAdmin.from('project_briefs').insert({
        client_name: validated.client_name,
        goal: validated.goal,
        features: validated.features,
        user_roles: validated.user_roles,
        tech_stack: validated.tech_stack,
        budget_inr: validated.budget_inr,
        proposed_plan: proposedPlan,
        status: 'plan_generated',
        created_by: adminUser.id,
      }).select().single();

      if (newBrief) {
        briefId = newBrief.id;
      }
    }

    return new Response(
      JSON.stringify({ success: true, brief_id: briefId, plan: proposedPlan }),
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
