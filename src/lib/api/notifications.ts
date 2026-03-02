import type { Notification } from '../../types';
import { request } from '../request';

export async function getNotifications(): Promise<Notification[]> {
  const res = await request<{ data: Notification[]; pagination: any } | Notification[]>('/notifications');
  return Array.isArray(res) ? res : res.data;
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  return request<Notification>(`/notifications/${id}/read`, {
    method: 'POST',
  });
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/notifications/read-all', {
    method: 'POST',
  });
}

