'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, ShoppingBag, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchApi, ApiError } from '../lib/api';

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
  activo: boolean;
}

interface BranchItem {
  id: string;
  nombre: string;
}

interface StockItem {
  productoId: string;
  sucursalId: string;
  cantidad: number;
}



export function RegisterSaleModal({ isOpen, onClose, onSuccess }: RegisterSaleModalProps) {
  const [productos, setProductos] = useState<ProductItem[]>([]);
  const [sucursales, setSucursales] = useState<BranchItem[]>([]);
  const [stockMatrix, setStockMatrix] = useState<StockItem[]>([]);

  const [sucursalId, setSucursalId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [usuarioId] = useState('cccc3333-cccc-3333-cccc-333333333333');

  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoadingData(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      Promise.all([
        fetchApi<ProductItem[]>('/products').catch(() => []),
        fetchApi<BranchItem[]>('/branches').catch(() => []),
        fetchApi<StockItem[]>('/stock').catch(() => []),
      ])
        .then(([prodsData, branchesData, stockData]) => {
          setProductos(prodsData);
          setSucursales(branchesData);
          setStockMatrix(stockData);

          if (prodsData.length > 0) setProductoId(prodsData[0].id);
          if (branchesData.length > 0) setSucursalId(branchesData[0].id);
        })
        .catch(() => {
          setErrorMsg('Error de comunicación con el backend al cargar catálogo e inventario.');
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [isOpen]);

  const stockDisponible = useMemo(() => {
    if (!productoId || !sucursalId) return null;
    const match = stockMatrix.find(
      (s) => s.productoId === productoId && s.sucursalId === sucursalId
    );
    return match ? match.cantidad : 0;
  }, [stockMatrix, productoId, sucursalId]);

  const selectedProduct = productos.find((p) => p.id === productoId);
  const selectedBranch = sucursales.find((b) => b.id === sucursalId);
  const totalEstimado = selectedProduct ? (selectedProduct.precio * cantidad).toFixed(2) : '0.00';

  const isInvalidQuantity = cantidad <= 0;
  const isExceedingStock = stockDisponible !== null && cantidad > stockDisponible;

  const isFormInvalid =
    !productoId ||
    !sucursalId ||
    isInvalidQuantity ||
    isExceedingStock ||
    loading;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const data = await fetchApi<{ total: number }>('/sales', {
        method: 'POST',
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

      setSuccessMsg(
        `¡Venta Registrada! Total: $${data.total} USD. Descuento de stock aplicado.`
      );
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          const branchName = selectedBranch ? selectedBranch.nombre : 'la sucursal seleccionada';
          const msg = error.message
            ? error.message.replace(/sucursal [0-9a-fA-F-]{36}/g, `sucursal ${branchName}`)
            : 'No hay suficiente inventario disponible en esta sucursal';
          setErrorMsg(msg);
        } else if (error.status === 409) {
          setErrorMsg('El inventario de este producto fue actualizado recientemente por otra caja. Por favor, reintente la venta.');
        } else {
          setErrorMsg(error.message || 'Error al procesar la venta');
        }
      } else {
        setErrorMsg('No se pudo conectar con el servidor. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600/10 text-amber-500 border border-amber-600/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-sm">Registrar Venta (Caja)</h2>
              <p className="text-[11px] text-zinc-400">Descuento automático de inventario en sucursal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
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

        {loadingData ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs">
            <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
            <span>Cargando catálogo e inventario de sucursales...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Sucursal Vendedora</label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {sucursales.map((suc) => (
                  <option key={suc.id} value={suc.id}>
                    {suc.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Producto a Vender</label>
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id} disabled={!prod.activo}>
                    {prod.nombre} ({prod.sku}) — ${prod.precio} USD {!prod.activo ? '(Inactivo)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Available Stock Badge */}
            {stockDisponible !== null && (
              <div className="px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-md flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Stock disponible en esta sucursal:</span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded ${
                    stockDisponible === 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {stockDisponible} unidades
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Cantidad a Vender</label>
                <input
                  type="number"
                  min="1"
                  max={stockDisponible !== null ? stockDisponible : undefined}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  required
                  className={`w-full px-3 py-2 bg-zinc-900 border rounded-md text-xs font-mono text-zinc-200 focus:outline-none ${
                    isExceedingStock || isInvalidQuantity
                      ? 'border-rose-500/80 text-rose-300 focus:border-rose-500'
                      : 'border-zinc-700 focus:border-amber-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Total Estimado</label>
                <div className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-md text-xs font-mono font-bold text-amber-500">
                  ${totalEstimado} USD
                </div>
              </div>
            </div>

            {/* Client Reactive Validation Banner */}
            {isExceedingStock && (
              <div className="p-2.5 rounded-md bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>
                  La cantidad a vender ({cantidad}) supera las {stockDisponible} unidades disponibles en {selectedBranch?.nombre || 'esta sucursal'}.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-zinc-700/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-medium text-xs rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isFormInvalid}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold text-xs rounded-md transition-colors"
              >
                {loading ? 'Procesando Venta...' : 'Confirmar Venta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
