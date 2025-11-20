export * from './api/categories';
export * from './api/collaborators';
export * from './api/salon';
export * from './api/clients';
export * from './api/products';
export * from './api/services';

// Reexport da função request e da constante de base para quem precisar de chamadas mais customizadas
export { request, API_BASE_URL } from './request';
