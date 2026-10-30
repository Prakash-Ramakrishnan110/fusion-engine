import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { supabase } from '@/lib/supabase';
import {
  FileCode,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Send,
  Building,
  Target,
  Code2,
  Calendar,
  DollarSign,
  ShieldAlert,
  Save,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface GeneratedModule {
  name: string;
  description: string;
  tasks: Array<{
    title: string;
    description: string;
    user_story: string;
    acceptance_criteria: string[];
    technical_notes: string;
    estimated_hours: number;
    dependencies: string[];
  }>;
}

export const ProjectBriefsPage: React.FC = () => {
  const { projects, refreshData } = usePortal();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [features, setFeatures] = useState<string>('');
  const [techStack, setTechStack] = useState<string>('React, TypeScript, Vite, Supabase, TailwindCSS');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(4);
  const [budgetInr, setBudgetInr] = useState<number>(150000);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Generated Plan Proposal
  const [proposedModules, setProposedModules] = useState<GeneratedModule[]>([]);
  const [proposedRisks, setProposedRisks] = useState<string[]>([]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const first = projects[0];
      setSelectedProjectId(first.id);
      setClientName(first.clientName || 'Gourmet Cloud Kitchens Pvt Ltd');
      if (!goal) {
        setGoal(first.description || 'Full-stack Restaurant ERP & POS Engine for multi-outlet operations.');
      }
      if (!features) {
        setFeatures('Real-time Table Reservation & QR Ordering\nCloud Kitchen KDS (Kitchen Display System)\nInventory Stock Alerts & Automated Purchase Orders\nLoyalty Program & SMS Marketing Integration\nDaily Sales Analytics & Z-Report Export');
      }
    }
  }, [projects]);

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !features.trim()) {
      toast.error('Please provide project goals and key features');
      return;
    }

    setIsGenerating(true);
    toast.info('Calling AI Edge Function to generate modular development plan...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await supabase.functions.invoke('generate-project-plan', {
        body: {
          project_id: selectedProjectId,
          client_name: clientName,
          goal,
          features: features.split('\n').filter(f => f.trim()),
          tech_stack: techStack.split(',').map(s => s.trim()),
          timeline_weeks: Number(timelineWeeks),
          budget_inr: Number(budgetInr)
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.error) {
        throw new Error(response.error.message || 'Generation failed');
      }

      const plan = response.data?.plan;
      if (plan && plan.modules) {
        setProposedModules(plan.modules);
        setProposedRisks(plan.risks || []);
        toast.success(`Generated ${plan.modules.length} modules and ${plan.modules.reduce((acc: number, m: any) => acc + (m.tasks?.length || 0), 0)} tasks!`);
      }
    } catch (err: any) {
      toast.error('AI Edge error: ' + err.message);
      // Fallback proposal
      setProposedModules([
        {
          name: 'Core Authentication & RBAC',
          description: 'Secure Supabase Auth with RLS, profiles, and team management',
          tasks: [
            {
              title: 'Setup Supabase Auth & Multi-tenant Profiles',
              description: 'Implement JWT verification and profile triggers',
              user_story: 'As a user, I need secure authentication with role enforcement.',
              acceptance_criteria: ['JWT verified', 'RLS policies enforced', 'No privilege escalation'],
              technical_notes: 'Use profiles table with protect_profile_fields trigger',
              estimated_hours: 12,
              dependencies: []
            },
            {
              title: 'Role-based Navigation & Route Guards',
              description: 'Ensure telecallers cannot access finance and developers see assigned projects',
              user_story: 'As an admin, I want strict role segregation across routes.',
              acceptance_criteria: ['Route guards active', 'Forbidden redirects to /portal'],
              technical_notes: 'Verify in PortalRoot and PortalSidebar',
              estimated_hours: 8,
              dependencies: ['Setup Supabase Auth & Multi-tenant Profiles']
            }
          ]
        },
        {
          name: 'Main Business Logic & Workflows',
          description: 'Key deliverables based on client requirements',
          tasks: [
            {
              title: 'Implement Core Data Tables & RLS Policies',
              description: 'Normalized database schema with audit trail',
              user_story: 'As a developer, I need standard tables for business transactions.',
              acceptance_criteria: ['Tables created via migrations', 'Indexes added', 'Tests pass'],
              technical_notes: 'Add to supabase/migrations/002_*.sql',
              estimated_hours: 16,
              dependencies: ['Role-based Navigation & Route Guards']
            }
          ]
        }
      ]);
      setProposedRisks([
        'Third-party API rate limits during peak usage',
        'Complex client approval cycles on user-facing design system'
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPlan = async () => {
    if (!selectedProjectId) {
      toast.error('Please select an active project to publish to');
      return;
    }
    if (proposedModules.length === 0) {
      toast.error('Please generate a plan before publishing');
      return;
    }

    setIsPublishing(true);
    try {
      // Create tasks on the selected project
      let createdCount = 0;
      for (const mod of proposedModules) {
        for (const t of mod.tasks) {
          const { error } = await supabase.from('tasks').insert([
            {
              project_id: selectedProjectId,
              title: `[${mod.name}] ${t.title}`,
              description: `${t.description}\n\nUser Story: ${t.user_story}\n\nTechnical Notes: ${t.technical_notes}`,
              acceptance_criteria: t.acceptance_criteria.join('\n- '),
              estimated_hours: t.estimated_hours,
              status: 'assigned',
              priority: 'High'
            }
          ]);
          if (!error) createdCount++;
        }
      }

      toast.success(`Published ${createdCount} tasks to project board!`);
      refreshData();
      setProposedModules([]);
      setProposedRisks([]);
    } catch (err: any) {
      toast.error('Publish error: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Project Brief & AI Plan Publisher</h1>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Phase E1 Standard</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Intake structured client briefs and transform them into standardized modules, user stories, acceptance criteria, and Definition-of-Done tasks.
          </p>
        </div>

        {proposedModules.length > 0 && (
          <Button
            onClick={handlePublishPlan}
            disabled={isPublishing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {isPublishing ? 'Publishing to Tasks Board...' : 'Publish Plan to Board'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intake Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Project Intake Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedProjectId(newId);
                    const match = projects.find(p => p.id === newId);
                    if (match) {
                      setClientName(match.clientName || '');
                      if (match.description) {
                        setGoal(match.description);
                      }
                      toast.info(`Switched target project to: ${match.name}`);
                    }
                  }}
                  className="w-full text-xs h-9 rounded-md border border-border/40 bg-background px-3 font-medium text-foreground focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">-- Choose Target Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.clientName || 'General Client'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Client / Sponsor
                </label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Nexus FinTech Pvt Ltd"
                  className="text-xs h-9 bg-background/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Primary Objective / Goal
                </label>
                <Textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Build a multi-tenant subscription billing portal with payment gateway..."
                  className="text-xs min-h-[70px] bg-background/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Key Features & Deliverables (One per line)
                </label>
                <Textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="User registration & KYC&#10;Razorpay subscription recurring debit&#10;Invoicing & GST PDF generation"
                  className="text-xs min-h-[90px] font-mono bg-background/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Timeline (Weeks)
                  </label>
                  <Input
                    type="number"
                    value={timelineWeeks}
                    onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                    className="text-xs h-9 bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Budget (INR)
                  </label>
                  <Input
                    type="number"
                    value={budgetInr}
                    onChange={(e) => setBudgetInr(Number(e.target.value))}
                    className="text-xs h-9 bg-background/50"
                  />
                </div>
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 gap-2 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isGenerating ? 'AI Generating Plan...' : 'Generate Plan with AI'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated Plan Preview */}
        <div className="lg:col-span-7 space-y-4">
          {proposedModules.length === 0 ? (
            <div className="p-12 rounded-xl border border-dashed border-border/60 bg-muted/10 text-center flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-muted-foreground">No plan generated yet</p>
              <p className="text-xs text-muted-foreground/60 max-w-sm">
                Fill in the project brief on the left and click "Generate Plan with AI" to propose standardized modules, tasks, and acceptance criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Proposed Architecture ({proposedModules.length} Modules)
                </span>
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400">
                  Ready for Admin Review
                </Badge>
              </div>

              {proposedModules.map((mod, mIdx) => (
                <Card key={mIdx} className="border-border/40 bg-card/60 shadow-sm">
                  <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-semibold text-foreground">
                        Module {mIdx + 1}: {mod.name}
                      </CardTitle>
                      <CardDescription className="text-[11px]">{mod.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {mod.tasks?.length || 0} Tasks
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {mod.tasks?.map((task, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-lg border border-border/40 bg-muted/10 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground">{task.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                            {task.estimated_hours} hrs
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{task.description}</p>
                        <div className="pt-2 border-t border-border/20">
                          <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                            Acceptance Criteria:
                          </span>
                          <ul className="list-disc list-inside text-[10px] text-muted-foreground space-y-0.5">
                            {task.acceptance_criteria?.map((crit, cIdx) => (
                              <li key={cIdx}>{crit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {proposedRisks.length > 0 && (
                <Card className="border-amber-500/30 bg-amber-950/10">
                  <CardContent className="p-4 space-y-1.5 text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Identified Technical & Schedule Risks
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/80">
                      {proposedRisks.map((risk, rIdx) => (
                        <li key={rIdx}>{risk}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBriefsPage;
