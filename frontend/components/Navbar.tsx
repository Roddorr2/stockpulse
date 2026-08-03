'use client';

import React from 'react';
import { Activity, ArrowLeftRight, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  isConnected: boolean;
  onOpenTransferModal: () => void;
  onOpenSaleModal: () => void;
}

export function Navbar({ isConnected, onOpenTransferModal, onOpenSaleModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070a0f]/90 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-sm">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-100 tracking-tight">StockPulse</span>
              <span className="text-[10px] font-mono uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Terminal Operativo de Inventario Multi-Sucursal</p>
          </div>
        </div>

        {/* Real-time Status Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 text-xs font-mono">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-slate-300">
              {isConnected ? 'Sincronizado en vivo' : 'Desconectado'}
            </span>
          </div>

          {/* Transfer Action */}
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-md border border-slate-700/60 transition-colors focus:outline-none"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Transferir Stock</span>
          </button>

          {/* Primary Action: Register Sale */}
          <button
            onClick={onOpenSaleModal}
            className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-md transition-colors shadow-sm focus:outline-none"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
