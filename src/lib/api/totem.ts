// src/lib/api/totem.ts
import { request, API_BASE_URL } from '../request';

export interface TotemDeviceLoginResponse {
  deviceId: string;
  deviceName: string;
  salonId: string;
  salonName: string;
  salonTheme: Record<string, unknown> | null;
}

export interface TotemDevice {
  id: string;
  salonId: string;
  name: string;
  accessCode: string;
  isActive: boolean;
  lastAccessAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  salonId: string;
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

// POST /totem/device/login - Login do dispositivo totem com código de acesso
export async function totemDeviceLogin(accessCode: string): Promise<TotemDeviceLoginResponse> {
  return fetch(`${API_BASE_URL}/totem/device/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessCode }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || `Failed to login: ${res.statusText}`);
        });
      }
      return res.json();
    });
}

// POST /totem/client/login
export async function totemClientLogin(phone: string, salonId: string): Promise<TotemClient> {
  return fetch(`${API_BASE_URL}/totem/client/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, salonId }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || `Failed to login: ${res.statusText}`);
        });
      }
      return res.json();
    });
}

// POST /totem/client/register
export async function totemClientRegister(payload: {
  name: string;
  phone: string;
  email?: string;
  salonId: string;
}): Promise<TotemClient> {
  return fetch(`${API_BASE_URL}/totem/client/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || `Failed to register: ${res.statusText}`);
        });
      }
      return res.json();
    });
}

// GET /totem/services
export async function getTotemServices(salonId: string): Promise<TotemService[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('salonId', salonId);

  return fetch(`${API_BASE_URL}/totem/services?${queryParams.toString()}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.statusText}`);
      }
      return res.json();
    });
}

// GET /totem/collaborators
export async function getTotemCollaborators(salonId: string, params?: {
  serviceCategoryIds?: string[];
}): Promise<TotemCollaborator[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('salonId', salonId);
  if (params?.serviceCategoryIds && params.serviceCategoryIds.length > 0) {
    queryParams.append('serviceCategoryIds', params.serviceCategoryIds.join(','));
  }

  return fetch(`${API_BASE_URL}/totem/collaborators?${queryParams.toString()}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch collaborators: ${res.statusText}`);
      }
      return res.json();
    });
}

// GET /totem/availability
export async function getTotemAvailability(salonId: string, params: {
  collaboratorId: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutos
}): Promise<AvailabilityResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('salonId', salonId);
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

// ========== Totem Device Management (authenticated) ==========

// GET /totem-devices
export async function getTotemDevices(): Promise<TotemDevice[]> {
  return request<TotemDevice[]>('/totem-devices', {
    method: 'GET',
  });
}

// POST /totem-devices
export async function createTotemDevice(name: string): Promise<TotemDevice> {
  return request<TotemDevice>('/totem-devices', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

// PUT /totem-devices/:id
export async function updateTotemDevice(id: string, data: { name?: string; isActive?: boolean }): Promise<TotemDevice> {
  return request<TotemDevice>(`/totem-devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// POST /totem-devices/:id/regenerate-code
export async function regenerateTotemDeviceCode(id: string): Promise<TotemDevice> {
  return request<TotemDevice>(`/totem-devices/${id}/regenerate-code`, {
    method: 'POST',
  });
}

// DELETE /totem-devices/:id
export async function deleteTotemDevice(id: string): Promise<void> {
  return request<void>(`/totem-devices/${id}`, {
    method: 'DELETE',
  });
}

