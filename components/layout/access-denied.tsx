'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';

export default function AccessDenied({ moduleNameTh, moduleNameEn }: { moduleNameTh?: string; moduleNameEn?: string }) {
  const { t, language } = useLanguage();

  return (
    <div className="h-[60vh] w-full flex items-center justify-center p-4 animate-in fade-in duration-350">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 font-sans">
            {language === 'th' ? 'ไม่มีสิทธิ์การเข้าถึงข้อมูล' : 'Access Denied'}
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed font-sans">
            {language === 'th' 
              ? `บทบาทปัจจุบันของคุณไม่ได้รับสิทธิ์เข้าใช้งานโมดูล ${moduleNameTh || 'นี้'} หากต้องการสิทธิ์เพิ่มเติม กรุณาติดต่อ Super Admin เพื่อปรับปรุงสิทธิ์ในหน้าตั้งค่าความปลอดภัย`
              : `Your current role does not have authorization to access the ${moduleNameEn || 'requested'} module. Please request permission overrides from the Super Admin in the Platform Settings.`
            }
          </p>
        </div>
        <div className="pt-2">
          <Button 
            onClick={() => window.history.back()}
            variant="outline" 
            className="flex items-center gap-1.5 mx-auto text-xs font-semibold text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {language === 'th' ? 'ย้อนกลับ' : 'Go Back'}
          </Button>
        </div>
      </div>
    </div>
  );
}
