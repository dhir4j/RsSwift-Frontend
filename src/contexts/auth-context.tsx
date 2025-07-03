"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const isLoggedIn = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
