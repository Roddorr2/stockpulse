'use client';

import React from 'react';
import { Activity, ArrowLeftRight, ShoppingBag, BarChart3, ShoppingCart, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isConnected: boolean;
  onOpenTransferModal: () => void;
  onOpenSaleModal: () => void;
}

export function Navbar({ isConnected, onOpenTransferModal, onOpenSaleModal }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const isSalesActive = pathname === '/sales';
  const isReportsActive = pathname === '/reports';

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-md bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-500 font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-zinc-100 tracking-tight">StockPulse</span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Terminal Operativo de Inventario</p>
            </div>
          </Link>

          {/* Navigation Links for Authenticated Users */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-zinc-950/50 p-1 rounded-lg border border-zinc-800/80">
              <Link 
                href="/sales" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isSalesActive 
                    ? 'bg-zinc-800 text-amber-500' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Ventas</span>
              </Link>
              
              {user?.roles.includes('ADMIN') && (
                <Link 
                  href="/reports" 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isReportsActive 
                      ? 'bg-zinc-800 text-emerald-500' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Reportes</span>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Real-time Status Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs font-mono">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            <span className="text-zinc-400">
              {isConnected ? 'Sincronizado' : 'Desconectado'}
            </span>
          </div>

          {isAuthenticated ? (
            <>
              {/* Transfer Action */}
              <button
                onClick={onOpenTransferModal}
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium rounded-md border border-zinc-700 transition-colors focus:outline-none"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-400" />
                <span>Transferir Stock</span>
              </button>

              {/* Primary Action: Register Sale */}
              <button
                onClick={onOpenSaleModal}
                className="flex items-center gap-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold text-xs rounded-md transition-colors shadow-none focus:outline-none"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Registrar Venta</span>
              </button>

              {/* Logout */}
              <div className="w-px h-6 bg-zinc-800 mx-1"></div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-md transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
