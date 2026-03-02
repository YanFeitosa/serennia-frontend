import { request } from '../request';
import type { User } from '../../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface MeResponse {
  id: string;
  salonId: string | null;
  name: string;
  email: string;
  platformRole?: 'super_admin' | 'tenant_admin';
  tenantRole?: 'manager' | 'receptionist' | 'professional';
  role?: string; // Legacy field for backward compatibility
  avatarUrl?: string;
  salonName?: string;
}

export async function login(input: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getMe(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me');
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export async function changePassword(input: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  return request<ChangePasswordResponse>('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface UpdateProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export async function updateProfile(input: UpdateProfilePayload): Promise<UpdateProfileResponse> {
  return request<UpdateProfileResponse>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export async function forgotPassword(input: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  return request<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

