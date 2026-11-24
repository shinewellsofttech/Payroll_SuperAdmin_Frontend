import React, { useState } from 'react';
import { useTenants } from '../context/TenantContext';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Key } from 'lucide-react';

export const LoginPage = () => {
  const { login, authError } = useTenants();

  const [username, setUsername] = useState('admin@payrollcloud.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(username, password, remember);
      setIsSubmitting(false);
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin@payrollcloud.in');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col items-center justify-center p-4 antialiased">
      
      {/* Background soft glow decoration */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        
        {/* Card Header Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-3 ring-4 ring-white/10">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Payroll Cloud</h1>
          <p className="text-xs font-semibold text-blue-300 mt-1 uppercase tracking-widest">
            Super Admin Master Portal
          </p>
        </div>

        {/* Main Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/95 backdrop-blur-xl p-7 shadow-2xl shadow-black/40 space-y-5">
          
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your credentials to manage clients, tenant databases, and module access.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2.5 text-xs text-red-700 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@payrollcloud.in"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-10 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In as Super Admin'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Info Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Key className="h-3.5 w-3.5 text-blue-600" />
              <span>Default Master Credentials:</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Username: <strong className="text-slate-800">admin@payrollcloud.in</strong></span>
              <span>Password: <strong className="text-slate-800">admin123</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Payroll SaaS Administration Engine • v2.0
        </div>
      </div>
    </div>
  );
};
