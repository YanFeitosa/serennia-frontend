// src/data/orders.ts
import type { Order, OrderItem } from '../types';

const orderItems: OrderItem[] = [
  { id: 'oi-1', serviceId: 'service-1', collaboratorId: 'collab-1', price: 120, commission: 60 },
  { id: 'oi-2', serviceId: 'service-2', collaboratorId: 'collab-2', price: 80, commission: 32 },
  { id: 'oi-3', serviceId: 'service-3', collaboratorId: 'collab-3', price: 180, commission: 99 },
  { id: 'oi-4', serviceId: 'service-4', collaboratorId: 'collab-1', price: 250, commission: 125 },
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    clientId: 'client-2',
    items: [orderItems[1]],
    total: 80,
    discount: 0,
    finalValue: 80,
    status: 'open',
    createdAt: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
  },
  {
    id: 'order-2',
    clientId: 'client-1',
    items: [orderItems[0]],
    total: 120,
    discount: 10,
    finalValue: 110,
    status: 'closed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    closedAt: new Date().toISOString(),
  },
  {
    id: 'order-3',
    clientId: 'client-3',
    items: [orderItems[2], orderItems[3]],
    total: 430,
    discount: 0,
    finalValue: 430,
    status: 'pending_payment',
    createdAt: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
  },
];
