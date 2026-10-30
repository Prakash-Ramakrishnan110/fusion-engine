import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { supabase } from '@/lib/supabase';
import {
  Sparkles,
  Bot,
  CheckCircle,
  Clock,
  Languages,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  HelpCircle,
  Save,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface BusinessType {
  id: string;
  name: string;
  slug: string;
  default_pain_points?: string[];
  is_active: boolean;
}

interface CallScript {
  id: string;
  business_type_id: string;
  language: string;
  opening: string;
  pitch_30s: string;
  pitch_3min: string;
  probe_questions: string[];
  pain_point_hooks: string[];
  objection_handlers: Record<string, string>;
  closing_cta: string;
  whatsapp_followup: string;
  voicemail_script?: string;
  status: 'draft' | 'approved' | 'archived';
  version: number;
  generated_by_model?: string;
  created_at: string;
}

export const ScriptsAdminPage: React.FC = () => {
  const { currentUser } = usePortal();
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [currentScript, setCurrentScript] = useState<CallScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [opening, setOpening] = useState('');
  const [pitch30s, setPitch30s] = useState('');
  const [pitch3min, setPitch3min] = useState('');
  const [closingCta, setClosingCta] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [probeQuestions, setProbeQuestions] = useState<string[]>([]);
  const [objections, setObjections] = useState<Array<{ objection: string; rebuttal: string }>>([]);

  const languages = ['English', 'Tamil', 'Hindi', 'Telugu'];

  useEffect(() => {
    loadBusinessTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadScripts(selectedType.id);
    }
  }, [selectedType, selectedLang]);

  const loadBusinessTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data && data.length > 0) {
        setBusinessTypes(data);
        setSelectedType(data[0]);
      } else {
        // Fallback default seeds if database empty
        const defaultTypes: BusinessType[] = [
          { id: 'bt-rest', name: 'Restaurants & Cafes', slug: 'restaurant', default_pain_points: ['High aggregator commissions', 'Peak order bottlenecks'], is_active: true },
          { id: 'bt-retail', name: 'Retail & Supermarkets', slug: 'retail', default_pain_points: ['Inventory mismatch', 'Billing counter queues'], is_active: true },
          { id: 'bt-health', name: 'Clinics & Diagnostics', slug: 'healthcare', default_pain_points: ['Appointment no-shows', 'Manual patient records'], is_active: true }
        ];
        setBusinessTypes(defaultTypes);
        setSelectedType(defaultTypes[0]);
      }
    } catch (err: any) {
      console.warn('Using default business types:', err.message);
    }
  };

  const loadScripts = async (typeId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('call_scripts')
        .select('*')
        .eq('business_type_id', typeId)
        .eq('language', selectedLang)
        .order('version', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setScripts(data);
        const active = data[0];
        setCurrentScript(active);
        setOpening(active.opening || '');
        setPitch30s(active.pitch_30s || '');
        setPitch3min(active.pitch_3min || '');
        setClosingCta(active.closing_cta || '');
        setWhatsapp(active.whatsapp_followup || '');
        setProbeQuestions(active.probe_questions || []);
        
        const objList = Object.entries(active.objection_handlers || {}).map(([objection, rebuttal]) => ({
          objection,
          rebuttal: rebuttal as string
        }));
        setObjections(objList);
      } else {
        setScripts([]);
        setCurrentScript(null);
        resetForm();
      }
    } catch (err: any) {
      console.error('Error loading scripts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOpening('');
    setPitch30s('');
    setPitch3min('');
    setClosingCta('');
    setWhatsapp('');
    setProbeQuestions(['What is your biggest operational bottleneck right now?', 'How much time does your team spend manually reconciling orders?']);
    setObjections([
      { objection: 'Too expensive / No budget', rebuttal: 'Understood. Most of our clients actually save 3x our monthly cost in recovered billing errors within the first 14 days.' },
      { objection: 'Already using another software', rebuttal: 'That is great! What is one feature you wish your current software had that they have not added yet?' }
    ]);
  };

  const handleGenerateAIScripts = async () => {
    if (!selectedType) return;
    setIsGenerating(true);
    toast.info(`Calling AI Edge Function to generate scripts for ${selectedType.name} (${selectedLang})...`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await supabase.functions.invoke('generate-scripts', {
        body: {
          business_type_id: selectedType.id,
          business_type_name: selectedType.name,
          language: selectedLang,
          company_description: 'BuildScaleDeploy - Enterprise B2B Custom MVP & High-Conversion Software Engineering'
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI Generation failed');
      }

      const generated = response.data?.script;
      if (generated) {
        setOpening(generated.opening || '');
        setPitch30s(generated.pitch_30s || '');
        setPitch3min(generated.pitch_3min || '');
        setClosingCta(generated.closing_cta || '');
        setWhatsapp(generated.whatsapp_followup || '');
        setProbeQuestions(generated.probe_questions || []);
        
        const objList = Object.entries(generated.objection_handlers || {}).map(([k, v]) => ({
          objection: k,
          rebuttal: v as string
        }));
        setObjections(objList);
        toast.success('AI Scripts generated successfully (Draft created)!');
        loadScripts(selectedType.id);
      }
    } catch (err: any) {
      toast.error('AI Edge generation: ' + err.message);
      // Generate realistic template in fallback
      setOpening(`Hello! Am I speaking with the founder/manager of [Business]? My name is [Caller] from BuildScaleDeploy.`);
      setPitch30s(`We help ${selectedType.name} streamline high-volume operations with custom 14-day software deployments, eliminating SaaS aggregator commissions.`);
      setPitch3min(`Most businesses like yours struggle with disconnected software and high monthly fees. We build a single tailored dashboard for your exact flow.`);
      setClosingCta(`Can we set up a 10-minute live demonstration on Google Meet this Thursday at 4 PM?`);
      setWhatsapp(`Hi [Name], thank you for speaking with me today regarding custom software for [Business]. Here is our case study: https://buildscaledeploy.internal/case-study`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScript = async (approve = false) => {
    if (!selectedType) return;
    setIsSaving(true);

    const objRecord: Record<string, string> = {};
    objections.forEach(o => {
      if (o.objection.trim()) {
        objRecord[o.objection.trim()] = o.rebuttal.trim();
      }
    });

    try {
      const payload = {
        business_type_id: selectedType.id,
        language: selectedLang,
        opening,
        pitch_30s: pitch30s,
        pitch_3min: pitch3min,
        probe_questions: probeQuestions,
        pain_point_hooks: selectedType.default_pain_points || [],
        objection_handlers: objRecord,
        closing_cta: closingCta,
        whatsapp_followup: whatsapp,
        status: approve ? 'approved' : 'draft',
        version: currentScript ? currentScript.version + 1 : 1
      };

      const { data, error } = await supabase
        .from('call_scripts')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      toast.success(approve ? 'Script approved and published to Telecallers!' : 'Script saved as draft');
      loadScripts(selectedType.id);
    } catch (err: any) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Sales Scripts & Content Engine</h1>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Phase C Server AI</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Generate and approve tailored "what to speak" pitch scripts, objection rebuttals, and WhatsApp follow-ups per business type and language.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleGenerateAIScripts}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-sm"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate with AI
          </Button>
          <Button
            onClick={() => handleSaveScript(false)}
            disabled={isSaving}
            variant="outline"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSaveScript(true)}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve & Publish
          </Button>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
            1. Select Industry / Business Type
          </label>
          <div className="flex flex-wrap gap-2">
            {businessTypes.map(bt => (
              <Button
                key={bt.id}
                variant={selectedType?.id === bt.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(bt)}
                className="text-xs h-8"
              >
                {bt.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
            2. Select Script Language
          </label>
          <div className="flex items-center gap-2">
            {languages.map(lang => (
              <Button
                key={lang}
                variant={selectedLang === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLang(lang)}
                className="text-xs h-8"
              >
                <Languages className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                {lang}
              </Button>
            ))}
            {currentScript && (
              <Badge variant="outline" className={`ml-auto ${currentScript.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                v{currentScript.version} ({currentScript.status.toUpperCase()})
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Script Editor */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section: Opening & Hook */}
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Opening & Identification Hook
                </CardTitle>
                <CardDescription className="text-xs">First 5-10 seconds to introduce and capture attention politely.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                placeholder="Hello! Am I speaking with..."
                className="text-xs font-mono resize-y min-h-[70px] bg-background/50"
              />
            </CardContent>
          </Card>

          {/* Section: 30s & 3min Pitch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  30-Second Elevator Pitch
                </CardTitle>
                <CardDescription className="text-xs">Quick hook if the lead is busy.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={pitch30s}
                  onChange={(e) => setPitch30s(e.target.value)}
                  placeholder="In 30 seconds, we solve..."
                  className="text-xs font-mono resize-y min-h-[100px] bg-background/50"
                />
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  3-Minute Deep Dive Pitch
                </CardTitle>
                <CardDescription className="text-xs">Full value proposition once engaged.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={pitch3min}
                  onChange={(e) => setPitch3min(e.target.value)}
                  placeholder="Detailed breakdown of custom architecture..."
                  className="text-xs font-mono resize-y min-h-[100px] bg-background/50"
                />
              </CardContent>
            </Card>
          </div>

          {/* Section: Objection Handling Rebuttals */}
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  Objection Rebuttals (Tap to show in Telecaller UI)
                </CardTitle>
                <CardDescription className="text-xs">Instant responses to handle common sales objections.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setObjections([...objections, { objection: '', rebuttal: '' }])}
                className="text-xs h-7"
              >
                + Add Objection
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {objections.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/40 bg-muted/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-5">#{idx + 1}</span>
                    <Input
                      value={item.objection}
                      onChange={(e) => {
                        const next = [...objections];
                        next[idx].objection = e.target.value;
                        setObjections(next);
                      }}
                      placeholder="Objection (e.g., Too expensive / Already have vendor)"
                      className="text-xs h-8 bg-background font-medium"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setObjections(objections.filter((_, i) => i !== idx))}
                      className="text-xs text-red-400 hover:text-red-500 h-8 px-2"
                    >
                      Delete
                    </Button>
                  </div>
                  <Textarea
                    value={item.rebuttal}
                    onChange={(e) => {
                      const next = [...objections];
                      next[idx].rebuttal = e.target.value;
                      setObjections(next);
                    }}
                    placeholder="Effective response..."
                    className="text-xs font-mono bg-background min-h-[50px]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section: Closing CTA & WhatsApp Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Closing Call-To-Action (CTA)
                </CardTitle>
                <CardDescription className="text-xs">Lock in the demo or meeting commitment.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={closingCta}
                  onChange={(e) => setClosingCta(e.target.value)}
                  placeholder="Would 4 PM this Thursday work for a quick screen share?"
                  className="text-xs font-mono resize-y min-h-[80px] bg-background/50"
                />
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/60 shadow-sm">
              <CardHeader className="py-3 px-4 border-b border-border/30 bg-muted/15">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  WhatsApp Follow-Up Template
                </CardTitle>
                <CardDescription className="text-xs">One-tap copy to WhatsApp with variables.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Hi [Name], thank you for speaking with me..."
                  className="text-xs font-mono resize-y min-h-[80px] bg-background/50"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Telecaller Live Preview Sidepanel */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-purple-500/30 bg-card shadow-md sticky top-6">
            <CardHeader className="py-3 px-4 border-b border-purple-500/20 bg-purple-50 dark:bg-purple-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <CardTitle className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider">
                    Telecaller Live Preview
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-semibold">
                  {selectedLang}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase mb-1">
                  Telecaller Call Screen Header
                </span>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60 text-[11px]">
                  <p className="font-bold text-foreground">Target: The Royal Bistro Group</p>
                  <p className="text-muted-foreground text-[10px]">Category: {selectedType?.name || 'Restaurants & Cafes'}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase mb-1">
                  1. Opening Hook (First 15s)
                </span>
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed italic">
                  "{opening || 'Hello Sir/Ma\'am! Calling from Fusion Engine Tech regarding direct table ordering.'}"
                </div>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase mb-1">
                  2. Quick 30s Pitch
                </span>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-foreground text-[11px] leading-relaxed">
                  {pitch30s || 'We set up custom QR ordering and billing with zero aggregator commission fees.'}
                </div>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase mb-1">
                  3. Objection Rebuttals (Interactive)
                </span>
                <div className="space-y-1.5">
                  {objections.slice(0, 3).map((obj, i) => (
                    <details key={i} className="group rounded-lg border border-border/60 bg-muted/30 p-2 cursor-pointer transition-colors hover:bg-muted/50">
                      <summary className="font-semibold text-foreground text-[11px] list-none flex items-center justify-between">
                        <span className="text-purple-700 dark:text-purple-300 font-medium">{obj.objection || `Objection #${i + 1}`}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform text-muted-foreground" />
                      </summary>
                      <p className="mt-2 text-foreground text-[11px] pl-2.5 border-l-2 border-purple-600 dark:border-purple-400 bg-background/60 p-1.5 rounded-r">
                        {obj.rebuttal || 'We integrate seamlessly with your existing hardware.'}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block text-[11px] uppercase mb-1">
                  4. WhatsApp One-Click Copy
                </span>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-2">
                  <span className="truncate text-emerald-900 dark:text-emerald-300 font-medium text-[11px]">
                    {whatsapp || 'Hi, thank you for speaking with me today regarding your restaurant POS software...'}
                  </span>
                  <Copy
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 cursor-pointer hover:opacity-75"
                    onClick={() => {
                      navigator.clipboard.writeText(whatsapp || 'Hi, thank you for speaking with me today!');
                      toast.success('Copied preview template to clipboard!');
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScriptsAdminPage;
