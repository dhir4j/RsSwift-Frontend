
"use client";

import React, { createContext, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  isAdminLoading: boolean;
  adminLogout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, logoutUser } = useAuth();

  const isAdminAuthenticated = !!user && user.isAdmin;

  const adminLogout = useCallback(() => {
    logoutUser(); 
  }, [logoutUser]);


  return (
    <AdminAuthContext.Provider value={{ 
      isAdminAuthenticated, 
      isAdminLoading: isLoading, 
      adminLogout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
