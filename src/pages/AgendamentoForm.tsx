// src/pages/AgendamentoForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Appointment } from '../types';
import { appointmentSchema, type AppointmentSchema } from '../lib/schemas';
import { mockAppointments, upsertMockAppointment } from '../data/appointments';
import { mockClients } from '../data/clients';
import { mockCollaborators } from '../data/collaborators';
import { mockServices } from '../data/services';
import { Button } from '../components/ui/Button';
import SearchableSelectPlain from '../components/ui/SearchableSelectPlain';
import MultiSelectPlain from '../components/ui/MultiSelectPlain';
import DateTimePickerPlain from '../components/ui/DateTimePickerPlain';
import { Textarea } from '../components/ui/Textarea';
import { useAuth } from '../contexts/AuthContext';

const toDateTimeLocal = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AgendamentoForm = () => {
  const { user } = useAuth();
  const location = useLocation();
  const query = useQuery();
  const clientIdFromQuery = query.get('clientId');
  const startFromQuery = query.get('start');
  const collaboratorIdFromQuery = query.get('collaboratorId');
  const state = location.state as { newClientId?: string } | null;
  const newClientIdFromState = state?.newClientId;
  const initialClientId = newClientIdFromState || clientIdFromQuery || '';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const appointment = id ? mockAppointments.find(a => a.id === id) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      reset({
        ...appointment,
        start: toDateTimeLocal(appointment.start),
      });
    } else {
      const initialStart = startFromQuery ?? toDateTimeLocal(new Date());
      reset({
        clientId: initialClientId,
        collaboratorId: collaboratorIdFromQuery || '',
        serviceIds: [],
        notes: '',
        start: initialStart,
      });
    }
  }, [appointment, reset, initialClientId, startFromQuery, collaboratorIdFromQuery]);

  useEffect(() => {
    if (appointment && appointment.status !== 'pending') {
      alert('Apenas agendamentos com status pendente podem ser editados.');
      navigate('/agenda');
    }
  }, [appointment, navigate]);

  const selectedCollaboratorId = watch('collaboratorId');
  const selectedCollaborator = mockCollaborators.find(c => c.id === selectedCollaboratorId);

  const availableServices = selectedCollaborator
    ? mockServices.filter(service => {
        const categories = selectedCollaborator.serviceCategories;
        if (!categories || categories.length === 0) return true;
        if (!service.category) return true;
        return categories.includes(service.category);
      })
    : [];

  useEffect(() => {
    // Ao trocar o profissional, limpamos os serviços selecionados
    setValue('serviceIds', []);
  }, [selectedCollaboratorId, setValue]);

  const onSubmit: SubmitHandler<AppointmentSchema> = (data) => {
    const startDate = new Date(data.start);
    if (isNaN(startDate.getTime())) {
      alert('Data e hora de início inválidas.');
      return;
    }

    const now = new Date();
    if (startDate.getTime() < now.getTime()) {
      alert('Não é possível criar um agendamento no passado.');
      return;
    }

    const selectedServices = mockServices.filter(service => data.serviceIds.includes(service.id));
    const totalDurationMinutes = selectedServices.reduce(
      (acc, service) => acc + service.duration + (service.bufferTime ?? 0),
      0
    );

    if (totalDurationMinutes <= 0) {
      alert('Não foi possível calcular a duração do agendamento.');
      return;
    }

    const endDate = new Date(startDate.getTime() + totalDurationMinutes * 60 * 1000);

    const hasOverlap = mockAppointments.some(existing => {
      if (appointment && existing.id === appointment.id) return false;
      if (existing.collaboratorId !== data.collaboratorId) return false;
      const existingStart = new Date(existing.start);
      const existingEnd = new Date(existing.end);
      return startDate < existingEnd && endDate > existingStart;
    });

    if (hasOverlap) {
      alert('Este profissional já possui um agendamento que conflita com este horário.');
      return;
    }

    const baseAppointment: Appointment = appointment
      ? { ...appointment }
      : {
          id: `appt-${Date.now()}`,
          salonId: user?.salonId ?? 'salon-1',
          clientId: data.clientId,
          collaboratorId: data.collaboratorId,
          serviceIds: data.serviceIds,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          status: 'pending',
          origin: 'reception',
          notes: data.notes,
        };

    const nextAppointment: Appointment = {
      ...baseAppointment,
      clientId: data.clientId,
      collaboratorId: data.collaboratorId,
      serviceIds: data.serviceIds,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      notes: data.notes,
    };

    return new Promise(resolve => {
      setTimeout(() => {
        upsertMockAppointment(nextAppointment);
        alert(appointment ? 'Agendamento atualizado!' : 'Agendamento criado!');
        navigate('/agenda');
        resolve(void 0);
      }, 1000);
    });
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">{appointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>
        <p className="text-text-muted">{appointment ? 'Altere os detalhes do agendamento.' : 'Preencha os dados para criar um novo agendamento.'}</p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-text">Cliente</label>
          <SearchableSelectPlain
            options={[
              ...mockClients.map(client => ({ value: client.id, label: client.name })),
              { value: '__add_client__', label: '+ adicionar cliente' },
            ]}
            value={watch('clientId')}
            onChange={(value: string) => {
              if (value === '__add_client__') {
                navigate('/clientes/novo', { state: { from: 'agendamento' } });
                return;
              }
              setValue('clientId', value);
            }}
            placeholder="Selecione um cliente"
          />
          {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>}
        </div>

        <div>
          <label htmlFor="collaboratorId" className="block text-sm font-medium text-text">Profissional</label>
          <SearchableSelectPlain
            options={mockCollaborators
              .filter(c => c.status === 'active' && c.role === 'professional')
              .map(collab => ({ value: collab.id, label: collab.name }))}
            value={watch('collaboratorId')}
            onChange={(value: string) => setValue('collaboratorId', value)}
            placeholder="Selecione um profissional"
          />
          {errors.collaboratorId && <p className="mt-1 text-sm text-red-600">{errors.collaboratorId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text">Serviços</label>
          {selectedCollaborator ? (
            <MultiSelectPlain
              options={availableServices.map(service => ({ value: service.id, label: service.name }))}
              selected={watch('serviceIds') || []}
              onChange={(value: string[]) => setValue('serviceIds', value)}
              placeholder={
                availableServices.length
                  ? 'Selecione os serviços'
                  : 'Nenhum serviço disponível para este profissional'
              }
            />
          ) : (
            <div className="px-3 py-2 border border-border rounded-md bg-muted text-text-muted text-sm">
              Selecione um profissional primeiro
            </div>
          )}
          {errors.serviceIds && <p className="mt-1 text-sm text-red-600">{errors.serviceIds.message}</p>}
        </div>

        <div>
          <label htmlFor="start" className="block text-sm font-medium text-text">Horário</label>
          <DateTimePickerPlain
            id="start"
            value={watch('start')}
            onChange={(value: string) => setValue('start', value)}
          />
          {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start.message}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text">Observações</label>
          <Textarea id="notes" {...register('notes')} rows={3} />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/agenda')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (appointment ? 'Salvar Alterações' : 'Criar Agendamento')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoForm;

