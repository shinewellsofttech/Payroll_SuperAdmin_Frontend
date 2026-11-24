import React, { useState } from 'react';
import { useTenants } from '../context/TenantContext';
import { CORE_MODULES } from '../data/initialData';
import {
  Building2,
  Briefcase,
  Search,
  Edit,
  Trash2,
  CalendarPlus,
  Globe,
  Database,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const ClientList = ({ onEditClient }) => {
  const { clients, getDaysLeft, deleteClient, renewClient, stats } = useTenants();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredClients = clients.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.pan.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.dbName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q);

    const matchType = filterType === 'ALL' || c.clientType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      
      {/* 4 Clean Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Clients</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">Managed Tenants</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-400">Active Subscriptions</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Operational</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-400">Consultants & Single Firms</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {stats.consultants} <span className="text-xs text-slate-400 font-normal">/ {stats.singleFirms}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.consultants} Consultants, {stats.singleFirms} Firms
          </div>
        </div>

        {/* USER REQUESTED: Total Annual AMC Booked Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Annual AMC</div>
          <div className="text-2xl font-black text-blue-600 mt-1 flex items-center">
            <span>₹{Number(stats.totalAmc || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Maintenance Revenue / Yr</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Client Name, PAN, Domain, Database, City..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Consultant">Consultants</option>
            <option value="SingleFirm">Single Firms</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Client / Firm Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Allowed Firms</th>
                <th className="py-3 px-4">Domain & Database</th>
                <th className="py-3 px-4">PAN No.</th>
                <th className="py-3 px-4">Modules Given</th>
                <th className="py-3 px-4">Logins</th>
                <th className="py-3 px-4">AMC Charges</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No clients found. Click "+ Add Client" to create one.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isConsultant = client.clientType === 'Consultant';
                  const daysLeft = getDaysLeft(client.expiryDate);
                  const isExpired = daysLeft < 0;

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{client.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {client.contactPerson ? `${client.contactPerson} • ` : ''}{client.city}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isConsultant
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isConsultant ? <Briefcase className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                          <span>{isConsultant ? 'Consultant' : 'Single Firm'}</span>
                        </span>
                      </td>

                      {/* Allowed Firms */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {client.allowedFirms} {client.allowedFirms > 1 ? 'Firms' : 'Firm'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isConsultant ? 'Multi-firm quota' : 'Locked to 1'}
                        </div>
                      </td>

                      {/* Domain & DB */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-blue-700">
                          <Globe className="h-3 w-3 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{client.domain}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 mt-0.5">
                          <Database className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px] font-semibold text-slate-700">{client.dbName}</span>
                        </div>
                      </td>

                      {/* PAN */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {client.pan}
                        </span>
                      </td>

                      {/* Modules Given (Including Accounting!) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[170px]">
                          {client.modules?.attendance && (
                            <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 text-[10px] font-semibold">
                              Attendance
                            </span>
                          )}
                          {client.modules?.payroll && (
                            <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-semibold">
                              Payroll
                            </span>
                          )}
                          {client.modules?.reports && (
                            <span className="rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 text-[10px] font-semibold">
                              Reports
                            </span>
                          )}
                          {client.modules?.labourCodes && (
                            <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 text-[10px] font-semibold">
                              Labour Codes
                            </span>
                          )}
                          {client.modules?.accounting && (
                            <span className="rounded bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 text-[10px] font-bold">
                              Accounting
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Logins */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Employee:</span>
                            <span className={`font-bold ${client.allowEmployeeLogin ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {client.allowEmployeeLogin ? 'Yes' : 'No'}
                            </span>
                          </div>
                          {isConsultant && (
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Customer:</span>
                              <span className={`font-bold ${client.allowCustomerLogin ? 'text-indigo-700' : 'text-slate-400'}`}>
                                {client.allowCustomerLogin ? 'Yes' : 'No'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* USER REQUESTED: AMC Details Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono text-[12px]">
                          ₹{Number(client.amcAmount || 0).toLocaleString('en-IN')}
                        </div>
                        <span className="inline-block rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 text-[10px] font-semibold mt-0.5">
                          {client.amcCycle || 'Annual'}
                        </span>
                      </td>

                      {/* Validity Dates */}
                      <td className="py-3.5 px-4">
                        <div className={`font-bold ${isExpired ? 'text-red-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>
                          {isExpired ? 'Expired' : `${daysLeft} Days Left`}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {client.startDate} to {client.expiryDate}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditClient(client)}
                            title="Edit Client"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Extend subscription for ${client.name} by +1 Year?`)) {
                                renewClient(client.id, 12);
                              }
                            }}
                            title="+1 Year Renewal"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                          >
                            <CalendarPlus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${client.name}?`)) {
                                deleteClient(client.id);
                              }
                            }}
                            title="Delete"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
