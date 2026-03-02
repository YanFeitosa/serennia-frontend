import type { Expense, ExpenseType } from '../../types';
import { request } from '../request';

export interface ExpensePayload {
  name: string;
  amount: number;
  type: ExpenseType;
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await request<{ data: Expense[]; pagination: any } | Expense[]>('/expenses');
  return Array.isArray(res) ? res : res.data;
}

export async function createExpense(input: ExpensePayload): Promise<Expense> {
  return request<Expense>('/expenses', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateExpense(
  id: string,
  input: Partial<ExpensePayload>,
): Promise<Expense> {
  return request<Expense>(`/expenses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteExpense(id: string): Promise<void> {
  await request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

