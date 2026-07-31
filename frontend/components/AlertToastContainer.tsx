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
          className="relative bg-amber-950/90 border border-amber-500/50 rounded-xl p-4 shadow-2xl text-amber-100 backdrop-blur-md animate-alert-pulse transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Alerta STOMP WebSockets
                </span>
                <span className="text-[10px] text-amber-300/70 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100">{alert.nombreProducto}</h4>
              <p className="text-xs text-amber-200/90 leading-snug">{alert.mensaje}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-amber-300">
                <span>Stock Actual: <strong className="text-white">{alert.stockActual}</strong></span>
                <span>Mínimo: <strong className="text-amber-400">{alert.stockMinimo}</strong></span>
              </div>
            </div>

            <button
              onClick={() => onDismiss(index)}
              className="text-amber-400/60 hover:text-amber-200 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
