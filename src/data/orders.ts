// src/data/orders.ts
import type { Appointment, Order, OrderItem } from '../types';
import { mockServices } from './services';
import { mockProducts } from './products';

const orderItems: OrderItem[] = [
  { id: 'oi-1', type: 'service', serviceId: 'service-1', collaboratorId: 'collab-1', price: 120, commission: 60 },
  { id: 'oi-2', type: 'service', serviceId: 'service-2', collaboratorId: 'collab-2', price: 80, commission: 32 },
  { id: 'oi-3', type: 'service', serviceId: 'service-3', collaboratorId: 'collab-3', price: 180, commission: 99 },
  { id: 'oi-4', type: 'service', serviceId: 'service-4', collaboratorId: 'collab-9', price: 250, commission: 125 },
  { id: 'oi-5', type: 'service', serviceId: 'service-5', collaboratorId: 'collab-6', price: 80, commission: 38.4 },
  { id: 'oi-6', type: 'service', serviceId: 'service-6', collaboratorId: 'collab-8', price: 280, commission: 145.6 },
  { id: 'oi-7', type: 'service', serviceId: 'service-7', collaboratorId: 'collab-1', price: 350, commission: 175 },
  { id: 'oi-8', type: 'service', serviceId: 'service-8', collaboratorId: 'collab-8', price: 450, commission: 247.5 },
  { id: 'oi-9', type: 'service', serviceId: 'service-9', collaboratorId: 'collab-1', price: 70, commission: 35 },
  { id: 'oi-10', type: 'service', serviceId: 'service-10', collaboratorId: 'collab-1', price: 100, commission: 50 },
  { id: 'oi-11', type: 'service', serviceId: 'service-11', collaboratorId: 'collab-2', price: 120, commission: 48 },
  { id: 'oi-12', type: 'service', serviceId: 'service-12', collaboratorId: 'collab-7', price: 60, commission: 28.8 },
  { id: 'oi-13', type: 'service', serviceId: 'service-13', collaboratorId: 'collab-5', price: 180, commission: 86.4 },
  { id: 'oi-14', type: 'service', serviceId: 'service-14', collaboratorId: 'collab-5', price: 350, commission: 168 },
  { id: 'oi-15', type: 'service', serviceId: 'service-15', collaboratorId: 'collab-7', price: 150, commission: 70.5 },
  { id: 'oi-16', type: 'service', serviceId: 'service-16', collaboratorId: 'collab-7', price: 200, commission: 94 },
  { id: 'oi-17', type: 'service', serviceId: 'service-17', collaboratorId: 'collab-9', price: 180, commission: 91.8 },
  { id: 'oi-18', type: 'service', serviceId: 'service-18', collaboratorId: 'collab-2', price: 110, commission: 44 },
  { id: 'oi-19', type: 'service', serviceId: 'service-19', collaboratorId: 'collab-3', price: 220, commission: 118.8 },
  { id: 'oi-20', type: 'service', serviceId: 'service-20', collaboratorId: 'collab-3', price: 280, commission: 156.8 },
  { id: 'oi-21', type: 'service', serviceId: 'service-21', collaboratorId: 'collab-5', price: 300, commission: 156 },
  { id: 'oi-22', type: 'service', serviceId: 'service-22', collaboratorId: 'collab-6', price: 50, commission: 22.5 },
  { id: 'oi-23', type: 'service', serviceId: 'service-23', collaboratorId: 'collab-1', price: 200, commission: 100 },
  { id: 'oi-24', type: 'service', serviceId: 'service-24', collaboratorId: 'collab-9', price: 130, commission: 63.7 },
  { id: 'oi-25', type: 'service', serviceId: 'service-25', collaboratorId: 'collab-9', price: 800, commission: 464 },
];

