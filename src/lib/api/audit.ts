import type { AuditLog } from '../../types';
import { request } from '../request';

export interface ListAuditLogsParams {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  tableName?: string;
}

export async function getAuditLogs(params: ListAuditLogsParams = {}): Promise<AuditLog[]> {
  const search = new URLSearchParams();
  if (params.dateFrom) search.append('dateFrom', params.dateFrom);
  if (params.dateTo) search.append('dateTo', params.dateTo);
  if (params.userId) search.append('userId', params.userId);
  if (params.tableName) search.append('tableName', params.tableName);

  const qs = search.toString();
  const path = qs ? `/audit-logs?${qs}` : '/audit-logs';
  return request<AuditLog[]>(path);
}

