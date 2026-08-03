'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { LowStockAlert } from '../lib/useStockAlertsWS';

interface AlertToastContainerProps {
  alerts: LowStockAlert[];
  onDismiss: (index: number) => void;
}

export function AlertToastContainer({ alerts, onDismiss }: AlertToastContainerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {alerts.map((alert, index) => (
        <div
          key={`${alert.productoId}-${alert.timestamp}-${index}`}
          className="relative bg-[#0d131c]/95 border border-amber-500/40 rounded-xl p-4 shadow-2xl text-amber-100 backdrop-blur-md animate-alert-pulse transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-amber-400">
                  Stock Crítico en Sucursal
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-slate-100">{alert.nombreProducto}</h4>
              <p className="text-[11px] text-slate-300 leading-snug">{alert.mensaje}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-amber-300">
                <span>Stock: <strong className="text-white font-mono">{alert.stockActual}</strong></span>
                <span>Mínimo: <strong className="text-amber-400 font-mono">{alert.stockMinimo}</strong></span>
              </div>
            </div>

            <button
              onClick={() => onDismiss(index)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
