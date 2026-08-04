'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.some((role) => hasRole(role));
      if (!hasRequiredRole) {
        // Redirigir a una ruta por defecto si no tiene permisos
        router.push('/');
      }
    }
  }, [isAuthenticated, allowedRoles, hasRole, router]);

  if (!isAuthenticated) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) return null;
  }

  return <>{children}</>;
};
