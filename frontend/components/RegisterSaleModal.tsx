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
        setErrorMsg(`Stock insuficiente: ${data.message || 'No hay suficiente inventario disponible en esta sucursal'}`);
      } else if (response.status === 409) {
        setErrorMsg('El inventario de este producto fue actualizado recientemente por otra caja. Por favor, reintente la venta.');
      } else {
        setErrorMsg(data.message || 'Error al procesar la venta');
      }
    } catch {
      setErrorMsg('No se pudo conectar con el servidor. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d131c] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm">Registrar Venta (Caja)</h2>
              <p className="text-[11px] text-slate-400">Descuento automático de inventario en sucursal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Sucursal Vendedora</label>
            <select
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#070a0f] border border-slate-800 rounded-md text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  {suc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Producto a Vender</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#070a0f] border border-slate-800 rounded-md text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Cantidad a Vender</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#070a0f] border border-slate-800 rounded-md text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Estimado</label>
              <div className="w-full px-3 py-2 bg-[#070a0f] border border-slate-800/80 rounded-md text-xs font-mono font-bold text-cyan-400">
                ${totalEstimado} USD
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-md transition-colors shadow-sm"
            >
              {loading ? 'Procesando Venta...' : 'Confirmar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
