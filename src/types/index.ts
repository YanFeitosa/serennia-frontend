// src/types/index.ts

// 1. Authentication and Users
export type UserRole = 'admin' | 'manager' | 'receptionist' | 'professional';

export interface User {
  id: string;
  salonId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
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
  role: UserRole;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  commissionRate: number; // Default commission rate
  serviceCategories?: string[];
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

// 6. UI-specific types

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
