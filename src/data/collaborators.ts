// src/data/collaborators.ts
import type { Collaborator } from '../types';

export const mockCollaborators: Collaborator[] = [
  {
    id: 'collab-1',
    name: 'Diana Hair',
    role: 'professional',
    status: 'active',
    commissionRate: 0.5,
  },
  {
    id: 'collab-2',
    name: 'Fernando Nails',
    role: 'professional',
    status: 'active',
    commissionRate: 0.45,
  },
  {
    id: 'collab-3',
    name: 'Gabriela Estética',
    role: 'professional',
    status: 'active',
    commissionRate: 0.55,
  },
  {
    id: 'collab-4',
    name: 'Lucas Massagista',
    role: 'professional',
    status: 'inactive',
    commissionRate: 0.5,
  },
];
