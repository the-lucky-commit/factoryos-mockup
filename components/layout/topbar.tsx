'use client';

import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Check, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [activeRole, setActiveRole] = useState<'Administrator' | 'Sales Executive' | 'Warehouse Manager' | 'Finance Accountant'>('Administrator');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    'Administrator',
    'Sales Executive',
    'Warehouse Manager',
    'Finance Accountant'
  ] as const;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 shrink-0">
      {/* Left side with menu toggle and search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick search SKU, customer, quotation..."
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Toggle User Role (Interactive Mockup feature) */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Role: {activeRole}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowRoleDropdown(false)}
              />
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Mock View Role
                  </span>
                </div>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <span>{role}</span>
                    {activeRole === role && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Support Hub */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 relative rounded-full hover:bg-slate-50">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 relative rounded-full hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* Company profile selector */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
            CH
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-semibold block text-slate-700">Cable Hub Supply</span>
            <span className="text-[10px] text-slate-400 block font-medium">Factory ID: CH-889</span>
          </div>
        </div>
      </div>
    </header>
  );
}
