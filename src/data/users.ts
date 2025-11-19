// src/data/users.ts
import type { User } from '../types';

// Usuários de teste para login e auditoria
export const mockUsers: User[] = [
  {
    id: 'user-1',
    salonId: 'salon-1',
    name: 'Ana (Admin)',
    email: 'admin@serenna.com',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  },
  {
    id: 'user-2',
    salonId: 'salon-1',
    name: 'Beatriz (Gerente)',
    email: 'manager@serenna.com',
    role: 'manager',
    avatarUrl: 'https://i.pravatar.cc/150?u=manager',
  },
  {
    id: 'user-3',
    salonId: 'salon-1',
    name: 'Carla (Recepcionista)',
    email: 'reception@serenna.com',
    role: 'receptionist',
    avatarUrl: 'https://i.pravatar.cc/150?u=reception',
  },
  {
    id: 'user-4',
    salonId: 'salon-1',
    name: 'Diana (Profissional)',
    email: 'diana@serenna.com',
    role: 'professional',
    avatarUrl: 'https://i.pravatar.cc/150?u=diana',
  },
];
