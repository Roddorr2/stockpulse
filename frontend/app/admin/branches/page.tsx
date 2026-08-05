'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Store, Plus, Edit2 } from 'lucide-react';
import { BranchFormModal } from '../../../components/BranchFormModal';
import { Navbar } from '../../../components/Navbar';
import { StockTransferModal } from '../../../components/StockTransferModal';
import { RegisterSaleModal } from '../../../components/RegisterSaleModal';
import { useAuth } from '../../../lib/AuthContext';
import { useStockAlertsWS } from '../../../lib/useStockAlertsWS';
import { fetchApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';

interface Branch {
  id: string;
  nombre: string;
  direccion: string;
}

export default function AdminBranchesPage() {
  const { user } = useAuth();
  const { isConnected } = useStockAlertsWS();
  const router = useRouter();
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await fetchApi<Branch[]>('/api/v1/branches');
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && !user.roles.includes('ADMIN')) {
      router.push('/unauthorized');
      return;
    }
    fetchBranches();
  }, [user, router, fetchBranches]);

  const handleCreateBranch = async (data: Omit<Branch, 'id'>) => {
    await fetchApi('/api/v1/admin/branches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    fetchBranches();
  };

  const handleUpdateBranch = async (data: Omit<Branch, 'id'>) => {
    if (!editingBranch) return;
    await fetchApi(`/api/v1/admin/branches/${editingBranch.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    fetchBranches();
  };

  const openCreateModal = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Cargando sucursales...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
      <Navbar 
        isConnected={isConnected} 
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                <Store className="h-6 w-6 text-amber-500" />
                Gestión de Sucursales
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Administra las sucursales de StockPulse</p>
            </div>
            
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Nueva Sucursal
            </button>
          </div>

      <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5 font-medium">Nombre</th>
                <th className="py-3 px-5 font-medium">Dirección</th>
                <th className="py-3 px-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/60">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                    No se encontraron sucursales.
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-zinc-700/30 transition-colors">
                    <td className="py-3 px-5 font-medium text-zinc-200">{branch.nombre}</td>
                    <td className="py-3 px-5 text-zinc-400">{branch.direccion}</td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(branch)}
                          className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BranchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}
        initialData={editingBranch}
      />
      </main>

      <RegisterSaleModal 
        isOpen={isSaleModalOpen} 
        onClose={() => setIsSaleModalOpen(false)} 
        onSuccess={fetchBranches} 
      />
      
      <StockTransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
        onSuccess={fetchBranches} 
      />
    </div>
  );
}
