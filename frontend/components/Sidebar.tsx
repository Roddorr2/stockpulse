'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { LayoutDashboard, ShoppingCart, BarChart3, LogOut, Package } from 'lucide-react';
import styles from './sidebar.module.css';

export const Sidebar = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'ENCARGADO_SUCURSAL'] },
    { name: 'Historial de Ventas', path: '/sales', icon: ShoppingCart, roles: ['ADMIN', 'ENCARGADO_SUCURSAL'] },
    { name: 'Reporte de Stock', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ENCARGADO_SUCURSAL'] },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Package size={28} color="var(--primary-color)" />
        <span>StockPulse</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          if (item.roles && !item.roles.some(r => hasRole(r))) return null;
          
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              href={item.path} 
              key={item.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{user.username}</span>
          <span className={styles.role}>{user.roles.join(', ')}</span>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
