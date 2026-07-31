'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { StockTransferModal } from '../components/StockTransferModal';
import { AlertToastContainer } from '../components/AlertToastContainer';
import { useStockAlertsWS } from '../lib/useStockAlertsWS';
import { Package, Building2, AlertTriangle, ArrowRightLeft, ShieldCheck, RefreshCw } from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  nombre: string;
  sucursal: string;
  sucursalId: string;
  cantidad: number;
  stockMinimo: number;
  version: number;
}

const INITIAL_STOCKS: StockItem[] = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    sku: 'PROD-MACBOOK',
    nombre: 'MacBook Pro M3 Max 16"',
    sucursal: 'Sucursal Central (Bogotá)',
    sucursalId: '11111111-1111-1111-1111-111111111111',
    cantidad: 24,
    stockMinimo: 5,
    version: 1,
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    sku: 'PROD-IPHONE',
    nombre: 'iPhone 15 Pro Max 256GB',
    sucursal: 'Sucursal Norte (Medellín)',
    sucursalId: '22222222-2222-2222-2222-222222222222',
    cantidad: 3,
    stockMinimo: 10,
    version: 4,
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    sku: 'PROD-DELL-XPS',
    nombre: 'Dell XPS 15 OLED Touch',
    sucursal: 'Sucursal Sur (Cali)',
    sucursalId: '33333333-3333-3333-3333-333333333333',
    cantidad: 12,
    stockMinimo: 4,
    version: 2,
  },
  {
    id: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
    sku: 'PROD-MONITOR-4K',
    nombre: 'Monitor LG UltraFine 32 4K',
    sucursal: 'Sucursal Central (Bogotá)',
    sucursalId: '11111111-1111-1111-1111-111111111111',
    cantidad: 2,
    stockMinimo: 8,
    version: 7,
  },
];

export default function Home() {
  const { alerts, isConnected, dismissAlert } = useStockAlertsWS();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);

  const handleRefresh = () => {
    // Simulación de refresco de vista
    setStocks([...INITIAL_STOCKS]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        isConnected={isConnected}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
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
              <p className="text-xs text-slate-400 font-medium">Catálogo Activo</p>
              <h3 className="text-2xl font-bold text-slate-100">42 Productos</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Sucursales Operativas</p>
              <h3 className="text-2xl font-bold text-slate-100">3 Sedes</h3>
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
              <h2 className="text-base font-bold text-slate-100">Matriz de Inventario por Sucursal</h2>
              <p className="text-xs text-slate-400">Control de existencias con versionado de concurrencia</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Actualizar Matriz</span>
              </button>
            </div>
          </div>

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
                      <td className="py-3 px-4 font-mono text-slate-400">{item.sku}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{item.nombre}</td>
                      <td className="py-3 px-4 text-slate-400">{item.sucursal}</td>
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
        </section>
      </main>

      {/* Stock Transfer Modal */}
      <StockTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={handleRefresh}
      />

      {/* Real-time STOMP Alert Toast Container */}
      <AlertToastContainer alerts={alerts} onDismiss={dismissAlert} />
    </div>
  );
}
