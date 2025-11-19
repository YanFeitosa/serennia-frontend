// src/data/audit.ts
import type { AuditLog } from '../types';

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    salonId: 'salon-1',
    userId: 'user-1',
    action: 'INSERT',
    tableName: 'clients',
    recordId: 'client-1',
    timestamp: new Date().toISOString(),
    newValue: { name: 'Ana Souza', phone: '(11) 98888-0001' },
    ipAddress: '127.0.0.1',
    userAgent: 'MockBrowser/1.0',
  },
  {
    id: 'audit-2',
    salonId: 'salon-1',
    userId: 'user-2',
    action: 'UPDATE',
    tableName: 'services',
    recordId: 'service-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    oldValue: { price: 100 },
    newValue: { price: 120 },
    ipAddress: '127.0.0.1',
    userAgent: 'MockBrowser/1.0',
  },
  {
    id: 'audit-3',
    salonId: 'salon-1',
    userId: 'user-3',
    action: 'DELETE',
    tableName: 'orders',
    recordId: 'order-x',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    ipAddress: '127.0.0.1',
    userAgent: 'MockBrowser/1.0',
  },
];
