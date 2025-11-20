import type { Collaborator } from '../../types';
import { request } from '../request';

export interface CollaboratorPayload {
  name: string;
  role: Collaborator['role'];
  status?: Collaborator['status'];
  phone?: string;
  email?: string;
  commissionRate?: number;
  serviceCategories?: string[];
}

export async function getCollaborators(): Promise<Collaborator[]> {
  return request<Collaborator[]>('/collaborators');
}

export async function getCollaboratorById(id: string): Promise<Collaborator> {
  return request<Collaborator>(`/collaborators/${id}`);
}

export async function createCollaborator(
  input: CollaboratorPayload,
): Promise<Collaborator> {
  return request<Collaborator>('/collaborators', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCollaborator(
  id: string,
  input: Partial<CollaboratorPayload>,
): Promise<Collaborator> {
  return request<Collaborator>(`/collaborators/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
