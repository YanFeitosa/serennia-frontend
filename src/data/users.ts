// src/data/users.ts
import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ana (Admin)',
    email: 'admin@serenna.com',
    role: 'admin',
    salonId: 'salon-1',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  },
  {
    id: 'user-2',
    name: 'Beatriz (Gerente)',
    email: 'manager@serenna.com',
    role: 'manager',
    salonId: 'salon-1',
    avatarUrl: 'https://i.pravatar.cc/150?u=manager',
  },
  {
    id: 'user-3',
    name: 'Carla (Recepcionista)',
    email: 'reception@serenna.com',
    role: 'receptionist',
    salonId: 'salon-1',
    avatarUrl: 'https://i.pravatar.cc/150?u=reception',
  },
  {
    id: 'user-4',
    name: 'Diana (Profissional)',
    email: 'diana@serenna.com',
    role: 'professional',
    salonId: 'salon-1',
    avatarUrl: 'https://i.pravatar.cc/150?u=diana',
  },
];
