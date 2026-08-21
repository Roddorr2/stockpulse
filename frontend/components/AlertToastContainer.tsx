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
    <div role="region" aria-label="Notificaciones de alertas de stock" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {alerts.map((alert, index) => (
        <div
          key={`${alert.productoId}-${alert.timestamp}-${index}`}
          role="alert"
          aria-live="polite"
          className="relative bg-zinc-800 border border-zinc-700 border-l-4 border-l-amber-500 rounded-lg p-4 shadow-xl text-zinc-100 backdrop-blur-md transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-500 shrink-0 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-amber-500">
                  Stock Crítico en Sucursal
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-zinc-100">{alert.nombreProducto}</h4>
              <p className="text-[11px] text-zinc-300 leading-snug">{alert.mensaje}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-300">
                <span>Stock: <strong className="text-zinc-100 font-mono">{alert.stockActual}</strong></span>
                <span>Mínimo: <strong className="text-amber-500 font-mono">{alert.stockMinimo}</strong></span>
              </div>
            </div>

            <button
              onClick={() => onDismiss(index)}
              aria-label={`Descartar notificación de stock crítico para ${alert.nombreProducto}`}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
