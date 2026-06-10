'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Administrator' | 'Sales Executive' | 'Warehouse Manager' | 'Finance Accountant';

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  status: 'Success' | 'Warning' | 'Failed';
  ipAddress: string;
}

export interface PermissionDefinition {
  key: string;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
}

export const permissionDefinitions: PermissionDefinition[] = [
  {
    key: 'manage_products',
    nameTh: 'จัดการแคตตาล็อกสินค้า (SKUs)',
    nameEn: 'Manage Product Catalog (SKUs)',
    descriptionTh: 'เพิ่ม แก้ไข รายละเอียดสายไฟอุตสาหกรรม และดูข้อมูลเชิงลึกสินค้า',
    descriptionEn: 'Add, edit industrial cable details and view item insights'
  },
  {
    key: 'process_inventory',
    nameTh: 'ทำรายการเคลื่อนไหวคลังสินค้า (รับ/จ่าย)',
    nameEn: 'Process Stock Movement (Receive/Issue)',
    descriptionTh: 'ทำรายการเพิ่มหรือเบิกสต็อกในคลังสินค้าและลงบันทึกประวัติการเบิกจ่าย',
    descriptionEn: 'Receive or issue stock in inventory and log movement history'
  },
  {
    key: 'create_quotations',
    nameTh: 'สร้างและออกเอกสารใบเสนอราคา',
    nameEn: 'Draft & Issue Quotations',
    descriptionTh: 'ออกเอกสารใบเสนอราคา เลือกสินค้า ลูกค้า คำนวณภาษี และบันทึกแบบร่าง',
    descriptionEn: 'Create quotes, select items/customers, compute tax, and save drafts'
  },
  {
    key: 'approve_prices',
    nameTh: 'อนุมัติเงื่อนไขราคาโครงการพิเศษ',
    nameEn: 'Approve Special Project Price Deals',
    descriptionTh: 'แก้ไขราคาขายและสิทธิ์การให้ส่วนลดพิเศษแก่ลูกค้าธุรกิจในใบเสนอราคา',
    descriptionEn: 'Override unit price and grant special discounts on quotations'
  },
  {
    key: 'manage_invoices',
    nameTh: 'รับชำระเงินและบันทึกใบแจ้งหนี้',
    nameEn: 'Invoice Ledger Settlements (Receive Cash)',
    descriptionTh: 'บันทึกใบแจ้งหนี้รับชำระเงิน (Mark Paid) เพื่อตัดยอดค้างรับจากลูกค้า',
    descriptionEn: 'Settle invoices (Mark Paid) to clear outstanding ledger balance'
  },
  {
    key: 'manage_settings',
    nameTh: 'แก้ไขโครงสร้างและตั้งค่าระบบสากล',
    nameEn: 'Modify System & Document Prefixes',
    descriptionTh: 'ตั้งค่าเลขที่เอกสาร อัตราภาษี ข้อมูลหน่วยงาน และควบคุมสิทธิ์ของระบบ',
    descriptionEn: 'Configure prefix formatting, tax rates, profile settings, and permissions'
  }
];

const defaultPermissions: Record<UserRole, Record<string, boolean>> = {
  'Administrator': {
    'manage_products': true,
    'process_inventory': true,
    'create_quotations': true,
    'approve_prices': true,
    'manage_invoices': true,
    'manage_settings': true,
  },
  'Sales Executive': {
    'manage_products': true,
    'process_inventory': false,
    'create_quotations': true,
    'approve_prices': false,
    'manage_invoices': false,
    'manage_settings': false,
  },
  'Warehouse Manager': {
    'manage_products': false,
    'process_inventory': true,
    'create_quotations': false,
    'approve_prices': false,
    'manage_invoices': false,
    'manage_settings': false,
  },
  'Finance Accountant': {
    'manage_products': false,
    'process_inventory': false,
    'create_quotations': false,
    'approve_prices': false,
    'manage_invoices': true,
    'manage_settings': false,
  }
};

const initialAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2026-06-10 14:15:30',
    user: 'Bank Supharoek',
    role: 'Administrator',
    action: 'Changed corporate tax VAT settings (VAT set to 7%)',
    status: 'Success',
    ipAddress: '192.168.1.108'
  },
  {
    id: '2',
    timestamp: '2026-06-10 13:58:22',
    user: 'Warehouse Staff',
    role: 'Warehouse Manager',
    action: 'Issued 50m of CV Cable (CV-185) for Quotation QT202606-002',
    status: 'Success',
    ipAddress: '192.168.1.144'
  },
  {
    id: '3',
    timestamp: '2026-06-10 13:12:05',
    user: 'Sales Officer A',
    role: 'Sales Executive',
    action: 'Created Quotation QT202606-003 for Siam Electrical Supplier',
    status: 'Success',
    ipAddress: '192.168.2.11'
  },
  {
    id: '4',
    timestamp: '2026-06-10 11:45:12',
    user: 'Finance Controller',
    role: 'Finance Accountant',
    action: 'Settle payment on invoice INV202606-001 (Mark Paid)',
    status: 'Success',
    ipAddress: '192.168.1.99'
  }
];

interface SecurityContextProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  permissions: Record<UserRole, Record<string, boolean>>;
  togglePermission: (role: UserRole, permissionKey: string) => void;
  auditLogs: AuditLog[];
  logAction: (action: string, status?: 'Success' | 'Warning' | 'Failed', userName?: string, roleName?: UserRole) => void;
  checkPermission: (permissionKey: string) => boolean;
}

const SecurityContext = createContext<SecurityContextProps | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<UserRole>('Administrator');
  const [permissions, setPermissions] = useState<Record<UserRole, Record<string, boolean>>>(defaultPermissions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load state from localStorage on client-side mount
    const savedRole = localStorage.getItem('security_active_role') as UserRole;
    if (savedRole) {
      setActiveRoleState(savedRole);
    }

    const savedPermissions = localStorage.getItem('security_permissions');
    if (savedPermissions) {
      try {
        setPermissions(JSON.parse(savedPermissions));
      } catch (e) {
        console.error(e);
      }
    }

    const savedLogs = localStorage.getItem('security_audit_logs');
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    }

    setMounted(true);
  }, []);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('security_active_role', role);
    
    // Log role switch action
    logAction(`Switched dashboard view role to: ${role}`, 'Success', 'Bank Supharoek', role);
  };

  const togglePermission = (role: UserRole, permissionKey: string) => {
    setPermissions((prev) => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [permissionKey]: !prev[role][permissionKey]
        }
      };
      localStorage.setItem('security_permissions', JSON.stringify(updated));
      return updated;
    });

    logAction(`Modified permission: toggled '${permissionKey}' for role '${role}'`, 'Success', 'Bank Supharoek', activeRole);
  };

  const logAction = (
    action: string, 
    status: 'Success' | 'Warning' | 'Failed' = 'Success', 
    userName?: string,
    roleName?: UserRole
  ) => {
    const finalUser = userName || 'Bank Supharoek';
    const finalRole = roleName || activeRole;
    
    const newLog: AuditLog = {
      id: String(Date.now()),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: finalUser,
      role: finalRole,
      action: action,
      status: status,
      ipAddress: '192.168.1.108'
    };

    setAuditLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 100); // cap at 100 logs
      localStorage.setItem('security_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const checkPermission = (permissionKey: string): boolean => {
    // Super Admin is always granted everything
    if (activeRole === 'Administrator') return true;
    return !!permissions[activeRole]?.[permissionKey];
  };

  return (
    <SecurityContext.Provider value={{
      activeRole,
      setActiveRole,
      permissions,
      togglePermission,
      auditLogs,
      logAction,
      checkPermission
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
