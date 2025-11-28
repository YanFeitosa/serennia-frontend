// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { getMe } from '../lib/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
    let hasInitialLoad = false;

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
          hasInitialLoad = true;
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

      // Skip token refresh events - they don't require re-fetching user data
      // This prevents infinite loading when switching browser tabs
      if (event === 'TOKEN_REFRESHED') {
        if (session && isMounted) {
          // Just update the access token, no need to re-fetch user
          setAccessToken(session.access_token);
        }
        return;
      }

      try {
        if (event === 'SIGNED_IN' && session) {
          // Prevent duplicate calls if we're already fetching or have initial load
          if (isFetching || hasInitialLoad) {
            // If we already have the user loaded, just update the token
            if (hasInitialLoad && session && isMounted) {
              setAccessToken(session.access_token);
            }
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

  const login = async (email: string, password: string): Promise<User> => {
    // Clear any previous salon context on fresh login
    // Super Admin will select a salon after login
    window.localStorage.removeItem('serennia-salon-id');

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

      const userWithRoles = {
        ...userData,
        tenantRole: userData.tenantRole,
        platformRole: userData.platformRole,
        role: userData.tenantRole || userData.platformRole || undefined,
      } as User;

      setUser(userWithRoles);
      setAccessToken(data.session.access_token);
      
      return userWithRoles;
    } catch (error) {
      // If getMe fails, sign out and throw
      await supabase.auth.signOut();
      throw new Error(
        error instanceof Error
          ? `Erro ao obter dados do usuário: ${error.message}`
          : 'Erro ao obter dados do usuário'
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.localStorage.removeItem('serennia-salon-id'); // Clear salon context on logout
    setUser(null);
    setAccessToken(null);
  };

  const refreshUser = async () => {
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
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshUser, isLoading }}>
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
