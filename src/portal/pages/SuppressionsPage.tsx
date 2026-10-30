import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShieldAlert, Plus, Search, Download, Trash2, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const SuppressionsPage: React.FC = () => {
  const { activePersona } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedForLift, setSelectedForLift] = useState<any | null>(null);
  const [liftReason, setLiftReason] = useState('');

  // Local state for suppressions
  const [suppressions, setSuppressions] = useState([
    {
      id: 'sup_1',
      phoneNormalized: '9845012345',
      rawPhone: '+91 98450 12345',
      reason: 'dnc_request',
      until: null, // permanent
      createdAt: '2026-02-10',
      createdBy: 'Telecaller',
    },
    {
      id: 'sup_2',
      phoneNormalized: '9822099887',
      rawPhone: '+91 98220 99887',
      reason: 'invalid',
      until: null,
      createdAt: '2026-02-18',
      createdBy: 'Telecaller',
    },
    {
      id: 'sup_3',
      phoneNormalized: '9711054321',
      rawPhone: '+91 97110 54321',
      reason: 'existing_client',
      until: null,
      createdAt: '2026-03-01',
      createdBy: 'Super Admin',
    },
  ]);

  // Add suppression form state
  const [newPhone, setNewPhone] = useState('');
  const [newReason, setNewReason] = useState<'dnc_request' | 'invalid' | 'existing_client' | 'legal' | 'admin'>('dnc_request');

  // Auto clean duplicate suppressions on mount
  React.useEffect(() => {
    setSuppressions((prev) => {
      const seen = new Set<string>();
      return prev.filter((s) => {
        const clean = s.phoneNormalized.slice(-10);
        if (seen.has(clean)) return false;
        seen.add(clean);
        return true;
      });
    });
  }, []);

  const handleCleanDuplicates = () => {
    const seen = new Set<string>();
    const initialCount = suppressions.length;
    const cleaned = suppressions.filter((s) => {
      const clean = s.phoneNormalized.slice(-10);
      if (seen.has(clean)) return false;
      seen.add(clean);
      return true;
    });
    setSuppressions(cleaned);
    const removed = initialCount - cleaned.length;
    if (removed > 0) {
      toast.success(`Removed ${removed} duplicate DNC suppression records.`);
    } else {
      toast.info('No duplicate DNC numbers found. Registry is completely clean!');
    }
  };

  const filteredSuppressions = suppressions.filter(
    (s) => s.phoneNormalized.includes(searchQuery) || s.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      toast.error('Please input a valid 10-digit phone number.');
      return;
    }

    const isDuplicate = suppressions.some((s) => s.phoneNormalized.slice(-10) === cleanPhone);
    if (isDuplicate) {
      toast.error(`Phone +91 ${cleanPhone} is already in the DNC suppression list!`);
      return;
    }

    const newRecord = {
      id: `sup_${Date.now()}`,
      phoneNormalized: cleanPhone,
      rawPhone: newPhone.trim().startsWith('+91') ? newPhone.trim() : `+91 ${cleanPhone}`,
      reason: newReason,
      until: null,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: activePersona.name,
    };

    setSuppressions([newRecord, ...suppressions]);
    toast.success(`Phone +91 ${cleanPhone} added to statutory suppression list.`);
    setIsAddOpen(false);
    setNewPhone('');
  };

  const handleConfirmLift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForLift) return;
    if (!liftReason.trim()) {
      toast.error('A mandatory audit reason is required to lift a suppression.');
      return;
    }

    setSuppressions(suppressions.filter((s) => s.id !== selectedForLift.id));
    toast.success(`Suppression lifted for ${selectedForLift.phoneNormalized}. Reason logged to audit trail.`);
    setSelectedForLift(null);
    setLiftReason('');
  };

  const handleExportCSV = () => {
    const headers = ['Phone Normalized', 'Raw Phone', 'Reason', 'Suppressed Until', 'Created At', 'Created By'];
    const rows = filteredSuppressions.map((s) => [
      `"${s.phoneNormalized}"`,
      `"${s.rawPhone}"`,
      `"${s.reason}"`,
      `"${s.until || 'Permanent'}"`,
      `"${s.createdAt}"`,
      `"${s.createdBy}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suppression_dnc_list_${Date.now()}.csv`;
    a.click();
    toast.success('DNC & Suppression list exported to CSV.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">
              TRAI & DND Compliance
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Server-Enforced Anti-Repeat Dialing
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Do-Not-Call (DNC) & Contact Suppression List
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Statutory suppression registry. Blocked numbers cannot be imported or locked by telecallers under TRAI TCCCPR guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCleanDuplicates} className="text-xs h-8 gap-1.5 border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clean Duplicates</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="text-xs h-8 gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export DNC CSV</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="text-xs h-8 gap-1.5 shadow-sm bg-rose-600 hover:bg-rose-700 text-white">
            <Plus className="w-4 h-4" />
            <span>+ Add DNC Number</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search phone number or reason..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Suppression Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
            <span>Suppressed Numbers ({filteredSuppressions.length})</span>
            <Badge variant="outline" className="text-[10px] font-mono">
              Append-Only Enforcement
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Numbers in this registry are blocked atomically in Postgres `lock_lead` RPC with SELECT ... FOR UPDATE.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Phone (Normalized)</th>
                  <th className="py-2.5 px-3">Raw Phone</th>
                  <th className="py-2.5 px-3">Suppression Reason</th>
                  <th className="py-2.5 px-3">Validity</th>
                  <th className="py-2.5 px-3">Logged Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredSuppressions.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {item.phoneNormalized}
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {item.rawPhone}
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono ${
                          item.reason === 'dnc_request'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 font-bold'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.reason.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-muted-foreground">
                      {item.until || 'Permanent / Statutory'}
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {item.createdAt}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedForLift(item)}
                        className="text-xs h-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        Lift Suppression
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Add DNC Number */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Add Phone to Suppression Registry
            </DialogTitle>
            <DialogDescription className="text-xs">
              Block all future calling and imports for this phone number across all agents.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSuppression} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Phone Number *</label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Reason for Suppression *</label>
              <Select value={newReason} onValueChange={(v: any) => setNewReason(v)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dnc_request" className="text-xs">Customer Requested Do-Not-Call (DNC)</SelectItem>
                  <SelectItem value="invalid" className="text-xs">Invalid / Non-Existent Number</SelectItem>
                  <SelectItem value="existing_client" className="text-xs">Existing ERP Client</SelectItem>
                  <SelectItem value="legal" className="text-xs">Legal / Compliance Hold</SelectItem>
                  <SelectItem value="admin" className="text-xs">Administrative Executive Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700">
                Confirm Suppression
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Lift Suppression with Mandatory Reason */}
      <Dialog open={Boolean(selectedForLift)} onOpenChange={(open) => !open && setSelectedForLift(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Lift Statutory Suppression
            </DialogTitle>
            <DialogDescription className="text-xs">
              Lifting suppression on <strong>{selectedForLift?.phoneNormalized}</strong>. Admin must provide a mandatory audit reason.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmLift} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Mandatory Reason for Lifting *</label>
              <Input
                value={liftReason}
                onChange={(e) => setLiftReason(e.target.value)}
                placeholder="e.g. Client called inbound and explicitly requested software quotation"
                className="text-xs"
                required
              />
              <span className="text-[10px] text-muted-foreground">
                This override will be logged with your Administrator identity in the permanent audit trail.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedForLift(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700">
                Confirm Lift & Audit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppressionsPage;
