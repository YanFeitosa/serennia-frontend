// src/pages/Notificacoes.tsx
import React, { useEffect, useState } from 'react';
import type { Notification } from '../../types';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

const Notificacoes: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotifications();
      setItems(data);
    } catch (err: any) {
      console.error('Error loading notifications', err);
      setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_NOTIFICATIONS_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read', err);
    }
  };

  const unreadCount = items.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text">Notificações</h1>
        <p className="text-text-muted">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text">Notificações</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text">Notificações</h1>
        <p className="text-text-muted">Nenhuma notificação no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-text-muted">Você tem {unreadCount} notificação(ões) não lida(s).</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="ghost" onClick={handleMarkAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(notification => (
            <div
              key={notification.id}
              className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 rounded-xl border border-border px-3 md:px-4 py-3 bg-card ${
                notification.read ? 'opacity-70' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm text-text">{notification.message}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(notification.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {!notification.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="self-end sm:self-auto whitespace-nowrap"
                >
                  Marcar como lida
                </Button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notificacoes;
