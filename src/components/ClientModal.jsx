import React, { useState, useEffect } from 'react';
import { useTenants } from '../context/TenantContext';
import { CORE_MODULES, AMC_CYCLES } from '../data/initialData';
import { X, Building2, Briefcase, IndianRupee } from 'lucide-react';

export const ClientModal = ({ isOpen, onClose, editingClient }) => {
  const { addClient, updateClient } = useTenants();

  const emptyForm = {
    name: '',
    clientType: 'SingleFirm', // 'SingleFirm' | 'Consultant'
    contactPerson: '',
    phone: '',
    email: '',
    pan: '',
    city: 'Jaipur',
    domain: '',
    dbName: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    allowedFirms: 1,
    amcAmount: 25000,
    amcCycle: 'Annual', // 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual'
    modules: {
      attendance: true,
      payroll: true,
      reports: true,
      labourCodes: true,
      accounting: false, // Accounting module
    },
    allowEmployeeLogin: true,
    allowCustomerLogin: false,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingClient) {
      setForm({
        ...emptyForm,
        ...editingClient,
        modules: {
          ...emptyForm.modules,
          ...(editingClient.modules || {})
        }
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingClient, isOpen]);

  if (!isOpen) return null;

  // Auto-fill domain & dbName on name change if new
  const handleNameChange = (name) => {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setForm(prev => ({
      ...prev,
      name,
      domain: prev.domain ? prev.domain : (clean ? `${clean}.payrollcloud.in` : ''),
      dbName: prev.dbName ? prev.dbName : (clean ? `Payroll_${clean.toUpperCase()}_DB` : '')
    }));
  };

  const handleTypeChange = (type) => {
    const isConsultant = type === 'Consultant';
    setForm(prev => ({
      ...prev,
      clientType: type,
      allowedFirms: isConsultant ? (prev.allowedFirms > 1 ? prev.allowedFirms : 10) : 1,
      allowCustomerLogin: isConsultant ? prev.allowCustomerLogin : false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Client Name is required.");
    if (!form.pan.trim()) return alert("PAN Number is required.");
    if (!form.domain.trim()) return alert("Client Domain is required.");
    if (!form.dbName.trim()) return alert("Database Name is required.");

    if (editingClient) {
      updateClient(editingClient.id, form);
    } else {
      addClient(form);
    }
    onClose();
  };

  const isConsultant = form.clientType === 'Consultant';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5">
          <h2 className="text-base font-bold text-slate-900">
            {editingClient ? `Edit Client: ${editingClient.name}` : 'Add New Client / Tenant'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Simple Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Client Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Client Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('SingleFirm')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  !isConsultant
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 className={`h-5 w-5 ${!isConsultant ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Single Particular Firm</div>
                  <div className="text-[11px] text-slate-500">Fixed to strictly 1 firm</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('Consultant')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isConsultant
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Briefcase className={`h-5 w-5 ${isConsultant ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Labour / HR Consultant</div>
                  <div className="text-[11px] text-slate-500">Can manage multiple firms</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Basic Details & PAN */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Basic Details & PAN
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Lotus Dairy Products P Ltd"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={form.pan}
                  onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                  placeholder="e.g. AAACL8492F"
                  className="w-full uppercase font-mono rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="e.g. Rajendra Sharma"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98290XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hr@client.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Jaipur"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Domain & Separate Database */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Domain & Separate Database
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Domain / Subdomain *</label>
                <input
                  type="text"
                  required
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value.toLowerCase() })}
                  placeholder="lotusdairy.payrollcloud.in"
                  className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Har client ka alag web URL / domain</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant Database Name *</label>
                <input
                  type="text"
                  required
                  value={form.dbName}
                  onChange={(e) => setForm({ ...form, dbName: e.target.value })}
                  placeholder="Payroll_Lotus_DB"
                  className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Is client ka alag database name</p>
              </div>
            </div>
          </div>

          {/* 4. Dates & Firm Quota */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Validity Dates & Firm Limit
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Software Starting Date *</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">License Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kitni Firm Banane Ka Access Hai? *
                </label>
                <input
                  type="number"
                  min={1}
                  disabled={!isConsultant}
                  value={form.allowedFirms}
                  onChange={(e) => setForm({ ...form, allowedFirms: Number(e.target.value) })}
                  className={`w-full font-bold rounded-lg border px-3 py-1.5 text-xs focus:outline-none ${
                    !isConsultant ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'border-indigo-400 text-indigo-900 bg-white'
                  }`}
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {!isConsultant ? 'Single firm ke liye 1 firm fixed' : 'Consultant ke liye allowed firms count'}
                </p>
              </div>
            </div>
          </div>

          {/* 5. USER REQUESTED: AMC Details (Amount & Frequency) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <IndianRupee className="h-3.5 w-3.5 text-blue-600" />
              <span>AMC Charges & Billing Frequency</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AMC Amount (₹ kitni hai) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={form.amcAmount}
                    onChange={(e) => setForm({ ...form, amcAmount: Number(e.target.value) })}
                    placeholder="e.g. 25000"
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Software maintenance charge</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AMC Billing Cycle (Monthly / Quarterly / Half-Yearly / Annual) *
                </label>
                <select
                  value={form.amcCycle}
                  onChange={(e) => setForm({ ...form, amcCycle: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {AMC_CYCLES.map(cycle => (
                    <option key={cycle} value={cycle}>{cycle}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-0.5">Payment interval</p>
              </div>
            </div>
          </div>

          {/* 6. Module Selection (Including Accounting Module!) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kis Client Ko Kya Module Dena Hai?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CORE_MODULES.map((mod) => {
                const isChecked = Boolean(form.modules?.[mod.key]);
                return (
                  <label
                    key={mod.key}
                    className={`cursor-pointer flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setForm({
                        ...form,
                        modules: {
                          ...form.modules,
                          [mod.key]: !isChecked
                        }
                      })}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{mod.label}</span>
                        {mod.key === 'accounting' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{mod.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 7. Login Permissions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Login Access Permissions
            </h3>

            <div className="space-y-2">
              {/* Employee Login */}
              <label className="cursor-pointer flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all">
                <div>
                  <div className="text-xs font-bold text-slate-900">Employee Login Dena Hai? (ESS Portal)</div>
                  <div className="text-[11px] text-slate-500">Staff apna attendance aur payslip mobile/web par dekh sakega</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.allowEmployeeLogin)}
                  onChange={(e) => setForm({ ...form, allowEmployeeLogin: e.target.checked })}
                  className="h-4 w-4 rounded text-blue-600"
                />
              </label>

              {/* Customer / Firm Login for Consultants */}
              <label className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all ${
                isConsultant ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70' : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Consultant Ki Firms Ko Customer Login Dena Hai?</span>
                    {!isConsultant && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                        Only for Consultant
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Consultant ki client firms log in karke sirf apni firm ke reports/attendance dekh sakein
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={!isConsultant}
                  checked={Boolean(form.allowCustomerLogin) && isConsultant}
                  onChange={(e) => setForm({ ...form, allowCustomerLogin: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-blue-500/20"
            >
              {editingClient ? 'Save Changes' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
