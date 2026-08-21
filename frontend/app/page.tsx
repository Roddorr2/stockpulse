'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { StockTransferModal } from '../components/StockTransferModal';
import { RegisterSaleModal } from '../components/RegisterSaleModal';
import { AlertToastContainer } from '../components/AlertToastContainer';
import { useStockAlertsWS } from '../lib/useStockAlertsWS';
import { ArrowRightLeft, RefreshCw, Loader2, Database, ShoppingBag, AlertTriangle, Layers, Building } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../lib/AuthContext';

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
  productoActivo: boolean;
}

export default function Home() {
  const { alerts, isConnected, dismissAlert } = useStockAlertsWS();
  const { hasRole } = useAuth();
  const canTransfer = hasRole('ADMIN') || hasRole('ENCARGADO_SUCURSAL');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [stocks, setStocks] = useState<StockDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchStockMatrix = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchApi<StockDTO[]>('/stock');
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
    <ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO_SUCURSAL', 'CAJERO']}>
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
        {/* Navigation Header */}
      <Navbar
        isConnected={isConnected}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
      />

      {/* Main Operational Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Asymmetric Metrics Layout (B2B Industrial Samsara / Flexport Style) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* HERO METRIC BLOCK: Alertas de Bajo Stock (Barra lateral 4px sin resplandor/glow) */}
          <div className={`md:col-span-6 border-y border-r border-zinc-700/80 rounded-r-xl rounded-l-none p-5 flex flex-col justify-between transition-all ${
            alerts.length > 0
              ? 'border-l-4 border-l-amber-500 bg-amber-500/5 text-zinc-100'
              : 'border-l-4 border-l-zinc-600 bg-zinc-800 text-zinc-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${alerts.length > 0 ? 'text-amber-500' : 'text-zinc-500'}`} />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  Alertas de Stock Crítico
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                alerts.length > 0 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}>
                {alerts.length > 0 ? 'Requiere Atención' : 'Normal'}
              </span>
            </div>

            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-bold font-mono text-zinc-100 tracking-tight">{alerts.length}</span>
              <span className="text-xs text-zinc-400">
                {alerts.length === 1 ? 'notificación activa en tiempo real' : 'notificaciones activas en tiempo real'}
              </span>
            </div>

            <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-between border-t border-zinc-700/60 pt-2">
              <span>Suscripción en tiempo real</span>
              <span className="text-amber-500 font-medium">Conexión activa</span>
            </div>
          </div>

          {/* SECONDARY COMPACT METRICS GRID */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            {/* Catálogo */}
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <Layers className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[11px] font-medium">Catálogo</span>
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {totalProductos > 0 ? totalProductos : '--'}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">Productos únicos</span>
            </div>

            {/* Sucursales */}
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <Building className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[11px] font-medium">Sucursales</span>
              </div>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {totalSucursales > 0 ? totalSucursales : '--'}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">Sedes operativas</span>
            </div>

            {/* Estado de Red */}
            <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <span className="text-[11px] font-medium">Estado Red</span>
              </div>
              <div className="text-lg font-bold font-mono text-zinc-100 truncate">
                {isConnected ? 'Operativo' : 'Offline'}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                {isConnected ? 'Sincronizado' : 'Reconectando'}
              </span>
            </div>
          </div>
        </section>

        {/* Stock Inventory Operational Table */}
        <section className="bg-zinc-800 border border-zinc-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-700/80 pb-3.5">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Matriz de Inventario en Tiempo Real</span>
              </h2>
              <p className="text-[11px] text-zinc-400">Verificación inmediata de disponibilidad por sucursal</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Registrar Venta</span>
              </button>

              <button
                onClick={fetchStockMatrix}
                disabled={loading}
                aria-label="Actualizar datos de inventario"
                className="p-1.5 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-md transition-colors text-xs flex items-center gap-1.5"
                title="Actualizar datos"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" aria-hidden="true" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-7 w-7 text-amber-500 animate-spin mx-auto" aria-hidden="true" />
              <p className="text-xs font-mono text-zinc-400">Cargando datos de inventario...</p>
            </div>
          )}

          {/* Error State */}
          {apiError && !loading && (
            <div role="alert" className="py-10 px-4 rounded-lg bg-zinc-900 border border-zinc-700 text-center space-y-3">
              <Database className="h-7 w-7 text-zinc-500 mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-300">Servidor no disponible</p>
                <p className="text-[11px] text-zinc-500 max-w-md mx-auto">{apiError}</p>
              </div>
              <button
                onClick={fetchStockMatrix}
                aria-label="Reintentar cargar matriz de inventario"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Operational Data Table with Side-Border Status Indicators & Neutral SKU styling */}
          {!loading && !apiError && stocks.length > 0 && (
            <div className="overflow-x-auto">
              <table aria-label="Matriz de inventario en tiempo real por sucursal" className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900 border-b border-zinc-700 text-zinc-400 uppercase font-mono tracking-wider text-[10px]">
                  <tr>
                    <th scope="col" className="py-2.5 px-4">SKU</th>
                    <th scope="col" className="py-2.5 px-4">Producto</th>
                    <th scope="col" className="py-2.5 px-4">Sucursal</th>
                    <th scope="col" className="py-2.5 px-4 text-center">Stock Actual</th>
                    <th scope="col" className="py-2.5 px-4 text-center">Stock Mínimo</th>
                    <th scope="col" className="py-2.5 px-4 text-center">Estado</th>
                    {canTransfer && <th scope="col" className="py-2.5 px-4 text-right">Acción</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/60">
                  {stocks.map((item) => {
                    const isLowStock = item.cantidad <= item.stockMinimo;
                    const isOutOfStock = item.cantidad === 0;
                    
                    const rowStatusClass = isOutOfStock
                      ? 'row-status-danger'
                      : isLowStock
                      ? 'row-status-warning'
                      : 'row-status-optimo';

                    return (
                      <tr key={item.id} className={`${rowStatusClass} hover:bg-zinc-700/30 transition-colors`}>
                        {/* SKU Neutro en gris claro text-zinc-300 */}
                        <td className="py-2.5 px-4 font-mono font-medium text-zinc-300">{item.skuProducto}</td>
                        <td className="py-2.5 px-4 font-medium text-zinc-100">{item.nombreProducto}</td>
                        <td className="py-2.5 px-4 text-zinc-400">{item.nombreSucursal}</td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-sm text-zinc-100">
                          {item.cantidad}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-zinc-400">
                          {item.stockMinimo}
                        </td>
                        {/* Estado: Semántica intacta de colores */}
                        <td className="py-2.5 px-4 text-center font-medium">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center text-[11px] text-rose-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" aria-hidden="true" />
                              Agotado
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center text-[11px] text-amber-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" aria-hidden="true" />
                              Bajo Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[11px] text-emerald-400 font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" aria-hidden="true" />
                              Óptimo
                            </span>
                          )}
                        </td>
                        {/* Botón secundario "Transferir" estilo ghost/outline neutro */}
                        {canTransfer && (
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setIsTransferModalOpen(true)}
                              disabled={!item.productoActivo}
                              aria-label={`Transferir stock de ${item.nombreProducto} (SKU ${item.skuProducto})`}
                              className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700/80 border border-zinc-700 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={!item.productoActivo ? 'Producto inactivo' : 'Transferir'}
                            >
                              <ArrowRightLeft className="h-3 w-3" aria-hidden="true" />
                              <span>Transferir</span>
                            </button>
                          </td>
                        )}
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
    </ProtectedRoute>
  );
}
