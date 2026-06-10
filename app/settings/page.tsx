'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Settings2, 
  FileSignature, 
  Check, 
  X, 
  ShieldCheck, 
  Save,
  CheckSquare,
  Square
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'docs' | 'permissions'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State Mock
  const [companyName, setCompanyName] = useState('Cable Hub Supply Co., Ltd.');
  const [taxId, setTaxId] = useState('0105560999888');
  const [phone, setPhone] = useState('02-999-0000');
  const [email, setEmail] = useState('billing@cablehub.co.th');
  const [address, setAddress] = useState('456 Factory Industrial Zone, Moo 4, Bang Na-Trad Rd, Samut Prakan 10540');

  // Document Numbering State Mock
  const [vatRate, setVatRate] = useState(7);
  const [quotePrefix, setQuotePrefix] = useState('QT{YYYY}{MM}-');
  const [invoicePrefix, setInvoicePrefix] = useState('INV{YYYY}{MM}-');

  // Trigger Save Mock
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      <PageHeader 
        title="Platform Settings" 
        description="Configure corporate metadata, document prefixes, and role-based permissions."
        actions={
          saveSuccess ? (
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-in fade-in duration-200">
              <Check className="w-4 h-4" /> Settings Saved!
            </span>
          ) : (
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building className="w-3.5 h-3.5" /> Company Profile
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'docs'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" /> Document Templates
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'permissions'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Access Permissions
        </button>
      </div>

      {/* Settings Sections */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>This information will appear on print documents (Quotations, Invoices, Delivery notes).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Registered Name</label>
                <input 
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Thailand Tax ID</label>
                <input 
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Office Telephone</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Contact Email */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Billing & Finance Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Registered Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'docs' && (
        <Card>
          <CardHeader>
            <CardTitle>Document Configuration</CardTitle>
            <CardDescription>Set serial number prefixes, next counters, and default tax parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VAT */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Default VAT Percentage (%)</label>
                <input 
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>
              
              {/* Currency */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">System Base Currency</label>
                <input 
                  type="text"
                  value="THB (Thai Baht ฿)"
                  disabled
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-bold"
                />
              </div>

              {/* Quotation Numbering */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quotation Serial Template</label>
                <input 
                  type="text"
                  value={quotePrefix}
                  onChange={(e) => setQuotePrefix(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Generates: QT202606-001, QT202606-002</span>
              </div>

              {/* Invoice Numbering */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Invoice Serial Template</label>
                <input 
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Generates: INV202606-001, INV202606-002</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Role Permission Matrix</CardTitle>
            <CardDescription>Review system security access configurations. Tick marks indicate permissions granted.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="px-6 py-3.5">Module / Function</th>
                    <th className="px-6 py-3.5 text-center">Admin</th>
                    <th className="px-6 py-3.5 text-center">Sales Executive</th>
                    <th className="px-6 py-3.5 text-center">Warehouse Staff</th>
                    <th className="px-6 py-3.5 text-center">Finance Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {/* Row 1 */}
                  <tr>
                    <td className="px-6 py-3.5">Manage Product Catalog (SKUs)</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td className="px-6 py-3.5">Process Stock Movement (Receive/Issue)</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="px-6 py-3.5">Draft & Issue Quotations</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  {/* Row 4 */}
                  <tr>
                    <td className="px-6 py-3.5">Approve Special Project Price Deals</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  {/* Row 5 */}
                  <tr>
                    <td className="px-6 py-3.5">Invoice Ledger Settlements (Receive Cash)</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  </tr>
                  {/* Row 6 */}
                  <tr>
                    <td className="px-6 py-3.5">Modify System & Document Prefixes</td>
                    <td className="px-6 py-3.5 text-center"><CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-3.5 text-center"><Square className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
