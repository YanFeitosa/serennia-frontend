// src/data/orders.ts
import type { Appointment, Order, OrderItem } from '../types';
import { mockServices } from './services';
import { mockProducts } from './products';

const calcFinalValue = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

const createServiceItem = (
  id: string,
  serviceId: string,
  collaboratorId: string,
): OrderItem => {
  const service = mockServices.find(s => s.id === serviceId);
  const price = service?.price ?? 0;
  const commissionRate = service?.commission ?? 0;
  const commission = service ? service.price * commissionRate : 0;
  return {
    id,
    salonId: 'salon-1',
    type: 'service',
    serviceId,
    collaboratorId,
    price,
    commission,
  };
};

const createProductItem = (
  id: string,
  productId: string,
): OrderItem => {
  const product = mockProducts.find(p => p.id === productId);
  const price = product?.price ?? 0;
  return {
    id,
    salonId: 'salon-1',
    type: 'product',
    productId,
    price,
    commission: 0,
  };
};

const now = new Date();

const daysAgoISO = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export let mockOrders: Order[] = (() => {
  const order1Items: OrderItem[] = [
    createServiceItem('oi-1', 'service-1', 'collab-1'),
  ];

  const order2Items: OrderItem[] = [
    createServiceItem('oi-2', 'service-4', 'collab-1'),
    createProductItem('oi-3', 'product-1'),
  ];

  const order3Items: OrderItem[] = [
    createServiceItem('oi-4', 'service-2', 'collab-2'),
  ];

  const order4Items: OrderItem[] = [
    createServiceItem('oi-5', 'service-5', 'collab-2'),
    createProductItem('oi-6', 'product-3'),
  ];

  const order5Items: OrderItem[] = [
    createServiceItem('oi-7', 'service-3', 'collab-3'),
  ];

  const order6Items: OrderItem[] = [
    createServiceItem('oi-8', 'service-6', 'collab-3'),
    createProductItem('oi-9', 'product-2'),
  ];

  const order7Items: OrderItem[] = [
    createServiceItem('oi-10', 'service-2', 'collab-2'),
    createProductItem('oi-11', 'product-4'),
  ];

  const order8Items: OrderItem[] = [
    createServiceItem('oi-12', 'service-7', 'collab-1'),
  ];

  return [
    {
      id: 'order-1',
      salonId: 'salon-1',
      clientId: 'client-1',
      items: order1Items,
      status: 'open',
      finalValue: calcFinalValue(order1Items),
      createdAt: daysAgoISO(0),
    },
    {
      id: 'order-2',
      salonId: 'salon-1',
      clientId: 'client-2',
      items: order2Items,
      status: 'closed',
      finalValue: calcFinalValue(order2Items),
      createdAt: daysAgoISO(1),
      closedAt: daysAgoISO(0),
    },
    {
      id: 'order-3',
      salonId: 'salon-1',
      clientId: 'client-3',
      items: order3Items,
      status: 'paid',
      finalValue: calcFinalValue(order3Items),
      createdAt: daysAgoISO(2),
      closedAt: daysAgoISO(2),
    },
    {
      id: 'order-4',
      salonId: 'salon-1',
      clientId: 'client-4',
      items: order4Items,
      status: 'paid',
      finalValue: calcFinalValue(order4Items),
      createdAt: daysAgoISO(5),
      closedAt: daysAgoISO(5),
    },
    {
      id: 'order-5',
      salonId: 'salon-1',
      clientId: 'client-5',
      items: order5Items,
      status: 'open',
      finalValue: calcFinalValue(order5Items),
      createdAt: daysAgoISO(0),
    },
    {
      id: 'order-6',
      salonId: 'salon-1',
      clientId: 'client-6',
      items: order6Items,
      status: 'paid',
      finalValue: calcFinalValue(order6Items),
      createdAt: daysAgoISO(3),
      closedAt: daysAgoISO(3),
    },
    {
      id: 'order-7',
      salonId: 'salon-1',
      clientId: 'client-7',
      items: order7Items,
      status: 'paid',
      finalValue: calcFinalValue(order7Items),
      createdAt: daysAgoISO(7),
      closedAt: daysAgoISO(7),
    },
    {
      id: 'order-8',
      salonId: 'salon-1',
      clientId: 'client-8',
      items: order8Items,
      status: 'closed',
      finalValue: calcFinalValue(order8Items),
      createdAt: daysAgoISO(4),
      closedAt: daysAgoISO(2),
    },
  ];
})();

