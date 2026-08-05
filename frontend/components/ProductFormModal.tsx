import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  stockMinimo: number;
  activo: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  initialData?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    precio: '0',
    stockMinimo: '0',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const getFieldError = (field: string) => {
    if (!touched[field]) return null;
    if (field === 'sku' && !formData.sku.trim()) return 'El SKU es obligatorio.';
    if (field === 'nombre' && !formData.nombre.trim()) return 'El nombre es obligatorio.';
    if (field === 'precio') {
      const p = parseFloat(formData.precio);
      if (isNaN(p) || p < 0) return 'El precio debe ser válido y >= 0.';
    }
    if (field === 'stockMinimo') {
      const s = parseInt(formData.stockMinimo);
      if (isNaN(s) || s < 0) return 'El stock mínimo debe ser válido y >= 0.';
    }
    return null;
  };

  const isFormInvalid =
    !formData.sku.trim() ||
    !formData.nombre.trim() ||
    isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) < 0 ||
    isNaN(parseInt(formData.stockMinimo)) || parseInt(formData.stockMinimo) < 0;

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku,
        nombre: initialData.nombre,
        precio: initialData.precio.toString(),
        stockMinimo: initialData.stockMinimo.toString(),
        activo: initialData.activo
      });
    } else {
      setFormData({ sku: '', nombre: '', precio: '0', stockMinimo: '0', activo: true });
    }
    setError(null);
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
      setTouched({ sku: true, nombre: true, precio: true, stockMinimo: true });
      return;
    }
    setError(null);

    const precioNum = parseFloat(formData.precio);
    const stockMinimoNum = parseInt(formData.stockMinimo);

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        precio: precioNum,
        stockMinimo: stockMinimoNum
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al guardar el producto.');
      } else {
        setError('Error al guardar el producto.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              onBlur={() => handleBlur('sku')}
              className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none transition-colors ${
                getFieldError('sku') ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
            {getFieldError('sku') && <p className="text-rose-400 text-[10px] mt-1">{getFieldError('sku')}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              onBlur={() => handleBlur('nombre')}
              className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none transition-colors ${
                getFieldError('nombre') ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
            {getFieldError('nombre') && <p className="text-rose-400 text-[10px] mt-1">{getFieldError('nombre')}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Precio</label>
              <input
                type="text"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                onBlur={() => handleBlur('precio')}
                className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none transition-colors ${
                  getFieldError('precio') ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
              {getFieldError('precio') && <p className="text-rose-400 text-[10px] mt-1">{getFieldError('precio')}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Stock Mínimo</label>
              <input
                type="text"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                onBlur={() => handleBlur('stockMinimo')}
                className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none transition-colors ${
                  getFieldError('stockMinimo') ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
              {getFieldError('stockMinimo') && <p className="text-rose-400 text-[10px] mt-1">{getFieldError('stockMinimo')}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="activo" className="text-sm text-zinc-300">Producto Activo</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || isFormInvalid}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
