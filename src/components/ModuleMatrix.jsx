import React from 'react';
import { useTenants } from '../context/TenantContext';
import { CORE_MODULES, LOGIN_PERMISSIONS } from '../data/initialData';
import { CheckCircle2, XCircle, Building2, Briefcase } from 'lucide-react';

export const ModuleMatrix = () => {
  const { clients, toggleModule, toggleLoginPermission } = useTenants();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Module & Login Access Matrix</h2>
        <p className="text-xs text-slate-500">
          Click any checkbox to instantly turn modules or login access ON/OFF for that client.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Client Organization</th>
                <th className="py-3 px-4 min-w-[120px]">Category</th>
                
                {/* 4 Core Modules */}
                {CORE_MODULES.map((mod) => (
                  <th key={mod.key} className="py-3 px-4 text-center min-w-[120px]">
                    <div>{mod.label}</div>
                  </th>
                ))}

                {/* 2 Login Accesses */}
                <th className="py-3 px-4 text-center min-w-[130px] bg-teal-50/60 text-teal-900">
                  Employee Login
                </th>
                <th className="py-3 px-4 text-center min-w-[130px] bg-indigo-50/60 text-indigo-900">
                  Customer Login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                const isConsultant = client.clientType === 'Consultant';

                return (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{client.name}</div>
                      <div className="text-[11px] font-mono font-normal text-slate-400">{client.domain}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isConsultant ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isConsultant ? 'Consultant' : 'Single Firm'}
                      </span>
                    </td>

                    {/* 4 Core Modules */}
                    {CORE_MODULES.map((mod) => {
                      const isChecked = Boolean(client.modules?.[mod.key]);
                      return (
                        <td key={mod.key} className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleModule(client.id, mod.key)}
                            title={`Toggle ${mod.label} for ${client.name}`}
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all ${
                              isChecked
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {isChecked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Employee Login */}
                    <td className="py-3.5 px-4 text-center bg-teal-50/30">
                      <button
                        type="button"
                        onClick={() => toggleLoginPermission(client.id, 'allowEmployeeLogin')}
                        title="Toggle Employee Login"
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all ${
                          client.allowEmployeeLogin
                            ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {client.allowEmployeeLogin ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </button>
                    </td>

                    {/* Customer Login */}
                    <td className="py-3.5 px-4 text-center bg-indigo-50/30">
                      {isConsultant ? (
                        <button
                          type="button"
                          onClick={() => toggleLoginPermission(client.id, 'allowCustomerLogin')}
                          title="Toggle Customer Login for Consultant's Firms"
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all ${
                            client.allowCustomerLogin
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {client.allowCustomerLogin ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
