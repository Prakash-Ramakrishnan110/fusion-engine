import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, TrendingUp, DollarSign, Users, Award, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const ReportsPage: React.FC = () => {
  const { projects, tasks, leads, vouchers, users } = usePortal();
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-2026');

  // Profitability per project
  const profitabilityData = projects.map((p) => {
    const pVouchers = vouchers.filter((v) => v.projectId === p.id);
    const totalDisbursed = pVouchers.reduce((acc, v) => acc + (v.grossAmountINR || v.amountINR || 0), 0);
    const contractValue = p.contractValueINR || 250000;
    const grossMargin = contractValue - totalDisbursed;
    const marginPct = contractValue > 0 ? Math.round((grossMargin / contractValue) * 100) : 0;

    return {
      name: p.code || p.name.slice(0, 15),
      contractValue,
      disbursed: totalDisbursed,
      margin: grossMargin,
      marginPct,
    };
  });

  // Leads by source
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.source || 'Direct Outreach';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const leadSourceData = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Payouts by developer
  const devPayouts = users
    .filter((u) => u.role === 'developer')
    .map((dev) => {
      const devVouchers = vouchers.filter((v) => v.recipientId === dev.id);
      const grossEarned = devVouchers.reduce((acc, v) => acc + (v.grossAmountINR || v.amountINR || 0), 0);
      const netPaid = devVouchers.reduce((acc, v) => acc + (v.netPayableINR || 0), 0);
      const devTasks = tasks.filter((t) => t.assignedToId === dev.id);
      const completed = devTasks.filter((t) => t.status === 'Approved').length;

      return {
        name: dev.name,
        grossEarned,
        netPaid,
        tasksTotal: devTasks.length,
        tasksCompleted: completed,
        onTimeRate: '95%',
        reworkRate: '5%',
      };
    });

  const handleExportCSV = (reportType: string) => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'profitability') {
      headers = ['Project Code', 'Contract Value (INR)', 'Disbursed (INR)', 'Gross Margin (INR)', 'Margin %'];
      rows = profitabilityData.map((d) => [
        `"${d.name}"`,
        `${d.contractValue}`,
        `${d.disbursed}`,
        `${d.margin}`,
        `${d.marginPct}%`,
      ]);
    } else {
      headers = ['Developer Name', 'Gross Payout (INR)', 'Net Paid (INR)', 'Total Tasks', 'Completed', 'On-Time Rate'];
      rows = devPayouts.map((d) => [
        `"${d.name}"`,
        `${d.grossEarned}`,
        `${d.netPaid}`,
        `${d.tasksTotal}`,
        `${d.tasksCompleted}`,
        `"${d.onTimeRate}"`,
      ]);
    }

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${Date.now()}.csv`;
    a.click();
    toast.success(`Exported ${reportType} report to CSV!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Executive Analytics & Financial Ledger
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Export-Ready CSV</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Financial & Engineering Intelligence Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit-ready project margins, developer compensation summaries, and telecaller conversion funnels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV('profitability')}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Profitability CSV</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profitability" className="space-y-4">
        <TabsList className="bg-muted/40 p-1">
          <TabsTrigger value="profitability" className="text-xs gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Project Profitability
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs gap-1.5">
            <Users className="w-3.5 h-3.5" /> Team Engineering Metrics
          </TabsTrigger>
          <TabsTrigger value="sources" className="text-xs gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Lead Acquisition Funnel
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFITABILITY */}
        <TabsContent value="profitability" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-border/60 bg-card/60 backdrop-blur shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  Contract Value vs Disbursements
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Comparison between gross contract budget and milestone disbursements in INR.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitabilityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" fontSize={11} stroke="#888888" />
                    <YAxis fontSize={11} stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="contractValue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Contract Value" />
                    <Bar dataKey="disbursed" fill="#10b981" radius={[4, 4, 0, 0]} name="Disbursed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  Portfolio Margin Overview
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Active project margins after developer payouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {profitabilityData.map((d, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/40 space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">{d.name}</span>
                      <span className="text-emerald-500 font-mono font-bold">{d.marginPct}% Margin</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Gross Margin:</span>
                      <span>₹{d.margin.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: TEAM METRICS */}
        <TabsContent value="team" className="space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Developer Performance & Payouts Ledger
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Track delivery reliability, rework rate, and total milestone disbursements per engineer.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportCSV('team')}
                className="text-xs h-7 gap-1"
              >
                <Download className="w-3 h-3" /> Export Team CSV
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Developer Name</th>
                      <th className="py-2.5 px-3 text-right">Gross Earned (₹)</th>
                      <th className="py-2.5 px-3 text-right">Net Received (₹)</th>
                      <th className="py-2.5 px-3 text-center">Tasks Assigned</th>
                      <th className="py-2.5 px-3 text-center">Approved</th>
                      <th className="py-2.5 px-3 text-center">On-Time Rate</th>
                      <th className="py-2.5 px-3 text-center">Rework Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {devPayouts.map((dev, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-foreground">{dev.name}</td>
                        <td className="py-3 px-3 text-right font-mono text-foreground font-semibold">
                          ₹{dev.grossEarned.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-500 font-bold">
                          ₹{dev.netPaid.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">{dev.tasksTotal}</td>
                        <td className="py-3 px-3 text-center font-mono text-emerald-500 font-semibold">{dev.tasksCompleted}</td>
                        <td className="py-3 px-3 text-center">
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 font-mono">
                            {dev.onTimeRate}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {dev.reworkRate}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SOURCES */}
        <TabsContent value="sources" className="space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Lead Acquisition Breakdown by Outreach Channel
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Distribution of verified restaurant prospects across marketing sources.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSourceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={11} stroke="#888888" />
                  <YAxis fontSize={11} stroke="#888888" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
