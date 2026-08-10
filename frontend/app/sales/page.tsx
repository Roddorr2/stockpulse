'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { fetchApi, ApiError } from '../../lib/api';
import { Search, ShoppingCart, Loader2, Database, Download } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { StockTransferModal } from '../../components/StockTransferModal';
import { RegisterSaleModal } from '../../components/RegisterSaleModal';
import { useAuth } from '../../lib/AuthContext';

interface Venta {
  id: string;
  fecha: string;
  sucursalId: string;
  items: DetalleVenta[];
  total: number;
}

interface DetalleVenta {
  productoId: string;
  sku: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export default function SalesHistoryPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Venta[]>([]);
  const [branches, setBranches] = useState<Array<{id: string, nombre: string}>>([]);
  const [products, setProducts] = useState<Array<{id: string, nombre: string, sku: string}>>([]);
  
  const [sucursalId, setSucursalId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSearch = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (sucursalId) params.append('sucursalId', sucursalId);
      if (productoId) params.append('productoId', productoId);
      if (fechaInicio) params.append('fechaInicio', new Date(fechaInicio).toISOString());
      if (fechaFin) params.append('fechaFin', new Date(fechaFin).toISOString());
      
      const data = await fetchApi<Venta[]>(`/sales?${params.toString()}`);
      setSales(data);
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setApiError('No tienes permisos suficientes para acceder a esta información o tu sesión es inválida.');
      } else {
        setApiError(error instanceof Error ? error.message : 'Error cargando el historial de ventas');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sucursalId, productoId, fechaInicio, fechaFin]);

  const handleExportCsv = async () => {
    setIsExporting(true);
    setApiError(null);
    try {
      const params = new URLSearchParams();
      if (sucursalId) params.append('sucursalId', sucursalId);
      if (productoId) params.append('productoId', productoId);
      if (fechaInicio) params.append('fechaInicio', new Date(fechaInicio).toISOString());
      if (fechaFin) params.append('fechaFin', new Date(fechaFin).toISOString());
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/sales/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al exportar el historial a CSV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historial_ventas.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : 'Error al exportar');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchApi<Array<{id: string, nombre: string}>>('/branches').then(setBranches).catch(() => {});
    fetchApi<Array<{id: string, nombre: string, sku: string}>>('/products').then(setProducts).catch(() => {});
    handleSearch();
  }, [handleSearch]);

  const getBranchName = (id: string) => {
    return branches.find(b => b.id === id)?.nombre || id;
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO_SUCURSAL', 'CAJERO']}>
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
        <Navbar 
          isConnected={true} 
          onOpenTransferModal={() => setIsTransferModalOpen(true)} 
          onOpenSaleModal={() => setIsSaleModalOpen(true)} 
        />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Historial de Ventas</h1>
          </div>
          
          {/* Filter Card */}
          <form className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-5 flex flex-wrap gap-4 items-end" onSubmit={handleSearch}>
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sucursal</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-3 py-2 text-zinc-100 outline-none transition-all text-sm" 
                value={sucursalId} 
                onChange={e => setSucursalId(e.target.value)}
              >
                <option value="">Todas las sucursales</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Producto</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-3 py-2 text-zinc-100 outline-none transition-all text-sm" 
                value={productoId} 
                onChange={e => setProductoId(e.target.value)}
              >
                <option value="">Todos los productos</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Desde</label>
              <input 
                type="datetime-local" 
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-3 py-2 text-zinc-100 outline-none transition-all text-sm" 
                value={fechaInicio} 
                onChange={e => setFechaInicio(e.target.value)} 
              />
            </div>
            
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Hasta</label>
              <input 
                type="datetime-local" 
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-3 py-2 text-zinc-100 outline-none transition-all text-sm" 
                value={fechaFin} 
                onChange={e => setFechaFin(e.target.value)} 
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-semibold px-5 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 h-[38px]"
              >
                <Search size={16} />
                <span>Filtrar</span>
              </button>
              
              {user?.roles.includes('ADMIN') && (
                <button 
                  type="button" 
                  onClick={handleExportCsv}
                  disabled={isLoading || isExporting}
                  className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-zinc-100 font-semibold px-5 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 h-[38px]"
                >
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span className="hidden sm:inline">Exportar CSV</span>
                </button>
              )}
            </div>
          </form>

          {/* Table section */}
          <section className="bg-zinc-800 border border-zinc-700/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">ID Venta</th>
                    <th className="py-3 px-5">Fecha</th>
                    <th className="py-3 px-5">Sucursal</th>
                    <th className="py-3 px-5">Artículos</th>
                    <th className="py-3 px-5">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/60">
                  {isLoading && sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <Loader2 className="h-6 w-6 text-amber-500 animate-spin mx-auto mb-2" />
                        <span className="text-zinc-500 font-mono">Cargando ventas...</span>
                      </td>
                    </tr>
                  ) : apiError ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-rose-400">
                        <Database className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <span>{apiError}</span>
                      </td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        No se encontraron ventas para estos filtros.
                      </td>
                    </tr>
                  ) : (
                    sales.map(venta => (
                      <tr key={venta.id} className="hover:bg-zinc-700/30 transition-colors">
                        <td className="py-3 px-5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {venta.id.split('-')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-5 font-medium text-zinc-300">
                          {new Date(venta.fecha).toLocaleString('es-ES')}
                        </td>
                        <td className="py-3 px-5 text-zinc-400">
                          {getBranchName(venta.sucursalId)}
                        </td>
                        <td className="py-3 px-5">
                          <ul className="space-y-1 text-zinc-400 font-mono text-[11px]">
                            {venta.items?.map(d => (
                              <li key={d.productoId}>
                                <span className="text-zinc-300 font-bold">{d.cantidad}x</span> {d.nombreProducto}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-5 font-bold text-amber-500">
                          ${venta.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <RegisterSaleModal 
          isOpen={isSaleModalOpen} 
          onClose={() => setIsSaleModalOpen(false)} 
          onSuccess={handleSearch} 
        />
        
        <StockTransferModal 
          isOpen={isTransferModalOpen} 
          onClose={() => setIsTransferModalOpen(false)} 
          onSuccess={handleSearch} 
        />
      </div>
    </ProtectedRoute>
  );
}
