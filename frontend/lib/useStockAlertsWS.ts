'use client';

import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface LowStockAlert {
  productoId: string;
  skuProducto: string;
  nombreProducto: string;
  sucursalId: string;
  stockActual: number;
  stockMinimo: number;
  mensaje: string;
  timestamp: string;
}

export function useStockAlertsWS() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const dismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    const socketFactory = () => new SockJS('http://localhost:8080/ws-stockpulse');

    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        setConnectionError(null);

        // Suscribirse a alertas globales de bajo stock
        client.subscribe('/topic/stock-alerts/global', (message) => {
          if (message.body) {
            try {
              const alert: LowStockAlert = JSON.parse(message.body);
              setAlerts((prev) => [alert, ...prev.slice(0, 4)]); // Guardar las últimas 5 alertas
            } catch (err) {
              console.error('Error parsing STOMP alert message:', err);
            }
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        setConnectionError('Error en el servicio WebSocket STOMP');
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  return { alerts, isConnected, connectionError, dismissAlert };
}
