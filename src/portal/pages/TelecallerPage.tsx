import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { TelecallerLead, LeadOutcome } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PhoneCall,
  Lock,
  Unlock,
  Upload,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building,
  User,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  FileSpreadsheet,
  MessageSquare,
  ArrowRight,
  FolderPlus,
  Languages,
  Copy,
  ChevronRight,
  ShieldAlert,
  Send,
  FileDown,
  Download,
  Trash2,
  UserCheck,
  UserPlus,
  Target,
  Zap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProjectWizardModal } from '../components/ProjectWizardModal';
import {
  getPitchRecommendation,
  BUSINESS_VERTICAL_RECOMMENDATIONS,
  BusinessPitchRecommendation,
} from '../services/aiPitchRecommender';

const COMMON_PAIN_POINTS = [
  'Slow KOT sync in rush hours',
  'High monthly POS recurring fee',
  'Wants contactless QR ordering',
  'Unreliable offline bill printing',
  'Lacks recipe ingredient inventory tracking',
  'Multi-branch franchise reporting missing',
];

export const TelecallerPage: React.FC = () => {
  const {
    leads,
    users,
    activePersona,
    currentUser,
    lockContact,
    unlockContact,
    logInteraction,
    claimLeadOwnership,
    reassignLeadOwnership,
    updateLeadFollowUp,
    importLeadsFromCSV,
    approveLeadQualification,
    convertLeadToClientProject,
    deleteLead,
  } = usePortal();

  const user = currentUser || activePersona;
  const isSuperAdmin = user.role === 'super_admin' || user.role === 'admin';

  // Navigation tab filter
  const [activeTab, setActiveTab] = useState<'all' | 'my-followups' | 'overdue' | 'converted'>('all');

  // Deletion state
  const [leadToDelete, setLeadToDelete] = useState<TelecallerLead | null>(null);

  // Active call modal state
  const [callingLead, setCallingLead] = useState<TelecallerLead | null>(null);
  const [outcome, setOutcome] = useState<LeadOutcome>('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [decisionMakerVerified, setDecisionMakerVerified] = useState(true);
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [requestQualification, setRequestQualification] = useState(false);
  const [scriptLanguage, setScriptLanguage] = useState<'English' | 'Tamil' | 'Hindi' | 'Telugu'>('English');
  const [verticalOverride, setVerticalOverride] = useState<string>('');

  // Follow-up scheduling modal state
  const [schedulingLead, setSchedulingLead] = useState<TelecallerLead | null>(null);
  const [schedDate, setSchedDate] = useState('');
  const [schedStage, setSchedStage] = useState<TelecallerLead['followUpStage']>('Interest Confirmed');
  const [schedPriority, setSchedPriority] = useState<TelecallerLead['followUpPriority']>('Medium');
  const [schedNotes, setSchedNotes] = useState('');

  // Reassignment modal state
  const [reassigningLead, setReassigningLead] = useState<TelecallerLead | null>(null);
  const [selectedNewOwnerId, setSelectedNewOwnerId] = useState('');

  // Conversion to Project modal state
  const [convertingLead, setConvertingLead] = useState<TelecallerLead | null>(null);

  // CSV Import State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState(
    `Business Name,Contact Person,Phone Number,Category,City,Source\n` +
    `Punjab Grill House,Manpreet Singh,+91 98111 22334,Fine Dining,Delhi,Zomato Merchant\n` +
    `Madras Filter Cafe,S. Ramaswamy,+91 94440 98765,Cafe & Bakery,Chennai,Swiggy Restaurant DB\n` +
    `Burger Bay Express,Farhan Qureshi,+91 98230 11223,QSR / Fast Food,Pune,Instagram Inbound Lead\n` +
    `Spice Cloud Kitchens,Kavitha Reddy,+91 98480 33445,Cloud Kitchen,Hyderabad,Field Outreach`
  );

  // Filter leads based on active tab
  const now = new Date();
  const filteredLeads = leads.filter((l) => {
    if (activeTab === 'my-followups') {
      return l.ownerId === user.id || l.assignedToId === user.id;
    }
    if (activeTab === 'overdue') {
      return (
        l.nextCallbackAt &&
        new Date(l.nextCallbackAt) < now &&
        l.status !== 'Converted' &&
        l.status !== 'Rejected'
      );
    }
    if (activeTab === 'converted') {
      return l.status === 'Converted';
    }
    return true; // 'all'
  });

  // Dynamic AI Pitch calculation
  const activeVertical = verticalOverride || callingLead?.category || 'QSR / Fast Food';
  const aiRecommendation = getPitchRecommendation(activeVertical);

  const formatAiText = (template: string) => {
    if (!template || !callingLead) return template;
    return template
      .replace(/{agentName}/g, user.name || 'Priya')
      .replace(/{contactPerson}/g, callingLead.contactPerson || 'Sir/Ma\'am')
      .replace(/{businessName}/g, callingLead.businessName || 'your restaurant')
      .replace(/{city}/g, callingLead.city || 'your area');
  };

  // Telecaller clicks to call -> Locks contact
  const handleInitiateCall = async (lead: TelecallerLead) => {
    if (lead.isLocked && lead.lockedById !== user.id) {
      toast.error(`Contact is currently LOCKED by ${lead.lockedByName}. Duplicate calls are prevented!`);
      return;
    }

    if (lead.ownerId && lead.ownerId !== user.id && !isSuperAdmin) {
      toast.error(`This lead is exclusively owned by ${lead.ownerName || 'another telecaller'} for follow-ups.`);
      return;
    }

    const locked = await lockContact(lead.id);
    if (locked) {
      setCallingLead(lead);
      setVerticalOverride(lead.category || 'QSR / Fast Food');
      setOutcome('Interested');
      setCallNotes('');
      setSelectedPainPoints(lead.painPoints || []);
      setDecisionMakerVerified(lead.decisionMakerConfirmed ?? true);
      setNextFollowUp(lead.nextCallbackAt || '');
      setRequestQualification(false);
      toast.info(`Exclusive lock placed on "${lead.businessName}". 20-minute timer active.`);
    }
  };

  const handleTogglePainPoint = (point: string) => {
    setSelectedPainPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const handleFinishCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callingLead) return;

    if (!callNotes.trim()) {
      toast.error('Please enter call notes summarizing the discussion.');
      return;
    }

    await logInteraction(
      callingLead.id,
      outcome,
      callNotes.trim(),
      selectedPainPoints,
      decisionMakerVerified,
      nextFollowUp || undefined,
      requestQualification
    );

    toast.success(`Interaction logged for "${callingLead.businessName}". Follow-up recorded.`);
    setCallingLead(null);
  };

  const handleCancelCall = async () => {
    if (callingLead) {
      await unlockContact(callingLead.id);
      toast.info(`Released lock on "${callingLead.businessName}".`);
      setCallingLead(null);
    }
  };

  const handleOpenScheduleModal = (lead: TelecallerLead) => {
    setSchedulingLead(lead);
    setSchedDate(lead.nextCallbackAt || '');
    setSchedStage(lead.followUpStage || 'Interest Confirmed');
    setSchedPriority(lead.followUpPriority || 'Medium');
    setSchedNotes('');
  };

  const handleSaveScheduledFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingLead) return;
    if (!schedDate) {
      toast.error('Please select a callback date and time.');
      return;
    }

    await updateLeadFollowUp(
      schedulingLead.id,
      schedDate,
      schedStage,
      schedNotes.trim(),
      schedPriority
    );

    setSchedulingLead(null);
  };

  const handleSaveReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassigningLead || !selectedNewOwnerId) return;

    await reassignLeadOwnership(reassigningLead.id, selectedNewOwnerId);
    setReassigningLead(null);
  };

  const handleClaimLead = async (lead: TelecallerLead) => {
    await claimLeadOwnership(lead.id);
  };

  const handleImportCSV = async () => {
    const lines = csvRawText.trim().split('\n');
    if (lines.length <= 1) {
      toast.error('Please provide at least one CSV row with prospect information.');
      return;
    }

    const parsedLeads: Array<Omit<TelecallerLead, 'id' | 'interactions' | 'isLocked' | 'isQualifiedApproved'>> = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 3 && parts[0] && parts[2]) {
        parsedLeads.push({
          businessName: parts[0],
          contactPerson: parts[1] || 'Owner',
          phone: parts[2],
          category: parts[3] || 'Restaurant',
          city: parts[4] || 'Bangalore',
          source: parts[5] || 'Admin CSV Import',
          status: 'New',
          ownerId: user.id,
          ownerName: user.name,
        });
      }
    }

    const added = await importLeadsFromCSV(parsedLeads);
    toast.success(`Imported ${added} verified leads.`);
    setIsCsvModalOpen(false);
  };

  // Callback timer badge helper
  const getCallbackBadge = (lead: TelecallerLead) => {
    if (!lead.nextCallbackAt) return null;
    const target = new Date(lead.nextCallbackAt);
    const isPast = target < now;
    const isToday =
      target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear();

    if (isPast && lead.status !== 'Converted') {
      return (
        <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30 font-semibold gap-1">
          <AlertCircle className="w-2.5 h-2.5" /> Overdue: {target.toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </Badge>
      );
    }
    if (isToday) {
      return (
        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30 font-semibold gap-1">
          <Clock className="w-2.5 h-2.5" /> Today {target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 font-mono">
        <Calendar className="w-2.5 h-2.5" /> {target.toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
              AI-Powered CRM & Outreach Engine
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Sticky Follow-Up Protection Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Restaurant Outreach & Pipeline CRM
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Lead generation with dynamic AI pitch recommendations tailored to the client's business, dedicated telecaller follow-up ownership, and seamless client project conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sales Pitch Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs shadow-sm">
                <BookOpen className="w-4 h-4 mr-1.5 text-primary" />
                Pitch Library & Objections
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Dynamic AI Sales Guidance
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Contextual sales scripts calibrated by restaurant business vertical.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4 text-xs">
                {Object.values(BUSINESS_VERTICAL_RECOMMENDATIONS).map((rec) => (
                  <div key={rec.categoryName} className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{rec.categoryName}</span>
                      <Badge variant="outline" className="text-[9px] text-emerald-500">
                        Avg Save ₹{(rec.estimatedMonthlySavingsINR / 1000).toFixed(0)}k/mo
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{rec.hook.English}"
                    </p>
                    <div className="text-[10px] text-primary">
                      <strong>Recommended:</strong> {rec.recommendedModules.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* CSV Import Button (Admin only) */}
          {isSuperAdmin && (
            <Button
              size="sm"
              onClick={() => setIsCsvModalOpen(true)}
              className="text-xs shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Upload CSV Leads
            </Button>
          )}
        </div>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur">
          <div className="text-xs text-muted-foreground font-semibold">Total Prospects</div>
          <div className="text-2xl font-bold mt-1 text-foreground">{leads.length}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur">
          <div className="text-xs text-muted-foreground font-semibold">My Active Leads</div>
          <div className="text-2xl font-bold text-primary mt-1">
            {leads.filter((l) => l.ownerId === user.id || l.assignedToId === user.id).length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur">
          <div className="text-xs text-muted-foreground font-semibold">Overdue Callbacks</div>
          <div className="text-2xl font-bold text-rose-500 mt-1">
            {
              leads.filter(
                (l) =>
                  l.nextCallbackAt &&
                  new Date(l.nextCallbackAt) < now &&
                  l.status !== 'Converted'
              ).length
            }
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur">
          <div className="text-xs text-muted-foreground font-semibold">Converted to Clients</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {leads.filter((l) => l.status === 'Converted').length}
          </div>
        </div>
      </div>

      {/* Main Outreach Table with Tabs */}
      <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold">Restaurant Outreach & Follow-Up Pipeline</CardTitle>
              <CardDescription className="text-xs">
                Each telecaller retains exclusive ownership of contacted leads for persistent conversion follow-ups.
              </CardDescription>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/40">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Directory ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('my-followups')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'my-followups'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Follow-Ups ({leads.filter((l) => l.ownerId === user.id).length})
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'overdue'
                    ? 'bg-background text-rose-500 shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-rose-400'
                }`}
              >
                Overdue (
                {
                  leads.filter(
                    (l) =>
                      l.nextCallbackAt &&
                      new Date(l.nextCallbackAt) < now &&
                      l.status !== 'Converted'
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setActiveTab('converted')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'converted'
                    ? 'bg-background text-emerald-500 shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-emerald-400'
                }`}
              >
                Converted ({leads.filter((l) => l.status === 'Converted').length})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold bg-muted/20">
                  <th className="py-2.5 px-3">Business / Restaurant</th>
                  <th className="py-2.5 px-3">Contact Person</th>
                  <th className="py-2.5 px-3">Phone & WhatsApp</th>
                  <th className="py-2.5 px-3">Vertical / City</th>
                  <th className="py-2.5 px-3">Lead Owner</th>
                  <th className="py-2.5 px-3">Next Callback / Stage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground text-xs">
                      <PhoneCall className="w-8 h-8 mx-auto text-primary opacity-40 mb-2" />
                      <p className="font-semibold text-foreground">No leads in this filter</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {activeTab === 'my-followups'
                          ? 'You have not claimed any prospect leads yet. Click "Claim Lead" on any lead in the directory.'
                          : 'No prospects match this criteria.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isMyLead = lead.ownerId === user.id;
                    const isOtherOwner = lead.ownerId && lead.ownerId !== user.id;
                    const isLockedByOther = lead.isLocked && lead.lockedById !== user.id;
                    const cleanPhone = lead.phone.replace(/\D/g, '');

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-muted/20 transition-colors ${
                          lead.isLocked ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        {/* Business Name */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{lead.businessName}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground pl-5">{lead.source}</div>
                        </td>

                        {/* Contact Person */}
                        <td className="py-3 px-3 text-foreground whitespace-nowrap">
                          {lead.contactPerson}
                        </td>

                        {/* Phone & WhatsApp */}
                        <td className="py-3 px-3 font-mono text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{lead.phone}</span>
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                formatAiText(aiRecommendation.whatsAppTemplate)
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-500 hover:text-emerald-600 p-0.5 rounded hover:bg-emerald-500/10"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        {/* Vertical & City */}
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] bg-muted/60 text-foreground border-border/40">
                            {lead.category || 'Restaurant'}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" /> {lead.city}
                          </div>
                        </td>

                        {/* Sticky Lead Ownership */}
                        <td className="py-3 px-3">
                          {lead.ownerId ? (
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-semibold ${
                                  isMyLead
                                    ? 'bg-primary/10 text-primary border-primary/30'
                                    : 'bg-muted text-muted-foreground border-border/40'
                                }`}
                              >
                                {isMyLead ? '★ My Lead' : `Owner: ${lead.ownerName?.split(' ')[0]}`}
                              </Badge>
                              {isSuperAdmin && (
                                <button
                                  onClick={() => {
                                    setReassigningLead(lead);
                                    setSelectedNewOwnerId(lead.ownerId || users[0]?.id || '');
                                  }}
                                  className="text-[10px] text-muted-foreground hover:text-foreground underline ml-1 cursor-pointer"
                                  title="Reassign to another telecaller"
                                >
                                  Reassign
                                </button>
                              )}
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleClaimLead(lead)}
                              className="h-6 text-[10px] text-primary hover:bg-primary/10 gap-1 px-1.5"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Claim Lead</span>
                            </Button>
                          )}
                        </td>

                        {/* Next Callback & Stage */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            {getCallbackBadge(lead)}
                            {lead.followUpStage ? (
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Target className="w-2.5 h-2.5 text-primary" />
                                <span>{lead.followUpStage}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {lead.status}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Schedule Follow-up button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenScheduleModal(lead)}
                              className="h-7 text-[10px] gap-1 border-border/60 hover:bg-muted"
                              title="Set follow-up date and stage"
                            >
                              <Calendar className="w-3 h-3 text-blue-400" />
                              <span>Follow-Up</span>
                            </Button>

                            {/* Convert to Project */}
                            {isSuperAdmin && (lead.status === 'Qualified' || lead.status === 'Converted') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] h-7 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 gap-1"
                                onClick={() => setConvertingLead(lead)}
                                title="Convert Lead into Project"
                              >
                                <FolderPlus className="w-3 h-3" />
                                Convert
                              </Button>
                            )}

                            {/* Call & Lock Button */}
                            <Button
                              size="sm"
                              disabled={isLockedByOther || (isOtherOwner && !isSuperAdmin)}
                              className={`text-xs h-7 gap-1 ${
                                isLockedByOther || (isOtherOwner && !isSuperAdmin)
                                  ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                              onClick={() => handleInitiateCall(lead)}
                            >
                              <PhoneCall className="w-3 h-3" />
                              {lead.isLocked && lead.lockedById === user.id
                                ? 'Active Call'
                                : isLockedByOther
                                ? 'Locked'
                                : isOtherOwner && !isSuperAdmin
                                ? 'Other Owner'
                                : 'Call & Lock'}
                            </Button>

                            {/* Delete button (Super Admin) */}
                            {isSuperAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                onClick={() => setLeadToDelete(lead)}
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Active Call with Contextual Dynamic AI Recommendation */}
      <Dialog open={Boolean(callingLead)} onOpenChange={(open) => !open && handleCancelCall()}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="border-b border-border/30 pb-3">
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                Active Call: {callingLead?.businessName}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">
                  Exclusive 20-Min Lock Held
                </Badge>
                {/* Language Switch */}
                <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded border border-border/40 text-[11px]">
                  <Languages className="w-3 h-3 text-purple-400" />
                  <select
                    value={scriptLanguage}
                    onChange={(e) => setScriptLanguage(e.target.value as any)}
                    className="bg-transparent text-[11px] font-medium outline-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs flex items-center justify-between">
              <span>
                Contact: <strong>{callingLead?.contactPerson}</strong> • Phone:{' '}
                <a href={`tel:${callingLead?.phone}`} className="font-mono text-primary hover:underline">
                  {callingLead?.phone}
                </a>{' '}
                • Location: <span className="font-semibold text-foreground">{callingLead?.city}</span>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-2">
            {/* Left Column: Call Logger Form */}
            <form onSubmit={handleFinishCall} className="md:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Call Outcome *</label>
                  <Select value={outcome} onValueChange={(v: any) => setOutcome(v)}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interested" className="text-xs text-emerald-500 font-semibold">Interested (Positive)</SelectItem>
                      <SelectItem value="Demo Requested" className="text-xs text-blue-500 font-semibold">Demo Requested (Scheduled)</SelectItem>
                      <SelectItem value="Callback Scheduled" className="text-xs text-amber-500">Callback Scheduled</SelectItem>
                      <SelectItem value="Not Interested" className="text-xs text-rose-500">Not Interested (Cooldown)</SelectItem>
                      <SelectItem value="Customer Asked Not to Call Again" className="text-xs text-red-600 font-bold">Do Not Call (DNC)</SelectItem>
                      <SelectItem value="Invalid/Wrong Number" className="text-xs text-muted-foreground">Invalid / Wrong Number</SelectItem>
                      <SelectItem value="Unreachable" className="text-xs text-muted-foreground">Unreachable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Next Callback Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Identified Pain Points */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Identified Restaurant Pain Points</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(aiRecommendation.keyPainPoints || COMMON_PAIN_POINTS).map((point) => (
                    <label
                      key={point}
                      className="flex items-center gap-2 p-2 rounded border border-border/40 hover:bg-accent/40 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPainPoints.includes(point)}
                        onChange={() => handleTogglePainPoint(point)}
                        className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      <span className="text-[11px] leading-tight">{point}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Call Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Notes & Objection Discussion *</label>
                <Textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Summarize conversation: owner feedback, current POS complaints, specific modules requested..."
                  className="text-xs min-h-[75px]"
                  required
                />
              </div>

              {/* Decision Maker Verified & Qualification */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={decisionMakerVerified}
                    onChange={(e) => setDecisionMakerVerified(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">
                    Verified Decision-Maker (Owner / General Manager / Managing Partner)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestQualification}
                    onChange={(e) => setRequestQualification(e.target.checked)}
                    className="rounded border-border text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Submit Lead for Admin Qualification Approval
                  </span>
                </label>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancelCall}>
                  Release Lock & Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Save Interaction & Schedule Follow-Up
                </Button>
              </DialogFooter>
            </form>

            {/* Right Column: DYNAMIC AI CONTENT RECOMMENDER */}
            <div className="md:col-span-6 bg-muted/20 p-4 rounded-xl border border-border/40 space-y-3.5 text-xs">
              {/* Header with Vertical Selector */}
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-foreground">
                    AI Content Recommendation ({scriptLanguage})
                  </span>
                </div>

                <Select value={verticalOverride} onValueChange={setVerticalOverride}>
                  <SelectTrigger className="text-[11px] h-7 w-36">
                    <SelectValue placeholder="Vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fine Dining" className="text-xs">Fine Dining / Restro-Bar</SelectItem>
                    <SelectItem value="QSR / Fast Food" className="text-xs">QSR / Fast Food</SelectItem>
                    <SelectItem value="Cloud Kitchen" className="text-xs">Cloud Kitchen Hub</SelectItem>
                    <SelectItem value="Cafe & Bakery" className="text-xs">Cafe & Bakery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Savings Pill */}
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-between">
                <span>Tailored Pitch for: <strong>{aiRecommendation.categoryName}</strong></span>
                <span className="font-mono font-bold">~₹{(aiRecommendation.estimatedMonthlySavingsINR / 1000).toFixed(0)}k/mo Savings</span>
              </div>

              {/* 1. Tailored Opening Hook */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">1. Recommended Opening Hook</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(formatAiText(aiRecommendation.hook[scriptLanguage]));
                      toast.success('Copied hook to clipboard');
                    }}
                    className="h-5 text-[9px] text-muted-foreground hover:text-foreground p-1"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </Button>
                </div>
                <p className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-200 text-[11px] italic leading-relaxed">
                  "{formatAiText(aiRecommendation.hook[scriptLanguage])}"
                </p>
              </div>

              {/* 2. Value Proposition */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">2. 30-Second ROI Proposition</span>
                <p className="p-2 rounded bg-background/60 border border-border/30 text-[11px] text-muted-foreground leading-relaxed">
                  {formatAiText(aiRecommendation.valueProposition[scriptLanguage])}
                </p>
              </div>

              {/* 3. Dynamic Objection Handlers Accordion */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">3. Objection Rebuttals (Click to read)</span>
                <div className="space-y-1.5">
                  {aiRecommendation.objectionHandlers.map((obj, idx) => (
                    <details key={idx} className="group p-2 rounded border border-border/30 bg-background/40 cursor-pointer">
                      <summary className="font-medium text-foreground text-[11px] flex items-center justify-between">
                        <span>"{obj.objection}"</span>
                        <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="mt-1.5 text-muted-foreground text-[10px] pl-2 border-l border-purple-500/60 leading-relaxed">
                        {formatAiText(obj.rebuttal[scriptLanguage])}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* 4. One-Click WhatsApp Template */}
              <div className="pt-2 border-t border-border/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Instant WhatsApp Follow-Up</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const msg = formatAiText(aiRecommendation.whatsAppTemplate);
                      navigator.clipboard.writeText(msg);
                      toast.success('Copied WhatsApp message to clipboard!');
                    }}
                    className="h-6 text-[10px] text-emerald-400 hover:text-emerald-300 gap-1 px-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Template
                  </Button>
                </div>
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 text-[10px] leading-relaxed">
                  {formatAiText(aiRecommendation.whatsAppTemplate)}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Dedicated Follow-Up Scheduler */}
      <Dialog open={Boolean(schedulingLead)} onOpenChange={(open) => !open && setSchedulingLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Schedule Follow-Up Callback
            </DialogTitle>
            <DialogDescription className="text-xs">
              Lock in the next touchpoint for <strong>{schedulingLead?.businessName}</strong>. You are the designated owner.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveScheduledFollowUp} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Callback Date & Time *</label>
              <Input
                type="datetime-local"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Funnel Stage</label>
                <Select value={schedStage} onValueChange={(val: any) => setSchedStage(val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Touch">1st Touch</SelectItem>
                    <SelectItem value="Interest Confirmed">Interest Confirmed</SelectItem>
                    <SelectItem value="Objections Handled">Objections Handled</SelectItem>
                    <SelectItem value="Demo Scheduled">Demo Scheduled</SelectItem>
                    <SelectItem value="Contract Review">Contract Review</SelectItem>
                    <SelectItem value="Closing Deal">Closing Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Priority</label>
                <Select value={schedPriority} onValueChange={(val: any) => setSchedPriority(val)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent" className="text-rose-500 font-bold">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Follow-Up Notes</label>
              <Textarea
                value={schedNotes}
                onChange={(e) => setSchedNotes(e.target.value)}
                placeholder="What will you present during this follow-up call?"
                className="text-xs min-h-[60px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSchedulingLead(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                Save Follow-Up
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Admin Reassign Lead */}
      <Dialog open={Boolean(reassigningLead)} onOpenChange={(open) => !open && setReassigningLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Reassign Lead Follow-Up Ownership
            </DialogTitle>
            <DialogDescription className="text-xs">
              Transfer <strong>{reassigningLead?.businessName}</strong> to another inside sales executive.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReassign} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Select New Owner</label>
              <Select value={selectedNewOwnerId} onValueChange={setSelectedNewOwnerId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Telecaller" />
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

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setReassigningLead(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                Confirm Reassignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: CSV Lead Feeder */}
      <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Import Prospect Leads via CSV
            </DialogTitle>
            <DialogDescription className="text-xs">
              Paste CSV rows or import standard restaurant prospect databases with business verticals.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Textarea
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              className="text-xs font-mono min-h-[140px]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleImportCSV} className="bg-emerald-600 hover:bg-emerald-700">
              Import Verified Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lead Dialog */}
      <Dialog open={Boolean(leadToDelete)} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Lead Record?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete prospect <strong>{leadToDelete?.businessName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setLeadToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (leadToDelete) {
                  await deleteLead(leadToDelete.id);
                  setLeadToDelete(null);
                }
              }}
            >
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Project Modal */}
      {convertingLead && (
        <ProjectWizardModal
          isOpen={Boolean(convertingLead)}
          onClose={() => setConvertingLead(null)}
          prefillClient={{
            name: convertingLead.businessName,
            contactPerson: convertingLead.contactPerson,
            phone: convertingLead.phone,
          }}
        />
      )}
    </div>
  );
};

export default TelecallerPage;
