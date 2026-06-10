'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCustomers } from '@/data/mock-customers';
import { mockInvoices } from '@/data/mock-invoices';
import { Customer } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  X,
  CreditCard,
  History
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function CustomersPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(mockCustomers[0]);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((c) => {
      return (
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.taxId.includes(searchTerm)
      );
    });
  }, [searchTerm]);

  // Find invoices associated with selected customer
  const customerInvoices = useMemo(() => {
    if (!selectedCustomer) return [];
    return mockInvoices.filter(inv => inv.customerId === selectedCustomer.id);
  }, [selectedCustomer]);

  return (
    <div className="space-y-6 relative h-full">
      <PageHeader 
        title={t('customers.title')} 
        description={t('customers.description')}
        actions={
          <Button size="sm" className="flex items-center gap-1">
            <UserPlus className="w-4 h-4" /> {t('customers.addCustomer')}
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Customer Grid */}
        <div className="flex-1 min-w-0 w-full space-y-4">

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('customers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Table Card */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-3.5">{t('quotations.customerName')}</th>
                    <th className="px-6 py-3.5">{t('customers.contactPerson')}</th>
                    <th className="px-6 py-3.5 text-center">{t('newQuotation.creditTerm')}</th>
                    <th className="px-6 py-3.5 text-right">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดสั่งซื้อรวม' : 'Total Orders'}</th>
                    <th className="px-6 py-3.5 text-right">{t('invoices.unpaid')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          selectedCustomer?.id === c.id ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <td className={`px-6 py-4 border-l-4 transition-all duration-200 ${
                          selectedCustomer?.id === c.id ? "border-l-blue-600" : "border-l-transparent"
                        }`}>
                          <div>
                            <span className="text-slate-900 block font-bold text-sm">{c.companyName}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">ID: {c.id} | {t('customers.taxId')}: {c.taxId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="text-slate-700 block font-semibold">{c.contactPerson}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{c.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-600">
                          {c.creditTerm}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-700">
                          {formatNumber(c.totalOrders)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-rose-600">
                          {formatCurrency(c.outstandingBalance)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                        {t('customers.noCustomers')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer Details Side Panel */}
        {selectedCustomer && (
          <Card className="w-full lg:w-96 shrink-0 shadow-lg border-blue-100/60 sticky top-20">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">{t('customers.clientProfile')}</span>
                <CardTitle className="text-md mt-1 font-bold text-slate-900">{selectedCustomer.companyName}</CardTitle>
                <CardDescription className="text-xs font-semibold">System Customer ID: {selectedCustomer.id}</CardDescription>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded cursor-pointer animate-in fade-in"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Account Receivable Highlight */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t('invoices.totalOutstanding')}</span>
                  <span className="text-lg font-bold text-rose-600 block mt-1">
                    {formatCurrency(selectedCustomer.outstandingBalance)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('customers.contactPerson') === 'พนักงานผู้ติดต่อจัดซื้อ' ? 'ข้อมูลการติดต่อ' : 'Contact Info'}
                </h4>
                
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-normal text-slate-600 font-semibold">{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>

              {/* Tax Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('common.viewAll') === 'ดูทั้งหมด' ? 'การตั้งค่าการเงิน' : 'Financial Setup'}
                </h4>
                
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg bg-slate-50/30 overflow-hidden text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold">{t('customers.taxId')}</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.taxId}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold">{t('newQuotation.creditTerm')}</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.creditTerm}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-slate-500 font-semibold">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ยอดสั่งซื้อรวม' : 'Total Orders'}</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.totalOrders} {t('common.viewAll') === 'ดูทั้งหมด' ? 'รายการ' : 'items'}</span>
                  </div>
                </div>
              </div>

              {/* Client Ledger History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-blue-600" /> {t('customers.salesHistory')}
                </h4>
                
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg max-h-[220px] overflow-y-auto bg-slate-50/10 text-xs">
                  {customerInvoices.length > 0 ? (
                    customerInvoices.map((inv) => (
                      <div key={inv.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <span className="font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{t('invoices.dueDate')}: {inv.dueDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{formatCurrency(inv.amount)}</span>
                          <span className="text-[10px] block mt-0.5">
                            {inv.status === 'Paid' ? (
                              <span className="text-emerald-600 font-semibold">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ชำระแล้ว' : 'Settled'}</span>
                            ) : (
                              <span className="text-rose-500 font-semibold">{t('invoices.unpaid')}: {formatCurrency(inv.outstandingAmount)}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 font-medium">
                      {t('common.viewAll') === 'ดูทั้งหมด' ? 'ไม่มีประวัติใบแจ้งหนี้สำหรับลูกค้ารายนี้' : 'No invoices issued for this customer.'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
