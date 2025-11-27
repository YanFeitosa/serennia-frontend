export * from './api/auth';
export * from './api/categories';
export * from './api/collaborators';
export * from './api/salon';
export * from './api/clients';
export * from './api/products';
export * from './api/services';
export * from './api/orders';
export * from './api/appointments';
export * from './api/notifications';
export * from './api/audit';
export * from './api/users';
export * from './api/messages';
export * from './api/totem';
export * from './api/register';
export * from './api/expenses';
export * from './api/payments';
export * from './api/commissions';
export * from './api/salons';

// Reexport da função request e da constante de base para quem precisar de chamadas mais customizadas
export { request, API_BASE_URL } from './request';
