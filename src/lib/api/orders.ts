import type { Order } from '../../types';
import { request } from '../request';

export interface ListOrdersParams {
  status?: Order['status'];
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export async function getOrders(params: ListOrdersParams = {}): Promise<Order[]> {
  const search = new URLSearchParams();
  if (params.status) search.append('status', params.status);
  if (params.clientId) search.append('clientId', params.clientId);
  if (params.dateFrom) search.append('dateFrom', params.dateFrom);
  if (params.dateTo) search.append('dateTo', params.dateTo);
  if (params.search) search.append('search', params.search);

  const qs = search.toString();
  const path = qs ? `/orders?${qs}` : '/orders';
  return request<Order[]>(path);
}

export async function getOrderById(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`);
}

export interface CreateOrderPayload {
  clientId: string;
}

export async function createOrder(input: CreateOrderPayload): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface UpdateOrderPayload {
  clientId?: string;
}

export async function updateOrder(
  id: string,
  input: UpdateOrderPayload,
): Promise<Order> {
  return request<Order>(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export type OrderItemType = 'service' | 'product';

export interface AddOrderItemPayload {
  type: OrderItemType;
  serviceId?: string;
  productId?: string;
  collaboratorId?: string;
  quantity?: number;
}

export async function addOrderItem(
  id: string,
  input: AddOrderItemPayload,
): Promise<Order> {
  return request<Order>(`/orders/${id}/items`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function removeOrderItem(orderId: string, itemId: string): Promise<Order> {
  return request<Order>(`/orders/${orderId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function closeOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}/close`, {
    method: 'POST',
  });
}

export async function payOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}/pay`, {
    method: 'POST',
  });
}

export async function ensureOrderForAppointment(appointmentId: string): Promise<Order> {
  return request<Order>(`/orders/appointments/${appointmentId}/order/ensure`, {
    method: 'POST',
  });
}
