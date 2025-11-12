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

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    clientId: 'client-1',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1'],
    start: toISO(today, 9, 0),
    end: toISO(today, 10, 0),
    status: 'confirmed',
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
    clientId: 'client-1',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1', 'service-2'],
    start: toISO(tomorrow, 11, 0),
    end: toISO(tomorrow, 13, 30),
    status: 'confirmed',
    origin: 'totem',
    price: 200,
  },
];
