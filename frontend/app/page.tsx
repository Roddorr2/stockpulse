'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { StockTransferModal } from '../components/StockTransferModal';
import { RegisterSaleModal } from '../components/RegisterSaleModal';
import { AlertToastContainer } from '../components/AlertToastContainer';
import { useStockAlertsWS } from '../lib/useStockAlertsWS';
import { Package, Building2, AlertTriangle, ArrowRightLeft, ShieldCheck, RefreshCw, Loader2, Database, ShoppingBag } from 'lucide-react';

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
      setApiError(`No se pudo cargar la matriz de stock desde el servidor Backend (${API_BASE_URL})`);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockMatrix();
  }, [fetchStockMatrix]);

  // Contadores dinámicos calculados a partir de los datos de la base de datos
  const totalProductos = new Set(stocks.map((s) => s.productoId)).size;
  const totalSucursales = new Set(stocks.map((s) => s.sucursalId)).size;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        isConnected={isConnected}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Catálogo Registrado</p>
              <h3 className="text-2xl font-bold text-slate-100">{totalProductos > 0 ? `${totalProductos} Productos` : '--'}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Sucursales Activas</p>
              <h3 className="text-2xl font-bold text-slate-100">{totalSucursales > 0 ? `${totalSucursales} Sedes` : '--'}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Alertas Bajo Stock</p>
              <h3 className="text-2xl font-bold text-amber-400">{alerts.length} Notificaciones</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Concurrencia Optimista</p>
              <h3 className="text-2xl font-bold text-slate-100">@Version Activo</h3>
            </div>
          </div>
        </section>

        {/* Stock Inventory Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">Matriz de Inventario en Tiempo Real</h2>
              <p className="text-xs text-slate-400">Datos obtenidos de PostgreSQL con control de concurrencia optimista</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Registrar Venta</span>
              </button>
              <button
                onClick={fetchStockMatrix}
                disabled={loading}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                <span>Actualizar Matriz</span>
              </button>
            </div>
          </div>

          {/* Loading / Error States */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Cargando matriz de inventario desde PostgreSQL...</p>
            </div>
          )}

          {apiError && !loading && (
            <div className="py-8 px-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <Database className="h-8 w-8 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Conexión con PostgreSQL en espera</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">{apiError}</p>
              </div>
              <button
                onClick={fetchStockMatrix}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reintentar Conexión</span>
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !apiError && stocks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Sucursal</th>
                    <th className="py-3 px-4 text-center">Stock Actual</th>
                    <th className="py-3 px-4 text-center">Stock Mínimo</th>
                    <th className="py-3 px-4 text-center">Versión (@Version)</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stocks.map((item) => {
                    const isLowStock = item.cantidad <= item.stockMinimo;
                    const isOutOfStock = item.cantidad === 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">{item.skuProducto}</td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{item.nombreProducto}</td>
                        <td className="py-3 px-4 text-slate-400">{item.nombreSucursal}</td>
                        <td className="py-3 px-4 text-center font-bold text-sm text-slate-100">{item.cantidad}</td>
                        <td className="py-3 px-4 text-center text-slate-400">{item.stockMinimo}</td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-blue-400">v{item.version}</td>
                        <td className="py-3 px-4 text-center">
                          {isOutOfStock ? (
                            <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-[10px]">
                              Agotado
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-[10px] animate-pulse">
                              Bajo Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                              Óptimo
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setIsTransferModalOpen(true)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
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

      {/* Real-time STOMP Alert Toast Container */}
      <AlertToastContainer alerts={alerts} onDismiss={dismissAlert} />
    </div>
  );
}
