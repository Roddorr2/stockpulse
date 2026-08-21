'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Edit2, Ban, CheckCircle2 } from 'lucide-react';
import { ProductFormModal } from '../../../components/ProductFormModal';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Navbar } from '../../../components/Navbar';
import { StockTransferModal } from '../../../components/StockTransferModal';
import { RegisterSaleModal } from '../../../components/RegisterSaleModal';
import { useAuth } from '../../../lib/AuthContext';
import { useStockAlertsWS } from '../../../lib/useStockAlertsWS';
import { fetchApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  stockMinimo: number;
  activo: boolean;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const { isConnected } = useStockAlertsWS();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const url = searchQuery 
        ? `/api/v1/products?q=${encodeURIComponent(searchQuery)}`
        : '/api/v1/products';
      const data = await fetchApi<Product[]>(url);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user && !user.roles.includes('ADMIN')) {
      router.push('/unauthorized');
      return;
    }
    fetchProducts();
  }, [user, router, fetchProducts]);

  const handleCreateProduct = async (data: Omit<Product, 'id'>) => {
    await fetchApi('/api/v1/admin/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    fetchProducts();
  };

  const handleUpdateProduct = async (data: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    await fetchApi(`/api/v1/admin/products/${editingProduct.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    fetchProducts();
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await fetchApi(`/api/v1/admin/products/${deactivateId}/deactivate`, {
        method: 'PATCH'
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setDeactivateId(null);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Cargando productos...</div>;
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
                <Package className="h-6 w-6 text-amber-500" />
                Gestión de Productos
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Administra el catálogo de productos de StockPulse</p>
            </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por SKU o Nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar producto por SKU o Nombre"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 w-full sm:w-64"
            />
            <button
              onClick={openCreateModal}
              aria-label="Abrir formulario para crear nuevo producto"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nuevo Producto
            </button>
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table aria-label="Catálogo de productos de inventario" className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="py-3 px-5 font-medium">SKU</th>
                <th scope="col" className="py-3 px-5 font-medium">Nombre</th>
                <th scope="col" className="py-3 px-5 font-medium text-right">Precio</th>
                <th scope="col" className="py-3 px-5 font-medium text-right">Stock Mín.</th>
                <th scope="col" className="py-3 px-5 font-medium text-center">Estado</th>
                <th scope="col" className="py-3 px-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-700/30 transition-colors">
                    <td className="py-3 px-5 font-mono text-zinc-400">{product.sku}</td>
                    <td className="py-3 px-5 font-medium text-zinc-200">{product.nombre}</td>
                    <td className="py-3 px-5 text-right font-mono">${product.precio.toFixed(2)}</td>
                    <td className="py-3 px-5 text-right font-mono">{product.stockMinimo}</td>
                    <td className="py-3 px-5 text-center">
                      {product.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          aria-label={`Editar producto ${product.nombre}`}
                          className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {product.activo && (
                          <button
                            onClick={() => setDeactivateId(product.id)}
                            aria-label={`Desactivar producto ${product.nombre}`}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors"
                            title="Desactivar"
                          >
                            <Ban className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
      />
      <ConfirmModal
        isOpen={!!deactivateId}
        onClose={() => setDeactivateId(null)}
        onConfirm={handleDeactivate}
        title="Desactivar Producto"
        message="¿Estás seguro de que deseas desactivar este producto? Ya no estará disponible para nuevas ventas."
      />
      </main>

      <RegisterSaleModal 
        isOpen={isSaleModalOpen} 
        onClose={() => setIsSaleModalOpen(false)} 
        onSuccess={fetchProducts} 
      />
      
      <StockTransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
        onSuccess={fetchProducts} 
      />
    </div>
  );
}
