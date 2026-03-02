// src/types/index.ts

// 1. Authentication and Users
export type PlatformRole = 'super_admin' | 'tenant_admin';
export type TenantRole = 'manager' | 'receptionist' | 'professional' | 'accountant';
export type SalonStatus = 'pending' | 'active' | 'suspended';

// UserRole includes admin for permissions (admin = full access)
// Legacy: 'admin' is treated as having all permissions
export type UserRole = TenantRole | 'admin' | 'super_admin' | 'tenant_admin';

export interface User {
  id: string;
  salonId: string | null; // null for super_admin
  name: string;
  email: string;
  phone?: string;
  platformRole?: PlatformRole; // 'super_admin' | 'tenant_admin' | null (tenant user)
  tenantRole?: TenantRole; // null for super_admin and tenant_admin
  role?: UserRole; // Legacy field for backward compatibility
  avatarUrl?: string;
  salonName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Main Data Models

export interface Client {
  id: string;
  salonId: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collaborator {
  id: string;
  salonId: string;
  userId?: string;
  name: string;
  role: TenantRole; // Collaborators can only have tenant roles
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  cpf?: string;
  avatarUrl?: string;
  commissionRate: number; // Default commission rate
  commissionMode?: 'service' | 'professional' | null; // null = usa padrão do salão, service = comissão do serviço, professional = taxa fixa
  serviceCategories?: string[];
  // Informações bancárias
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  bankName?: string;
  bankAgency?: string;
  bankAccount?: string;
  bankAccountType?: 'corrente' | 'poupanca';
  // Endereço
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  // Datas importantes
  hireDate?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Salon {
  id: string;
  name: string;
  document?: string;
  tenantAdminId?: string;
  status: SalonStatus;
  defaultCommissionRate?: number;
  commissionMode?: 'service' | 'professional';
  fixedCostsMonthly?: number;
  variableCostRate?: number;
  rolePermissions?: Record<string, string[]>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  salonId: string;
  name: string;
  category?: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  commission?: number; // commission percentage as fraction (0-1)
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  salonId: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  trackStock?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryType = 'service' | 'product';

export interface Category {
  id: string;
  salonId: string;
  type: CategoryType;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// 3. Appointments and Scheduling

export type AppointmentStatus = 'pending' | 'in_progress' | 'completed' | 'canceled' | 'no_show' | 'not_paid';
export type AppointmentOrigin = 'whatsapp' | 'app' | 'totem' | 'reception';

export interface Appointment {
  id: string;
  salonId: string;
  clientId: string;
  collaboratorId: string;
  serviceIds: string[];
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
  status: AppointmentStatus;
  origin: AppointmentOrigin;
  notes?: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 4. Orders and Payments

export interface OrderItem {
  id: string;
  salonId: string;
  type: 'service' | 'product';
  serviceId?: string;
  productId?: string;
  collaboratorId?: string;
  quantity?: number;
  price: number;
  commission: number;
}

export interface Order {
  id: string;
  salonId: string;
  clientId: string;
  items: OrderItem[];
  status: 'open' | 'closed' | 'paid';
  paymentMethod?: PaymentMethod;
  finalValue: number;
  createdAt: string;
  closedAt?: string;
  appointmentId?: string;
  createdByUserId?: string;
  updatedAt?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'pix' | 'online';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status?: 'pending' | 'confirmed' | 'failed';
  transactionDate: string;
  salonId: string;
  receivedByUserId?: string;
}

// 5. Financial and Auditing

export interface CommissionRecord {
  id: string;
  salonId: string;
  collaboratorId: string;
  orderId: string;
  orderItemId?: string;
  amount: number;
  paid: boolean;
  paymentDate?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface AuditLog {
  id: string;
  salonId: string;
  userId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: string;
  timestamp: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// 6. Expenses

export type ExpenseType = 'FIXED' | 'VARIABLE';

export interface Expense {
  id: string;
  salonId: string;
  name: string;
  amount: number;
  type: ExpenseType;
  createdAt: string;
  updatedAt: string;
}

// 7. UI-specific types

export interface Notification {
  id: string;
  userId: string;
  salonId?: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  type?: 'info' | 'warning' | 'error';
}
