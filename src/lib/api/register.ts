import { request } from '../request';

export interface RegisterPayload {
  salonName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  salonId?: string;
  userId?: string;
}

export async function register(data: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

