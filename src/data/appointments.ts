// src/data/appointments.ts
import type { Appointment } from '../types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const toISO = (date: Date, hours: number, minutes: number) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

// Helper to create dates for multiple days
const getDayOffset = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date;
};
const getDateKey = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const ensureNoOverlap = (appointments: Appointment[]): Appointment[] => {
  const groups: Record<string, Appointment[]> = {};

  for (const appt of appointments) {
    const key = `${appt.collaboratorId}-${getDateKey(appt.start)}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(appt);
  }

  const result: Appointment[] = [];

  Object.values(groups).forEach(group => {
    const sorted = [...group].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    let lastEnd: number | null = null;

    sorted.forEach(current => {
      let start = new Date(current.start);
      let end = new Date(current.end);

      if (lastEnd !== null && start.getTime() < lastEnd) {
        const duration = end.getTime() - start.getTime();
        start = new Date(lastEnd);
        end = new Date(start.getTime() + duration);
        current = { ...current, start: start.toISOString(), end: end.toISOString() };
      }

      lastEnd = end.getTime();
      result.push(current);
    });
  });

  return result;
};

const initialMockAppointments: Appointment[] = [
  // Today's appointments
  {
    id: 'appt-1',
    clientId: 'client-1',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1'],
    start: toISO(today, 9, 0),
    end: toISO(today, 10, 0),
    status: 'completed',
    origin: 'reception',
    price: 120,
  },
  {
    id: 'appt-2',
    clientId: 'client-2',
    collaboratorId: 'collab-2',
    serviceIds: ['service-2'],
    start: toISO(today, 10, 30),
    end: toISO(today, 12, 0),
    status: 'in_progress',
    origin: 'whatsapp',
    price: 80,
  },
  {
    id: 'appt-3',
    clientId: 'client-3',
    collaboratorId: 'collab-3',
    serviceIds: ['service-3'],
    start: toISO(today, 14, 0),
    end: toISO(today, 15, 15),
    status: 'pending',
    origin: 'app',
    price: 180,
  },
  {
    id: 'appt-4',
    clientId: 'client-4',
    collaboratorId: 'collab-5',
    serviceIds: ['service-13'],
    start: toISO(today, 15, 30),
    end: toISO(today, 16, 30),
    status: 'pending',
    origin: 'totem',
    price: 180,
  },
  {
    id: 'appt-5',
    clientId: 'client-5',
    collaboratorId: 'collab-6',
    serviceIds: ['service-5', 'service-22'],
    start: toISO(today, 16, 0),
    end: toISO(today, 17, 15),
    status: 'in_progress',
    origin: 'reception',
    price: 130,
  },
  {
    id: 'appt-31',
    clientId: 'client-2',
    collaboratorId: 'collab-1',
    serviceIds: ['service-10'],
    start: toISO(today, 17, 30),
    end: toISO(today, 18, 30),
    status: 'pending',
    origin: 'app',
    price: 100,
  },
  
  // Tomorrow's appointments
  {
    id: 'appt-6',
    clientId: 'client-1',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1', 'service-10'],
    start: toISO(tomorrow, 11, 0),
    end: toISO(tomorrow, 13, 0),
    status: 'pending',
    origin: 'totem',
    price: 220,
  },
  {
    id: 'appt-7',
    clientId: 'client-6',
    collaboratorId: 'collab-8',
    serviceIds: ['service-6'],
    start: toISO(tomorrow, 9, 0),
    end: toISO(tomorrow, 11, 0),
    status: 'pending',
    origin: 'whatsapp',
    price: 280,
  },
  {
    id: 'appt-8',
    clientId: 'client-7',
    collaboratorId: 'collab-9',
    serviceIds: ['service-17'],
    start: toISO(tomorrow, 14, 0),
    end: toISO(tomorrow, 15, 0),
    status: 'pending',
    origin: 'app',
    price: 180,
  },
  {
    id: 'appt-9',
    clientId: 'client-8',
    collaboratorId: 'collab-3',
    serviceIds: ['service-19'],
    start: toISO(tomorrow, 10, 0),
    end: toISO(tomorrow, 11, 30),
    status: 'pending',
    origin: 'reception',
    price: 220,
  },
  {
    id: 'appt-10',
    clientId: 'client-9',
    collaboratorId: 'collab-2',
    serviceIds: ['service-11'],
    start: toISO(tomorrow, 15, 0),
    end: toISO(tomorrow, 16, 30),
    status: 'pending',
    origin: 'totem',
    price: 120,
  },

  // Day +2 appointments
  {
    id: 'appt-11',
    clientId: 'client-10',
    collaboratorId: 'collab-1',
    serviceIds: ['service-7'],
    start: toISO(getDayOffset(2), 9, 0),
    end: toISO(getDayOffset(2), 11, 30),
    status: 'pending',
    origin: 'whatsapp',
    price: 350,
  },
  {
    id: 'appt-12',
    clientId: 'client-11',
    collaboratorId: 'collab-7',
    serviceIds: ['service-15'],
    start: toISO(getDayOffset(2), 10, 0),
    end: toISO(getDayOffset(2), 11, 30),
    status: 'pending',
    origin: 'app',
    price: 150,
  },
  {
    id: 'appt-13',
    clientId: 'client-12',
    collaboratorId: 'collab-5',
    serviceIds: ['service-14'],
    start: toISO(getDayOffset(2), 14, 0),
    end: toISO(getDayOffset(2), 15, 30),
    status: 'pending',
    origin: 'reception',
    price: 350,
  },
  {
    id: 'appt-14',
    clientId: 'client-13',
    collaboratorId: 'collab-6',
    serviceIds: ['service-5'],
    start: toISO(getDayOffset(2), 16, 0),
    end: toISO(getDayOffset(2), 16, 45),
    status: 'pending',
    origin: 'totem',
    price: 80,
  },

  // Day +3 appointments
  {
    id: 'appt-15',
    clientId: 'client-14',
    collaboratorId: 'collab-8',
    serviceIds: ['service-8'],
    start: toISO(getDayOffset(3), 9, 0),
    end: toISO(getDayOffset(3), 12, 0),
    status: 'pending',
    origin: 'whatsapp',
    price: 450,
  },
  {
    id: 'appt-16',
    clientId: 'client-15',
    collaboratorId: 'collab-9',
    serviceIds: ['service-4'],
    start: toISO(getDayOffset(3), 13, 0),
    end: toISO(getDayOffset(3), 14, 0),
    status: 'pending',
    origin: 'app',
    price: 250,
  },
  {
    id: 'appt-17',
    clientId: 'client-2',
    collaboratorId: 'collab-3',
    serviceIds: ['service-20'],
    start: toISO(getDayOffset(3), 15, 0),
    end: toISO(getDayOffset(3), 16, 0),
    status: 'pending',
    origin: 'reception',
    price: 280,
  },

  // Day +4 appointments
  {
    id: 'appt-18',
    clientId: 'client-3',
    collaboratorId: 'collab-1',
    serviceIds: ['service-23'],
    start: toISO(getDayOffset(4), 10, 0),
    end: toISO(getDayOffset(4), 11, 30),
    status: 'pending',
    origin: 'totem',
    price: 200,
  },
  {
    id: 'appt-19',
    clientId: 'client-5',
    collaboratorId: 'collab-2',
    serviceIds: ['service-18'],
    start: toISO(getDayOffset(4), 14, 0),
    end: toISO(getDayOffset(4), 15, 0),
    status: 'pending',
    origin: 'whatsapp',
    price: 110,
  },
  {
    id: 'appt-20',
    clientId: 'client-7',
    collaboratorId: 'collab-5',
    serviceIds: ['service-13', 'service-12'],
    start: toISO(getDayOffset(4), 16, 0),
    end: toISO(getDayOffset(4), 17, 30),
    status: 'pending',
    origin: 'app',
    price: 240,
  },

  // Day +5 appointments (weekend)
  {
    id: 'appt-21',
    clientId: 'client-1',
    collaboratorId: 'collab-9',
    serviceIds: ['service-25'],
    start: toISO(getDayOffset(5), 9, 0),
    end: toISO(getDayOffset(5), 13, 0),
    status: 'pending',
    origin: 'reception',
    price: 800,
  },
  {
    id: 'appt-22',
    clientId: 'client-8',
    collaboratorId: 'collab-6',
    serviceIds: ['service-5', 'service-22'],
    start: toISO(getDayOffset(5), 10, 0),
    end: toISO(getDayOffset(5), 11, 15),
    status: 'pending',
    origin: 'totem',
    price: 130,
  },
  {
    id: 'appt-23',
    clientId: 'client-11',
    collaboratorId: 'collab-8',
    serviceIds: ['service-6', 'service-10'],
    start: toISO(getDayOffset(5), 14, 0),
    end: toISO(getDayOffset(5), 17, 0),
    status: 'pending',
    origin: 'whatsapp',
    price: 380,
  },

  // Past appointments (yesterday)
  {
    id: 'appt-24',
    clientId: 'client-4',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1'],
    start: toISO(getDayOffset(-1), 9, 0),
    end: toISO(getDayOffset(-1), 10, 0),
    status: 'completed',
    origin: 'reception',
    price: 120,
  },
  {
    id: 'appt-25',
    clientId: 'client-6',
    collaboratorId: 'collab-3',
    serviceIds: ['service-3'],
    start: toISO(getDayOffset(-1), 11, 0),
    end: toISO(getDayOffset(-1), 12, 15),
    status: 'completed',
    origin: 'app',
    price: 180,
  },
  {
    id: 'appt-26',
    clientId: 'client-9',
    collaboratorId: 'collab-2',
    serviceIds: ['service-2', 'service-11'],
    start: toISO(getDayOffset(-1), 14, 0),
    end: toISO(getDayOffset(-1), 16, 30),
    status: 'completed',
    origin: 'whatsapp',
    price: 200,
  },
  {
    id: 'appt-27',
    clientId: 'client-12',
    collaboratorId: 'collab-7',
    serviceIds: ['service-16'],
    start: toISO(getDayOffset(-1), 15, 0),
    end: toISO(getDayOffset(-1), 15, 45),
    status: 'canceled',
    origin: 'totem',
    price: 200,
  },

  // Past appointments (day -2)
  {
    id: 'appt-28',
    clientId: 'client-13',
    collaboratorId: 'collab-5',
    serviceIds: ['service-13'],
    start: toISO(getDayOffset(-2), 10, 0),
    end: toISO(getDayOffset(-2), 11, 0),
    status: 'completed',
    origin: 'reception',
    price: 180,
  },
  {
    id: 'appt-29',
    clientId: 'client-14',
    collaboratorId: 'collab-9',
    serviceIds: ['service-17'],
    start: toISO(getDayOffset(-2), 13, 0),
    end: toISO(getDayOffset(-2), 14, 0),
    status: 'completed',
    origin: 'app',
    price: 180,
  },
  {
    id: 'appt-30',
    clientId: 'client-15',
    collaboratorId: 'collab-6',
    serviceIds: ['service-5'],
    start: toISO(getDayOffset(-2), 16, 0),
    end: toISO(getDayOffset(-2), 16, 45),
    status: 'no_show',
    origin: 'whatsapp',
    price: 80,
  },
];

export let mockAppointments: Appointment[] = ensureNoOverlap(initialMockAppointments);

export const upsertMockAppointment = (appointment: Appointment) => {
  mockAppointments = ensureNoOverlap([
    ...mockAppointments.filter(a => a.id !== appointment.id),
    appointment,
  ]);
};
