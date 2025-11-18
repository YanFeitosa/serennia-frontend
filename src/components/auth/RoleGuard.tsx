// src/components/auth/RoleGuard.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../../types';
import { useAuth, getDefaultPathForRole } from '../../contexts/AuthContext';

interface RoleGuardProps {
  allowed: UserRole[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowed, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Se não estiver autenticado, redireciona para login e guarda a rota original
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed.includes(user.role)) {
    const fallback = getDefaultPathForRole(user.role);
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
