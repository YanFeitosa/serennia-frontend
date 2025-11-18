// src/data/collaborators.ts
import type { Collaborator } from '../types';

export let mockCollaborators: Collaborator[] = [
  {
    id: 'collab-1',
    name: 'Diana Hair',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-1111',
    email: 'diana@serenna.com',
    commissionRate: 0.5,
    serviceCategories: ['Cabelo'],
  },
  {
    id: 'collab-2',
    name: 'Fernando Nails',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-2222',
    email: 'fernando@serenna.com',
    commissionRate: 0.45,
    serviceCategories: ['Unhas'],
  },
  {
    id: 'collab-3',
    name: 'Gabriela Estética',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-3333',
    email: 'gabriela@serenna.com',
    commissionRate: 0.55,
    serviceCategories: ['Estética'],
  },
  {
    id: 'collab-4',
    name: 'Lucas Massagista',
    role: 'professional',
    status: 'inactive',
    phone: '(11) 98765-4444',
    email: 'lucas@serenna.com',
    commissionRate: 0.5,
  },
  {
    id: 'collab-5',
    name: 'Carla Makeup',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-5555',
    email: 'carla@serenna.com',
    commissionRate: 0.48,
    serviceCategories: ['Maquiagem'],
  },
  {
    id: 'collab-6',
    name: 'Rafael Barbeiro',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-6666',
    email: 'rafael@serenna.com',
    commissionRate: 0.52,
    serviceCategories: ['Cabelo', 'Barba'],
  },
  {
    id: 'collab-7',
    name: 'Patrícia Depilação',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-7777',
    email: 'patricia@serenna.com',
    commissionRate: 0.47,
    serviceCategories: ['Depilação'],
  },
  {
    id: 'collab-8',
    name: 'André Colorista',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-8888',
    email: 'andre@serenna.com',
    commissionRate: 0.53,
    serviceCategories: ['Cabelo', 'Coloração'],
  },
  {
    id: 'collab-9',
    name: 'Juliana Spa',
    role: 'professional',
    status: 'active',
    phone: '(11) 98765-9999',
    email: 'juliana@serenna.com',
    commissionRate: 0.51,
    serviceCategories: ['Spa', 'Massagem'],
  },
  {
    id: 'collab-10',
    name: 'Rodrigo Designer',
    role: 'professional',
    status: 'inactive',
    phone: '(11) 98765-0000',
    email: 'rodrigo@serenna.com',
    commissionRate: 0.49,
    serviceCategories: ['Estética'],
  },
];

export const addMockCollaborator = (collaborator: Collaborator) => {
  mockCollaborators = [...mockCollaborators, collaborator];
};

export const updateMockCollaborator = (id: string, updates: Partial<Collaborator>) => {
  mockCollaborators = mockCollaborators.map(collaborator =>
    collaborator.id === id ? { ...collaborator, ...updates } : collaborator
  );
};
