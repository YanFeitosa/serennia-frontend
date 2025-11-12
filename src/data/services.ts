// src/data/services.ts
import type { Service } from '../types';

export const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Corte Feminino',
    duration: 60,
    price: 120,
    commission: 0.5,
    bufferTime: 15,
    color: '#C3BCEB',
  },
  {
    id: 'service-2',
    name: 'Manicure e Pedicure',
    duration: 90,
    price: 80,
    commission: 0.4,
    color: '#A9DEF9',
  },
  {
    id: 'service-3',
    name: 'Limpeza de Pele',
    duration: 75,
    price: 180,
    commission: 0.55,
    bufferTime: 15,
    color: '#F6EAC2',
  },
  {
    id: 'service-4',
    name: 'Massagem Relaxante',
    duration: 60,
    price: 250,
    commission: 0.5,
    color: '#FBC3BC',
  },
];
