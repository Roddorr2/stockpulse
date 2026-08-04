'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Package, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await res.json();
      
      const tokenPayload = JSON.parse(atob(data.accessToken.split('.')[1]));
      
      const user = {
        id: tokenPayload.usuarioId || tokenPayload.sub,
        username: tokenPayload.sub,
        roles: tokenPayload.rol ? [tokenPayload.rol] : [],
      };

      login(data.accessToken, data.refreshToken, user);
      
      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al iniciar sesión');
      } else {
        setError('Error desconocido al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-500 mb-4">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Acceso a StockPulse</h1>
          <p className="text-sm text-zinc-400 mt-1">Terminal Operativo de Inventario</p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="username">
              Email
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all text-sm"
              placeholder="Ej: admin@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-zinc-950 font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}
