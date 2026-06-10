'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockQuotations } from '@/data/mock-quotations';
import { Quotation } from '@/lib/types';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  FileText, 
  Eye, 
  Printer, 
  Mail, 
  Download, 
  X,
  Building,
  Calendar,
  User,
  Calculator
} from 'lucide-react';
import Link from 'next/link';

export default function QuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  // Status lists
  const statuses = ['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

  // Filter logic
  const filteredQuotations = useMemo(() => {
    return mockQuotations.filter((q) => {
      const matchesSearch = 
        q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Quotation Management" 
        description="Create, monitor, and manage B2B price proposals for electrical wiring products."
        actions={
          <Link href="/quotations/new">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Create Quotation
            </Button>
          </Link>
        }
      />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white hover:border-blue-200 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Proposals YTD</span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{mockQuotations.length}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white hover:border-emerald-200 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Accepted Deals</span>
            <h3 className="text-xl font-bold text-emerald-600 mt-2">
              {mockQuotations.filter(q => q.status === 'Accepted').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-white hover:border-blue-200 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sent & Pending</span>
            <h3 className="text-xl font-bold text-blue-600 mt-2">
              {mockQuotations.filter(q => q.status === 'Sent').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-white hover:border-rose-200 transition-colors">
          <CardContent className="p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Expired / Rejected</span>
            <h3 className="text-xl font-bold text-rose-600 mt-2">
              {mockQuotations.filter(q => q.status === 'Expired' || q.status === 'Rejected').length}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Quotation list and filtering controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quotation #, customer, sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Status buttons */}
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
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* List Card */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Quotation No</th>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Issued Date</th>
                  <th className="px-6 py-3.5 text-right">Grand Total</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5">Salesperson</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredQuotations.length > 0 ? (
                  filteredQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{q.quotationNumber}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-700">{q.customerName}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-500">{formatDate(q.date)}</td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                        {formatCurrency(q.grandTotal)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 font-semibold">{q.salesperson}</td>
                      <td className="px-6 py-3.5 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setPreviewQuotation(q)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 font-semibold flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Document
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No quotations match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Document Preview Modal */}
      {previewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setPreviewQuotation(null)}
          />
          
          {/* Print container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-50 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Actions Bar (Sticky) */}
            <div className="h-14 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-slate-50 rounded-t-xl">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Document Layout Preview (QT-ID: {previewQuotation.id})
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1" onClick={() => window.print()}>
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Customer
                </Button>
                <button 
                  onClick={() => setPreviewQuotation(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 font-serif text-slate-800 bg-white">
              {/* Document Header */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                    CABLE HUB SUPPLY CO., LTD.
                  </h2>
                  <p className="text-[10px] text-slate-500 font-sans font-semibold mt-1 leading-normal max-w-sm">
                    456 Factory Industrial Zone, Moo 4, Bang Na-Trad Rd, Bang Phli, Samut Prakan 10540<br/>
                    Tel: 02-999-0000 | Tax ID: 0105560999888
                  </p>
                </div>
                <div className="text-right font-sans">
                  <h1 className="text-2xl font-bold tracking-wider text-slate-900">QUOTATION</h1>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-xs text-left border border-slate-200 p-3 rounded-lg bg-slate-50/50">
                    <span className="text-slate-400 font-medium">Document No:</span>
                    <span className="font-bold text-slate-900">{previewQuotation.quotationNumber}</span>
                    <span className="text-slate-400 font-medium">Issued Date:</span>
                    <span className="font-semibold text-slate-900">{formatDate(previewQuotation.date)}</span>
                    <span className="text-slate-400 font-medium">Expiry Date:</span>
                    <span className="font-semibold text-rose-600">{formatDate(previewQuotation.expiryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 text-xs font-sans border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Client Company</span>
                  <div className="flex items-start gap-1">
                    <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{previewQuotation.customerName}</span>
                      <span className="text-slate-500 block mt-1 leading-normal max-w-xs">{mockQuotations[0].terms ? "123/45 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900" : "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Account Executive:</span>
                    <span className="font-semibold text-slate-800">{previewQuotation.salesperson}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Credit Term:</span>
                    <span className="font-bold text-slate-800">30 Days</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-6">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase">
                      <th className="py-2.5 w-8 text-center">#</th>
                      <th className="py-2.5">SKU / Description</th>
                      <th className="py-2.5 text-right w-16">Qty</th>
                      <th className="py-2.5 text-center w-16">Unit</th>
                      <th className="py-2.5 text-right w-24">Unit Price</th>
                      <th className="py-2.5 text-right w-16">Discount</th>
                      <th className="py-2.5 text-right w-28">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewQuotation.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-3">
                          <span className="font-bold text-slate-900 block">{item.sku}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{item.name}</span>
                        </td>
                        <td className="py-3 text-right font-semibold">{formatNumber(item.qty)}</td>
                        <td className="py-3 text-center text-slate-500 font-medium">{item.unit}</td>
                        <td className="py-3 text-right font-semibold">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right font-medium text-slate-500">{item.discount}%</td>
                        <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary Footer */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-6 border-t border-slate-200 font-sans text-xs">
                {/* Bank / Transfer info */}
                <div className="max-w-xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Payment Account</span>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg leading-normal text-[11px]">
                    <span className="font-bold text-slate-800 block">Siam Commercial Bank (SCB)</span>
                    <span className="text-slate-600 block mt-0.5">Account Name: Cable Hub Supply Co., Ltd.</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Account No: 123-4-56789-0</span>
                  </div>
                </div>

                {/* Calculation Totals */}
                <div className="w-full md:w-80 space-y-2 border border-slate-100 rounded-lg p-4 bg-slate-50/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Subtotal:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(previewQuotation.subtotal)}</span>
                  </div>
                  {previewQuotation.discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Flat Discount:</span>
                      <span>-{formatCurrency(previewQuotation.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Net Total (excl. VAT):</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(previewQuotation.subtotal - previewQuotation.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">VAT (7%):</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(previewQuotation.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="text-slate-900 font-bold">Grand Total:</span>
                    <span className="font-black text-blue-700">{formatCurrency(previewQuotation.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Signature */}
              <div className="mt-8 border-t border-slate-100 pt-6 font-sans text-xs space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Terms & Conditions</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal italic">
                    {previewQuotation.terms}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal italic">
                    Note: {previewQuotation.notes}
                  </p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-10 text-center max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <div className="border-b border-slate-300 pb-2">
                      <span className="text-xs font-semibold text-slate-400 block">(Signature)</span>
                    </div>
                    <span className="font-bold text-slate-800 text-xs block">Customer Authorized Signature</span>
                    <span className="text-[10px] text-slate-400 block">Date: ____/____/____</span>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-slate-300 pb-2">
                      <span className="text-xs font-bold text-blue-700 italic block font-serif">Ananya W.</span>
                    </div>
                    <span className="font-bold text-slate-800 text-xs block">Cable Hub Supply Representative</span>
                    <span className="text-[10px] text-slate-400 block">Date: {formatDate(previewQuotation.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
