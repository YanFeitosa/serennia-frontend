// src/components/agenda/DailyView.tsx
import type { Appointment } from '../../types';
import { mockAppointments } from '../../data/appointments';
import { mockCollaborators } from '../../data/collaborators';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';
import AppointmentCard from './AppointmentCard';

interface DailyViewProps {
  onEditAppointment: (appointment: Appointment) => void;
}

const DailyView = ({ onEditAppointment }: DailyViewProps) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex">
        {/* Time Scale */}
        <div className="w-16 text-right pr-2">
          {hours.map(hour => (
            <div key={hour} className="h-24 flex items-start justify-end">
              <span className="text-sm text-gray-500 -mt-3">{`${hour}:00`}</span>
            </div>
          ))}
        </div>

        {/* Agenda Grid */}
        <div className="flex-1 grid grid-cols-3 gap-px bg-gray-200 border-l border-gray-200">
          {mockCollaborators.filter(c => c.status === 'active').map(collab => (
            <div key={collab.id} className="relative bg-background">
              <div className="text-center font-semibold py-2 border-b border-gray-200 bg-white sticky top-0 z-10">{collab.name}</div>
              {mockAppointments
                .filter(appt => appt.collaboratorId === collab.id)
                .map(appt => {
                  const client = mockClients.find(c => c.id === appt.clientId);
                  const services = mockServices.filter(s => appt.serviceIds.includes(s.id));
                  if (!client || !services.length) return null;

                  const start = new Date(appt.start);
                  const end = new Date(appt.end);
                  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
                  const top = ((start.getHours() - 8) * 60 + start.getMinutes()) * (96 / 60); // 96px per hour (24*4)
                  const height = durationMinutes * (96 / 60);

                  return (
                    <div 
                      key={appt.id}
                      className="absolute w-full px-1"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <AppointmentCard appointment={appt} client={client} services={services} onEdit={onEditAppointment} />
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyView;
