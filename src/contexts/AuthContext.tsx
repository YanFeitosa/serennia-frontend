// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/users';

interface AuthContextType {
  user: User | null;
  loginAs: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('serenna-user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem('serenna-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('serenna-user');
    }
  }, [user]);

  const loginAs = (u: User) => {
    setUser(u);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export const getDefaultPathForRole = (role: UserRole): string => {
  switch (role) {
    case 'manager':
      return '/servicos';
    case 'receptionist':
    case 'professional':
      return '/agenda';
    case 'admin':
    default:
      return '/agenda';
  }
};

export const findTestUserByEmail = (email: string): User | null => {
  const normalized = email.trim().toLowerCase();
  const user = mockUsers.find(u => u.email.toLowerCase() === normalized);
  return user ?? null;
};
