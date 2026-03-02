import { request } from '../request';

export interface QueueEntryClient {
  id: string;
  name: string;
  phone: string;
}

export interface QueueEntryCollaborator {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface QueueEntryAppointment {
  id: string;
  start: string;
  end: string;
  status: string;
}

export interface QueueEntry {
  id: string;
  salonId: string;
  clientId: string;
  collaboratorId: string;
  appointmentId: string;
  position: number;
  notes?: string;
  arrivedAt: string;
  createdAt: string;
  client?: QueueEntryClient;
  collaborator?: QueueEntryCollaborator;
  appointment?: QueueEntryAppointment;
}

export async function getQueueEntries(): Promise<QueueEntry[]> {
  return request<QueueEntry[]>('/queue');
}

export async function addToQueue(input: { clientId: string; serviceIds: string[]; notes?: string }): Promise<QueueEntry> {
  return request<QueueEntry>('/queue/add', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function deleteQueueEntry(id: string): Promise<void> {
  return request<void>(`/queue/${id}`, {
    method: 'DELETE',
  });
}
