import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLIENTS } from '../data/initialData';

const STORAGE_KEY_CLIENTS = 'PAYROLL_SUPER_ADMIN_CLIENTS_V2';
const STORAGE_KEY_AUTH = 'PAYROLL_SUPER_ADMIN_AUTH';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Auth read error", e);
    }
    return null; // default logged out or null
  });

  const [authError, setAuthError] = useState('');

  // Login handler
  const login = (username, password, remember = true) => {
    setAuthError('');
    const u = username.trim().toLowerCase();
    const p = password.trim();

    // Valid demo credentials: (admin or admin@payrollcloud.in) with (admin or admin123 or superadmin)
    if (
      (u === 'admin' || u === 'admin@payrollcloud.in' || u === 'superadmin') &&
      (p === 'admin' || p === 'admin123' || p === 'password')
    ) {
      const user = {
        name: 'Super Administrator',
        email: u.includes('@') ? u : 'admin@payrollcloud.in',
        role: 'Master Admin',
        loginTime: new Date().toLocaleTimeString(),
      };
      setCurrentUser(user);

      if (remember) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      } else {
        sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      }
      return true;
    } else {
      setAuthError('Invalid credentials. Use admin@payrollcloud.in and admin123');
      return false;
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Client Data State
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    return INITIAL_CLIENTS;
  });

  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'modules'

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error("Error writing localStorage", e);
    }
  }, [clients]);

  // Helper for days remaining
  const getDaysLeft = (expiryDateStr) => {
    if (!expiryDateStr) return 0;
    const exp = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);
    return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Add Client
  const addClient = (formData) => {
    const newClient = {
      ...formData,
      id: `client-${Date.now()}`,
      allowedFirms: formData.clientType === 'SingleFirm' ? 1 : Number(formData.allowedFirms || 5),
      allowCustomerLogin: formData.clientType === 'Consultant' ? Boolean(formData.allowCustomerLogin) : false,
      amcAmount: Number(formData.amcAmount || 0),
      amcCycle: formData.amcCycle || 'Annual',
    };
    setClients(prev => [newClient, ...prev]);
  };

  // Update Client
  const updateClient = (id, formData) => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...formData,
          allowedFirms: formData.clientType === 'SingleFirm' ? 1 : Number(formData.allowedFirms || c.allowedFirms),
          allowCustomerLogin: formData.clientType === 'Consultant' ? Boolean(formData.allowCustomerLogin) : false,
          amcAmount: Number(formData.amcAmount || 0),
          amcCycle: formData.amcCycle || c.amcCycle || 'Annual',
        };
      }
      return c;
    }));
  };

  // Delete Client
  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // Toggle Module
  const toggleModule = (clientId, moduleKey) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          modules: {
            ...c.modules,
            [moduleKey]: !c.modules?.[moduleKey]
          }
        };
      }
      return c;
    }));
  };

  // Toggle Login Permission
  const toggleLoginPermission = (clientId, permKey) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          [permKey]: !c[permKey]
        };
      }
      return c;
    }));
  };

  // Renew Subscription
  const renewClient = (clientId, months = 12) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const base = new Date(c.expiryDate && new Date(c.expiryDate) > new Date() ? c.expiryDate : new Date());
        base.setMonth(base.getMonth() + Number(months));
        return {
          ...c,
          expiryDate: base.toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  // Reset to default
  const resetToDefault = () => {
    setClients(INITIAL_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
  };

  // Calculate total AMC (annualized)
  const calculateTotalAmc = () => {
    return clients.reduce((acc, c) => {
      const amt = Number(c.amcAmount || 0);
      if (c.amcCycle === 'Monthly') return acc + (amt * 12);
      if (c.amcCycle === 'Quarterly') return acc + (amt * 4);
      if (c.amcCycle === 'Half-Yearly') return acc + (amt * 2);
      return acc + amt; // Annual
    }, 0);
  };

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => getDaysLeft(c.expiryDate) >= 0).length,
    expired: clients.filter(c => getDaysLeft(c.expiryDate) < 0).length,
    consultants: clients.filter(c => c.clientType === 'Consultant').length,
    singleFirms: clients.filter(c => c.clientType === 'SingleFirm').length,
    totalAmc: calculateTotalAmc(),
  };

  return (
    <TenantContext.Provider value={{
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authError,
      login,
      logout,
      clients,
      activeTab,
      setActiveTab,
      getDaysLeft,
      addClient,
      updateClient,
      deleteClient,
      toggleModule,
      toggleLoginPermission,
      renewClient,
      resetToDefault,
      stats
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenants = () => useContext(TenantContext);
