import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FolderKanban,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  UtensilsCrossed,
  DollarSign,
  Users2,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillClient?: {
    name: string;
    contactPerson: string;
    phone: string;
    email?: string;
  };
}

export const ProjectWizardModal: React.FC<ProjectWizardModalProps> = ({
  isOpen,
  onClose,
  prefillClient,
}) => {
  const { templates, users, createProjectFromWizard } = usePortal();

  // Wizard Step (1 to 6)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basics
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState(prefillClient?.name || '');
  const [contactPerson, setContactPerson] = useState(prefillClient?.contactPerson || '');
  const [phone, setPhone] = useState(prefillClient?.phone || '');
  const [email, setEmail] = useState(prefillClient?.email || '');
  const [projectType, setProjectType] = useState<'client' | 'internal'>('client');
  const [contractValue, setContractValue] = useState(250000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');

  // Step 2: Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template_restaurant');

  // Step 3: Modules (with budget weights that must total 100%)
  const [modules, setModules] = useState<
    Array<{ name: string; description: string; budgetWeightPct: number }>
  >([
    {
      name: 'Restaurant Onboarding & Multi-Branch Catalog',
      description: 'Branch setup, tax configs, menu categories',
      budgetWeightPct: 15,
    },
    {
      name: 'QR-Code Table Ordering & Guest Self-Service',
      description: 'Dynamic encrypted table QR, digital menu, mobile order queue',
      budgetWeightPct: 20,
    },
    {
      name: 'Kitchen Order Ticket (KOT) Real-Time Sync',
      description: 'Live socket kitchen display, station routing, acoustic alerts',
      budgetWeightPct: 20,
    },
    {
      name: 'POS Counter Billing & GST Thermal Invoicing',
      description: 'Split billing, CGST/SGST calculations, thermal 80mm ESC/POS print',
      budgetWeightPct: 20,
    },
    {
      name: 'Table Reservations & Dynamic Floorplan Map',
      description: 'Seating grid layout, slot reservation manager',
      budgetWeightPct: 10,
    },
    {
      name: 'Inventory Control & Recipe Ingredient Tracking',
      description: 'Raw ingredient deductions per dish served, low-stock reorder',
      budgetWeightPct: 15,
    },
  ]);

  // Step 4: Milestones (percentage must total 100%)
  const [milestones, setMilestones] = useState<
    Array<{ name: string; percentage: number; dueDate: string }>
  >([
    { name: 'Milestone 1: Architecture, UI/UX & DB Schema', percentage: 20, dueDate: '2026-03-20' },
    { name: 'Milestone 2: Backend REST/GraphQL APIs & Auth', percentage: 30, dueDate: '2026-04-15' },
    { name: 'Milestone 3: Frontend Implementation & Workflows', percentage: 30, dueDate: '2026-05-20' },
    { name: 'Milestone 4: E2E Testing, CI/CD & Handover', percentage: 20, dueDate: '2026-06-30' },
  ]);

  // Step 5: Team Members
  const [members, setMembers] = useState<
    Array<{
      profileId: string;
      projectRole: 'tech_lead' | 'developer' | 'qa';
      payModel: 'per_task' | 'per_module' | 'milestone_share' | 'hourly';
      rate: number;
      allocationPct: number;
    }>
  >(() => {
    const dev = users.find((u) => u.role === 'developer');
    const admin = users.find((u) => u.role === 'admin' || u.role === 'super_admin');
    return [
      {
        profileId: admin?.id || 'admin_id',
        projectRole: 'tech_lead',
        payModel: 'milestone_share',
        rate: 0,
        allocationPct: 50,
      },
      {
        profileId: dev?.id || 'dev_id',
        projectRole: 'developer',
        payModel: 'milestone_share',
        rate: 75000,
        allocationPct: 100,
      },
    ];
  });

  // Calculations & Validations
  const totalModuleWeight = modules.reduce((acc, m) => acc + (Number(m.budgetWeightPct) || 0), 0);
  const totalMilestonePct = milestones.reduce((acc, m) => acc + (Number(m.percentage) || 0), 0);

  const isModuleTotalValid = totalModuleWeight === 100;
  const isMilestoneTotalValid = totalMilestonePct === 100;

  // Handle template selection
  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    if (tmplId === 'blank') {
      setModules([{ name: 'Core Foundation & Infrastructure', description: 'Setup', budgetWeightPct: 100 }]);
      setMilestones([{ name: 'Phase 1 Delivery', percentage: 100, dueDate: endDate }]);
      toast.info('Applied blank template.');
      return;
    }

    const tmpl = templates.find((t) => t.id === tmplId) || templates[0];
    if (tmpl) {
      setModules(
        tmpl.defaultModules.map((m) => ({
          name: m.name,
          description: m.description,
          budgetWeightPct: m.budgetWeightPct,
        }))
      );
      setMilestones(
        tmpl.defaultMilestones.map((m, idx) => ({
          name: m.name,
          percentage: m.percentage,
          dueDate: new Date(Date.now() + (idx + 1) * 20 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        }))
      );
      toast.success(`Loaded "${tmpl.name}" with ${tmpl.defaultModules.length} modules!`);
    }
  };

  // Step 3 helper: Add Module
  const handleAddModule = () => {
    setModules([...modules, { name: 'New Project Module', description: '', budgetWeightPct: 0 }]);
  };

  // Step 3 helper: Remove Module
  const handleRemoveModule = (index: number) => {
    if (modules.length <= 1) {
      toast.error('Project must have at least one module.');
      return;
    }
    setModules(modules.filter((_, i) => i !== index));
  };

  // Step 4 helper: Add Milestone
  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { name: `Milestone ${milestones.length + 1}`, percentage: 0, dueDate: endDate },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) {
      toast.error('Project must have at least one milestone.');
      return;
    }
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // Step 5 helper: Add Team Member
  const handleAddMember = () => {
    const unassigned = users.find((u) => !members.some((m) => m.profileId === u.id));
    if (!unassigned) {
      toast.warning('All available directory users are already assigned to this project.');
      return;
    }
    setMembers([
      ...members,
      {
        profileId: unassigned.id,
        projectRole: 'developer',
        payModel: 'milestone_share',
        rate: 50000,
        allocationPct: 100,
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // Final Step 6: Create Project
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Project name is required.');
      setStep(1);
      return;
    }
    if (!isModuleTotalValid) {
      toast.error('Module budget weightage must sum to precisely 100%.');
      setStep(3);
      return;
    }
    if (!isMilestoneTotalValid) {
      toast.error('Milestone percentage allocation must sum to precisely 100%.');
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: projectName.trim(),
        clientData: {
          name: clientName.trim() || 'Internal Client',
          contactPerson: contactPerson.trim() || 'Authorized Representative',
          phone: phone.trim() || '+91 90000 00000',
          email: email.trim() || undefined,
        },
        type: projectType,
        contractValue,
        startDate,
        endDate,
        description: description.trim(),
        templateId: selectedTemplateId !== 'blank' ? selectedTemplateId : undefined,
        modules: modules.map((m, idx) => ({
          name: m.name,
          description: m.description,
          budgetWeightPct: m.budgetWeightPct,
          sortOrder: idx + 1,
        })),
        milestones: milestones.map((ms) => ({
          name: ms.name,
          percentage: ms.percentage,
          dueDate: ms.dueDate,
        })),
        members,
      };

      const res = await createProjectFromWizard(payload);
      setIsSubmitting(false);

      if (res.success) {
        toast.success(`Project "${projectName}" onboarded successfully via RPC!`);
        onClose();
      } else {
        toast.error(res.error || 'Failed to create project.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || 'Error executing project creation RPC.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-border/40 bg-card/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Project Onboarding Wizard
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Create an enterprise multi-project workspace with modules, milestones, and team assignments.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
              Step {step} of 6
            </Badge>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-6 gap-1 pt-3">
            {[
              { num: 1, label: 'Basics' },
              { num: 2, label: 'Template' },
              { num: 3, label: 'Modules' },
              { num: 4, label: 'Milestones' },
              { num: 5, label: 'Team' },
              { num: 6, label: 'Review' },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`cursor-pointer rounded py-1 px-1.5 text-center text-[10px] font-semibold transition-colors ${
                  step === s.num
                    ? 'bg-primary text-primary-foreground'
                    : step > s.num
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/40 text-muted-foreground'
                }`}
              >
                {s.num}. {s.label}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Project Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Royal Bistro Restaurant Management SaaS"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Client Organization</label>
                  <Input
                    placeholder="e.g. The Royal Bistro Hospitality Group"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Contact Person</label>
                  <Input
                    placeholder="e.g. Vikramaditya Singhania"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Client Phone</label>
                  <Input
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Contract Value (INR ₹)</label>
                  <Input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(Number(e.target.value))}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Project Scope & Description</label>
                  <Textarea
                    placeholder="Describe deliverables, technical stack requirements, and client specifications..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-xs h-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Select a project blueprint to preload industry modules and standard milestones, or start blank:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleApplyTemplate('template_restaurant')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplateId === 'template_restaurant'
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">
                        Restaurant Management SaaS Template
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[9px]">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    6 comprehensive modules: QR Table Ordering, Live KOT Sync, POS Counter Billing, Dynamic Floorplan Reservations, Multi-Branch Catalog, and Recipe Inventory.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-primary font-semibold">
                    <Sparkles className="w-3 h-3" /> 6 Modules • 4 Standard Milestones (20/30/30/20)
                  </div>
                </div>

                <div
                  onClick={() => handleApplyTemplate('blank')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplateId === 'blank'
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">Blank Custom Project</span>
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      Custom
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Start with a clean slate. Define bespoke modules, percentage weights, milestones, and developer payment terms from scratch.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                    Custom Modules • Custom Milestones
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MODULES */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Project Modules</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Each module represents an epic. Budget weightage must total exactly 100%.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isModuleTotalValid ? 'outline' : 'destructive'}
                    className={`text-[10px] font-mono ${
                      isModuleTotalValid ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''
                    }`}
                  >
                    Total Weight: {totalModuleWeight}% / 100%
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleAddModule} className="text-xs h-7 gap-1">
                    <Plus className="w-3 h-3" /> Add Module
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center gap-3 text-xs"
                  >
                    <span className="font-mono text-muted-foreground w-6 text-center">{idx + 1}.</span>
                    <div className="flex-1 space-y-1">
                      <Input
                        value={mod.name}
                        onChange={(e) => {
                          const updated = [...modules];
                          updated[idx].name = e.target.value;
                          setModules(updated);
                        }}
                        className="text-xs font-semibold h-8"
                        placeholder="Module Name"
                      />
                      <Input
                        value={mod.description}
                        onChange={(e) => {
                          const updated = [...modules];
                          updated[idx].description = e.target.value;
                          setModules(updated);
                        }}
                        className="text-[11px] text-muted-foreground h-7"
                        placeholder="Description & specs"
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] text-muted-foreground block text-right">Weight %</label>
                      <Input
                        type="number"
                        value={mod.budgetWeightPct}
                        onChange={(e) => {
                          const updated = [...modules];
                          updated[idx].budgetWeightPct = Number(e.target.value);
                          setModules(updated);
                        }}
                        className="text-xs text-right font-mono h-8"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveModule(idx)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: MILESTONES */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Project Milestones & Escrow Allocation</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Default 20/30/30/20. Percentage must total 100%. Payout calculated live from ₹
                    {contractValue.toLocaleString()}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isMilestoneTotalValid ? 'outline' : 'destructive'}
                    className={`text-[10px] font-mono ${
                      isMilestoneTotalValid ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''
                    }`}
                  >
                    Total: {totalMilestonePct}% / 100%
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleAddMilestone} className="text-xs h-7 gap-1">
                    <Plus className="w-3 h-3" /> Add Milestone
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {milestones.map((ms, idx) => {
                  const calculatedAmount = (contractValue * (Number(ms.percentage) || 0)) / 100;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center gap-3 text-xs"
                    >
                      <span className="font-mono text-muted-foreground w-6 text-center">{idx + 1}.</span>
                      <div className="flex-1 space-y-1">
                        <Input
                          value={ms.name}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].name = e.target.value;
                            setMilestones(updated);
                          }}
                          className="text-xs font-semibold h-8"
                          placeholder="Milestone Scope Name"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-muted-foreground">Due Date:</label>
                          <Input
                            type="date"
                            value={ms.dueDate}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[idx].dueDate = e.target.value;
                              setMilestones(updated);
                            }}
                            className="text-[11px] h-7 w-36"
                          />
                        </div>
                      </div>
                      <div className="w-24 shrink-0 text-right">
                        <label className="text-[10px] text-muted-foreground block">Allocation %</label>
                        <Input
                          type="number"
                          value={ms.percentage}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].percentage = Number(e.target.value);
                            setMilestones(updated);
                          }}
                          className="text-xs text-right font-mono h-8"
                        />
                        <span className="text-[10px] font-mono text-primary block mt-0.5">
                          ₹{calculatedAmount.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: TEAM MEMBERS */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Project Team Members</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Assign engineers from active directory. Assigned developers only see this project.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddMember} className="text-xs h-7 gap-1">
                  <Plus className="w-3 h-3" /> Assign Member
                </Button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {members.map((mem, idx) => {
                  const assignedProfile = users.find((u) => u.id === mem.profileId);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center gap-3 text-xs"
                    >
                      <div className="w-40 shrink-0">
                        <label className="text-[10px] text-muted-foreground block mb-1">User</label>
                        <Select
                          value={mem.profileId}
                          onValueChange={(val) => {
                            const updated = [...members];
                            updated[idx].profileId = val;
                            setMembers(updated);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id} className="text-xs">
                                {u.name} ({u.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-32 shrink-0">
                        <label className="text-[10px] text-muted-foreground block mb-1">Role</label>
                        <Select
                          value={mem.projectRole}
                          onValueChange={(val: any) => {
                            const updated = [...members];
                            updated[idx].projectRole = val;
                            setMembers(updated);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech_lead" className="text-xs">Tech Lead</SelectItem>
                            <SelectItem value="developer" className="text-xs">Developer</SelectItem>
                            <SelectItem value="qa" className="text-xs">QA Engineer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-36 shrink-0">
                        <label className="text-[10px] text-muted-foreground block mb-1">Pay Model</label>
                        <Select
                          value={mem.payModel}
                          onValueChange={(val: any) => {
                            const updated = [...members];
                            updated[idx].payModel = val;
                            setMembers(updated);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="milestone_share" className="text-xs">Milestone Share</SelectItem>
                            <SelectItem value="per_task" className="text-xs">Per Task</SelectItem>
                            <SelectItem value="per_module" className="text-xs">Per Module</SelectItem>
                            <SelectItem value="hourly" className="text-xs">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-24 shrink-0">
                        <label className="text-[10px] text-muted-foreground block mb-1">Rate (₹)</label>
                        <Input
                          type="number"
                          value={mem.rate}
                          onChange={(e) => {
                            const updated = [...members];
                            updated[idx].rate = Number(e.target.value);
                            setMembers(updated);
                          }}
                          className="text-xs font-mono h-8"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 shrink-0 mt-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & CREATE */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Project Summary</span>
                  <Badge variant="outline" className="font-mono text-primary text-[10px]">
                    Ready to Provision
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Project Name</span>
                    <span className="font-bold text-foreground">{projectName || 'Unnamed Project'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Client</span>
                    <span className="font-semibold text-foreground">{clientName || 'Internal'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Contract Value</span>
                    <span className="font-mono font-bold text-primary">₹{contractValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Timeline</span>
                    <span className="font-medium text-foreground">{startDate} to {endDate}</span>
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg border text-xs bg-card/40">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${isModuleTotalValid ? 'text-emerald-500' : 'text-rose-500'}`} />
                    <span>Modules Budget Weightage (100% required):</span>
                  </span>
                  <span className={`font-mono font-bold ${isModuleTotalValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {totalModuleWeight}% {isModuleTotalValid ? '✓' : '⚠️ Need 100%'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border text-xs bg-card/40">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${isMilestoneTotalValid ? 'text-emerald-500' : 'text-rose-500'}`} />
                    <span>Milestones Total Percentage (100% required):</span>
                  </span>
                  <span className={`font-mono font-bold ${isMilestoneTotalValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {totalMilestonePct}% {isMilestoneTotalValid ? '✓' : '⚠️ Need 100%'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border text-xs bg-card/40">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Assigned Team Members:</span>
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {members.length} engineers
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border/40 bg-card/60 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isSubmitting}
            className="text-xs gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (step === 1 && !projectName.trim()) {
                    toast.error('Please enter a project name.');
                    return;
                  }
                  if (step === 3 && !isModuleTotalValid) {
                    toast.error('Module weights must total 100% before proceeding.');
                    return;
                  }
                  if (step === 4 && !isMilestoneTotalValid) {
                    toast.error('Milestone allocations must total 100% before proceeding.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="text-xs gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleCreateProject}
                disabled={isSubmitting || !isModuleTotalValid || !isMilestoneTotalValid}
                className="text-xs gap-1.5 shadow-md bg-primary hover:bg-primary/90"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isSubmitting ? 'Executing Wizard RPC...' : 'Provision & Create Project'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
