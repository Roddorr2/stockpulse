'use client';

import React from 'react';
import Link from 'next/link';
import { useStockAlertsWS } from '../../lib/useStockAlertsWS';
import { Server, Cpu, Database, Network, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SystemStatusPage() {
  const { isConnected } = useStockAlertsWS();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
              Vista Dev / Portafolio Técnico
            </span>
            <span className="text-xs text-slate-500 font-mono">/system-status</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Estado Técnico de Infraestructura</h1>
          <p className="text-xs text-slate-400">
            Monitor de arquitectura en vivo para evaluación de patrones distribuidos, WebSockets STOMP y concurrencia optimista en JPA.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Dashboard de Negocio</span>
        </Link>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WebSocket STOMP Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Network className="h-6 w-6" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              isConnected 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isConnected ? 'STOMP Activo' : 'Desconectado'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">WebSocket / SockJS STOMP</h3>
            <p className="text-xs text-slate-400 mt-1">
              Canal de pub/sub en tiempo real. Suscrito al tópico <code>/topic/stock-alerts/global</code>.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Endpoint:</span>
              <span className="text-slate-200">/ws-stockpulse</span>
            </div>
            <div className="flex justify-between">
              <span>Transporte:</span>
              <span className="text-slate-200">WebSocket (SockJS Fallback)</span>
            </div>
          </div>
        </div>

        {/* Database Engine Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="h-6 w-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              PostgreSQL 16
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Motor de Base de Datos</h3>
            <p className="text-xs text-slate-400 mt-1">
              Persistencia relacional multi-sucursal con migraciones automáticas ejecutadas vía Flyway.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Driver:</span>
              <span className="text-slate-200">Org.postgresql.Driver</span>
            </div>
            <div className="flex justify-between">
              <span>Connection Pool:</span>
              <span className="text-slate-200">HikariCP (Max: 10)</span>
            </div>
          </div>
        </div>

        {/* Optimistic Concurrency Control Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              JPA @Version
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Control de Concurrencia Optimista</h3>
            <p className="text-xs text-slate-400 mt-1">
              Protección contra Race Conditions (Lost Updates) mediante anotaciones <code>@Version</code> en la entidad Stock.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Excepción:</span>
              <span className="text-slate-200">ObjectOptimisticLockingFailureException</span>
            </div>
            <div className="flex justify-between">
              <span>Respuesta HTTP:</span>
              <span className="text-slate-200">409 Conflict</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Tech Stack Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-blue-400" />
          <span>Resumen de Arquitectura y Stack</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              Backend Framework
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Spring Boot 3.x con Java 21 LTS, Spring Data JPA, Spring Messaging (STOMP WebSockets) y validaciones Jakarta.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-400" />
              Frontend Framework
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Next.js 15 (App Router), React 19, TailwindCSS v4, Lucide Icons y cliente @stomp/stompjs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
