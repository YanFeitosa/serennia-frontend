// src/data/users.ts
import type { User } from '../types';

// Usuários de teste para login e auditoria
export const mockUsers: User[] = [
  {
    id: 'user-1',
    salonId: 'salon-1',
    name: 'Ana (Admin)',
    email: 'admin@serennia.com',
    role: 'admin',
  },
  {
    id: 'user-2',
    salonId: 'salon-1',
    name: 'Beatriz (Gerente)',
    email: 'manager@serennia.com',
    role: 'manager',
  },
  {
    id: 'user-3',
    salonId: 'salon-1',
    name: 'Carla (Recepcionista)',
    email: 'reception@serennia.com',
    role: 'receptionist',
  },
  {
    id: 'user-4',
    salonId: 'salon-1',
    name: 'Diana (Profissional)',
    email: 'diana@serennia.com',
    role: 'professional',
  },
];
