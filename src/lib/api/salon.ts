import { request } from '../request';

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
