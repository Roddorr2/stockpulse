'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { fetchApi } from '../../lib/api';
import { Search } from 'lucide-react';
import styles from './sales.module.css';

interface Venta {
  id: string;
  fecha: string;
  sucursalId: string;
  detalles: DetalleVenta[];
  totalVenta: number;
}

interface DetalleVenta {
  productoId: string;
  sku: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Venta[]>([]);
  const [branches, setBranches] = useState<Array<{id: string, nombre: string}>>([]);
  const [products, setProducts] = useState<Array<{id: string, nombre: string, sku: string}>>([]);
  
  const [sucursalId, setSucursalId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (sucursalId) params.append('sucursalId', sucursalId);
      if (productoId) params.append('productoId', productoId);
      if (fechaInicio) params.append('fechaInicio', new Date(fechaInicio).toISOString());
      if (fechaFin) params.append('fechaFin', new Date(fechaFin).toISOString());
      
      const data = await fetchApi<Venta[]>(`/sales?${params.toString()}`);
      setSales(data);
    } catch (error) {
      console.error('Failed to fetch sales', error);
    } finally {
      setIsLoading(false);
    }
  }, [sucursalId, productoId, fechaInicio, fechaFin]);

  useEffect(() => {
    fetchApi<Array<{id: string, nombre: string}>>('/branches').then(setBranches).catch(console.error);
    fetchApi<Array<{id: string, nombre: string, sku: string}>>('/products').then(setProducts).catch(console.error);
    handleSearch();
  }, [handleSearch]);

  const getBranchName = (id: string) => {
    return branches.find(b => b.id === id)?.nombre || id;
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO_SUCURSAL']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Historial de Ventas</h1>
        </div>
        
        <form className={styles.filterCard} onSubmit={handleSearch}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Sucursal</label>
            <select className={styles.select} value={sucursalId} onChange={e => setSucursalId(e.target.value)}>
              <option value="">Todas las sucursales</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.label}>Producto</label>
            <select className={styles.select} value={productoId} onChange={e => setProductoId(e.target.value)}>
              <option value="">Todos los productos</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.label}>Desde</label>
            <input 
              type="datetime-local" 
              className={styles.input} 
              value={fechaInicio} 
              onChange={e => setFechaInicio(e.target.value)} 
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.label}>Hasta</label>
            <input 
              type="datetime-local" 
              className={styles.input} 
              value={fechaFin} 
              onChange={e => setFechaFin(e.target.value)} 
            />
          </div>
          
          <button type="submit" className={styles.button} disabled={isLoading}>
            <Search size={18} />
            Filtrar
          </button>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Sucursal</th>
                <th>Artículos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    {isLoading ? 'Cargando ventas...' : 'No se encontraron ventas para estos filtros.'}
                  </td>
                </tr>
              ) : (
                sales.map(venta => (
                  <tr key={venta.id}>
                    <td><span className={styles.badge}>{venta.id.split('-')[0]}</span></td>
                    <td>{new Date(venta.fecha).toLocaleString('es-ES')}</td>
                    <td>{getBranchName(venta.sucursalId)}</td>
                    <td>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                        {venta.detalles.map(d => (
                          <li key={d.productoId}>
                            {d.cantidad}x {d.nombreProducto} 
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                      ${venta.totalVenta.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
