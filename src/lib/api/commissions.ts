import { request } from '../request';

export interface PendingCommission {
  collaborator: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  totalAmount: number;
  recordCount: number;
  records: Array<{
    id: string;
    amount: number;
    orderId: string;
    orderDate: string;
  }>;
}

export interface CommissionPaymentResult {
  success: boolean;
  paymentId: string;
  amount: number;
  recordsPaid: number;
}

export interface CommissionPaymentHistory {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  paidAt: string;
  notes?: string;
}

export async function getPendingCommissions(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<PendingCommission[]> {
  const searchParams = new URLSearchParams();
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);

  const query = searchParams.toString();
  return request<PendingCommission[]>(`/commissions/pending${query ? `?${query}` : ''}`);
}

export async function payCommissions(params: {
  collaboratorId: string;
  recordIds?: string[];
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
}): Promise<CommissionPaymentResult> {
  return request<CommissionPaymentResult>('/commissions/pay', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getCommissionHistory(params?: {
  collaboratorId?: string;
  limit?: number;
}): Promise<CommissionPaymentHistory[]> {
  const searchParams = new URLSearchParams();
  if (params?.collaboratorId) searchParams.set('collaboratorId', params.collaboratorId);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  return request<CommissionPaymentHistory[]>(`/commissions/history${query ? `?${query}` : ''}`);
}

