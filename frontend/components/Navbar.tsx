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
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-500 font-bold">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-zinc-100 tracking-tight">StockPulse</span>
              <span className="text-[10px] font-mono uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Terminal Operativo de Inventario Multi-Sucursal</p>
          </div>
        </div>

        {/* Real-time Status Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status (Discreto con punto verde y texto neutro) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs font-mono">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            <span className="text-zinc-400">
              {isConnected ? 'Sincronizado en vivo' : 'Desconectado'}
            </span>
          </div>

          {/* Transfer Action (Secondary Outline Scale) */}
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium rounded-md border border-zinc-700 transition-colors focus:outline-none"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-400" />
            <span>Transferir Stock</span>
          </button>

          {/* Primary Action: Register Sale (Amber-600 Cobre Industrial) */}
          <button
            onClick={onOpenSaleModal}
            className="flex items-center gap-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold text-xs rounded-md transition-colors shadow-none focus:outline-none"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>
    </header>
  );
}
