import React, { useState } from 'react';
import { TenantProvider, useTenants } from './context/TenantContext';
import { Navbar } from './components/Navbar';
import { ClientList } from './components/ClientList';
import { ClientModal } from './components/ClientModal';
import { ModuleMatrix } from './components/ModuleMatrix';
import { LoginPage } from './components/LoginPage';

const MainApp = () => {
  const { activeTab, isAuthenticated } = useTenants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // If not signed in, show the Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenAdd = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar onOpenAddModal={handleOpenAdd} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'clients' && (
          <ClientList onEditClient={handleEdit} />
        )}

        {activeTab === 'modules' && (
          <ModuleMatrix />
        )}
      </main>

      {/* Add / Edit Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        editingClient={editingClient}
      />
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <MainApp />
    </TenantProvider>
  );
}
