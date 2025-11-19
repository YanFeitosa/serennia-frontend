// src/data/clients.ts
import type { Client } from '../types';

export let mockClients: Client[] = [
  {
    id: 'client-1',
    salonId: 'salon-1',
    name: 'Ana Souza',
    phone: '(11) 98888-0001',
    email: 'ana.souza@example.com',
    lastVisit: '2023-11-10T14:00:00Z',
  },
  {
    id: 'client-2',
    salonId: 'salon-1',
    name: 'Beatriz Lima',
    phone: '(11) 98888-0002',
    email: 'beatriz.lima@example.com',
    lastVisit: '2023-11-08T16:30:00Z',
  },
  {
    id: 'client-3',
    salonId: 'salon-1',
    name: 'Carla Oliveira',
    phone: '(11) 98888-0003',
    email: 'carla.oliveira@example.com',
    lastVisit: '2023-11-12T18:00:00Z',
  },
  {
    id: 'client-4',
    salonId: 'salon-1',
    name: 'Daniela Santos',
    phone: '(11) 98888-0004',
    email: 'daniela.santos@example.com',
    lastVisit: '2023-11-05T11:30:00Z',
  },
  {
    id: 'client-5',
    salonId: 'salon-1',
    name: 'Elisa Costa',
    phone: '(11) 98888-0005',
    email: 'elisa.costa@example.com',
  },
  {
    id: 'client-6',
    salonId: 'salon-1',
    name: 'Fernanda Alves',
    phone: '(11) 98888-0006',
    email: 'fernanda.alves@example.com',
  },
  {
    id: 'client-7',
    salonId: 'salon-1',
    name: 'Gabriela Rocha',
    phone: '(11) 98888-0007',
    email: 'gabriela.rocha@example.com',
  },
  {
    id: 'client-8',
    salonId: 'salon-1',
    name: 'Helena Martins',
    phone: '(11) 98888-0008',
    email: 'helena.martins@example.com',
  },
  {
    id: 'client-9',
    salonId: 'salon-1',
    name: 'Isabela Alves',
    phone: '(11) 98888-0009',
    email: 'isabela.alves@example.com',
    lastVisit: '2023-11-03T17:30:00Z',
  },
  {
    id: 'client-10',
    salonId: 'salon-1',
    name: 'Joana Ribeiro',
    phone: '(11) 98888-0010',
    email: 'joana.ribeiro@example.com',
  },
  {
    id: 'client-11',
    salonId: 'salon-1',
    name: 'Karina Oliveira',
    phone: '(11) 98888-0011',
    email: 'karina.oliveira@example.com',
  },
  {
    id: 'client-12',
    salonId: 'salon-1',
    name: 'Luana Pereira',
    phone: '(11) 98888-0012',
    email: 'luana.pereira@example.com',
  },
];

export const addMockClient = (client: Client) => {
  mockClients = [...mockClients, client];
};

export const updateMockClient = (id: string, updates: Partial<Client>) => {
  mockClients = mockClients.map(client =>
    client.id === id ? { ...client, ...updates } : client,
  );
};
