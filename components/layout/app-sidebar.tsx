'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  FileText, 
  Receipt, 
  Users, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Cable,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import { useSecurity } from '@/lib/security-context';

interface SidebarItem {
  name: string;
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', key: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Product Master', key: 'nav.products', href: '/products', icon: Package },
  { name: 'Inventory', key: 'nav.inventory', href: '/inventory', icon: Boxes },
  { name: 'Quotations', key: 'nav.quotations', href: '/quotations', icon: FileText },
  { name: 'Invoices', key: 'nav.invoices', href: '/invoices', icon: Receipt },
  { name: 'Customers', key: 'nav.customers', href: '/customers', icon: Users },
  { name: 'Reports', key: 'nav.reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', key: 'nav.settings', href: '/settings', icon: Settings },
];

export default function AppSidebar({ 
  className, 
  onClose,
  collapsed,
  onToggleCollapse
}: { 
  className?: string; 
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { activeRole, checkPermission } = useSecurity();

  // Filter sidebar items based on role permission configuration
  const visibleItems = sidebarItems.filter(item => {
    if (item.href === '/dashboard') return true;
    if (item.href === '/products') return checkPermission('manage_products');
    if (item.href === '/inventory') return checkPermission('process_inventory');
    if (item.href === '/quotations') return checkPermission('create_quotations');
    if (item.href === '/invoices') return checkPermission('manage_invoices');
    if (item.href === '/settings') return activeRole === 'Administrator';
    // Customers & Reports: hide for Warehouse Manager, show for others
    if (item.href === '/customers' || item.href === '/reports') return activeRole !== 'Warehouse Manager';
    return true;
  });

  return (
    <aside className={cn(
      collapsed ? "w-20" : "w-64",
      "bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 transition-all duration-300 z-30",
      className
    )}>
      {/* Brand Header */}
      <div className={cn("h-16 flex items-center border-b border-slate-800 shrink-0 px-4", collapsed ? "justify-center" : "justify-between px-6")}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-sans">
            <Cable className="w-5 h-5 shrink-0" />
          </div>
          {!collapsed && (
            <div className="font-sans animate-in fade-in duration-300">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block leading-tight">
                FactoryOS
              </span>
              <span className="text-xs block text-slate-500 font-medium">{t('nav.cableHubEdition')}</span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button (Desktop only) */}
        {!onClose && (
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className={cn("flex-1 py-6 space-y-1 overflow-y-auto", collapsed ? "px-2" : "px-4")}>
        {!collapsed ? (
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider animate-in fade-in duration-300">
            {t('nav.mainMenu')}
          </div>
        ) : (
          <div className="h-px bg-slate-800/80 my-4 mx-2" />
        )}
        {visibleItems.map((item) => {
          // Check if pathname starts with the item.href (for pages with sub-routes like /quotations/new)
          // Exception: /dashboard should be exact match
          const isActive = item.href === '/dashboard' 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.key) : undefined}
              className={cn(
                "flex items-center transition-all duration-200 group rounded-lg text-sm font-medium",
                collapsed ? "justify-center p-2.5 w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {!collapsed && (
                <span className="truncate animate-in fade-in duration-350">
                  {t(item.key)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className={cn("p-4 border-t border-slate-800 bg-slate-950/40 shrink-0", collapsed ? "flex justify-center" : "")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-in fade-in duration-350">
              <span className="text-sm font-semibold block text-slate-200 truncate">Bank Supharoek</span>
              <span className="text-xs text-slate-500 block truncate">{t('common.administrator')}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
