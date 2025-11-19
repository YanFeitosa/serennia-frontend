// src/data/services.ts
import type { Service } from '../types';

export let mockServices: Service[] = [
  {
    id: 'service-1',
    salonId: 'salon-1',
    name: 'Corte feminino',
    category: 'Cabelo',
    description: 'Corte de cabelo feminino com finalização básica.',
    duration: 60,
    price: 120,
    commission: 0.5,
    bufferTime: 10,
    isActive: true,
  },
  {
    id: 'service-2',
    salonId: 'salon-1',
    name: 'Corte masculino',
    category: 'Cabelo',
    description: 'Corte de cabelo masculino.',
    duration: 45,
    price: 80,
    commission: 0.5,
    bufferTime: 5,
    isActive: true,
  },
  {
    id: 'service-3',
    salonId: 'salon-1',
    name: 'Escova',
    category: 'Cabelo',
    description: 'Escova modeladora.',
    duration: 60,
    price: 100,
    commission: 0.4,
    bufferTime: 10,
    isActive: true,
  },
  {
    id: 'service-4',
    salonId: 'salon-1',
    name: 'Manicure e pedicure',
    category: 'Unhas',
    description: 'Serviço completo de mãos e pés.',
    duration: 90,
    price: 150,
    commission: 0.5,
    isActive: true,
  },
  {
    id: 'service-5',
    salonId: 'salon-1',
    name: 'Massagem relaxante',
    category: 'Massagem',
    description: 'Massagem corporal relaxante.',
    duration: 60,
    price: 180,
    commission: 0.5,
    isActive: true,
  },
  {
    id: 'service-6',
    salonId: 'salon-1',
    name: 'Limpeza de pele',
    category: 'Estética',
    description: 'Limpeza de pele profunda.',
    duration: 75,
    price: 220,
    commission: 0.45,
    isActive: true,
  },
  {
    id: 'service-7',
    salonId: 'salon-1',
    name: 'Maquiagem social',
    category: 'Maquiagem',
    description: 'Maquiagem para festas e eventos.',
    duration: 60,
    price: 200,
    commission: 0.5,
    isActive: true,
  },
  {
    id: 'service-8',
    salonId: 'salon-1',
    name: 'Pacote noiva',
    category: 'Pacote',
    description: 'Cabelo, maquiagem e unhas para noiva.',
    duration: 240,
    price: 800,
    commission: 0.6,
    isActive: true,
  },
];

export const addMockService = (service: Service) => {
  mockServices = [...mockServices, service];
};

export const updateMockService = (id: string, updates: Partial<Service>) => {
  mockServices = mockServices.map(service =>
    service.id === id ? { ...service, ...updates } : service,
  );
};
