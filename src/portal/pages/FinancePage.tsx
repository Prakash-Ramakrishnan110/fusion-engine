import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { PaymentVoucher } from '../types';
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
import {
  Coins,
  FileCheck2,
  Receipt,
  Building,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Send,
  AlertCircle,
  Sparkles,
  FolderKanban,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export const FinancePage: React.FC = () => {
  const {
    vouchers,
    projects,
    activeProjects,
    selectedProjectId,
    setSelectedProjectId,
    activePersona,
    currentUser,
    generateMilestoneVoucher,
    releasePaymentVoucher,
    tdsRate,
  } = usePortal();

  const [selectedVoucherForRelease, setSelectedVoucherForRelease] = useState<PaymentVoucher | null>(null);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<PaymentVoucher | null>(null);

  // Disbursement Form
  const [paymentMode, setPaymentMode] = useState<'NEFT' | 'RTGS' | 'IMPS' | 'UPI'>('UPI');
  const [utrRef, setUtrRef] = useState('');

  const user = currentUser || activePersona;
  const isSuperAdmin = user.role === 'super_admin' || user.role === 'admin';
  const isDeveloper = user.role === 'developer';

  // Projects & Inspected Project
  const inspectedProject =
    projects.find((p) => p.id === selectedProjectId && selectedProjectId !== 'all') ||
    activeProjects[0] ||
    projects[0];

  // Role filtered vouchers: Developer only sees own vouchers!
  const displayedVouchers = isDeveloper
    ? vouchers.filter((v) => v.recipientId === user.id)
    : selectedProjectId === 'all' || !selectedProjectId
    ? vouchers
    : vouchers.filter((v) => v.projectId === selectedProjectId);

  // Stats calculation
  const totalGross = displayedVouchers.reduce((acc, v) => acc + (v.grossAmountINR || v.amountINR || 0), 0);
  const totalTds = displayedVouchers.reduce((acc, v) => acc + (v.tdsDeductionINR || 0), 0);
  const totalNet = displayedVouchers.reduce((acc, v) => acc + (v.netPayableINR || 0), 0);

  const handleCreateVoucher = async (milestoneId: string) => {
    if (!inspectedProject) return;
    const newVoucher = await generateMilestoneVoucher(milestoneId, inspectedProject.id);
    if (newVoucher) {
      toast.success(`Generated Gate 2 Official Voucher: ${newVoucher.voucherNumber}`);
    }
  };

  const handleOpenReleaseModal = (voucher: PaymentVoucher) => {
    setSelectedVoucherForRelease(voucher);
    setPaymentMode('UPI');
    setUtrRef(`UPI/AXIS/${Math.floor(100000000000 + Math.random() * 900000000000)}`);
  };

  const handleReleasePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucherForRelease) return;

    if (!utrRef.trim()) {
      toast.error('Please input valid Bank UTR / IMPS transaction reference.');
      return;
    }

    await releasePaymentVoucher(selectedVoucherForRelease.id, paymentMode, utrRef.trim());
    setSelectedVoucherForRelease(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
              Dual-Gate Finance & Escrow
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Sec 194J TDS ({tdsRate}%) Automated
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            {isDeveloper ? 'My Earnings & Payment Vouchers' : 'Dual-Gate Compensation & Disbursements'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generation of official numbered vouchers (<code>FET-MS-2026-XXXX</code>), TDS deduction under Sec 194J, and bank UTR reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project Selector for Admin */}
          {isSuperAdmin && (
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="text-xs h-8 w-48">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.code} - {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Statutory Disclaimer Note */}
      <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-muted-foreground flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Statutory Compliance Note:</strong> Automated TDS rate default is {tdsRate}% under Sec 194J of the Income Tax Act. Please confirm specific PAN applicability and threshold limits with your Chartered Accountant.
          </span>
        </span>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Gross Contract Value</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground">
              ₹{totalGross.toLocaleString('en-IN')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Total approved deliverable milestones
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Statutory TDS Deducted ({tdsRate}%)</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-rose-500">
              ₹{totalTds.toLocaleString('en-IN')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Reconciled for quarterly Form 26Q filing
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Net Disbursed / Received</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-emerald-500">
              ₹{totalNet.toLocaleString('en-IN')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Net payout via IMPS/NEFT/UPI transfer
          </CardContent>
        </Card>
      </div>

      {/* Gate 2 Generation Section (For Super Admin) */}
      {isSuperAdmin && inspectedProject && (
        <Card className="border-border/60 bg-gradient-to-br from-card/90 to-amber-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  Gate 2 Voucher Generation: {inspectedProject.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Review deliverable milestones and generate official voucher records for bank disbursement.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inspectedProject.milestones?.map((ms) => (
                <div
                  key={ms.id}
                  className="p-3.5 rounded-xl border border-border/50 bg-background/60 flex flex-col justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{ms.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {ms.percentageAllocation}%
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs font-semibold text-foreground">
                      Agreed Sum: ₹{ms.agreedAmountINR?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        ms.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : ms.status === 'Gate 1 Approved'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/30 font-semibold'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {ms.status}
                    </Badge>

                    {ms.status !== 'Paid' ? (
                      <Button
                        size="sm"
                        className="text-xs h-7 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => handleCreateVoucher(ms.id)}
                      >
                        <Coins className="w-3 h-3 mr-1" />
                        Generate Gate 2 Voucher
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        {ms.voucherNumber || 'Disbursed'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Official Voucher Registry Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Disbursement Voucher Ledger</CardTitle>
              <CardDescription className="text-xs">
                Audited vouchers under Income Tax Act Sec 194J & MSME statutory guidelines.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {displayedVouchers.length} Vouchers Listed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">Voucher #</th>
                  <th className="py-2.5 px-3">Payee & PAN</th>
                  <th className="py-2.5 px-3">Project & Ref</th>
                  <th className="py-2.5 px-3 text-right">Gross (₹)</th>
                  <th className="py-2.5 px-3 text-right">TDS 10% (₹)</th>
                  <th className="py-2.5 px-3 text-right">Net Payable (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {displayedVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                      <Receipt className="w-8 h-8 mx-auto text-primary opacity-40 mb-2" />
                      <p className="font-semibold text-foreground">No Vouchers Generated Yet</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Approve tasks or milestones to automatically generate Gate 2 vouchers with TDS deduction.
                      </p>
                    </td>
                  </tr>
                ) : (
                  displayedVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        {voucher.voucherNumber}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground">{voucher.recipientName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          PAN: {voucher.recipientPan || 'ABCDE1234F'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-foreground">{voucher.projectName || 'Software Build'}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                          {voucher.milestoneOrLeadRef}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-foreground">
                        ₹{(voucher.grossAmountINR || voucher.amountINR).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-rose-500 font-medium">
                        -₹{voucher.tdsDeductionINR.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">
                        ₹{voucher.netPayableINR.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            voucher.status === 'Released / Paid'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : voucher.status === 'Approved'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {voucher.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print / View PDF */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedVoucherForPrint(voucher)}
                            title="Print Voucher PDF"
                          >
                            <Printer className="w-3.5 h-3.5 mr-1" />
                            PDF
                          </Button>

                          {/* Admin Release Payment */}
                          {isSuperAdmin && voucher.status !== 'Released / Paid' && (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleOpenReleaseModal(voucher)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Pay Out
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Payment Disbursement Dialog */}
      <Dialog
        open={Boolean(selectedVoucherForRelease)}
        onOpenChange={(open) => !open && setSelectedVoucherForRelease(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-500" />
              Disburse Payment: {selectedVoucherForRelease?.voucherNumber}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record bank transfer details and mark voucher as disbursed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReleasePayment} className="space-y-4 py-2 text-xs">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payee:</span>
                <span className="font-bold text-foreground">{selectedVoucherForRelease?.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payee PAN:</span>
                <span className="font-mono text-foreground">{selectedVoucherForRelease?.recipientPan || 'ABCDE1234F'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Disbursable Sum:</span>
                <span className="font-mono font-bold text-emerald-500 text-sm">
                  ₹{selectedVoucherForRelease?.netPayableINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Payment Channel</label>
              <Select value={paymentMode} onValueChange={(v: any) => setPaymentMode(v)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI" className="text-xs">UPI Transfer</SelectItem>
                  <SelectItem value="IMPS" className="text-xs">IMPS Immediate Transfer</SelectItem>
                  <SelectItem value="NEFT" className="text-xs">NEFT National Electronic Funds</SelectItem>
                  <SelectItem value="RTGS" className="text-xs">RTGS High-Value Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Bank UTR / Transaction Reference *</label>
              <Input
                value={utrRef}
                onChange={(e) => setUtrRef(e.target.value)}
                placeholder="e.g. UPI/AXIS/123456789012 or CMS202603201"
                className="text-xs font-mono"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedVoucherForRelease(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Confirm & Record Disbursement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Printable PDF Voucher */}
      <Dialog
        open={Boolean(selectedVoucherForPrint)}
        onOpenChange={(open) => !open && setSelectedVoucherForPrint(null)}
      >
        <DialogContent className="max-w-2xl print:max-w-full print:m-0 print:p-0">
          <DialogHeader className="print:hidden">
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span>Official Disbursement Voucher</span>
              <Button size="sm" onClick={handlePrint} className="gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedVoucherForPrint && (
            <div className="p-6 border rounded-xl bg-white text-zinc-900 space-y-5 text-xs font-sans print:border-none print:shadow-none">
              {/* Company Letterhead Header */}
              <div className="border-b pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 tracking-tight">FUSION ENGINE TECHNOLOGY</h2>
                  <p className="text-[11px] text-zinc-500">Ministry of MSME / Startup India Registered Enterprise</p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Udyam: UDYAM-TN-02-0089124 • GSTIN: 33AAACF1234Q1Z2</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-indigo-700">{selectedVoucherForPrint.voucherNumber}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Date: {new Date(selectedVoucherForPrint.createdAt).toLocaleDateString('en-IN')}</div>
                  <Badge variant="outline" className="text-[9px] uppercase font-mono mt-1">
                    {selectedVoucherForPrint.status}
                  </Badge>
                </div>
              </div>

              {/* Payee Details */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-50 rounded-lg">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Payee Details</span>
                  <div className="font-bold text-zinc-900 mt-0.5">{selectedVoucherForPrint.recipientName}</div>
                  <div className="text-[11px] text-zinc-600 font-mono">PAN: {selectedVoucherForPrint.recipientPan || 'ABCDE1234F'}</div>
                  <div className="text-[11px] text-zinc-600">Role: {selectedVoucherForPrint.recipientRole}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Project & Scope Reference</span>
                  <div className="font-bold text-zinc-900 mt-0.5">{selectedVoucherForPrint.projectName || 'Software Build'}</div>
                  <div className="text-[11px] text-zinc-600">{selectedVoucherForPrint.milestoneOrLeadRef}</div>
                  {selectedVoucherForPrint.transactionReferenceUTR && (
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      UTR: {selectedVoucherForPrint.transactionReferenceUTR} ({selectedVoucherForPrint.paymentMode})
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Calculation Table */}
              <table className="w-full text-left text-xs border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-600 font-semibold">
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="p-2 font-medium">Gross Milestone Escrow Sum</td>
                    <td className="p-2 text-right font-mono">
                      ₹{(selectedVoucherForPrint.grossAmountINR || selectedVoucherForPrint.amountINR).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-600">
                      Less: Tax Deducted at Source (TDS under Sec 194J @ {tdsRate}%)
                    </td>
                    <td className="p-2 text-right font-mono text-red-600">
                      -₹{selectedVoucherForPrint.tdsDeductionINR.toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                  <tr className="bg-zinc-50 font-bold">
                    <td className="p-2 text-zinc-900">Net Payable / Disbursed Amount</td>
                    <td className="p-2 text-right font-mono text-emerald-700 text-sm">
                      ₹{selectedVoucherForPrint.netPayableINR.toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Dual Gate Sign-off Verification */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-[11px]">
                <div className="space-y-1">
                  <div className="font-semibold text-zinc-700">Gate 1: Technical Acceptance Sign-Off</div>
                  <div className="text-zinc-500">Verified by Tech Lead • PR & Unit Tests Approved</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="font-semibold text-zinc-700">Gate 2: Executive Disbursement Sign-Off</div>
                  <div className="text-zinc-500">Authorized by Super Admin • Transferred via Banking Portal</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
