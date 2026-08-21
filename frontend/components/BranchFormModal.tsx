import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface Branch {
  id: string;
  nombre: string;
  direccion: string;
}

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Branch, 'id'>) => Promise<void>;
  initialData?: Branch | null;
}

export function BranchFormModal({ isOpen, onClose, onSubmit, initialData }: BranchFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const getFieldError = (field: string) => {
    if (!touched[field]) return null;
    if (field === 'nombre' && !formData.nombre.trim()) return 'El nombre es obligatorio.';
    if (field === 'direccion' && !formData.direccion.trim()) return 'La dirección es obligatoria.';
    return null;
  };

  const isFormInvalid = !formData.nombre.trim() || !formData.direccion.trim();

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        direccion: initialData.direccion
      });
    } else {
      setFormData({ nombre: '', direccion: '' });
    }
    setError(null);
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
      setTouched({ nombre: true, direccion: true });
      return;
    }
    setError(null);

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al guardar la sucursal.');
      } else {
        setError('Error al guardar la sucursal.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="branch-form-title" 
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 id="branch-form-title" className="text-lg font-semibold text-zinc-100">
            {initialData ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Cerrar modal de formulario de sucursal" 
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="branch-nombre" className="block text-xs font-medium text-zinc-400 mb-1">Nombre</label>
            <input
              id="branch-nombre"
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
          <div>
            <label htmlFor="branch-direccion" className="block text-xs font-medium text-zinc-400 mb-1">Dirección</label>
            <input
              id="branch-direccion"
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              onBlur={() => handleBlur('direccion')}
              className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none transition-colors ${
                getFieldError('direccion') ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
            {getFieldError('direccion') && <p className="text-rose-400 text-[10px] mt-1">{getFieldError('direccion')}</p>}
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
