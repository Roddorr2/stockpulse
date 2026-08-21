'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowRightLeft, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchApi, ApiError } from '../lib/api';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductItem {
  id: string;
  sku: string;
  nombre: string;
  activo: boolean;
}

interface BranchItem {
  id: string;
  nombre: string;
  direccion?: string;
}

interface UserItem {
  id: string;
  nombre: string;
  email: string;
}

interface StockItem {
  productoId: string;
  sucursalId: string;
  cantidad: number;
}



export function StockTransferModal({ isOpen, onClose, onSuccess }: StockTransferModalProps) {
  const [productos, setProductos] = useState<ProductItem[]>([]);
  const [sucursales, setSucursales] = useState<BranchItem[]>([]);
  const [usuarios, setUsuarios] = useState<UserItem[]>([]);
  const [stockMatrix, setStockMatrix] = useState<StockItem[]>([]);

  const [productoId, setProductoId] = useState('');
  const [sucursalOrigenId, setSucursalOrigenId] = useState('');
  const [sucursalDestinoId, setSucursalDestinoId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        fetchApi<UserItem[]>('/users').catch(() => []),
        fetchApi<StockItem[]>('/stock').catch(() => []),
      ])
        .then(([prodsData, branchesData, usersData, stockData]) => {
          setProductos(prodsData);
          setSucursales(branchesData);
          setUsuarios(usersData);
          setStockMatrix(stockData);

          if (prodsData.length > 0) setProductoId(prodsData[0].id);
          if (branchesData.length > 0) setSucursalOrigenId(branchesData[0].id);
          if (branchesData.length > 1) {
            setSucursalDestinoId(branchesData[1].id);
          } else if (branchesData.length > 0) {
            setSucursalDestinoId(branchesData[0].id);
          }
          if (usersData.length > 0) setUsuarioId(usersData[0].id);
        })
        .catch(() => {
          setErrorMsg('Error de comunicación con el backend al cargar el catálogo.');
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [isOpen]);

  const stockDisponibleOrigen = useMemo(() => {
    if (!productoId || !sucursalOrigenId) return null;
    const match = stockMatrix.find(
      (s) => s.productoId === productoId && s.sucursalId === sucursalOrigenId
    );
    return match ? match.cantidad : 0;
  }, [stockMatrix, productoId, sucursalOrigenId]);

  const isSameBranch = sucursalOrigenId !== '' && sucursalOrigenId === sucursalDestinoId;
  const isInvalidQuantity = cantidad <= 0;
  const isExceedingStock =
    stockDisponibleOrigen !== null && cantidad > stockDisponibleOrigen;

  const isFormInvalid =
    !productoId ||
    !sucursalOrigenId ||
    !sucursalDestinoId ||
    !usuarioId ||
    isSameBranch ||
    isInvalidQuantity ||
    isExceedingStock ||
    submitting;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const data = await fetchApi<{ stockOrigenRestante: number; stockDestinoActual: number }>('/stock/transfer', {
        method: 'POST',
        body: JSON.stringify({
          productoId,
          sucursalOrigenId,
          sucursalDestinoId,
          cantidad: Number(cantidad),
          usuarioId,
        }),
      });

      setSuccessMsg(
        `¡Transferencia Exitosa! Nuevo stock origen: ${data.stockOrigenRestante} ud, destino: ${data.stockDestinoActual} ud.`
      );
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrorMsg(
            'El stock de este producto fue modificado por otra operación simultánea. Por favor, intente nuevamente.'
          );
        } else {
          setErrorMsg(error.message || 'Error al procesar la transferencia de stock');
        }
      } else {
        setErrorMsg('No se pudo conectar con el servidor. Por favor, intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="transfer-modal-title" 
        className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600/10 text-amber-500 border border-amber-600/20">
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="transfer-modal-title" className="font-bold text-zinc-100 text-sm">Nueva Transferencia de Stock</h2>
              <p className="text-[11px] text-zinc-400">Transferencia directa entre sucursales</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de transferencia de stock"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMsg && (
          <div role="alert" className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div role="status" className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        {loadingData ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs">
            <RefreshCw className="h-5 w-5 animate-spin text-amber-500" aria-hidden="true" />
            <span>Cargando catálogo y sucursales...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto Select */}
            <div>
              <label htmlFor="transfer-product-select" className="block text-xs font-medium text-zinc-300 mb-1">
                Producto a Transferir
              </label>
              <select
                id="transfer-product-select"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {productos.length === 0 ? (
                  <option value="">No hay productos registrados</option>
                ) : (
                  productos.map((prod) => (
                    <option key={prod.id} value={prod.id} disabled={!prod.activo}>
                      {prod.nombre} — [{prod.sku}] {!prod.activo ? '(Inactivo)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Sucursales Origen y Destino */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="transfer-branch-origin" className="block text-xs font-medium text-zinc-300 mb-1">
                  Sucursal Origen
                </label>
                <select
                  id="transfer-branch-origin"
                  value={sucursalOrigenId}
                  onChange={(e) => setSucursalOrigenId(e.target.value)}
                  required
                  className={`w-full px-3 py-2 bg-zinc-900 border rounded-md text-xs font-medium text-zinc-200 focus:outline-none ${
                    isSameBranch
                      ? 'border-rose-500/80 text-rose-300 focus:border-rose-500'
                      : 'border-zinc-700 focus:border-amber-500'
                  }`}
                >
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="transfer-branch-target" className="block text-xs font-medium text-zinc-300 mb-1">
                  Sucursal Destino
                </label>
                <select
                  id="transfer-branch-target"
                  value={sucursalDestinoId}
                  onChange={(e) => setSucursalDestinoId(e.target.value)}
                  required
                  className={`w-full px-3 py-2 bg-zinc-900 border rounded-md text-xs font-medium text-zinc-200 focus:outline-none ${
                    isSameBranch
                      ? 'border-rose-500/80 text-rose-300 focus:border-rose-500'
                      : 'border-zinc-700 focus:border-amber-500'
                  }`}
                >
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Validation: Same Branch */}
            {isSameBranch && (
              <div role="alert" className="p-2.5 rounded-md bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>La sucursal de origen y destino deben ser distintas.</span>
              </div>
            )}

            {/* Live Available Stock Badge */}
            {stockDisponibleOrigen !== null && !isSameBranch && (
              <div aria-label={`Stock disponible en origen: ${stockDisponibleOrigen} unidades`} className="px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-md flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Stock disponible en origen:</span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded ${
                    stockDisponibleOrigen === 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {stockDisponibleOrigen} unidades
                </span>
              </div>
            )}

            {/* Cantidad and Operador */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="transfer-quantity-input" className="block text-xs font-medium text-zinc-300 mb-1">
                  Cantidad a Transferir
                </label>
                <input
                  id="transfer-quantity-input"
                  type="number"
                  min="1"
                  max={stockDisponibleOrigen !== null ? stockDisponibleOrigen : undefined}
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
                <label htmlFor="transfer-user-select" className="block text-xs font-medium text-zinc-300 mb-1">
                  Operador Responsable
                </label>
                <select
                  id="transfer-user-select"
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  {usuarios.length === 0 ? (
                    <option value="">No hay usuarios registrados</option>
                  ) : (
                    usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.email})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Client Validation: Exceeding Stock */}
            {isExceedingStock && (
              <div role="alert" className="p-2.5 rounded-md bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
                <span>
                  La cantidad ({cantidad}) supera las {stockDisponibleOrigen} unidades disponibles en origen.
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
                {submitting ? 'Procesando Transacción...' : 'Confirmar Transferencia'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
