// src/components/auth/RoleGuard.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../../types';
import { useAuth, getDefaultPathForRole } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { getEffectiveRole } from '../../lib/utils';

interface RoleGuardProps {
  allowed?: UserRole[];
  resourceKey?: string;
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowed, resourceKey, children }) => {
  const { user } = useAuth();
  const { canAccessRoute } = usePermissions();
  const location = useLocation();

  if (!user) {
    // Se não estiver autenticado, redireciona para login e guarda a rota original
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Get effective role for permission checks
  const effectiveRole = getEffectiveRole(user) as UserRole;

  // If resourceKey is provided, use permissions system
  if (resourceKey) {
    if (!canAccessRoute(effectiveRole, resourceKey)) {
      const fallback = getDefaultPathForRole(effectiveRole);
      return <Navigate to={fallback} replace />;
    }
    return <>{children}</>;
  }

  // Fallback to allowed array for backward compatibility
  if (allowed && !allowed.includes(effectiveRole)) {
    const fallback = getDefaultPathForRole(effectiveRole);
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
