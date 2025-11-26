import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { User } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if user has admin-like permissions
 * Returns true for tenant_admin, super_admin, or legacy 'admin' role
 */
export function isAdminLike(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.platformRole === 'tenant_admin' || 
         user.platformRole === 'super_admin' || 
         user.role === 'admin';
}

/**
 * Get effective role for permission checks
 * Returns tenantRole if present, otherwise platformRole, otherwise 'admin' as fallback
 */
export function getEffectiveRole(user: User | null | undefined): string {
  if (!user) return 'admin';
  return user.tenantRole || user.platformRole || user.role || 'admin';
}
