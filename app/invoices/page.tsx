'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockInvoices } from '@/data/mock-invoices';
import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Search, 
  Receipt, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  PiggyBank,
  CheckCircle2
} from 'lucide-react';

import { useSecurity } from '@/lib/security-context';
import { useLanguage } from '@/lib/language-context';
import AccessDenied from '@/components/layout/access-denied';

export default function InvoicesPage() {
  const { checkPermission, logAction } = useSecurity();
  const { t } = useLanguage();

  if (!checkPermission('manage_invoices')) {
    return <AccessDenied moduleNameTh="ใบแจ้งหนี้ (Invoices)" moduleNameEn="Invoices" />;
  }

  // Local state to simulate receiving payments
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Dialog State
  const [paymentSuccessInfo, setPaymentSuccessInfo] = useState<{ invNo: string; amt: number } | null>(null);

  // Status List
  const statuses = ['All', 'Paid', 'Partially Paid', 'Unpaid', 'Overdue'];

  // Calculations based on live state
  const metrics = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstandingAmount = invoices.reduce((sum, inv) => {
      return sum + (inv.status !== 'Paid' ? inv.outstandingAmount : 0);
    }, 0);
    const overdueAmount = invoices.reduce((sum, inv) => {
      return sum + (inv.status === 'Overdue' ? inv.outstandingAmount : 0);
    }, 0);

    return {
      totalInvoiced,
      paidAmount,
      outstandingAmount,
      overdueAmount
    };
  }, [invoices]);

  // Filtering Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = 
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Simulate payment processing
  const handleReceivePayment = (id: string) => {
    const targetInv = invoices.find(inv => inv.id === id);
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        setPaymentSuccessInfo({
          invNo: inv.invoiceNumber,
          amt: inv.outstandingAmount
        });
        return {
          ...inv,
          paidAmount: inv.amount,
          outstandingAmount: 0,
          status: 'Paid' as const
        };
      }
      return inv;
    });
    setInvoices(updated);
    if (targetInv) {
      logAction(`Invoice: Settled payment on invoice ${targetInv.invoiceNumber} (Marked Paid, settled ${targetInv.outstandingAmount} THB)`, 'Success', t('common.userName'));
    }
  };

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title={t('invoices.title')} 
        description={t('invoices.description')}
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="hover:border-slate-350 hover:shadow-lg hover:shadow-slate-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดออกบิลรวมทั้งหมด YTD' : 'Total Billed YTD'}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate" title={formatCurrency(metrics.totalInvoiced)}>
                {formatCurrency(metrics.totalInvoiced)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดออกใบแจ้งหนี้รวม YTD' : 'Accumulated billed amount YTD'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('invoices.collectedAmount')}</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-2xl font-black text-emerald-600 tracking-tight truncate" title={formatCurrency(metrics.paidAmount)}>
                {formatCurrency(metrics.paidAmount)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดรับชำระเงินเรียบร้อยแล้ว' : 'Collected and settled funds'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('invoices.totalOutstanding')}</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-2xl font-black text-amber-600 tracking-tight truncate" title={formatCurrency(metrics.outstandingAmount)}>
                {formatCurrency(metrics.outstandingAmount)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดค้างชำระทั้งหมดในระบบ' : 'Total accounts receivable balance'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold text-slate-400">{t('invoices.overdueCount')}</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-2xl font-black text-rose-600 tracking-tight truncate" title={formatCurrency(metrics.overdueAmount)}>
                {formatCurrency(metrics.overdueAmount)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'เกินกำหนดชำระเครดิตเทอม' : 'Overdue receivable balance'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice list controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('invoices.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status === 'All' ? (t('common.viewAll') === 'ดูทั้งหมด' ? 'ทั้งหมด' : t('common.viewAll')) : 
                 status === 'Paid' ? t('invoices.paid') : 
                 status === 'Partially Paid' ? t('invoices.partiallyPaid') : 
                 status === 'Unpaid' ? t('invoices.unpaid') : t('invoices.overdue')}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">{t('invoices.invoiceNo')}</th>
                  <th className="px-6 py-3.5">{t('quotations.quotationNo')}</th>
                  <th className="px-6 py-3.5">{t('quotations.customerName')}</th>
                  <th className="px-6 py-3.5">{t('quotations.issuedDate')}</th>
                  <th className="px-6 py-3.5">{t('invoices.dueDate')}</th>
                  <th className="px-6 py-3.5 text-right">{t('invoices.amountDue')}</th>
                  <th className="px-6 py-3.5 text-right">{t('invoices.paid')}</th>
                  <th className="px-6 py-3.5 text-right">{t('invoices.unpaid')}</th>
                  <th className="px-6 py-3.5 text-center">{t('products.status')}</th>
                  <th className="px-6 py-3.5 text-center">{t('quotations.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-500">{inv.quotationNumber}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-700">{inv.customerName}</td>
                      <td className="px-6 py-3.5 text-xs text-slate-500">{formatDate(inv.date)}</td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 font-semibold">{formatDate(inv.dueDate)}</td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium text-emerald-600">
                        {formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-700">
                        {formatCurrency(inv.outstandingAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {inv.status !== 'Paid' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReceivePayment(inv.id)}
                            className="text-xs px-2 py-1 font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-7"
                          >
                            {t('invoices.markAsPaid')}
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {t('common.viewAll') === 'ดูทั้งหมด' ? 'รับเงินแล้ว' : 'Settled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400 font-medium">
                      {t('invoices.noInvoices')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Payment Success Dialog */}
      {paymentSuccessInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setPaymentSuccessInfo(null)}
          />
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-sm p-6 z-50 relative text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ได้รับชำระเงินเรียบร้อย' : 'Payment Received'}</h3>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              {t('common.viewAll') === 'ดูทั้งหมด' ? 'การโอนเงินจำนวน ' : 'Payment of '} <span className="font-bold text-slate-900">{formatCurrency(paymentSuccessInfo.amt)}</span> {t('common.viewAll') === 'ดูทั้งหมด' ? ' เข้าธนาคารไทยพาณิชย์ สำหรับใบแจ้งหนี้ ' : ' SCB transfer for invoice '} <span className="font-bold text-slate-900">{paymentSuccessInfo.invNo}</span> {t('common.viewAll') === 'ดูทั้งหมด' ? ' ได้รับการตรวจสอบและปรับยอดทางบัญชีสำเร็จแล้ว' : ' has been processed. Ledger state updated.'}
            </p>
            <div className="flex justify-center pt-2">
              <Button size="sm" className="text-xs font-semibold bg-emerald-600 text-white" onClick={() => setPaymentSuccessInfo(null)}>
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'ปิดหน้าต่าง' : 'Dismiss'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
