// src/components/agenda/AppointmentCard.tsx
import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment, AppointmentStatus, Client, Service } from '../../types';
import { Clock, User, Tag, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';
import { updateAppointmentStatus, ensureOrderForAppointment } from '../../lib/api';

interface AppointmentCardProps {
  appointment: Appointment;
  client: Client;
  services: Service[];
  onEdit: (appointment: Appointment) => void;
  minHeight?: number;
  onStatusUpdated?: (appointment: Appointment) => void;
  onBringToFront?: () => void;
  onAfterAction?: () => void;
}

const AppointmentCard = ({ appointment, client, services, onEdit, minHeight, onStatusUpdated, onBringToFront, onAfterAction }: AppointmentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const now = new Date();
  const appointmentStart = new Date(appointment.start);
  const isBeforeStart = now.getTime() < appointmentStart.getTime();

  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--color-status-info)',
    minHeight,
  };

  if (appointment.status === 'not_paid') {
    cardStyle.backgroundColor = 'var(--color-status-error)';
  } else if (appointment.status === 'pending') {
    cardStyle.backgroundColor = 'var(--color-status-info)';
  } else if (appointment.status === 'in_progress') {
    cardStyle.backgroundColor = 'var(--color-status-warning)';
  } else if (appointment.status === 'completed') {
    cardStyle.backgroundColor = 'var(--color-status-success)';
  } else if (appointment.status === 'no_show') {
    cardStyle.backgroundColor = 'var(--color-status-muted)';
  }

  const changeStatus = async (
    e: React.MouseEvent,
    status: AppointmentStatus,
    confirmText: string,
  ) => {
    e.stopPropagation();
    if (!window.confirm(confirmText)) return;

    try {
      setIsChangingStatus(true);
      const updated = await updateAppointmentStatus(appointment.id, status);
      onStatusUpdated?.(updated);
      onAfterAction?.();
    } catch (err) {
      console.error('Error updating appointment status', err);
      const message = err instanceof Error ? err.message : 'Erro ao atualizar status do agendamento.';
      alert(message);
    } finally {
      setIsChangingStatus(false);
    }
  };

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
      className={`p-3 rounded-lg shadow-sm text-sm text-text space-y-2 relative cursor-pointer ${
        isExpanded ? 'min-h-full overflow-visible' : 'h-full overflow-hidden'
      }`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onBringToFront?.();
        setIsExpanded(true);
      }}
    >
      {isHovered && appointment.status === 'pending' && (
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

        const handleOpenOrder = async (e: React.MouseEvent) => {
          e.stopPropagation();
          try {
            setIsChangingStatus(true);
            const order = await ensureOrderForAppointment(appointment.id);
            let updatedAppointment = appointment;
            if (appointment.status === 'pending') {
              updatedAppointment = await updateAppointmentStatus(appointment.id, 'in_progress');
              onStatusUpdated?.(updatedAppointment);
            }
            navigate('/comandas', {
              state: { focusOrderId: order.id },
            });
            onAfterAction?.();
          } catch (err) {
            console.error('Error ensuring order for appointment', err);
            const message = err instanceof Error ? err.message : 'Erro ao abrir comanda.';
            alert(message);
          } finally {
            setIsChangingStatus(false);
          }
        };

        if (
          appointment.status === 'pending' ||
          appointment.status === 'in_progress' ||
          appointment.status === 'completed' ||
          appointment.status === 'not_paid'
        ) {
          label = appointment.status === 'pending' ? 'Abrir comanda' : 'Acessar comanda';
          onClick = handleOpenOrder;
        }

        let statusLabel: string | null = null;
        let statusHandler: ((e: React.MouseEvent) => void) | null = null;

        if (appointment.status === 'pending') {
          if (isBeforeStart) {
            statusLabel = 'cancelar';
            statusHandler = (e) =>
              changeStatus(e, 'canceled', 'Cancelar este agendamento?');
          } else {
            statusLabel = 'não apareceu';
            statusHandler = (e) =>
              changeStatus(e, 'no_show', 'Marcar este agendamento como "não apareceu"?');
          }
        }

        return (
          <div className="pt-2 space-y-2">
            {statusLabel && statusHandler && (
              <div className="flex justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isChangingStatus}
                  onClick={statusHandler}
                >
                  {statusLabel}
                </Button>
              </div>
            )}
            {label && onClick && (
              <div className="flex justify-center">
                <Button size="sm" variant="secondary" onClick={onClick}>
                  {label}
                </Button>
              </div>
            )}
          </div>
        );
      })()}
      {!isExpanded && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-b-lg z-10 flex items-end justify-center"
          style={{
            background: `linear-gradient(to top, ${cardStyle.backgroundColor}, transparent)`,
          }}
        >
          <span
            className={`text-xs text-white transition-all duration-150 ${
              isHovered ? 'opacity-90 translate-y-0' : 'opacity-70 translate-y-0.5'
            }`}
          >
            ▾
          </span>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
