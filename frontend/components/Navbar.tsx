'use client';

import React from 'react';
import { Activity, Radio, ArrowLeftRight } from 'lucide-react';

interface NavbarProps {
  isConnected: boolean;
  onOpenTransferModal: () => void;
}

export function Navbar({ isConnected, onOpenTransferModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">StockPulse</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Inventario Multi-Sucursal en Tiempo Real</p>
          </div>
        </div>

        {/* Status Indicators & Action Button */}
        <div className="flex items-center gap-4">
          {/* WebSocket Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
            isConnected 
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <Radio className={`h-3.5 w-3.5 ${isConnected ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
            <span>{isConnected ? 'WebSocket STOMP Conectado' : 'Conectando WebSocket...'}</span>
          </div>

          {/* Transfer Button */}
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transferir Stock</span>
          </button>
        </div>
      </div>
    </header>
  );
}
