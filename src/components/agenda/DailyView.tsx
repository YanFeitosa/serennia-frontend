// src/components/agenda/DailyView.tsx
import type { Appointment } from '../../types';
import { mockAppointments } from '../../data/appointments';
import { mockCollaborators } from '../../data/collaborators';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';
import AppointmentCard from './AppointmentCard';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DailyViewProps {
  date: Date;
  onEditAppointment: (appointment: Appointment) => void;
}

const toDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const DailyView = ({ date, onEditAppointment }: DailyViewProps) => {
  const navigate = useNavigate();
  const activeCollaborators = mockCollaborators.filter(c => c.status === 'active');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const START_HOUR = 8;
  const END_HOUR = 21; // exclusive
  const MINUTES_PER_SLOT = 30;
  const PIXELS_PER_MINUTE = 2; // escala vertical: 120px por hora
  const SLOT_HEIGHT = MINUTES_PER_SLOT * PIXELS_PER_MINUTE;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  const TOTAL_SLOTS = TOTAL_MINUTES / MINUTES_PER_SLOT;

  const COLUMN_WIDTH = 220;
  const HEADER_HEIGHT = 48; // px aproximado do cabeçalho do profissional
  const MIN_APPOINTMENT_HEIGHT = 80; // px para evitar corte de texto
  const columnHeight = TOTAL_MINUTES * PIXELS_PER_MINUTE + HEADER_HEIGHT;

  const selectedDateKey = date.toISOString().slice(0, 10);
  const timeSlots = Array.from({ length: TOTAL_SLOTS }, (_, index) => index);
  const now = new Date();

  return (
    <div
      className="bg-card rounded-xl shadow-md p-4 border border-border"
      style={{ minHeight: columnHeight + 32 }}
    >
      {/* Controles de rolagem horizontal */}
      <div className="flex justify-end items-center mb-2 gap-2">
        <button
          type="button"
          className="px-2 py-1 text-xs rounded border border-border text-text-muted hover:bg-secondary hover:text-text transition-colors flex items-center gap-1"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs rounded border border-border text-text-muted hover:bg-secondary hover:text-text transition-colors flex items-center gap-1"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
            }
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex">
        {/* Time Scale */}
        <div className="w-16 text-right pr-2 border-r border-border" style={{ paddingTop: HEADER_HEIGHT }}>
          {timeSlots.map(slot => {
            const totalMinutes = slot * MINUTES_PER_SLOT;
            const hour = START_HOUR + Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const label = `${hour.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}`;

            return (
              <div
                key={slot}
                style={{ height: `${SLOT_HEIGHT}px` }}
                className="flex items-start justify-end"
              >
                <span className="text-[11px] text-text-muted -mt-2">{label}</span>
              </div>
            );
          })}
        </div>
        {/* Agenda Grid */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className="relative flex overflow-x-auto"
          >
            {activeCollaborators.map((collab, index) => {
              const appointmentsForCollab = mockAppointments.filter(
                appt => appt.collaboratorId === collab.id && appt.start.slice(0, 10) === selectedDateKey
              );

              return (
                <div
                  key={collab.id}
                  className={`relative bg-background${index > 0 ? ' border-l border-border' : ''}`}
                  style={{ flex: `0 0 ${COLUMN_WIDTH}px`, height: `${columnHeight}px` }}
                >
                  <div className="text-center font-semibold py-2 border-b border-border bg-card sticky top-0 z-10 text-text">{collab.name}</div>

                  {/* Slots vazios clicáveis para criar novo agendamento */}
                  {timeSlots.map(slotIndex => {
                    const slotStartMinutes = slotIndex * MINUTES_PER_SLOT;
                    const slotEndMinutes = slotStartMinutes + MINUTES_PER_SLOT;

                    const hasAppointmentInSlot = appointmentsForCollab.some(appt => {
                      const apptStart = new Date(appt.start);
                      const apptEnd = new Date(appt.end);
                      const apptStartMinutes = (apptStart.getHours() - START_HOUR) * 60 + apptStart.getMinutes();
                      const apptEndMinutes = (apptEnd.getHours() - START_HOUR) * 60 + apptEnd.getMinutes();
                      return apptStartMinutes < slotEndMinutes && apptEndMinutes > slotStartMinutes;
                    });

                    if (hasAppointmentInSlot) {
                      return null;
                    }

                    const top = HEADER_HEIGHT + slotStartMinutes * PIXELS_PER_MINUTE;
                    const slotDate = new Date(date);
                    const hour = START_HOUR + Math.floor(slotStartMinutes / 60);
                    const minutes = slotStartMinutes % 60;
                    slotDate.setHours(hour, minutes, 0, 0);
                    if (slotDate.getTime() <= now.getTime()) {
                      return null;
                    }
                    const startStr = toDateTimeLocal(slotDate);

                    return (
                      <button
                        key={`slot-${collab.id}-${slotIndex}`}
                        type="button"
                        className="absolute left-0 w-full px-1 group z-0"
                        style={{ top: `${top}px`, height: `${SLOT_HEIGHT}px` }}
                        onClick={() => {
                          navigate(`/agenda/novo?start=${encodeURIComponent(startStr)}&collaboratorId=${encodeURIComponent(collab.id)}`);
                        }}
                      >
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          Adicionar
                        </div>
                      </button>
                    );
                  })}

                  {/* Agendamentos existentes */}
                  {appointmentsForCollab.map(appt => {
                    const client = mockClients.find(c => c.id === appt.clientId);
                    const services = mockServices.filter(s => appt.serviceIds.includes(s.id));
                    if (!client || !services.length) return null;

                    const start = new Date(appt.start);
                    const end = new Date(appt.end);
                    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
                    const minutesFromStartOfDay = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
                    const top = HEADER_HEIGHT + minutesFromStartOfDay * PIXELS_PER_MINUTE;
                    const height = Math.max(durationMinutes * PIXELS_PER_MINUTE, MIN_APPOINTMENT_HEIGHT);

                    return (
                      <div
                        key={appt.id}
                        className="absolute w-full px-1 z-10"
                        style={{ top: `${top}px` }}
                      >
                        <AppointmentCard
                          appointment={appt}
                          client={client}
                          services={services}
                          onEdit={onEditAppointment}
                          minHeight={height}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
