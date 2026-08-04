'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { fetchApi } from '../../lib/api';
import { BarChart3, Loader2, Database, TrendingUp, DollarSign } from 'lucide-react';
import { Navbar } from '../../components/Navbar';

interface ItemReporteStockDTO {
  productoId: string;
  sku: string;
  nombre: string;
  cantidadTotal: number;
  precioBase: number;
  valorTotalInmovilizado: number;
}

interface ReporteStockTotalDTO {
  items: ItemReporteStockDTO[];
  valorGlobalInmovilizado: number;
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReporteStockTotalDTO | null>(null);
  const [branches, setBranches] = useState<Array<{id: string, nombre: string}>>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<Array<{id: string, nombre: string}>>('/branches').then(setBranches).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const url = sucursalId ? `/stock/report?sucursalId=${sucursalId}` : '/stock/report';
        const data = await fetchApi<ReporteStockTotalDTO>(url);
        setReport(data);
      } catch (error: unknown) {
        console.error('Failed to fetch report', error);
        setApiError(error instanceof Error ? error.message : 'Error cargando el reporte de stock');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [sucursalId]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO_SUCURSAL']}>
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
        <Navbar 
          isConnected={true} 
          onOpenTransferModal={() => {}} 
          onOpenSaleModal={() => {}} 
        />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Reporte de Inventario</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Filtrar por Sucursal:</label>
              <select 
                className="bg-zinc-900 border border-zinc-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-3 py-1.5 text-zinc-100 outline-none transition-all text-sm w-48"
                value={sucursalId} 
                onChange={e => setSucursalId(e.target.value)}
              >
                <option value="">Todas (Consolidado)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Valor Global Inmovilizado</span>
              </div>
              
              {isLoading && !report ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                </div>
              ) : apiError ? (
                <div className="text-rose-400 text-sm font-medium h-10 flex items-center">
                  Error calculando valor
                </div>
              ) : (
                <div className="text-4xl font-bold font-mono text-zinc-100 tracking-tight">
                  {formatMoney(report?.valorGlobalInmovilizado || 0)}
                </div>
              )}
            </div>
            
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Productos en Catálogo</span>
              </div>
              
              {isLoading && !report ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                </div>
              ) : apiError ? (
                <div className="text-rose-400 text-sm font-medium h-10 flex items-center">
                  --
                </div>
              ) : (
                <div className="text-4xl font-bold font-mono text-zinc-100 tracking-tight">
                  {report?.items.length || 0}
                </div>
              )}
            </div>
          </div>

          {/* Table section */}
          <section className="bg-zinc-800 border border-zinc-700/80 rounded-xl overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">SKU</th>
                    <th className="py-3 px-5">Producto</th>
                    <th className="py-3 px-5 text-right">Cantidad Total</th>
                    <th className="py-3 px-5 text-right">Precio Base</th>
                    <th className="py-3 px-5 text-right">Total Inmovilizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/60">
                  {isLoading && !report ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <Loader2 className="h-6 w-6 text-amber-500 animate-spin mx-auto mb-2" />
                        <span className="text-zinc-500 font-mono">Generando reporte...</span>
                      </td>
                    </tr>
                  ) : apiError ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-rose-400">
                        <Database className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <span>{apiError}</span>
                      </td>
                    </tr>
                  ) : report?.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500">
                        No hay stock registrado.
                      </td>
                    </tr>
                  ) : (
                    report?.items.map(item => (
                      <tr key={item.productoId} className="hover:bg-zinc-700/30 transition-colors">
                        <td className="py-3 px-5 font-mono font-medium text-zinc-400">
                          {item.sku}
                        </td>
                        <td className="py-3 px-5 font-medium text-zinc-100">
                          {item.nombre}
                        </td>
                        <td className="py-3 px-5 text-right font-mono font-bold text-zinc-100">
                          {item.cantidadTotal}
                        </td>
                        <td className="py-3 px-5 text-right font-mono text-zinc-400">
                          {formatMoney(item.precioBase)}
                        </td>
                        <td className="py-3 px-5 text-right font-mono font-bold text-emerald-400">
                          {formatMoney(item.valorTotalInmovilizado)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