export let mockOrders: Order[] = [
  // Open orders (today)
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
    clientId: 'client-5',
    items: [orderItems[4], orderItems[21]],
    total: 130,
    discount: 0,
    finalValue: 130,
    status: 'open',
    createdAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
  },
  {
    id: 'order-3',
    clientId: 'client-8',
    items: [orderItems[12]],
    total: 180,
    discount: 0,
    finalValue: 180,
    status: 'open',
    createdAt: new Date(new Date().setMinutes(new Date().getMinutes() - 30)).toISOString(),
  },

  // Closed orders (waiting payment)
  {
    id: 'order-4',
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
    id: 'order-5',
    clientId: 'client-4',
    items: [orderItems[12], orderItems[11]],
    total: 240,
    discount: 20,
    finalValue: 220,
    status: 'closed',
    createdAt: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
    closedAt: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
  },

  // Paid orders (recent)
  {
    id: 'order-6',
    clientId: 'client-3',
    items: [orderItems[2], orderItems[3]],
    total: 430,
    discount: 0,
    finalValue: 430,
    status: 'paid',
    createdAt: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
  },
  {
    id: 'order-7',
    clientId: 'client-6',
    items: [orderItems[5]],
    total: 280,
    discount: 15,
    finalValue: 265,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: 'order-8',
    clientId: 'client-7',
    items: [orderItems[16]],
    total: 180,
    discount: 0,
    finalValue: 180,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: 'order-9',
    clientId: 'client-9',
    items: [orderItems[10]],
    total: 120,
    discount: 0,
    finalValue: 120,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: 'order-10',
    clientId: 'client-10',
    items: [orderItems[6]],
    total: 350,
    discount: 30,
    finalValue: 320,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: 'order-11',
    clientId: 'client-11',
    items: [orderItems[14]],
    total: 150,
    discount: 0,
    finalValue: 150,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: 'order-12',
    clientId: 'client-12',
    items: [orderItems[13]],
    total: 350,
    discount: 0,
    finalValue: 350,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: 'order-13',
    clientId: 'client-13',
    items: [orderItems[4], orderItems[21]],
    total: 130,
    discount: 10,
    finalValue: 120,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: 'order-14',
    clientId: 'client-14',
    items: [orderItems[7]],
    total: 450,
    discount: 0,
    finalValue: 450,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
  {
    id: 'order-15',
    clientId: 'client-15',
    items: [orderItems[3]],
    total: 250,
    discount: 0,
    finalValue: 250,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
  {
    id: 'order-16',
    clientId: 'client-2',
    items: [orderItems[19]],
    total: 280,
    discount: 0,
    finalValue: 280,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: 'order-17',
    clientId: 'client-3',
    items: [orderItems[2]],
    total: 180,
    discount: 10,
    finalValue: 170,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: 'order-18',
    clientId: 'client-5',
    items: [orderItems[17]],
    total: 110,
    discount: 0,
    finalValue: 110,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
  },
  {
    id: 'order-19',
    clientId: 'client-8',
    items: [orderItems[18]],
    total: 220,
    discount: 20,
    finalValue: 200,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
  },
  {
    id: 'order-20',
    clientId: 'client-1',
    items: [orderItems[24]],
    total: 800,
    discount: 50,
    finalValue: 750,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  },
  {
    id: 'order-21',
    clientId: 'client-11',
    items: [orderItems[5], orderItems[9]],
    total: 380,
    discount: 0,
    finalValue: 380,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
  },
  {
    id: 'order-22',
    clientId: 'client-6',
    items: [orderItems[0], orderItems[8]],
    total: 190,
    discount: 10,
    finalValue: 180,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
  },
  {
    id: 'order-23',
    clientId: 'client-7',
    items: [orderItems[22]],
    total: 200,
    discount: 0,
    finalValue: 200,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: 'order-24',
    clientId: 'client-9',
    items: [orderItems[1], orderItems[10]],
    total: 200,
    discount: 15,
    finalValue: 185,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
  },
  {
    id: 'order-25',
    clientId: 'client-4',
    items: [orderItems[20]],
    total: 300,
    discount: 0,
    finalValue: 300,
    status: 'paid',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
  },
];

const calcTotals = (items: OrderItem[]): { total: number; finalValue: number } => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { total, finalValue: total };
};

const findOpenOrderForClient = (clientId: string): Order | undefined => {
  return mockOrders.find(order => order.clientId === clientId && order.status === 'open');
};

export const createEmptyOrderForClient = (clientId: string): Order => {
  const existing = findOpenOrderForClient(clientId);
  if (existing) {
    return existing;
  }

  const id = `order-${Date.now()}`;
  const now = new Date().toISOString();
  const order: Order = {
    id,
    clientId,
    items: [],
    total: 0,
    discount: 0,
    finalValue: 0,
    status: 'open',
    createdAt: now,
  };
  mockOrders = [...mockOrders, order];
  return order;
};

export const createOrderFromAppointment = (appointment: Appointment): Order => {
  const existing = findOpenOrderForClient(appointment.clientId);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const items: OrderItem[] = appointment.serviceIds.map(serviceId => {
    const service = mockServices.find(s => s.id === serviceId);
    const price = service?.price ?? 0;
    const commission = service ? service.price * service.commission : 0;
    return {
      id: `oi-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: 'service',
      serviceId,
      collaboratorId: appointment.collaboratorId,
      price,
      commission,
    };
  });

  const { total, finalValue } = calcTotals(items);

  const order: Order = {
    id: `order-${Date.now()}`,
    clientId: appointment.clientId,
    items,
    total,
    discount: 0,
    finalValue,
    status: 'open',
    createdAt: now,
  };

  mockOrders = [...mockOrders, order];
  return order;
};

export const addItemToOrder = (orderId: string, serviceId: string, collaboratorId: string): Order | null => {
  const service = mockServices.find(s => s.id === serviceId);
  if (!service) return null;

  const price = service.price;
  const commission = service.price * service.commission;
  const item: OrderItem = {
    id: `oi-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'service',
    serviceId,
    collaboratorId,
    price,
    commission,
  };

  mockOrders = mockOrders.map(order => {
    if (order.id !== orderId) return order;
    const items = [...order.items, item];
    const { total, finalValue } = calcTotals(items);
    return { ...order, items, total, finalValue };
  });

  return mockOrders.find(o => o.id === orderId) ?? null;
};

export const addProductToOrder = (orderId: string, productId: string): Order | null => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;

  const item: OrderItem = {
    id: `oi-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'product',
    productId,
    price: product.price,
    commission: 0,
  };

  mockOrders = mockOrders.map(order => {
    if (order.id !== orderId) return order;
    const items = [...order.items, item];
    const { total, finalValue } = calcTotals(items);
    return { ...order, items, total, finalValue };
  });

  return mockOrders.find(o => o.id === orderId) ?? null;
};

export const removeItemFromOrder = (orderId: string, itemId: string): Order | null => {
  mockOrders = mockOrders.map(order => {
    if (order.id !== orderId) return order;
    const items = order.items.filter(item => item.id !== itemId);
    const { total, finalValue } = calcTotals(items);
    return { ...order, items, total, finalValue };
  });

  return mockOrders.find(o => o.id === orderId) ?? null;
};

export const findOrderById = (id: string): Order | null => {
  return mockOrders.find(o => o.id === id) ?? null;
};

export const findOpenOrderByClientId = (clientId: string): Order | null => {
  return findOpenOrderForClient(clientId) ?? null;
};
