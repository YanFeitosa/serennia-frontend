// src/components/agenda/AppointmentCard.tsx
import { useState } from 'react';
import type { Appointment, Client, Service } from '../../types';
import { Clock, User, Tag, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppointmentCardProps {
  appointment: Appointment;
  client: Client;
  services: Service[];
  onEdit: (appointment: Appointment) => void;
}

const AppointmentCard = ({ appointment, client, services, onEdit }: AppointmentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    backgroundColor: services[0]?.color || '#E5E7EB', // Default gray
    borderLeft: `4px solid ${services[0]?.color ? darkenColor(services[0].color, -20) : '#9CA3AF'}`,
  };

  return (
    <div 
      className="p-3 rounded-lg shadow-sm text-sm text-text space-y-2 relative h-full"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      <div className="font-bold flex items-center space-x-2">
        <User className="w-4 h-4 text-text-muted" />
        <span>{client.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Tag className="w-4 h-4 text-text-muted" />
        <span>{services.map(s => s.name).join(', ')}</span>
      </div>
      <div className="flex items-center space-x-2 text-xs">
        <Clock className="w-4 h-4 text-text-muted" />
        <span>{new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

// Helper to darken the border color
function darkenColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

export default AppointmentCard;
