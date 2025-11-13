// src/types/index.ts

// 1. Authentication and Users
export type UserRole = 'admin' | 'manager' | 'receptionist' | 'professional';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  salonId: string;
  avatarUrl?: string;
  name: string;
}

// 2. Main Data Models

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit?: string;
  visitCount: number;
  preferences?: string;
  tags?: string[]; // e.g., 'alergia-a-esmalte', 'prefere-sem-conversa'
}

export interface Collaborator {
  id: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  commissionRate: number; // Default commission rate
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  commission: number; // percentage or fixed value
  bufferTime?: number; // minutes after service
  color?: string; // for agenda display
}

// 3. Appointments and Scheduling

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'canceled' | 'no_show';
export type AppointmentOrigin = 'whatsapp' | 'app' | 'totem' | 'reception';

export interface Appointment {
  id: string;
  clientId: string;
  collaboratorId: string;
  serviceIds: string[];
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
  status: AppointmentStatus;
  origin: AppointmentOrigin;
  notes?: string;
  price: number;
}

// 4. Orders and Payments

export interface OrderItem {
  id: string;
  serviceId: string;
  collaboratorId: string;
  price: number;
  commission: number;
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  total: number;
  discount: number;
  finalValue: number;
  status: 'open' | 'closed' | 'paid';
  createdAt: string;
  closedAt?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'pix' | 'online';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  transactionDate: string;
}

// 5. Financial and Auditing

export interface CommissionRecord {
  id: string;
  collaboratorId: string;
  orderId: string;
  amount: number;
  paid: boolean;
  paymentDate?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
}

// 6. UI-specific types

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
