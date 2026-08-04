'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { fetchApi } from '../../lib/api';
import styles from './reports.module.css';

interface ItemReporteStockDTO {
  productoId: string;
  sku: string;
  nombre: string;
  cantidadTotal: number;
  precioBase: number;
  valorTotalInmovilizado: number;
}

interface ReporteStockTotalDTO {
  items: ItemReporteStockDTO[];
  valorGlobalInmovilizado: number;
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReporteStockTotalDTO | null>(null);
  const [branches, setBranches] = useState<Array<{id: string, nombre: string}>>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<Array<{id: string, nombre: string}>>('/branches').then(setBranches).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const url = sucursalId ? `/stock/report?sucursalId=${sucursalId}` : '/stock/report';
        const data = await fetchApi<ReporteStockTotalDTO>(url);
        setReport(data);
      } catch (error) {
        console.error('Failed to fetch report', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [sucursalId]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO_SUCURSAL']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reporte Consolidado de Stock</h1>
          
          <select 
            className={styles.filter} 
            value={sucursalId} 
            onChange={(e) => setSucursalId(e.target.value)}
          >
            <option value="">Todas las sucursales (Global)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Valor Global Inmovilizado</span>
            <span className={styles.kpiValue}>
              {report ? formatMoney(report.valorGlobalInmovilizado) : '$0'}
            </span>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Stock Total</th>
                <th>Precio Unit. Base</th>
                <th>Valor Inmovilizado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    Calculando reporte...
                  </td>
                </tr>
              ) : report?.items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    No hay inventario registrado.
                  </td>
                </tr>
              ) : (
                report?.items.map(item => (
                  <tr key={item.productoId}>
                    <td>{item.sku}</td>
                    <td style={{ fontWeight: 500 }}>{item.nombre}</td>
                    <td>{item.cantidadTotal} und.</td>
                    <td>{formatMoney(item.precioBase)}</td>
                    <td className={styles.moneyCell}>{formatMoney(item.valorTotalInmovilizado)}</td>
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
