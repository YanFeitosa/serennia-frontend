import type { Category, CategoryType } from '../../types';
import { request } from '../request';

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

export async function deleteCategory(id: string): Promise<void> {
  await request<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
