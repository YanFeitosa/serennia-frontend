// src/data/audit.ts
import type { AuditLog } from '../types';

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-1',
    action: 'UPDATE',
    tableName: 'services',
    recordId: 'service-1',
    timestamp: new Date().toISOString(),
    oldValue: { price: 110 },
    newValue: { price: 120 },
  },
  {
    id: 'log-2',
    userId: 'user-3',
    action: 'INSERT',
    tableName: 'appointments',
    recordId: 'appt-4',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    newValue: { clientId: 'client-1', serviceIds: ['service-1'] },
  },
  {
    id: 'log-3',
    userId: 'user-2',
    action: 'DELETE',
    tableName: 'clients',
    recordId: 'client-temp',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    oldValue: { name: 'Cliente Removido' },
  },
];