const findOpenOrderForClient = (clientId: string): Order | undefined => {
  return mockOrders.find(order => order.clientId === clientId && order.status === 'open');
};

export const createEmptyOrderForClient = (clientId: string): Order => {
  const existing = findOpenOrderForClient(clientId);
  if (existing) {
    return existing;
  }

  const id = `order-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const order: Order = {
    id,
    salonId: 'salon-1',
    clientId,
    items: [],
    status: 'open',
    finalValue: 0,
    createdAt,
  };

  mockOrders = [...mockOrders, order];
  return order;
};

export const findOrderById = (id: string): Order | null => {
  return mockOrders.find(o => o.id === id) ?? null;
};

const updateOrderById = (orderId: string, updater: (order: Order) => Order): Order | null => {
  let updated: Order | null = null;
  mockOrders = mockOrders.map(order => {
    if (order.id !== orderId) return order;
    updated = updater(order);
    return updated;
  });
  return updated;
};

export const addItemToOrder = (
  orderId: string,
  serviceId: string,
  collaboratorId: string,
): Order | null => {
  const service = mockServices.find(s => s.id === serviceId);
  if (!service) return null;

  const itemId = `oi-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newItem = createServiceItem(itemId, serviceId, collaboratorId);

  return updateOrderById(orderId, (order) => {
    const items = [...order.items, newItem];
    const finalValue = calcFinalValue(items);
    return { ...order, items, finalValue };
  });
};

export const addProductToOrder = (
  orderId: string,
  productId: string,
): Order | null => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;

  const itemId = `oi-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newItem = createProductItem(itemId, productId);

  return updateOrderById(orderId, (order) => {
    const items = [...order.items, newItem];
    const finalValue = calcFinalValue(items);
    return { ...order, items, finalValue };
  });
};

export const removeItemFromOrder = (
  orderId: string,
  itemId: string,
): Order | null => {
  return updateOrderById(orderId, (order) => {
    const items = order.items.filter(item => item.id !== itemId);
    const finalValue = calcFinalValue(items);
    return { ...order, items, finalValue };
  });
};

export const findOpenOrderByClientId = (clientId: string): Order | null => {
  return findOpenOrderForClient(clientId) ?? null;
};

// Garante uma comanda aberta para o agendamento informado,
// adicionando os serviços do agendamento como itens (se ainda não existirem)
// e vinculando o appointmentId na comanda.
export const ensureOrderForAppointment = (appointment: Appointment): Order => {
  // Garante uma comanda aberta para o cliente (reutiliza se já existir)
  const baseOrder = createEmptyOrderForClient(appointment.clientId);

  // Adiciona itens de serviço referentes aos serviceIds do agendamento,
  // evitando duplicar itens idênticos (mesmo serviceId e collaboratorId).
  let currentOrder: Order = baseOrder;

  for (const serviceId of appointment.serviceIds) {
    const alreadyHasItem = currentOrder.items.some(
      item =>
        item.type === 'service' &&
        item.serviceId === serviceId &&
        item.collaboratorId === appointment.collaboratorId,
    );

    if (!alreadyHasItem) {
      const updated = addItemToOrder(currentOrder.id, serviceId, appointment.collaboratorId);
      if (updated) {
        currentOrder = updated;
      }
    }
  }

  // Garante vínculo com o agendamento
  if (currentOrder.appointmentId !== appointment.id) {
    const updated = updateOrderById(currentOrder.id, (order) => ({
      ...order,
      appointmentId: appointment.id,
    }));
    if (updated) {
      currentOrder = updated;
    }
  }

  return currentOrder;
};
