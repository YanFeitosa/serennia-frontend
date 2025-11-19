// src/components/agenda/AppointmentCard.tsx
import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment, Client, Service } from '../../types';
import { Clock, User, Tag, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';
import { mockOrders } from '../../data/orders';

interface AppointmentCardProps {
  appointment: Appointment;
  client: Client;
  services: Service[];
  onEdit: (appointment: Appointment) => void;
  minHeight?: number;
}

const getLatestOrderForClient = (clientId: string) => {
  const ordersForClient = mockOrders.filter(order => order.clientId === clientId);
  if (ordersForClient.length === 0) return null;
  return [...ordersForClient].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
};

const AppointmentCard = ({ appointment, client, services, onEdit, minHeight }: AppointmentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const latestOrder = getLatestOrderForClient(client.id);

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const hasOpenOrder = latestOrder?.status === 'open';
  const hasOverdueOpenOrder =
    !!latestOrder &&
    latestOrder.status === 'open' &&
    new Date(latestOrder.createdAt).getTime() < todayAtMidnight.getTime();

  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--color-status-info)',
    minHeight,
  };

  const appointmentDay = new Date(appointment.start);
  appointmentDay.setHours(0, 0, 0, 0);
  const isPastDay = appointmentDay.getTime() < todayAtMidnight.getTime();

  if (appointment.status === 'not_paid') {
    cardStyle.backgroundColor = 'var(--color-status-error)';
  } else if (appointment.status === 'pending') {
    cardStyle.backgroundColor = 'var(--color-status-info)';
  } else if (appointment.status === 'in_progress') {
    if (isPastDay && hasOverdueOpenOrder) {
      // Agendamento atrasado com comanda aberta em dia anterior
      cardStyle.backgroundColor = 'var(--color-status-error)';
    } else {
      // Em andamento hoje (ou sem comanda aberta atrasada): laranja
      cardStyle.backgroundColor = 'var(--color-status-warning)';
    }
  } else if (appointment.status === 'completed') {
    cardStyle.backgroundColor = 'var(--color-status-success)';
  } else if (appointment.status === 'no_show') {
    cardStyle.backgroundColor = 'var(--color-status-muted)';
  }

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div 
      ref={cardRef}
      className={`p-3 rounded-lg shadow-sm text-sm text-text space-y-2 relative h-full cursor-pointer ${
        isExpanded ? 'overflow-visible' : 'overflow-hidden'
      }`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(true)}
    >
      {isHovered && (
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => onEdit(appointment)}
          className="absolute top-1 right-1 p-1 bg-card/80 rounded-full hover:bg-card z-10"
        >
          <Pencil className="w-4 h-4 text-text" />
        </Button>
      )}
      <div className="space-y-2">
        <div className="font-bold flex items-center space-x-2">
          <User className="w-4 h-4 text-text-muted" />
          <span className="break-words leading-snug">{client.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-text-muted" />
          <span className="break-words leading-snug">{services.map(s => s.name).join(', ')}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Clock className="w-4 h-4 text-text-muted" />
          <span>
            {new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' - '}
            {new Date(appointment.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {isExpanded && (() => {
        let label: string | null = null;
        let onClick: ((e: React.MouseEvent) => void) | null = null;

        if (appointment.status === 'pending') {
          // Cards azuis (pending) nunca mostram "Acessar comanda";
          // só permitem abrir nova comanda se não houver comanda aberta.
          if (!hasOpenOrder) {
            label = 'Abrir comanda';
            onClick = (e) => {
              e.stopPropagation();
              navigate('/comandas', {
                state: { newOrderClientId: client.id },
              });
            };
          }
        } else if (
          appointment.status === 'in_progress' ||
          appointment.status === 'completed' ||
          appointment.status === 'not_paid'
        ) {
          if (latestOrder) {
            label = 'Acessar comanda';
            onClick = (e) => {
              e.stopPropagation();
              navigate('/comandas', {
                state: { focusOrderId: latestOrder.id },
              });
            };
          }
        }

        if (!label || !onClick) return null;

        return (
          <div className="pt-2 flex justify-center">
            <Button size="sm" variant="secondary" onClick={onClick}>
              {label}
            </Button>
          </div>
        );
      })()}
      {!isExpanded && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--color-background) 85%, transparent), transparent)',
          }}
        />
      )}
    </div>
  );
};

export default AppointmentCard;
