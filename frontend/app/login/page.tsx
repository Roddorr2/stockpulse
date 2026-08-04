'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import styles from './login.module.css';

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
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await res.json();
      
      // Decodificamos el JWT para obtener los roles y el username
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      
      const user = {
        id: tokenPayload.sub,
        username: tokenPayload.sub,
        roles: tokenPayload.roles,
      };

      login(data.token, data.refreshToken, user);
      
      // Redirigir al home
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bienvenido a StockPulse</h1>
          <p className={styles.subtitle}>Ingresa a tu cuenta para gestionar el inventario</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Ej: admin"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
