import type { Collaborator } from '../../types';
import { request } from '../request';

export interface CollaboratorPayload {
  name: string;
  role: Collaborator['role'];
  status?: Collaborator['status'];
  phone?: string;
  email?: string;
  cpf?: string;
  avatarUrl?: string;
  commissionRate?: number;
  serviceCategories?: string[];
}

export async function getCollaborators(): Promise<Collaborator[]> {
  const res = await request<{ data: Collaborator[]; pagination: any } | Collaborator[]>('/collaborators');
  return Array.isArray(res) ? res : res.data;
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

export async function deleteCollaborator(id: string): Promise<void> {
  return request<void>(`/collaborators/${id}`, {
    method: 'DELETE',
  });
}
