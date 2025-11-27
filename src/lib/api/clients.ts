import type { Client } from '../../types';
import { request } from '../request';

export async function getClients(): Promise<Client[]> {
  return request<Client[]>('/clients');
}

export async function getClientById(id: string): Promise<Client> {
  return request<Client>(`/clients/${id}`);
}

export interface ClientPayload {
  name: string;
  phone: string;
  email?: string;
}

export async function createClient(input: ClientPayload): Promise<Client> {
  return request<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateClient(
  id: string,
  input: Partial<ClientPayload> & { lastVisit?: string | null },
): Promise<Client> {
  return request<Client>(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteClient(id: string): Promise<void> {
  return request<void>(`/clients/${id}`, {
    method: 'DELETE',
  });
}
