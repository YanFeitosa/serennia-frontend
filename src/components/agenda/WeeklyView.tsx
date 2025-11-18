// src/components/agenda/WeeklyView.tsx
import React from 'react';
import { mockAppointments } from '../../data/appointments';
import { mockCollaborators } from '../../data/collaborators';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';

interface WeeklyViewProps {
  date: Date;
  onSelectDate: (date: Date) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ date, onSelectDate }) => {
  const today = new Date();
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

  const groupedByDay = days.map(d => {
    const key = getDateKey(d);
    const appointments = mockAppointments
      .filter(appt => appt.start.slice(0, 10) === key)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return { date: d, appointments };
  });

  return (
    <div className="bg-card rounded-xl shadow-md p-4 border border-border">
      <h2 className="text-xl font-bold mb-4 text-text">Visualização Semanal</h2>
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
                {appointments.map(appt => {
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

                  return (
                    <div
                      key={appt.id}
                      className="rounded-md px-2 py-1 text-[11px] border-l-4"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-status-info) 10%, transparent)',
                        borderColor: 'var(--color-status-info)',
                      }}
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
