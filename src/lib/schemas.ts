// src/lib/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  collaboratorId: z.string().min(1, 'Profissional é obrigatório'),
  serviceIds: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data e hora de início inválidas' }),
  notes: z.string().optional(),
  origin: z.enum(['whatsapp', 'app', 'totem', 'reception']).optional(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const registerSchema = z.object({
  salonName: z.string().min(2, { message: 'Nome do salão deve ter no mínimo 2 caracteres' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
