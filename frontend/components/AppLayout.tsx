'use client';

import React from 'react';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && isAuthenticated && <Sidebar />}
      <main style={{
        marginLeft: (!isLoginPage && isAuthenticated) ? '260px' : '0',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--background)'
      }}>
        {children}
      </main>
    </>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
};
