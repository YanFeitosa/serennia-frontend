// src/lib/api/totem.ts
import { request, API_BASE_URL } from '../request';

export interface TotemClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface TotemService {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface TotemCollaborator {
  id: string;
  name: string;
  serviceCategories: string[];
}

export interface AvailabilityResponse {
  collaboratorId: string;
  date: string;
  availableSlots: string[];
  totalSlots: number;
}

export interface CreateTotemAppointmentPayload {
  clientId: string;
  collaboratorId: string;
  serviceIds: string[];
  start: string; // ISO string
}

export interface TotemAppointment {
  id: string;
  clientId: string;
  collaboratorId: string;
  serviceIds: string[];
  start: string;
  end: string;
  status: string;
  origin: string;
}

// POST /totem/client/login
export async function totemClientLogin(phone: string): Promise<TotemClient> {
  return request<TotemClient>('/totem/client/login', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

// POST /totem/client/register
export async function totemClientRegister(payload: {
  name: string;
  phone: string;
  email?: string;
}): Promise<TotemClient> {
  return request<TotemClient>('/totem/client/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// GET /totem/services
export async function getTotemServices(): Promise<TotemService[]> {
  // Endpoint público, não precisa de autenticação
  return fetch(`${API_BASE_URL}/totem/services`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.statusText}`);
      }
      return res.json();
    });
}

// GET /totem/collaborators
export async function getTotemCollaborators(params?: {
  serviceCategoryIds?: string[];
}): Promise<TotemCollaborator[]> {
  const queryParams = new URLSearchParams();
  if (params?.serviceCategoryIds && params.serviceCategoryIds.length > 0) {
    queryParams.append('serviceCategoryIds', params.serviceCategoryIds.join(','));
  }

  const query = queryParams.toString();
  return fetch(`${API_BASE_URL}/totem/collaborators${query ? `?${query}` : ''}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch collaborators: ${res.statusText}`);
      }
      return res.json();
    });
}

// GET /totem/availability
export async function getTotemAvailability(params: {
  collaboratorId: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutos
}): Promise<AvailabilityResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('collaboratorId', params.collaboratorId);
  queryParams.append('date', params.date);
  queryParams.append('duration', String(params.duration));

  return fetch(`${API_BASE_URL}/totem/availability?${queryParams.toString()}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to check availability: ${res.statusText}`);
      }
      return res.json();
    });
}

// POST /totem/appointments
export async function createTotemAppointment(
  payload: CreateTotemAppointmentPayload
): Promise<TotemAppointment> {
  return fetch(`${API_BASE_URL}/totem/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || `Failed to create appointment: ${res.statusText}`);
        });
      }
      return res.json();
    });
}

