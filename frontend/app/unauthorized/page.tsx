'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10 text-center">
        
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Acceso Denegado</h1>
          <p className="text-sm text-zinc-400 mt-2">
            No tienes los permisos necesarios para acceder a esta sección o realizar esta acción.
          </p>
        </div>

        <div className="space-y-3 mt-8">
          <Link
            href="/"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 border border-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          
          <button
            onClick={logout}
            className="w-full bg-transparent hover:bg-rose-500/10 text-rose-400 font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
}
