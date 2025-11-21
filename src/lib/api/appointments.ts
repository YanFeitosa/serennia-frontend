import type { Appointment, AppointmentStatus, AppointmentOrigin } from '../../types';
import { request } from '../request';

export interface ListAppointmentsParams {
  dateFrom?: string;
  dateTo?: string;
  collaboratorId?: string;
  status?: AppointmentStatus;
}

export async function getAppointments(params: ListAppointmentsParams = {}): Promise<Appointment[]> {
  const search = new URLSearchParams();
  if (params.dateFrom) search.append('dateFrom', params.dateFrom);
  if (params.dateTo) search.append('dateTo', params.dateTo);
  if (params.collaboratorId) search.append('collaboratorId', params.collaboratorId);
  if (params.status) search.append('status', params.status);

  const qs = search.toString();
  const path = qs ? `/appointments?${qs}` : '/appointments';
  return request<Appointment[]>(path);
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}`);
}

export interface CreateAppointmentPayload {
  clientId: string;
  collaboratorId: string;
  serviceIds: string[];
  start: string;
  notes?: string;
  origin: AppointmentOrigin;
}

export interface UpdateAppointmentPayload {
  clientId?: string;
  collaboratorId?: string;
  serviceIds?: string[];
  start?: string;
  notes?: string;
  origin?: AppointmentOrigin;
}

export async function createAppointment(input: CreateAppointmentPayload): Promise<Appointment> {
  return request<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentPayload,
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}
