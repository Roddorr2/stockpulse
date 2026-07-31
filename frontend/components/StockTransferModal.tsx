'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductItem {
  id: string;
  sku: string;
  nombre: string;
}

interface BranchItem {
  id: string;
  nombre: string;
}

export function StockTransferModal({ isOpen, onClose, onSuccess }: StockTransferModalProps) {
  const [productos, setProductos] = useState<ProductItem[]>([]);
  const [sucursales, setSucursales] = useState<BranchItem[]>([]);

  const [productoId, setProductoId] = useState('');
  const [sucursalOrigenId, setSucursalOrigenId] = useState('');
  const [sucursalDestinoId, setSucursalDestinoId] = useState('');
  const [cantidad, setCantidad] = useState(5);
  const [usuarioId] = useState('bbbb2222-bbbb-2222-bbbb-222222222222');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Cargar productos y sucursales reales de la base de datos
      fetch('http://localhost:8080/api/v1/products')
        .then((res) => res.ok ? res.json() : [])
        .then((data: ProductItem[]) => {
          setProductos(data);
          if (data.length > 0) setProductoId(data[0].id);
        })
        .catch(() => {});

      fetch('http://localhost:8080/api/v1/branches')
        .then((res) => res.ok ? res.json() : [])
        .then((data: BranchItem[]) => {
          setSucursales(data);
          if (data.length > 1) {
            setSucursalOrigenId(data[0].id);
            setSucursalDestinoId(data[1].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/stock/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId,
          sucursalOrigenId,
          sucursalDestinoId,
          cantidad: Number(cantidad),
          usuarioId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(
          `¡Transferencia Exitosa! Nuevo stock origen: ${data.stockOrigenRestante} ud, destino: ${data.stockDestinoActual} ud.`
        );
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else if (response.status === 409) {
        setErrorMsg('⚡ CONFLICTO DE CONCURRENCIA (@Version): El stock fue modificado por otra transacción en milisegundos. Por favor reintente.');
      } else {
        setErrorMsg(data.message || 'Error al procesar la transferencia de stock');
      }
    } catch {
      setErrorMsg('No se pudo conectar con el servidor Backend (http://localhost:8080)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">Nueva Transferencia de Stock</h2>
              <p className="text-xs text-slate-400">Movimiento atómico entre sucursales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Producto a Transferir</label>
            {productos.length > 0 ? (
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} ({prod.sku})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                placeholder="ID Producto (UUID)"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sucursal Origen</label>
              {sucursales.length > 0 ? (
                <select
                  value={sucursalOrigenId}
                  onChange={(e) => setSucursalOrigenId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={sucursalOrigenId}
                  onChange={(e) => setSucursalOrigenId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sucursal Destino</label>
              {sucursales.length > 0 ? (
                <select
                  value={sucursalDestinoId}
                  onChange={(e) => setSucursalDestinoId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={sucursalDestinoId}
                  onChange={(e) => setSucursalDestinoId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cantidad a Transferir</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ID Operador</label>
              <input
                type="text"
                value={usuarioId}
                disabled
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Procesando Transacción...' : 'Confirmar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
