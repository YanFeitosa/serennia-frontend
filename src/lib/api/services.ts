import type { Service } from '../../types';
import { request } from '../request';

export async function getServices(): Promise<Service[]> {
  const res = await request<{ data: Service[]; pagination: any } | Service[]>('/services');
  return Array.isArray(res) ? res : res.data;
}

export async function getServiceById(id: string): Promise<Service> {
  return request<Service>(`/services/${id}`);
}

export interface ServicePayload {
  name: string;
  category: string;
  description?: string;
  duration: number;
  price: number;
  commission?: number;
  isActive?: boolean;
}

export async function createService(input: ServicePayload): Promise<Service> {
  return request<Service>('/services', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateService(
  id: string,
  input: Partial<ServicePayload>,
): Promise<Service> {
  return request<Service>(`/services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteService(id: string): Promise<void> {
  return request<void>(`/services/${id}`, {
    method: 'DELETE',
  });
}
