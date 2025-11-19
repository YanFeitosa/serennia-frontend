// src/data/collaborators.ts
import type { Collaborator } from '../types';

export let mockCollaborators: Collaborator[] = [
  {
    id: 'collab-1',
    salonId: 'salon-1',
    name: 'Diana Costa',
    role: 'professional',
    status: 'active',
    phone: '(11) 97777-0001',
    email: 'diana.profissional@example.com',
    commissionRate: 0.5,
    serviceCategories: ['Cabelo', 'Unhas'],
  },
  {
    id: 'collab-2',
    salonId: 'salon-1',
    name: 'Marina Lopes',
    role: 'professional',
    status: 'active',
    phone: '(11) 97777-0002',
    email: 'marina.profissional@example.com',
    commissionRate: 0.5,
    serviceCategories: ['Estética', 'Massagem'],
  },
  {
    id: 'collab-3',
    salonId: 'salon-1',
    name: 'Patrícia Nogueira',
    role: 'professional',
    status: 'active',
    phone: '(11) 97777-0003',
    email: 'patricia.profissional@example.com',
    commissionRate: 0.5,
    serviceCategories: ['Cabelo', 'Maquiagem'],
  },
  {
    id: 'collab-4',
    salonId: 'salon-1',
    name: 'Carla Recepção',
    role: 'receptionist',
    status: 'active',
    phone: '(11) 97777-0004',
    email: 'carla.recepcionista@example.com',
    commissionRate: 0,
    serviceCategories: [],
  },
  {
    id: 'collab-5',
    salonId: 'salon-1',
    name: 'Beatriz Gerente',
    role: 'manager',
    status: 'active',
    phone: '(11) 97777-0005',
    email: 'beatriz.gerente@example.com',
    commissionRate: 0,
    serviceCategories: [],
  },
];

export const addMockCollaborator = (collaborator: Collaborator) => {
  mockCollaborators = [...mockCollaborators, collaborator];
};

export const updateMockCollaborator = (id: string, updates: Partial<Collaborator>) => {
  mockCollaborators = mockCollaborators.map(collab =>
    collab.id === id ? { ...collab, ...updates } : collab,
  );
};
