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
import { Building2, Search, Plus, Mail, Download, FolderKanban, CheckCircle2, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Client } from '../types';

export const ClientsPage: React.FC = () => {
  const { clients, addClient, deleteClient, deduplicateClients } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newContractValue, setNewContractValue] = useState('150000');

  const handleCleanDuplicates = async () => {
    await deduplicateClients();
  };

  const filteredClients = (clients || []).filter((c) => {
    if (!c) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.contactPerson || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.gstNo || '').toLowerCase().includes(q)
    );
  });

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      toast.error('Client organization name and phone number are required.');
      return;
    }

    const cleanNewPhone = newPhone.replace(/\D/g, '');
    const isDup = (clients || []).some(
      (c) =>
        (c.name || '').trim().toLowerCase() === newName.trim().toLowerCase() ||
        (c.phone || '').replace(/\D/g, '') === cleanNewPhone
    );

    if (isDup) {
      toast.error('A client with this name or phone number already exists!');
      return;
    }

    const res = await addClient({
      name: newName.trim(),
      contactPerson: newContact.trim() || 'Authorized Representative',
      phone: newPhone.trim(),
      email: newEmail.trim() || 'info@client.in',
      gstNo: newGst.trim() || 'Unregistered',
      address: newAddress.trim() || 'India',
      projectCode: 'PRJ-2026-' + Math.floor(100 + Math.random() * 900),
      projectName: newProjectName.trim() || 'Custom Enterprise Build',
      contractValueINR: Number(newContractValue) || 150000,
      status: 'Active',
    });

    if (res.success) {
      setIsNewClientOpen(false);
      setNewName('');
      setNewContact('');
      setNewPhone('');
      setNewEmail('');
      setNewGst('');
      setNewAddress('');
      setNewProjectName('');
      setNewContractValue('150000');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Client Name', 'Contact Person', 'Phone', 'Email', 'GSTIN', 'Address', 'Status', 'Created At'];
    const rows = filteredClients.map((c) => [
      `"${c.name}"`,
      `"${c.contactPerson}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.gstNo}"`,
      `"${c.address}"`,
      `"${c.status}"`,
      `"${c.createdAt}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_directory_${Date.now()}.csv`;
    a.click();
    toast.success('Clients directory exported to CSV.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              CRM & ERP Bridge
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {(clients || []).length} Enterprise Clients
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Client Accounts & Organizations
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Directory of converted client entities, statutory GSTIN records, and linked active software build projects.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanDuplicates}
            className="text-xs h-8 gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clean Duplicates</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="text-xs h-8 gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setIsNewClientOpen(true)} className="text-xs h-8 gap-1.5 shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>+ New Client</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name, contact person, or phone..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card className="border-border/60 bg-card/40 backdrop-blur text-center p-8">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {(clients || []).length === 0 ? 'No Client Accounts in Directory' : 'No Matching Clients Found'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {(clients || []).length === 0
                ? 'Your client accounts directory is currently clean. Click "+ New Client" to onboard an organization or convert qualified leads from the CRM Workspace.'
                : 'Try adjusting your search criteria.'}
            </p>
            {(clients || []).length === 0 && (
              <Button size="sm" onClick={() => setIsNewClientOpen(true)} className="text-xs gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>Onboard First Client</span>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="p-4 pb-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">GST: {client.gstNo || 'N/A'}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-semibold">
                    {client.status || 'Active'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => setClientToDelete(client)}
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {client.name}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-2 text-muted-foreground">
                <span>{client.contactPerson}</span>
                <span>•</span>
                <span className="font-mono">{client.phone}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-background/50 border border-border/40 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <FolderKanban className="w-3.5 h-3.5 text-primary" />
                    <span>{client.projectName || 'Enterprise Engagement'}</span>
                  </span>
                  {client.contractValueINR && (
                    <span className="font-mono text-primary font-bold">
                      ₹{client.contractValueINR.toLocaleString()}
                    </span>
                  )}
                </div>
                {client.projectCode && (
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Project Code: {client.projectCode}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {client.email}
                </span>
                <span>Onboarded: {client.createdAt || 'Recent'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL: New Client Dialog */}
      <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Onboard Enterprise Client
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a direct client entity before initiating project architecture drafting.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Business / Organization Name *</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Royal Bistro Hospitality Group"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Contact Person</label>
                <Input
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. Vikramaditya"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Phone / WhatsApp *</label>
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Corporate Email</label>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">GSTIN (Optional)</label>
                <Input
                  value={newGst}
                  onChange={(e) => setNewGst(e.target.value)}
                  placeholder="33AAACF1234Q1Z2"
                  className="text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Linked Project Name</label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. POS Automation"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Contract Value (INR)</label>
                <Input
                  value={newContractValue}
                  onChange={(e) => setNewContractValue(e.target.value)}
                  placeholder="150000"
                  type="number"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Registered Address</label>
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="City, State"
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewClientOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save & Onboard Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Delete Client Confirmation */}
      <Dialog open={Boolean(clientToDelete)} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="w-4 h-4 text-destructive" />
              Delete Client Account
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete the client record for{' '}
              <strong className="text-foreground">{clientToDelete?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setClientToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (!clientToDelete) return;
                setIsDeleting(true);
                await deleteClient(clientToDelete.id);
                setIsDeleting(false);
                setClientToDelete(null);
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
