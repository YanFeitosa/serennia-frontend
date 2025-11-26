// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { getMe } from '../lib/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string, salonId?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth from Supabase on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let isFetching = false;

    const loadAuth = async () => {
      // Prevent multiple simultaneous calls
      if (isFetching) {
        return;
      }
      isFetching = true;

      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.warn('Error getting session:', error.message);
          setIsLoading(false);
          isFetching = false;
          return;
        }

        if (!session) {
          setIsLoading(false);
          isFetching = false;
          return;
        }

        // Get user info from backend
        try {
          const userData = await getMe();
          if (!isMounted) return;

          // Update appearance if salonName is present
          if (userData.salonName) {
            window.localStorage.setItem('serennia-appearance', JSON.stringify({
              platformName: userData.salonName
            }));
            window.dispatchEvent(new Event('serennia-appearance-changed'));
          }

          setUser({
            ...userData,
            tenantRole: userData.tenantRole,
            platformRole: userData.platformRole,
            role: userData.tenantRole || userData.platformRole || undefined,
          } as User);
          setAccessToken(session.access_token);
        } catch (error) {
          // If backend verification fails, silently clear auth state
          // Don't sign out from Supabase to avoid loops
          console.warn('Backend verification failed (user may not be logged in):', error instanceof Error ? error.message : 'Unknown error');
          if (isMounted) {
            setUser(null);
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading auth:', error);
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        isFetching = false;
      }
    };

    loadAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip initial session check to avoid duplicate calls
      if (event === 'INITIAL_SESSION') {
        return;
      }

      try {
        if (event === 'SIGNED_IN' && session) {
          // Prevent duplicate calls if we're already fetching
          if (isFetching) {
            return;
          }
          isFetching = true;

          try {
            const userData = await getMe();
            if (isMounted) {
              // Update appearance if salonName is present
              if (userData.salonName) {
                window.localStorage.setItem('serennia-appearance', JSON.stringify({
                  platformName: userData.salonName
                }));
                window.dispatchEvent(new Event('serennia-appearance-changed'));
              }

              setUser({
                ...userData,
                tenantRole: userData.tenantRole,
                platformRole: userData.platformRole,
                role: userData.tenantRole || userData.platformRole || undefined,
              } as User);
              setAccessToken(session.access_token);
            }
          } catch (error) {
            console.error('Error fetching user data after sign in:', error);
            if (isMounted) {
              setUser(null);
              setAccessToken(null);
            }
          } finally {
            isFetching = false;
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, salonId?: string) => {
    try {
      // Set salonId in localStorage if provided (for Super Admin context)
      if (salonId) {
        window.localStorage.setItem('serennia-salon-id', salonId);
      } else {
        // If not provided, we might want to clear it to avoid stale context, 
        // OR keep it if we want persistence. 
        // Given the requirement is "login with salon_id", let's assume if it's NOT provided, 
        // we shouldn't force a context unless it was already there? 
        // Safest is to NOT clear it here if we want persistence across reloads, 
        // but if the user logs in explicitly without it, maybe they want default context?
        // Let's clear it if it's a fresh login without salonId to be safe and avoid confusion.
        window.localStorage.removeItem('serennia-salon-id');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Erro ao fazer login');
      }

      if (!data.session) {
        throw new Error('Sessão não criada');
      }

      // Get user info from backend
      try {
        const userData = await getMe();

        // Update appearance if salonName is present
        if (userData.salonName) {
          window.localStorage.setItem('serennia-appearance', JSON.stringify({
            platformName: userData.salonName
          }));
          window.dispatchEvent(new Event('serennia-appearance-changed'));
        }

        setUser({
          ...userData,
          tenantRole: userData.tenantRole,
          platformRole: userData.platformRole,
          role: userData.tenantRole || userData.platformRole || undefined,
        } as User);
        setAccessToken(data.session.access_token);
      } catch (error) {
        // If getMe fails, sign out and throw
        await supabase.auth.signOut();
        throw new Error(
          error instanceof Error
            ? `Erro ao obter dados do usuário: ${error.message}`
            : 'Erro ao obter dados do usuário'
        );
      }
    } catch (error) {
      // Re-throw to let the caller handle it
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.localStorage.removeItem('serennia-salon-id'); // Clear salon context on logout
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading }}>
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

export const getDefaultPathForRole = (role: UserRole | string): string => {
  switch (role) {
    case 'manager':
      return '/app/servicos';
    case 'receptionist':
    case 'professional':
      return '/app/agenda';
    case 'admin':
    case 'tenant_admin':
    case 'super_admin':
    default:
      return '/app/agenda';
  }
};
