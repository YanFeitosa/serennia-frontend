// src/lib/api/messages.ts
import { request } from '../request';

export interface MessageTemplate {
  id: string;
  salonId: string;
  name: string;
  channel: 'whatsapp' | 'sms' | 'email';
  content: string;
  variables?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageLog {
  id: string;
  salonId: string;
  templateId?: string;
  appointmentId?: string;
  clientId: string;
  channel: 'whatsapp' | 'sms' | 'email';
  content: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface CreateTemplatePayload {
  name: string;
  channel: 'whatsapp' | 'sms' | 'email';
  content: string;
  variables?: any;
  isActive?: boolean;
}

export interface UpdateTemplatePayload {
  name?: string;
  channel?: 'whatsapp' | 'sms' | 'email';
  content?: string;
  variables?: any;
  isActive?: boolean;
}

export interface SendMessagePayload {
  templateId: string;
  clientId: string;
  appointmentId?: string;
  variables?: Record<string, string | number>;
}

export interface TestMessagePayload {
  phone: string;
  message: string;
  config?: {
    apiKey?: string;
    instanceId?: string;
    apiUrl?: string;
  };
}

export interface TestConnectionPayload {
  apiKey?: string;
  instanceId?: string;
  apiUrl?: string;
}

// GET /messages/templates
export async function getMessageTemplates(isActive?: boolean): Promise<MessageTemplate[]> {
  const params = isActive !== undefined ? `?isActive=${isActive}` : '';
  return request<MessageTemplate[]>(`/messages/templates${params}`);
}

// GET /messages/templates/:id
export async function getMessageTemplate(id: string): Promise<MessageTemplate> {
  return request<MessageTemplate>(`/messages/templates/${id}`);
}

// POST /messages/templates
export async function createMessageTemplate(
  payload: CreateTemplatePayload
): Promise<MessageTemplate> {
  return request<MessageTemplate>('/messages/templates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PATCH /messages/templates/:id
export async function updateMessageTemplate(
  id: string,
  payload: UpdateTemplatePayload
): Promise<MessageTemplate> {
  return request<MessageTemplate>(`/messages/templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// DELETE /messages/templates/:id
export async function deleteMessageTemplate(id: string): Promise<void> {
  return request<void>(`/messages/templates/${id}`, {
    method: 'DELETE',
  });
}

// POST /messages/send
export async function sendMessage(payload: SendMessagePayload): Promise<{
  success: boolean;
  logId: string;
  message: string;
}> {
  return request('/messages/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// GET /messages/logs
export async function getMessageLogs(params?: {
  clientId?: string;
  appointmentId?: string;
  status?: string;
  limit?: number;
}): Promise<MessageLog[]> {
  const queryParams = new URLSearchParams();
  if (params?.clientId) queryParams.append('clientId', params.clientId);
  if (params?.appointmentId) queryParams.append('appointmentId', params.appointmentId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  return request<MessageLog[]>(`/messages/logs${query ? `?${query}` : ''}`);
}

// POST /messages/test
export async function testMessage(payload: TestMessagePayload): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  return request('/messages/test', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// POST /messages/test-connection
export async function testWhatsAppMessageConnection(
  payload: TestConnectionPayload
): Promise<{
  success: boolean;
  error?: string;
}> {
  return request('/messages/test-connection', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// POST /appointments/:id/send-confirmation
export async function sendAppointmentConfirmation(
  appointmentId: string,
  templateId?: string
): Promise<{
  success: boolean;
  logId: string;
  message: string;
}> {
  return request(`/appointments/${appointmentId}/send-confirmation`, {
    method: 'POST',
    body: JSON.stringify({ templateId }),
  });
}

