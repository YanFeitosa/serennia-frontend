// src/components/agenda/WeeklyView.tsx
import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { mockAppointments } from '../../data/appointments';
import { mockCollaborators } from '../../data/collaborators';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';
import type { Appointment, AppointmentStatus } from '../../types';

interface WeeklyViewProps {
  date: Date;
  onSelectDate: (date: Date) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, onSelectDate }) => {
  const today = new Date();
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
  const activeCollaborators = mockCollaborators.filter(
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

  const getDateKey = (date: Date) => date.toISOString().slice(0, 10);
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

  const groupedByDay = days.map(d => {
    const key = getDateKey(d);
    const appointments = mockAppointments
      .filter(
        (appt: Appointment) =>
          appt.start.slice(0, 10) === key &&
          (!selectedCollaboratorId || appt.collaboratorId === selectedCollaboratorId),
      )
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
    return { date: d, appointments };
  });

  return (
    <div className="bg-card rounded-xl shadow-md p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text">Visualização Semanal</h2>
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
      <div className="grid grid-cols-7 gap-2 text-xs mb-2">
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
                  const client = mockClients.find(c => c.id === appt.clientId);
                  const collaborator = mockCollaborators.find(c => c.id === appt.collaboratorId);
                  const services = mockServices.filter(s => appt.serviceIds.includes(s.id));
                  if (!client || !collaborator || services.length === 0) return null;
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
                        {services.map(s => s.name).join(', ')}
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
  );
};

export default WeeklyView;
