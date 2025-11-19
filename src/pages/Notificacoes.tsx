// src/pages/Notificacoes.tsx
import React, { useEffect, useState } from 'react';
import type { Notification } from '../types';
import { mockNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../data/notifications';
import { Button } from '../components/ui/Button';

const Notificacoes: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([...mockNotifications]);

  useEffect(() => {
    const update = () => {
      setItems([...mockNotifications]);
    };

    update();

    if (typeof window === 'undefined') return;
    window.addEventListener('serenna-notifications-changed', update);
    return () => window.removeEventListener('serenna-notifications-changed', update);
  }, []);

  const unreadCount = items.filter(n => !n.read).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-text-muted">Você tem {unreadCount} notificação(ões) não lida(s).</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="ghost" onClick={() => markAllNotificationsAsRead()}>
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
              className={`flex items-start justify-between rounded-xl border border-border px-4 py-3 bg-card ${
                notification.read ? 'opacity-70' : ''
              }`}
            >
              <div>
                <p className="text-sm text-text">{notification.message}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(notification.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {!notification.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markNotificationAsRead(notification.id)}
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
