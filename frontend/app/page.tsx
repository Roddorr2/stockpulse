'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { StockTransferModal } from '../components/StockTransferModal';
import { RegisterSaleModal } from '../components/RegisterSaleModal';
import { AlertToastContainer } from '../components/AlertToastContainer';
import { useStockAlertsWS } from '../lib/useStockAlertsWS';
import { ArrowRightLeft, RefreshCw, Loader2, Database, ShoppingBag, AlertTriangle, Layers, Building } from 'lucide-react';

export interface StockDTO {
  id: string;
  productoId: string;
  skuProducto: string;
  nombreProducto: string;
  precioProducto: number;
  sucursalId: string;
  nombreSucursal: string;
  cantidad: number;
  stockMinimo: number;
  version: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function Home() {
  const { alerts, isConnected, dismissAlert } = useStockAlertsWS();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [stocks, setStocks] = useState<StockDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchStockMatrix = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/stock`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      const data: StockDTO[] = await response.json();
      setStocks(data);
    } catch {
      setApiError('No se pudo cargar la matriz de inventario desde el servidor');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockMatrix();
  }, [fetchStockMatrix]);

  // Contadores dinámicos calculados a partir de los datos de inventario
  const totalProductos = new Set(stocks.map((s) => s.productoId)).size;
  const totalSucursales = new Set(stocks.map((s) => s.sucursalId)).size;

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        isConnected={isConnected}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
      />

      {/* Main Operational Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Asymmetric Metrics Layout (Breaks the 4-identical-cards anti-pattern) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* HERO METRIC BLOCK: Alertas de Bajo Stock (KPI Crítico de Operación) */}
          <div className={`md:col-span-6 border rounded-xl p-5 flex flex-col justify-between transition-all ${
            alerts.length > 0
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              : 'bg-[#0d131c] border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${alerts.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400">
                  Alertas de Stock Crítico
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                alerts.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {alerts.length > 0 ? 'Requiere Atención' : 'Normal'}
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-bold font-mono text-white tracking-tight">{alerts.length}</span>
              <span className="text-xs text-slate-400">
                {alerts.length === 1 ? 'notificación activa en tiempo real' : 'notificaciones activas en tiempo real'}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>Suscripción activa en tiempo real</span>
              <span className="text-cyan-400">Escuchando eventos...</span>
            </div>
          </div>

          {/* SECONDARY COMPACT METRICS GRID */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            {/* Catálogo */}
            <div className="bg-[#0d131c] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[11px] font-medium">Catálogo</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100">
                {totalProductos > 0 ? totalProductos : '--'}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Productos únicos</span>
            </div>

            {/* Sucursales */}
            <div className="bg-[#0d131c] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[11px] font-medium">Sucursales</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100">
                {totalSucursales > 0 ? totalSucursales : '--'}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Sedes operativas</span>
            </div>

            {/* Estado de Red */}
            <div className="bg-[#0d131c] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                <span className="text-[11px] font-medium">Estado Red</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-100 truncate">
                {isConnected ? 'Operativo' : 'Offline'}
              </div>
              <span className="text-[10px] text-cyan-400 font-mono mt-1 truncate">
                {isConnected ? '100% Sincronizado' : 'Reconectando'}
              </span>
            </div>
          </div>
        </section>

        {/* Stock Inventory Operational Table */}
        <section className="bg-[#0d131c] border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <span>Matriz de Inventario en Tiempo Real</span>
              </h2>
              <p className="text-[11px] text-slate-400">Verificación inmediata de disponibilidad por sucursal</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Registrar Venta</span>
              </button>

              <button
                onClick={fetchStockMatrix}
                disabled={loading}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md transition-colors text-xs flex items-center gap-1.5"
                title="Actualizar datos"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" /> : <RefreshCw className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-7 w-7 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Cargando datos de inventario...</p>
            </div>
          )}

          {/* Error State */}
          {apiError && !loading && (
            <div className="py-10 px-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center space-y-3">
              <Database className="h-7 w-7 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">Servidor no disponible</p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">{apiError}</p>
              </div>
              <button
                onClick={fetchStockMatrix}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Operational Data Table with Side-Border Status Indicators & Monospace Numbers */}
          {!loading && !apiError && stocks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070a0f] border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">SKU</th>
                    <th className="py-2.5 px-4">Producto</th>
                    <th className="py-2.5 px-4">Sucursal</th>
                    <th className="py-2.5 px-4 text-center">Stock Actual</th>
                    <th className="py-2.5 px-4 text-center">Stock Mínimo</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stocks.map((item) => {
                    const isLowStock = item.cantidad <= item.stockMinimo;
                    const isOutOfStock = item.cantidad === 0;
                    
                    const rowStatusClass = isOutOfStock
                      ? 'row-status-danger'
                      : isLowStock
                      ? 'row-status-warning'
                      : 'row-status-optimo';

                    return (
                      <tr key={item.id} className={`${rowStatusClass} hover:bg-slate-800/30 transition-colors`}>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-400">{item.skuProducto}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-100">{item.nombreProducto}</td>
                        <td className="py-2.5 px-4 text-slate-400">{item.nombreSucursal}</td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-sm text-slate-100">
                          {item.cantidad}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                          {item.stockMinimo}
                        </td>
                        <td className="py-2.5 px-4 text-center font-medium">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center text-[11px] text-rose-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
                              Agotado
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center text-[11px] text-amber-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
                              Bajo Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[11px] text-emerald-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
                              Óptimo
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setIsTransferModalOpen(true)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-cyan-400 hover:text-cyan-300 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
                            <span>Transferir</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Stock Transfer Modal */}
      <StockTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={fetchStockMatrix}
      />

      {/* Register Sale Modal */}
      <RegisterSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSuccess={fetchStockMatrix}
      />

      {/* Real-time Alert Toast Container */}
      <AlertToastContainer alerts={alerts} onDismiss={dismissAlert} />
    </div>
  );
}
