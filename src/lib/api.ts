import type { Category, CategoryType, Service, Product, Client, Collaborator } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data: unknown = undefined;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as any).error === 'string'
        ? (data as any).error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getCategories(type: CategoryType): Promise<Category[]> {
  const params = new URLSearchParams({ type });
  return request<Category[]>(`/categories?${params.toString()}`);
}

export async function createCategory(input: {
  type: CategoryType;
  name: string;
}): Promise<Category> {
  return request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface CollaboratorPayload {
  name: string;
  role: Collaborator['role'];
  status?: Collaborator['status'];
  phone?: string;
  email?: string;
  commissionRate?: number;
  serviceCategories?: string[];
}

export async function getCollaborators(): Promise<Collaborator[]> {
  return request<Collaborator[]>('/collaborators');
}

export async function getCollaboratorById(id: string): Promise<Collaborator> {
  return request<Collaborator>(`/collaborators/${id}`);
}

export async function createCollaborator(
  input: CollaboratorPayload,
): Promise<Collaborator> {
  return request<Collaborator>('/collaborators', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCollaborator(
  id: string,
  input: Partial<CollaboratorPayload>,
): Promise<Collaborator> {
  return request<Collaborator>(`/collaborators/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export interface SalonSettings {
  id: string;
  name: string;
  defaultCommissionRate: number | null;
  commissionMode: 'service' | 'professional';
}

export async function getSalonSettings(): Promise<SalonSettings> {
  return request<SalonSettings>('/salon');
}

export async function updateSalonSettings(
  input: Partial<{
    name: string;
    defaultCommissionRate: number;
    commissionMode: 'service' | 'professional';
  }>,
): Promise<SalonSettings> {
  return request<SalonSettings>('/salon', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

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

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>('/products');
}

export async function getProductById(id: string): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export interface ProductPayload {
  name: string;
  category?: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  isActive?: boolean;
}

export async function createProduct(input: ProductPayload): Promise<Product> {
  return request<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: Partial<ProductPayload>,
): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await request<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}

export async function getServices(): Promise<Service[]> {
  return request<Service[]>('/services');
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
