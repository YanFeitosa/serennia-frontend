// src/data/notifications.ts
import type { Notification } from '../types';

export let mockNotifications: Notification[] = [];

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('serennia-notifications-changed'));
  }
};

export const addNotification = (notification: Notification) => {
  mockNotifications = [...mockNotifications, notification];
  notifyChange();
};

export const upsertNotification = (notification: Notification) => {
  mockNotifications = [
    ...mockNotifications.filter(n => n.id !== notification.id),
    notification,
  ];
  notifyChange();
};

export const markNotificationAsRead = (id: string) => {
  mockNotifications = mockNotifications.map(n =>
    n.id === id ? { ...n, read: true } : n,
  );
  notifyChange();
};

export const markAllNotificationsAsRead = () => {
  mockNotifications = mockNotifications.map(n =>
    n.read ? n : { ...n, read: true },
  );
  notifyChange();
};

export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter(n => !n.read);
};
