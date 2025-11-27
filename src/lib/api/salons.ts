import { request } from '../request';

export interface Salon {
  id: string;
  name: string;
  document: string | null;
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  usersCount: number;
  collaboratorsCount: number;
  clientsCount: number;
}

export interface SalonDetails extends Salon {
  defaultCommissionRate: number;
  commissionMode: string;
  servicesCount: number;
  productsCount: number;
}

// List all salons (Super Admin only)
export async function getSalons(): Promise<Salon[]> {
  return request<Salon[]>('/salons');
}

// Get salon details (Super Admin only)
export async function getSalonById(id: string): Promise<SalonDetails> {
  return request<SalonDetails>(`/salons/${id}`);
}
