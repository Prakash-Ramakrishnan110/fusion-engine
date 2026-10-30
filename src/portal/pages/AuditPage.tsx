import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search, Download, Filter, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export const AuditPage: React.FC = () => {
  const { auditLogs } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesQuery =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === 'ALL' || log.actorRole === selectedRoleFilter;
    return matchesQuery && matchesRole;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.warning('No audit logs to export.');
      return;
    }

    const headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action Code', 'Target Entity', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.targetEntity}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_trail_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported audit trail to CSV!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Compliance & Security
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Append-Only Immutable Event Stream</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Immutable Activity Audit Trail
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographic ledger tracking all role switches, PR reviews, contact locks, and financial voucher releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 font-mono">
            {auditLogs.length} Events Logged
          </Badge>
          <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs gap-1.5 h-8">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action type (e.g. VOUCHER, LOCK, APPROVAL), or details..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
          {['ALL', 'admin', 'developer', 'telecaller'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRoleFilter === role
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <History className="w-4 h-4 text-primary" />
            Audit Ledger ({filteredLogs.length} Records)
          </CardTitle>
          <CardDescription className="text-xs">
            Chronological records are permanently retained for statutory compliance and cannot be updated or deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action Code</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                      <History className="w-8 h-8 mx-auto text-primary opacity-40 mb-2" />
                      <p className="font-semibold text-foreground">Zero Audit Records Found</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        New activity logs will record here in real-time as actions are taken.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono text-muted-foreground whitespace-nowrap text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground">{log.actorName}</div>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 capitalize mt-0.5">
                          {log.actorRole}
                        </Badge>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-primary whitespace-nowrap text-[11px]">
                        {log.targetEntity}
                      </td>

                      <td className="py-3 px-3 text-muted-foreground leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
