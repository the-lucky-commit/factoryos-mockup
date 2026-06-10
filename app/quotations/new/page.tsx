'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCustomers } from '@/data/mock-customers';
import { mockProducts } from '@/data/mock-products';
import { Customer, Product, QuotationItem } from '@/lib/types';
import { calculateTotals } from '@/lib/calculations';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Sparkles, 
  Building, 
  Calendar, 
  FileText, 
  CheckCircle2,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { useSecurity } from '@/lib/security-context';
import { useLanguage } from '@/lib/language-context';
import AccessDenied from '@/components/layout/access-denied';

export default function CreateQuotationPage() {
  const { checkPermission, logAction } = useSecurity();
  const { t } = useLanguage();

  if (!checkPermission('create_quotations')) {
    return <AccessDenied moduleNameTh="สร้างใบเสนอราคา (Create Quotation)" moduleNameEn="Create Quotation" />;
  }

  // 1. Core State
  const [selectedCustomerId, setSelectedCustomerId] = useState(mockCustomers[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  
  const [items, setItems] = useState<QuotationItem[]>([
    {
      sku: mockProducts[0].sku,
      name: mockProducts[0].name,
      unit: mockProducts[0].unit,
      qty: 200,
      unitPrice: mockProducts[0].price,
      discount: 5,
      total: 200 * mockProducts[0].price * 0.95
    }
  ]);
  
  const [flatDiscount, setFlatDiscount] = useState<number>(1000);
  const [notes, setNotes] = useState('Prices include delivery to Bangkok and metropolitan areas.');
  const [terms, setTerms] = useState('Payment: 30 Days Credit. Delivery: Within 7 days after Purchase Order.');
  
  // Modal / Toast Notification State
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newQuoteNo, setNewQuoteNo] = useState('');

  // 2. Computed values
  const currentCustomer = useMemo(() => {
    return mockCustomers.find(c => c.id === selectedCustomerId) || mockCustomers[0];
  }, [selectedCustomerId]);

  const totals = useMemo(() => {
    return calculateTotals(items, flatDiscount, 7);
  }, [items, flatDiscount]);

  // 3. Form operations
  const handleAddItem = () => {
    const product = mockProducts[1] || mockProducts[0];
    const newItem: QuotationItem = {
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      qty: 100,
      unitPrice: product.price,
      discount: 0,
      total: 100 * product.price
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        const tempItem = { ...item, [field]: value };
        
        // If sku changed, prefill product details
        if (field === 'sku') {
          const prod = mockProducts.find(p => p.sku === value);
          if (prod) {
            tempItem.name = prod.name;
            tempItem.unit = prod.unit;
            tempItem.unitPrice = prod.price;
          }
        }
        
        // Recalculate row total
        const qty = tempItem.qty || 0;
        const price = tempItem.unitPrice || 0;
        const disc = tempItem.discount || 0;
        tempItem.total = qty * price * (1 - disc / 100);
        
        return tempItem;
      }
      return item;
    });
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return; // Must keep at least one
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSaveQuotation = (status: 'Draft' | 'Sent') => {
    const newNo = `QT202606-${Math.floor(100 + Math.random() * 900)}`;
    setNewQuoteNo(newNo);
    setSavedSuccess(true);
    logAction(`Created Quotation ${newNo} (${status === 'Draft' ? 'แบบร่าง' : 'ส่งแล้ว'}) for customer ID: ${selectedCustomerId}`, 'Success', t('common.userName'));
  };

  return (
    <div className="space-y-6 relative h-full">
      <PageHeader 
        title={t('newQuotation.title')} 
        description={t('newQuotation.description')}
        actions={
          <Link href="/quotations">
            <Button variant="outline" size="sm">{t('newQuotation.backToQuotations')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Panel: Form Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                {t('newQuotation.corporateProfile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Select */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.selectCustomer')}</label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                >
                  {mockCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.contactPerson})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.quotationDate')}</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.expiryDate')}</label>
                <input 
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                />
              </div>

              {/* Sales Person */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.representative')}</label>
                <input 
                  type="text"
                  value={t('common.userName')}
                  disabled
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items Table */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {t('newQuotation.productLineItems')}
                </CardTitle>
                <CardDescription className="text-xs font-medium">{t('newQuotation.description')}</CardDescription>
              </div>
              <Button onClick={handleAddItem} size="sm" variant="outline" className="text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50">
                <Plus className="w-4 h-4" /> {t('newQuotation.addProductLine')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase">
                      <th className="px-4 py-3">{t('newQuotation.skuDesc')}</th>
                      <th className="px-4 py-3 text-right w-20">{t('newQuotation.quantity')}</th>
                      <th className="px-4 py-3 text-right w-24">{t('newQuotation.unitPrice')}</th>
                      <th className="px-4 py-3 text-right w-16">{t('newQuotation.discountPercent')}</th>
                      <th className="px-4 py-3 text-right w-28">{t('newQuotation.amount')}</th>
                      <th className="px-4 py-3 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/20">
                        {/* SKU Selector */}
                        <td className="px-4 py-3">
                          <select 
                            value={item.sku}
                            onChange={(e) => handleUpdateItem(idx, 'sku', e.target.value)}
                            className="p-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none w-56 font-semibold text-slate-700"
                          >
                            {mockProducts.map((p) => (
                              <option key={p.sku} value={p.sku}>
                                {p.sku} - {p.name.substring(0, 20)}...
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Qty */}
                        <td className="px-4 py-3 text-right">
                          <input 
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                            className="p-1.5 border border-slate-200 rounded text-xs w-16 text-right font-bold text-slate-800"
                            min="1"
                          />
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-right font-semibold">
                          <input 
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="p-1.5 border border-slate-200 rounded text-xs w-20 text-right font-semibold text-slate-800"
                            min="0"
                            step="0.5"
                          />
                        </td>

                        {/* Discount % */}
                        <td className="px-4 py-3 text-right">
                          <input 
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleUpdateItem(idx, 'discount', parseFloat(e.target.value) || 0)}
                            className="p-1.5 border border-slate-200 rounded text-xs w-12 text-right font-semibold text-slate-600"
                            min="0"
                            max="100"
                          />
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {formatCurrency(item.total)}
                        </td>

                        {/* Remove Action */}
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length === 1}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Adjustments & Terms */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-600" />
                {t('newQuotation.paymentTerms')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flat Discount */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.flatDiscountLabel')}</label>
                  <input 
                    type="number"
                    value={flatDiscount}
                    onChange={(e) => setFlatDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-bold"
                  />
                </div>
                {/* VAT Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('quotations.vat')}</label>
                  <input 
                    type="text"
                    value="7% (Standard Thailand VAT)"
                    disabled
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-semibold"
                  />
                </div>
              </div>

              {/* Delivery Terms */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.termsAndConditions')}</label>
                <input 
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('newQuotation.notes')}</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Row */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="font-semibold" onClick={() => handleSaveQuotation('Draft')}>
              {t('newQuotation.saveDraft')}
            </Button>
            <Button className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5" onClick={() => handleSaveQuotation('Sent')}>
              <Send className="w-4 h-4" /> {t('newQuotation.issueDocument')}
            </Button>
          </div>
        </div>

        {/* Right Panel: Live Document Preview */}
        <div className="sticky top-20">
          <Card className="shadow-lg border-blue-200/50 bg-white overflow-hidden">
            {/* Header info */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                {t('quotations.layoutPreviewTitle')}
              </span>
              <Button size="sm" variant="ghost" className="text-xs flex items-center gap-1 hover:bg-slate-200 font-semibold" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> {t('quotations.printPdf')}
              </Button>
            </div>

            {/* Document sheet */}
            <div className="p-8 md:p-10 font-serif text-slate-800 bg-white select-none max-h-[85vh] overflow-y-auto">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 font-sans">
                    {t('topbar.companyName').toUpperCase()}
                  </h2>
                  <p className="text-[9px] text-slate-500 font-sans font-semibold mt-0.5 leading-tight">
                    456 Factory Industrial Zone, Moo 4, Bang Na-Trad Rd, Bang Phli, Samut Prakan 10540<br/>
                    Tel: 02-999-0000 | Tax ID: 0105560999888
                  </p>
                </div>
                <div className="text-right font-sans">
                  <h1 className="text-lg font-bold tracking-wider text-slate-900 leading-none">
                    {t('nav.quotations') === 'ใบเสนอราคา' ? 'ใบเสนอราคา' : 'QUOTATION'}
                  </h1>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-2.5 text-[10px] text-left border border-slate-200 p-2 rounded bg-slate-50">
                    <span className="text-slate-400 font-medium">{t('quotations.quotationNo')}:</span>
                    <span className="font-bold text-slate-950">QT202606-XXX</span>
                    <span className="text-slate-400 font-medium">{t('quotations.issuedDate')}:</span>
                    <span className="font-semibold text-slate-950">{formatDate(date)}</span>
                    <span className="text-slate-400 font-medium">{t('newQuotation.expiryDate')}:</span>
                    <span className="font-semibold text-rose-600">{formatDate(expiryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Customer and info */}
              <div className="grid grid-cols-2 gap-4 py-4 text-[10px] font-sans border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">{t('newQuotation.clientCompany')}</span>
                  <span className="font-bold text-slate-900 block">{currentCustomer.companyName}</span>
                  <span className="text-slate-500 block leading-normal">{currentCustomer.address}</span>
                  <span className="text-slate-500 block">{t('customers.taxId')}: {currentCustomer.taxId}</span>
                </div>
                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-slate-400">{t('newQuotation.representative')}:</span>
                    <span className="font-semibold text-slate-800 ml-1">{t('common.userName')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">{t('newQuotation.creditTerm')}:</span>
                    <span className="font-bold text-slate-800 ml-1">{currentCustomer.creditTerm}</span>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="py-4">
                <table className="w-full text-left border-collapse font-sans text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase">
                      <th className="py-2 w-6 text-center">#</th>
                      <th className="py-2">{t('newQuotation.skuDesc')}</th>
                      <th className="py-2 text-right w-12">{t('newQuotation.quantity')}</th>
                      <th className="py-2 text-center w-12">{t('products.unit')}</th>
                      <th className="py-2 text-right w-20">{t('newQuotation.unitPrice')}</th>
                      <th className="py-2 text-right w-12">{t('newQuotation.discountPercent')}</th>
                      <th className="py-2 text-right w-24">{t('newQuotation.amount')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5">
                          <span className="font-bold text-slate-900 block">{item.sku}</span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">{item.name}</span>
                        </td>
                        <td className="py-2.5 text-right font-semibold">{formatNumber(item.qty)}</td>
                        <td className="py-2.5 text-center text-slate-500 font-semibold">{item.unit === 'Meter' ? (t('common.viewAll') === 'ดูทั้งหมด' ? 'เมตร' : 'Meter') : (t('common.viewAll') === 'ดูทั้งหมด' ? 'ม้วน' : 'Roll')}</td>
                        <td className="py-2.5 text-right font-semibold">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2.5 text-right text-slate-500">{item.discount}%</td>
                        <td className="py-2.5 text-right font-bold text-slate-950">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="flex justify-between items-start gap-4 pt-4 border-t border-slate-200 font-sans text-[10px]">
                <div className="max-w-[200px] leading-tight text-[9px]">
                  <span className="font-bold text-slate-800 block">{t('quotations.paymentAccount')}</span>
                  <span className="text-slate-500 block mt-0.5">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ธนาคารไทยพาณิชย์ (SCB)' : 'Siam Commercial Bank (SCB)'}</span>
                  <span className="text-slate-500 block">{t('common.viewAll') === 'ดูทั้งหมด' ? 'ชื่อบัญชี: บริษัท เคเบิ้ล ฮับ ซัพพลาย จำกัด' : 'Account Name: Cable Hub Supply Co., Ltd.'}</span>
                  <span className="font-bold text-slate-900 block mt-0.5">No: 123-4-56789-0</span>
                </div>

                <div className="w-56 space-y-1.5 border border-slate-100 rounded p-2.5 bg-slate-50">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">{t('newQuotation.amount')} (Subtotal):</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {totals.discountFlat > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold text-[10px]">
                      <span>{t('quotations.flatDiscount')}:</span>
                      <span>-{formatCurrency(totals.discountFlat)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">{t('quotations.vat')}:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totals.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 text-xs">
                    <span className="text-slate-900 font-bold">{t('quotations.grandTotal')}:</span>
                    <span className="font-black text-blue-700">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="mt-6 border-t border-slate-100 pt-4 font-sans text-[9px] text-slate-500 space-y-1 leading-normal italic">
                <div>
                  <span className="font-bold text-slate-600 block not-italic">{t('newQuotation.paymentTerms')}:</span>
                  {terms}
                </div>
                <div>
                  <span className="font-bold text-slate-600 block not-italic">{t('newQuotation.notes')}:</span>
                  {notes}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      {savedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setSavedSuccess(false)}
          />
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-sm p-6 z-50 relative text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">{t('common.viewAll') === 'ดูทั้งหมด' ? 'สร้างใบเสนอราคาสำเร็จ' : 'Quotation Created Successfully'}</h3>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              {t('common.viewAll') === 'ดูทั้งหมด' ? 'ใบเสนอราคา ' : 'Quotation '}<span className="font-bold text-slate-900">{newQuoteNo}</span>{t('common.viewAll') === 'ดูทั้งหมด' ? ' ถูกบันทึกลงในฐานข้อมูลระบบสำเร็จเรียบร้อยแล้ว' : ' has been created and logged in the operational database.'}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button size="sm" variant="outline" className="text-xs font-semibold" onClick={() => setSavedSuccess(false)}>
                {t('common.viewAll') === 'ดูทั้งหมด' ? 'อยู่หน้านี้ต่อ' : 'Stay Here'}
              </Button>
              <Link href="/quotations">
                <Button size="sm" className="text-xs font-semibold bg-blue-600 text-white">
                  {t('newQuotation.backToQuotations')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
