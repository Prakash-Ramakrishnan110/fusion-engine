import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FolderKanban,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Code2,
  UtensilsCrossed,
  Boxes,
  Users2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Briefcase,
  Trash2,
  MessageSquare,
  Palette,
  UserPlus,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProjectWizardModal } from '../components/ProjectWizardModal';
import { ProjectDeveloperAllocationModal } from '../components/ProjectDeveloperAllocationModal';
import { ProjectTeamChat } from '../components/ProjectTeamChat';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const {
    projects,
    activeProjects,
    selectedProjectId,
    setSelectedProjectId,
    tasks,
    users,
    activePersona,
    currentUser,
    createTask,
    deleteProject,
  } = usePortal();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // Selected project to inspect
  const inspectedProject =
    projects.find((p) => p.id === selectedProjectId && selectedProjectId !== 'all') ||
    activeProjects[0] ||
    projects[0];

  // Task form state
  const [taskModule, setTaskModule] = useState(inspectedProject?.modules?.[0] || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [deadline, setDeadline] = useState('2026-04-15');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [milestoneId, setMilestoneId] = useState(inspectedProject?.milestones?.[0]?.id || '');
  const [payoutAmount, setPayoutAmount] = useState(15000);

  const user = currentUser || activePersona;
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDescription.trim()) {
      toast.error('Please enter a title and description for the task.');
      return;
    }
    if (!inspectedProject) {
      toast.error('No project selected.');
      return;
    }

    const assignedUser = users.find((u) => u.id === assignedToId) || users[0];

    await createTask({
      projectId: inspectedProject.id,
      projectName: inspectedProject.name,
      module: taskModule || inspectedProject.modules[0] || 'Core',
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      assignedToId: assignedUser.id,
      assignedToName: assignedUser.name,
      deadline,
      priority,
      status: 'Assigned',
      progressPercentage: 0,
      milestoneId: milestoneId || inspectedProject.milestones?.[0]?.id || '',
      payoutAmountINR: payoutAmount,
    });

    toast.success('Task created and assigned successfully!');
    setTaskTitle('');
    setTaskDescription('');
    setIsTaskDialogOpen(false);
  };

  const projectTasks = tasks.filter((t) => inspectedProject && t.projectId === inspectedProject.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'Approved').length;
  const taskProgress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Project Directory Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Multi-Project Workspace
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {activeProjects.length} Projects Available
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Projects & Technical Specifications
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Central repository of active client and internal software builds, architecture specs, modular epics, and escrow milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              className="shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard New Project</span>
            </Button>
          )}
        </div>
      </div>

      {/* Projects Grid / Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeProjects.map((p) => {
          const isSelected = inspectedProject?.id === p.id;
          const pTasks = tasks.filter((t) => t.projectId === p.id);
          const pApproved = pTasks.filter((t) => t.status === 'Approved').length;
          const pPct = pTasks.length > 0 ? Math.round((pApproved / pTasks.length) * 100) : 0;

          return (
            <Card
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`cursor-pointer transition-all border ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/40'
                  : 'border-border/60 hover:border-primary/40 bg-card/60'
              }`}
            >
              <CardHeader className="p-4 pb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase font-mono ${
                        p.status === 'Active' || p.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {p.status}
                    </Badge>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p);
                        }}
                        className="text-muted-foreground hover:text-destructive p-0.5 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    )}
                  </div>
                </div>
                <CardTitle className="text-sm font-bold truncate text-foreground">
                  {p.name}
                </CardTitle>
                <CardDescription className="text-[11px] truncate text-muted-foreground">
                  Client: {p.clientName || 'Internal'} • ₹{(p.contractValueINR / 1000).toFixed(0)}k
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Progress ({pApproved}/{pTasks.length} tasks)</span>
                  <span className="font-mono font-bold text-foreground">{pPct}%</span>
                </div>
                <Progress value={pPct} className="h-1.5" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                  <span>{p.modules?.length || 0} Modules</span>
                  <span>{p.milestones?.length || 0} Milestones</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Project In-Depth Detail View */}
      {inspectedProject ? (
        <Card className="border-border/60 bg-card/80 backdrop-blur shadow-sm">
          <CardHeader className="p-4 sm:p-6 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] text-primary bg-primary/10">
                    {inspectedProject.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Client: <strong className="text-foreground">{inspectedProject.clientName || 'Internal'}</strong>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • Contract Value: <strong className="text-primary font-mono">₹{inspectedProject.contractValueINR.toLocaleString()}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground mt-1">
                  {inspectedProject.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inspectedProject.description}
                </p>
              </div>

              {isAdmin && (
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 shadow-sm">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Project Task</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">Assign Task under {inspectedProject.name}</DialogTitle>
                      <DialogDescription className="text-xs">
                        Create an engineering task deliverable mapped to a module and milestone.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateTask} className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Module Epic</label>
                        <Select value={taskModule} onValueChange={setTaskModule}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select Module" />
                          </SelectTrigger>
                          <SelectContent>
                            {inspectedProject.modules?.map((mod) => (
                              <SelectItem key={mod} value={mod} className="text-xs">
                                {mod}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Deliverable Title</label>
                        <Input
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="e.g. Implement WebSocket broadcast for KOT sync"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Acceptance Criteria</label>
                        <Textarea
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Describe acceptance criteria, expected tests, and PR submission expectations..."
                          className="text-xs min-h-[80px]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold">Assign Developer</label>
                          <Select value={assignedToId} onValueChange={setAssignedToId}>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Select Developer" />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                .filter((u) => u.role === 'developer' || u.role === 'admin')
                                .map((dev) => (
                                  <SelectItem key={dev.id} value={dev.id} className="text-xs">
                                    {dev.name} ({dev.role})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold">Priority</label>
                          <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low" className="text-xs">Low</SelectItem>
                              <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                              <SelectItem value="High" className="text-xs">High</SelectItem>
                              <SelectItem value="Critical" className="text-xs text-rose-500 font-semibold">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold">Target Deadline</label>
                          <Input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="text-xs"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold">Payout Amount (INR ₹)</label>
                          <Input
                            type="number"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(Number(e.target.value))}
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>

                      <DialogFooter className="pt-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsTaskDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm">
                          Create & Assign Task
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="modules" className="space-y-4">
              <TabsList className="bg-muted/40 p-1">
                <TabsTrigger value="modules" className="text-xs gap-1.5">
                  <Boxes className="w-3.5 h-3.5" /> Modules ({inspectedProject.modules?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="milestones" className="text-xs gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Milestones ({inspectedProject.milestones?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Tasks ({projectTasks.length})
                </TabsTrigger>
                <TabsTrigger value="team" className="text-xs gap-1.5">
                  <Users2 className="w-3.5 h-3.5" /> Team ({inspectedProject.members?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-xs gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Team Chat
                </TabsTrigger>
                <TabsTrigger value="design-qa" className="text-xs gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" /> Design & QA Standards
                </TabsTrigger>
              </TabsList>

              {/* MODULES TAB */}
              <TabsContent value="modules" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inspectedProject.modules?.map((modName, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-border/50 bg-card/40 flex items-start gap-3 text-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-xs">{modName}</div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Architecture specs, database schemas, and unit test requirements verified.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-500 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Production Grade Spec
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* MILESTONES TAB */}
              <TabsContent value="milestones" className="space-y-3">
                <div className="space-y-2">
                  {inspectedProject.milestones?.map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      className="p-4 rounded-xl border border-border/50 bg-card/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{ms.name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {ms.percentageAllocation}% of Contract
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Due Date: {ms.dueDate} • Dual-Gate Verification Required
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono text-primary">
                            ₹{ms.agreedAmountINR?.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-muted-foreground">Escrow Allocation</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            ms.status === 'Gate 1 Approved'
                              ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                              : ms.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {ms.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TASKS TAB */}
              <TabsContent value="tasks" className="space-y-3">
                {projectTasks.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-xl text-xs text-muted-foreground">
                    No tasks created for this project yet. Click "Assign Project Task" above to add deliverables.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projectTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-foreground">{task.title}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {task.module} • Assigned to: <span className="text-foreground font-medium">{task.assignedToName}</span> • Deadline: {task.deadline}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {task.status}
                          </Badge>
                          <span className="font-mono font-bold text-primary text-xs">
                            ₹{(task.payoutAmountINR || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TEAM TAB */}
              <TabsContent value="team" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-muted/30 border border-border/40">
                  <div>
                    <div className="text-xs font-bold text-foreground">Project Engineering Roster</div>
                    <div className="text-[11px] text-muted-foreground">
                      {inspectedProject.members?.length || 0} assigned engineers with dedicated roles and capacity
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      onClick={() => setIsAllocationModalOpen(true)}
                      className="text-xs h-7 gap-1.5 shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Allocate / Assign Developers</span>
                    </Button>
                  )}
                </div>

                {(!inspectedProject.members || inspectedProject.members.length === 0) ? (
                  <div className="p-8 text-center border border-dashed rounded-xl text-xs text-muted-foreground space-y-2">
                    <Users2 className="w-8 h-8 mx-auto text-primary opacity-40" />
                    <p>No engineers assigned to this project yet.</p>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAllocationModalOpen(true)}
                        className="text-xs h-7"
                      >
                        Allocate Developers Now
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectedProject.members.map((mem) => (
                      <div
                        key={mem.id}
                        className="p-3.5 rounded-xl border border-border/50 bg-card/40 flex items-center justify-between text-xs hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <span>{mem.profileName || 'Engineer'}</span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] uppercase ${
                                mem.projectRole === 'tech_lead'
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                  : mem.projectRole === 'qa'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {mem.projectRole.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Allocation: <strong className="text-foreground">{mem.allocationPct}%</strong> • Model: {mem.payModel}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono text-primary bg-primary/5 border-primary/20">
                          ₹{(mem.rate || 0).toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TEAM CHAT TAB */}
              <TabsContent value="chat" className="space-y-3">
                <ProjectTeamChat projectId={inspectedProject.id} projectName={inspectedProject.name} />
              </TabsContent>

              {/* DESIGN SYSTEM & QA STANDARDS TAB */}
              <TabsContent value="design-qa" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Design Specifications & Assets */}
                  <div className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-purple-400" />
                        Approved Design System & Prototype
                      </span>
                      <Badge variant="outline" className="text-[9px] text-purple-400 bg-purple-500/10">
                        MNC Design Gate
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/40">
                        <span className="text-muted-foreground">Figma High-Fidelity Specs:</span>
                        <a
                          href="https://www.figma.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-[11px] font-mono"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>figma.com/file/{inspectedProject.code.toLowerCase()}</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/40">
                        <span className="text-muted-foreground">Design Token Standard:</span>
                        <span className="font-mono text-foreground font-semibold">Tailwind CSS 3.4 / Shadcn</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/40">
                        <span className="text-muted-foreground">Responsive Breakpoints:</span>
                        <span className="font-mono text-foreground text-[11px]">Mobile (375px), Tablet (768px), Desktop (1440px)</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border/40">
                        <span className="text-muted-foreground">Typography System:</span>
                        <span className="font-mono text-foreground font-semibold">Inter, Fira Code (Monospace)</span>
                      </div>
                    </div>
                  </div>

                  {/* Zero-Defect QA Checklist */}
                  <div className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Zero-Defect Quality Assurance Rules
                      </span>
                      <Badge variant="outline" className="text-[9px] text-emerald-500 bg-emerald-500/10">
                        No Mistake Policy
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      To prevent costly rework and coordination delays, every deliverable PR must satisfy all quality standards:
                    </p>

                    <div className="space-y-2 text-[11px]">
                      <div className="p-2 rounded bg-muted/30 border border-border/30 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Pixel-Perfect Layout:</strong> Margins, paddings, and font weights match Figma specs exactly.</span>
                      </div>
                      <div className="p-2 rounded bg-muted/30 border border-border/30 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Zero Console Warnings:</strong> Clean production build with zero React key warnings or unhandled exceptions.</span>
                      </div>
                      <div className="p-2 rounded bg-muted/30 border border-border/30 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Unit & Integration Tests:</strong> Minimum 80% code coverage on core billing and KOT state logic.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="p-12 text-center border border-dashed rounded-2xl text-xs text-muted-foreground space-y-3">
          <FolderKanban className="w-8 h-8 mx-auto text-primary opacity-40" />
          <p>No projects configured in system database.</p>
          {isAdmin && (
            <Button size="sm" onClick={() => setIsWizardOpen(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Project Onboarding Wizard</span>
            </Button>
          )}
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <ProjectWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Developer Allocation Modal */}
      {inspectedProject && (
        <ProjectDeveloperAllocationModal
          isOpen={isAllocationModalOpen}
          onClose={() => setIsAllocationModalOpen(false)}
          project={inspectedProject}
        />
      )}

      {/* MODAL: Confirm Delete Project */}
      <Dialog open={Boolean(projectToDelete)} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete <strong className="text-foreground">{projectToDelete?.name}</strong>?
              This will remove the project architecture, modules, and all associated tasks.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setProjectToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (!projectToDelete) return;
                setIsDeleting(true);
                await deleteProject(projectToDelete.id);
                setIsDeleting(false);
                setProjectToDelete(null);
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default ProjectsPage;
