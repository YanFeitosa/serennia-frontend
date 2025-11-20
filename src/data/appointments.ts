// src/data/appointments.ts
import type { Appointment } from '../types';

const today = new Date();

const toISOWithOffset = (base: Date, dayOffset: number, hour: number, minute: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const initialMockAppointments: Appointment[] = [
  // Hoje
  {
    id: 'appt-1',
    salonId: 'salon-1',
    clientId: 'client-1',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1'],
    start: toISOWithOffset(today, 0, 9, 0),
    end: toISOWithOffset(today, 0, 10, 0),
    status: 'completed',
    origin: 'reception',
    notes: 'Corte e finalização.',
  },
  {
    id: 'appt-2',
    salonId: 'salon-1',
    clientId: 'client-2',
    collaboratorId: 'collab-2',
    serviceIds: ['service-5'],
    start: toISOWithOffset(today, 0, 10, 30),
    end: toISOWithOffset(today, 0, 11, 30),
    status: 'in_progress',
    origin: 'whatsapp',
  },
  {
    id: 'appt-3',
    salonId: 'salon-1',
    clientId: 'client-3',
    collaboratorId: 'collab-3',
    serviceIds: ['service-3'],
    start: toISOWithOffset(today, 0, 14, 0),
    end: toISOWithOffset(today, 0, 15, 0),
    status: 'pending',
    origin: 'app',
  },
  {
    id: 'appt-4',
    salonId: 'salon-1',
    clientId: 'client-4',
    collaboratorId: 'collab-1',
    serviceIds: ['service-4'],
    start: toISOWithOffset(today, 0, 16, 0),
    end: toISOWithOffset(today, 0, 17, 30),
    status: 'pending',
    origin: 'totem',
  },

  // Amanhã
  {
    id: 'appt-5',
    salonId: 'salon-1',
    clientId: 'client-5',
    collaboratorId: 'collab-2',
    serviceIds: ['service-2'],
    start: toISOWithOffset(today, 1, 9, 0),
    end: toISOWithOffset(today, 1, 9, 45),
    status: 'pending',
    origin: 'reception',
  },
  {
    id: 'appt-6',
    salonId: 'salon-1',
    clientId: 'client-6',
    collaboratorId: 'collab-3',
    serviceIds: ['service-6'],
    start: toISOWithOffset(today, 1, 11, 0),
    end: toISOWithOffset(today, 1, 12, 15),
    status: 'pending',
    origin: 'whatsapp',
  },
  {
    id: 'appt-9',
    salonId: 'salon-1',
    clientId: 'client-9',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1', 'service-3'],
    start: toISOWithOffset(today, 1, 15, 0),
    end: toISOWithOffset(today, 1, 17, 0),
    status: 'pending',
    origin: 'app',
  },

  // Daqui a 3 dias
  {
    id: 'appt-10',
    salonId: 'salon-1',
    clientId: 'client-10',
    collaboratorId: 'collab-2',
    serviceIds: ['service-5'],
    start: toISOWithOffset(today, 3, 10, 0),
    end: toISOWithOffset(today, 3, 11, 0),
    status: 'pending',
    origin: 'totem',
  },

  // Ontem e dias anteriores
  {
    id: 'appt-7',
    salonId: 'salon-1',
    clientId: 'client-7',
    collaboratorId: 'collab-1',
    serviceIds: ['service-7'],
    start: toISOWithOffset(today, -1, 15, 0),
    end: toISOWithOffset(today, -1, 16, 0),
    status: 'completed',
    origin: 'reception',
  },
  {
    id: 'appt-8',
    salonId: 'salon-1',
    clientId: 'client-8',
    collaboratorId: 'collab-2',
    serviceIds: ['service-2', 'service-3'],
    start: toISOWithOffset(today, -2, 10, 0),
    end: toISOWithOffset(today, -2, 12, 0),
    status: 'not_paid',
    origin: 'app',
  },
  {
    id: 'appt-11',
    salonId: 'salon-1',
    clientId: 'client-11',
    collaboratorId: 'collab-3',
    serviceIds: ['service-6'],
    start: toISOWithOffset(today, -3, 9, 30),
    end: toISOWithOffset(today, -3, 10, 45),
    status: 'no_show',
    origin: 'whatsapp',
  },
  {
    id: 'appt-12',
    salonId: 'salon-1',
    clientId: 'client-12',
    collaboratorId: 'collab-1',
    serviceIds: ['service-1'],
    start: toISOWithOffset(today, -4, 13, 0),
    end: toISOWithOffset(today, -4, 14, 0),
    status: 'completed',
    origin: 'reception',
  },
];

export let mockAppointments: Appointment[] = initialMockAppointments;

export const upsertMockAppointment = (appointment: Appointment) => {
  mockAppointments = [
    ...mockAppointments.filter(a => a.id !== appointment.id),
    appointment,
  ];
};

export const findAppointmentById = (id: string): Appointment | null => {
  return mockAppointments.find(a => a.id === id) ?? null;
};

export const updateAppointmentById = (
  id: string,
  updater: (appointment: Appointment) => Appointment,
): Appointment | null => {
  let updated: Appointment | null = null;
  mockAppointments = mockAppointments.map(appt => {
    if (appt.id !== id) return appt;
    updated = updater(appt);
    return updated;
  });
  return updated;
};

export const linkOrderToAppointment = (
  appointmentId: string,
  orderId: string,
): Appointment | null => {
  return updateAppointmentById(appointmentId, (appt) => ({ ...appt, orderId }));
};
