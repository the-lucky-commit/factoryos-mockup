'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppSidebar from './app-sidebar';
import Topbar from './topbar';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const auth = localStorage.getItem('factoryos_auth');
    if (auth === 'true') {
      setAuthorized(true);
      if (pathname === '/login') {
        router.push('/dashboard');
      }
    } else {
      setAuthorized(false);
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-55 text-slate-500 font-sans font-semibold text-sm gap-2">
        <span className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></span>
        Verifying Session...
      </div>
    );
  }

  // If on login page, render only login screen without Sidebar/Topbar
  if (pathname === '/login') {
    return <div className="h-screen w-screen overflow-hidden bg-slate-50">{children}</div>;
  }

  // If redirecting to login, render empty screen
  if (!authorized) {
    return null;
  }

  return (
    <div className="h-full flex overflow-hidden text-slate-900 bg-slate-50 font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
