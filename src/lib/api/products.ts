import type { Product } from '../../types';
import { request } from '../request';

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
  trackStock?: boolean;
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

export async function deleteProduct(id: string): Promise<void> {
  return request<void>(`/products/${id}`, {
    method: 'DELETE',
  });
}
