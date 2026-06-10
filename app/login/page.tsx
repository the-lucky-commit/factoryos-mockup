'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cable, KeyRound, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock validation as requested
    if (username === 'admin' && password === 'admin1234') {
      localStorage.setItem('factoryos_auth', 'true');
      
      // Delay slightly for mock realism
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 800);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Invalid username or password. Please try again.');
      }, 500);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 relative p-4">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        <Card className="border-slate-200/80 shadow-xl shadow-slate-100 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center pb-4">
            {/* Logo */}
            <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
              <Cable className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
              Welcome to FactoryOS
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-400 mt-1">
              Industrial Cable Hub & Business Operating System
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username field */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-semibold"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 h-10 shadow-lg shadow-blue-500/10"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Hint Card */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Demo System Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-500 font-semibold">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Username</span>
              <span className="text-slate-800 font-mono select-all font-bold">admin</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Password</span>
              <span className="text-slate-800 font-mono select-all font-bold">admin1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
