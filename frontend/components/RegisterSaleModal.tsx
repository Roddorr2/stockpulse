'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RegisterSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductItem {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
}

interface BranchItem {
  id: string;
  nombre: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export function RegisterSaleModal({ isOpen, onClose, onSuccess }: RegisterSaleModalProps) {
  const [productos, setProductos] = useState<ProductItem[]>([]);
  const [sucursales, setSucursales] = useState<BranchItem[]>([]);

  const [sucursalId, setSucursalId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [usuarioId] = useState('cccc3333-cccc-3333-cccc-333333333333');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/v1/products`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: ProductItem[]) => {
          setProductos(data);
          if (data.length > 0) setProductoId(data[0].id);
        })
        .catch(() => {});

      fetch(`${API_BASE_URL}/api/v1/branches`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: BranchItem[]) => {
          setSucursales(data);
          if (data.length > 0) setSucursalId(data[0].id);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = productos.find((p) => p.id === productoId);
  const totalEstimado = selectedProduct ? (selectedProduct.precio * cantidad).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sucursalId,
          usuarioId,
          items: [
            {
              productoId,
              cantidad: Number(cantidad),
            },
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(
          `¡Venta Registrada! Total: $${data.total} USD. Descuento de stock aplicado.`
        );
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else if (response.status === 422) {
        setErrorMsg(`⚠️ STOCK INSUFICIENTE (HTTP 422): ${data.message || 'No hay suficiente inventario en esta sucursal'}`);
      } else if (response.status === 409) {
        setErrorMsg('⚡ CONFLICTO DE CONCURRENCIA (@Version): Otra caja procesó una venta sobre este producto en milisegundos. Por favor reintente.');
      } else {
        setErrorMsg(data.message || 'Error al procesar la venta');
      }
    } catch {
      setErrorMsg(`No se pudo conectar con el servidor Backend (${API_BASE_URL})`);
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
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">Registrar Nueva Venta (Caja)</h2>
              <p className="text-xs text-slate-400">Descuento atómico de stock en sucursal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerts */}
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sucursal Vendedora</label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  {suc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Producto a Vender</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} ({prod.sku}) — ${prod.precio} USD
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cantidad a Vender</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Estimado</label>
              <div className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs font-mono font-bold text-emerald-400">
                ${totalEstimado} USD
              </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Procesando Venta...' : 'Confirmar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
