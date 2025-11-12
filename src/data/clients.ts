// src/data/clients.ts
import type { Client } from '../types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Helena Martins',
    phone: '(11) 98765-4321',
    email: 'helena.m@example.com',
    visitCount: 5,
    lastVisit: '2023-10-15T14:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Laura Santos',
    phone: '(21) 91234-5678',
    email: 'laura.s@example.com',
    visitCount: 1,
    lastVisit: '2023-11-01T11:30:00Z',
  },
  {
    id: 'client-3',
    name: 'Manuela Costa',
    phone: '(31) 99999-8888',
    email: 'manuela.c@example.com',
    visitCount: 12,
    lastVisit: '2023-11-10T18:00:00Z',
    tags: ['prefere-sem-conversa'],
  },
];
