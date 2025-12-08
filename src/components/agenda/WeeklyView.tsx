// src/components/agenda/WeeklyView.tsx
import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Appointment, AppointmentStatus, Client, Collaborator, Service } from '../../types';
import { getAppointments, getClients, getCollaborators, getServices } from '../../lib/api';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

interface WeeklyViewProps {
  date: Date;
  onSelectDate: (date: Date) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, onSelectDate }) => {
  const today = new Date();
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeCollaborators = collaborators.filter(
    c => c.status === 'active' && c.role === 'professional',
  );
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getStatusToken = (
    status: AppointmentStatus,
  ): 'info' | 'warning' | 'success' | 'error' | 'muted' => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'no_show':
        return 'muted';
      case 'not_paid':
        return 'error';
      case 'canceled':
        // Cancelados não devem aparecer na agenda, mas mantemos um fallback neutro
        return 'info';
      case 'pending':
      default:
        return 'info';
    }
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    const token = getStatusToken(status);
    const colorVar = {
      info: 'var(--color-status-info)',
      warning: 'var(--color-status-warning)',
      success: 'var(--color-status-success)',
      error: 'var(--color-status-error)',
      muted: 'var(--color-status-muted)',
    }[token];
    return {
      backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)`,
      borderColor: colorVar,
    } as CSSProperties;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        end.setHours(23, 59, 59, 999);

        const [appointmentsRes, clientsRes, collaboratorsRes, servicesRes] =
          await Promise.all([
            getAppointments({
              dateFrom: start.toISOString(),
              dateTo: end.toISOString(),
              collaboratorId: selectedCollaboratorId || undefined,
            }),
            getClients(),
            getCollaborators(),
            getServices(),
          ]);

        setAppointments(appointmentsRes);
        setClients(clientsRes);
        setCollaborators(collaboratorsRes);
        setServices(servicesRes);
      } catch (err) {
        console.error('Error loading weekly view data', err);
        setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_APPOINTMENTS_FAILED));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [date, selectedCollaboratorId]);

  const groupedByDay = days.map(d => {
    const key = getDateKey(d);
    const appointmentsForDay = appointments
      .filter(
        (appt: Appointment) =>
          getDateKey(new Date(appt.start)) === key &&
          appt.status !== 'canceled' &&
          appt.status !== 'no_show' &&
          (!selectedCollaboratorId || appt.collaboratorId === selectedCollaboratorId),
      )
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
    return { date: d, appointments: appointmentsForDay };
  });

  return (
    <div className="bg-card rounded-xl shadow-md p-3 md:p-4 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-text">Visualização Semanal</h2>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-text-muted">Profissional:</span>
          <select
            value={selectedCollaboratorId}
            onChange={(e) => setSelectedCollaboratorId(e.target.value)}
            className="border border-border bg-card text-text text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos</option>
            {activeCollaborators.map(collab => (
              <option key={collab.id} value={collab.id}>
                {collab.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {(isLoading || error) && (
        <div className="mb-2 text-[11px] text-text-muted">
          {isLoading ? 'Carregando agendamentos...' : error}
        </div>
      )}
      <div className="overflow-x-auto -mx-3 md:mx-0">
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-xs mb-2 min-w-[600px] px-3 md:px-0">
        {groupedByDay.map(({ date, appointments }) => {
          const label = `${weekdayLabels[date.getDay()]} ${date
            .getDate()
            .toString()
            .padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          const isToday = getDateKey(date) === getDateKey(today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`border border-border rounded-lg bg-background flex flex-col text-left ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="px-2 py-1 border-b border-border text-[11px] font-semibold text-text">
                {label}
              </div>
              <div className="flex-1 p-1 space-y-1 overflow-y-auto max-h-[520px]">
                {appointments.length === 0 && (
                  <div className="text-[11px] text-text-muted">Sem agendamentos</div>
                )}
                {appointments.map((appt: Appointment) => {
                  const client = clients.find(c => c.id === appt.clientId);
                  const collaborator = collaborators.find(c => c.id === appt.collaboratorId);
                  const servicesForAppointment = services.filter((s) =>
                    appt.serviceIds.includes(s.id),
                  );
                  if (!client || !collaborator || servicesForAppointment.length === 0)
                    return null;
                  const start = new Date(appt.start);
                  const end = new Date(appt.end);
                  const timeLabel = `${start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                  const style = getStatusStyle(appt.status as AppointmentStatus);

                  return (
                    <div
                      key={appt.id}
                      className="rounded-md px-2 py-1 text-[11px] border-l-4"
                      style={style}
                    >
                      <div className="font-semibold text-text">
                        {client.name}
                      </div>
                      <div className="text-text-muted">
                        {collaborator.name}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {servicesForAppointment.map((s) => s.name).join(', ')}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {timeLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
