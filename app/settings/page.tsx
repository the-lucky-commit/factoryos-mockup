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
import { useLanguage } from '@/lib/language-context';
import { useSecurity, permissionDefinitions } from '@/lib/security-context';
import AccessDenied from '@/components/layout/access-denied';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { activeRole, permissions, togglePermission, auditLogs, logAction } = useSecurity();

  if (activeRole !== 'Administrator') {
    return <AccessDenied moduleNameTh="ตั้งค่าระบบ (Platform Settings)" moduleNameEn="Platform Settings" />;
  }

  const [activeTab, setActiveTab] = useState<'profile' | 'docs' | 'permissions' | 'audit'>('profile');
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
    logAction(`Updated Platform settings: Profile & Templates data`, 'Success');
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      <PageHeader 
        title={t('settings.title')} 
        description={t('settings.description')}
        actions={
          saveSuccess ? (
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-in fade-in duration-200">
              <Check className="w-4 h-4" /> {language === 'th' ? 'บันทึกข้อมูลเรียบร้อย!' : 'Settings Saved!'}
            </span>
          ) : (
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
              <Save className="w-4 h-4" /> {t('common.save')}
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
          <Building className="w-3.5 h-3.5" /> {language === 'th' ? 'ข้อมูลนิติบุคคล' : 'Company Profile'}
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'docs'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" /> {language === 'th' ? 'ตั้งค่าเอกสาร' : 'Document Templates'}
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'permissions'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> {language === 'th' ? 'สิทธิ์การใช้งาน' : 'Access Permissions'}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'audit'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" /> {language === 'th' ? 'บันทึกประวัติระบบ' : 'System Logs'}
        </button>
      </div>

      {/* Settings Sections */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.companyInfo')}</CardTitle>
            <CardDescription>{t('settings.companyInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === 'th' ? 'ชื่อจดทะเบียนนิติบุคคล' : 'Company Registered Name'}
                </label>
                <input 
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === 'th' ? 'เลขประจำตัวผู้เสียภาษี' : 'Thailand Tax ID'}
                </label>
                <input 
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === 'th' ? 'เบอร์โทรศัพท์สำนักงาน' : 'Office Telephone'}
                </label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                />
              </div>

              {/* Contact Email */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === 'th' ? 'อีเมลแผนกบัญชีและการเงิน' : 'Billing & Finance Email'}
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === 'th' ? 'ที่อยู่จดทะเบียนนิติบุคคล' : 'Registered Address'}
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
                  rows={3}
                />
              </div>

              {/* Language Selection Setting */}
              <div className="md:col-span-2 border-t border-slate-150 pt-4 mt-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {t('settings.langSelect')}
                </label>
                <span className="text-[10px] text-slate-400 block mb-3 font-semibold">
                  {t('settings.langSettingDesc')}
                </span>
                <div className="flex flex-col sm:flex-row gap-4 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sm text-slate-700">
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'th'}
                      onChange={() => setLanguage('th')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-350"
                    />
                    <span>{t('settings.thai')}</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sm text-slate-700">
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'en'}
                      onChange={() => setLanguage('en')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-350"
                    />
                    <span>{t('settings.english')}</span>
                  </label>
                </div>
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
            <CardTitle>{language === 'th' ? 'ตารางสิทธิ์การใช้งานแยกตามบทบาท' : 'Role Permission Matrix'}</CardTitle>
            <CardDescription>
              {language === 'th' 
                ? 'กำหนดสิทธิ์การใช้งานแต่ละบทบาทจำลอง ติ๊กเลือกเพื่อเปิดสิทธิ์ความปลอดภัย (Super Admin สามารถควบคุมได้ทั้งหมด)' 
                : 'Configure module access controls. Tick boxes to grant features dynamically.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="px-6 py-4">{language === 'th' ? 'โมดูล / ฟังก์ชันการทำรายการ' : 'Module / Function'}</th>
                    <th className="px-6 py-4 text-center">{language === 'th' ? 'ผู้ดูแลระบบ (Admin)' : 'Admin'}</th>
                    <th className="px-6 py-4 text-center">{language === 'th' ? 'ฝ่ายขาย (Sales)' : 'Sales Executive'}</th>
                    <th className="px-6 py-4 text-center">{language === 'th' ? 'ฝ่ายคลังสินค้า (Warehouse)' : 'Warehouse Manager'}</th>
                    <th className="px-6 py-4 text-center">{language === 'th' ? 'ฝ่ายบัญชี (Finance)' : 'Finance Accountant'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {permissionDefinitions.map((permission) => (
                    <tr key={permission.key} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{language === 'th' ? permission.nameTh : permission.nameEn}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{language === 'th' ? permission.descriptionTh : permission.descriptionEn}</div>
                      </td>
                      {/* Admin - Always checked, disabled */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permissions['Administrator'][permission.key]}
                          disabled
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-not-allowed opacity-75 mx-auto"
                        />
                      </td>
                      {/* Sales Executive */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permissions['Sales Executive'][permission.key]}
                          onChange={() => togglePermission('Sales Executive', permission.key)}
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer mx-auto"
                        />
                      </td>
                      {/* Warehouse Manager */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permissions['Warehouse Manager'][permission.key]}
                          onChange={() => togglePermission('Warehouse Manager', permission.key)}
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer mx-auto"
                        />
                      </td>
                      {/* Finance Accountant */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={permissions['Finance Accountant'][permission.key]}
                          onChange={() => togglePermission('Finance Accountant', permission.key)}
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer mx-auto"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{language === 'th' ? 'บันทึกประวัติการทำงานของระบบ (System Audit Log)' : 'System Audit Log'}</CardTitle>
              <CardDescription>
                {language === 'th'
                  ? 'ตรวจสอบประวัติกิจกรรมการใช้งาน การเข้าถึง และการเปลี่ยนแปลงสิทธิ์ความปลอดภัยในระบบ (Full Security Analysis)'
                  : 'Track and audit user actions, permission toggles, data modifications, and mock security logs.'
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(language === 'th' ? 'ต้องการล้างบันทึกประวัติใช่หรือไม่?' : 'Clear audit logs?')) {
                    localStorage.removeItem('security_audit_logs');
                    window.location.reload();
                  }
                }}
                className="text-xs text-rose-500 border-rose-200 hover:bg-rose-50 cursor-pointer font-bold"
              >
                {language === 'th' ? 'ล้างบันทึก' : 'Clear Logs'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="px-6 py-3.5">{language === 'th' ? 'วันเวลา' : 'Timestamp'}</th>
                    <th className="px-6 py-3.5">{language === 'th' ? 'ผู้ใช้งาน' : 'User'}</th>
                    <th className="px-6 py-3.5">{language === 'th' ? 'บทบาท' : 'Role'}</th>
                    <th className="px-6 py-3.5">{language === 'th' ? 'การกระทำ' : 'Action Logs'}</th>
                    <th className="px-6 py-3.5 text-center">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                    <th className="px-6 py-3.5">{language === 'th' ? 'เลขไอพี' : 'IP Address'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-mono">{log.timestamp}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-900">{log.user}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-bold">
                          {log.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-750 max-w-xs sm:max-w-md truncate md:whitespace-normal break-words" title={log.action}>
                        {log.action}
                      </td>
                      <td className="px-6 py-3.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' :
                          log.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-250' :
                          'bg-rose-50 text-rose-700 border border-rose-250'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-400 font-mono">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
