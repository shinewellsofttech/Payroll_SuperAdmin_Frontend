import React from 'react';
import { useTenants } from '../context/TenantContext';
import { Users, Layers, Plus, RotateCcw, Shield, LogOut, User } from 'lucide-react';

export const Navbar = ({ onOpenAddModal }) => {
  const { activeTab, setActiveTab, resetToDefault, stats, currentUser, logout } = useTenants();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Branding & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">Payroll Super Admin</h1>
              <p className="text-[11px] text-slate-500">Client & Module Allocation Portal</p>
            </div>
          </div>

          {/* Simple Tab Switcher (Only 2 Tabs!) */}
          <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'clients'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Clients ({stats.total})</span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'modules'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Module Permissions</span>
            </button>
          </nav>
        </div>

        {/* Right: Actions & User Logout */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Reset Demo */}
          <button
            onClick={() => {
              if (confirm("Reset demo data to initial sample clients?")) {
                resetToDefault();
              }
            }}
            title="Reset to default sample data"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* + Add Client Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Client</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              SA
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-slate-800 leading-tight">Super Admin</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Online</div>
            </div>
            
            <button
              onClick={() => {
                if (confirm("Log out from Super Admin portal?")) {
                  logout();
                }
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
