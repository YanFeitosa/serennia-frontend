// src/contexts/PermissionsContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserRole } from '../types';
import { getSalonSettings } from '../lib/api';
import { useAuth } from './AuthContext';

// Default permissions matching current behavior
// 'admin' has full access to everything
const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'agenda',
    'comandas',
    'clientes',
    'servicos',
    'produtos',
    'colaboradores',
    'financeiro',
    'configuracoes',
    'auditoria',
    'notificacoes',
    'editarPerfilProfissionais',
    'podeEditarProduto',
    'podeEditarServico',
    'podeDeletarCliente',
    'podeDeletarColaborador',
    'podeDeletarProduto',
    'podeDeletarServico',
  ] as string[],
  manager: [
    'servicos',
    'produtos',
    'colaboradores',
    'financeiro',
    'configuracoes',
    'auditoria',
    'podeDeletarCliente',
    'podeDeletarColaborador',
    'podeDeletarProduto',
    'podeDeletarServico',
  ],
  receptionist: [
    'agenda',
    'comandas',
    'clientes',
    'servicos',
    'produtos',
    'colaboradores',
    'notificacoes',
  ],
  professional: [
    'agenda',
    'comandas',
    'clientes',
    'notificacoes',
  ],
  accountant: [
    'financeiro',
  ],
  super_admin: [
    'agenda',
    'comandas',
    'clientes',
    'servicos',
    'produtos',
    'colaboradores',
    'financeiro',
    'configuracoes',
    'auditoria',
    'notificacoes',
    'editarPerfilProfissionais',
    'podeEditarProduto',
    'podeEditarServico',
    'podeDeletarCliente',
    'podeDeletarColaborador',
    'podeDeletarProduto',
    'podeDeletarServico',
  ],
  tenant_admin: [
    'agenda',
    'comandas',
    'clientes',
    'servicos',
    'produtos',
    'colaboradores',
    'financeiro',
    'configuracoes',
    'auditoria',
    'notificacoes',
    'editarPerfilProfissionais',
    'podeEditarProduto',
    'podeEditarServico',
    'podeDeletarCliente',
    'podeDeletarColaborador',
    'podeDeletarProduto',
    'podeDeletarServico',
  ],
};

interface PermissionsContextType {
  permissions: Record<UserRole, string[]>;
  isLoading: boolean;
  canAccessRoute: (role: UserRole, resourceKey: string) => boolean;
  can: (role: UserRole, permissionKey: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Record<UserRole, string[]>>(DEFAULT_PERMISSIONS);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  const loadPermissions = useCallback(async () => {
    // Only load permissions if user is authenticated
    if (!user) {
      setPermissions(DEFAULT_PERMISSIONS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const settings = await getSalonSettings();

      if (settings.rolePermissions && typeof settings.rolePermissions === 'object') {
        // Merge custom permissions with defaults
        const custom = settings.rolePermissions as Record<string, string[]>;
        const merged: Record<UserRole, string[]> = { ...DEFAULT_PERMISSIONS };

        for (const role of ['admin', 'manager', 'receptionist', 'professional', 'accountant', 'super_admin', 'tenant_admin'] as UserRole[]) {
          if (custom[role] && Array.isArray(custom[role])) {
            merged[role] = custom[role];
          }
        }

        setPermissions(merged);
      } else {
        setPermissions(DEFAULT_PERMISSIONS);
      }
    } catch (error) {
      // Log error but don't break the app - use default permissions
      // Only log if user is authenticated (to avoid noise on landing page)
      if (user) {
        console.warn(
          'Error loading permissions, using defaults:',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      setPermissions(DEFAULT_PERMISSIONS);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Wait for auth to finish loading before checking for user
    if (authLoading) {
      return;
    }

    // Only load permissions if user is authenticated
    if (user) {
      loadPermissions();
    } else {
      // No user, just use defaults without loading
      setPermissions(DEFAULT_PERMISSIONS);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]); // Only depend on user.id to avoid unnecessary re-renders

  const canAccessRoute = (role: UserRole, resourceKey: string): boolean => {
    try {
      const rolePerms = permissions[role] || [];
      return rolePerms.includes(resourceKey);
    } catch (error) {
      console.error('Error checking route access:', error);
      // Fail safe: deny access on error
      return false;
    }
  };

  const can = (role: UserRole, permissionKey: string): boolean => {
    try {
      return canAccessRoute(role, permissionKey);
    } catch (error) {
      console.error('Error checking permission:', error);
      // Fail safe: deny permission on error
      return false;
    }
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isLoading,
        canAccessRoute,
        can,
        refreshPermissions: loadPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return ctx;
};

