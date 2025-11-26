// src/pages/AgendamentoForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Appointment, Client, Collaborator, Service } from '../../types';
import { appointmentSchema, type AppointmentSchema } from '../../lib/schemas';
import { Button } from '../../components/ui/Button';
import SearchableSelectPlain from '../../components/ui/SearchableSelectPlain';
import MultiSelectPlain from '../../components/ui/MultiSelectPlain';
import DateTimePickerPlain from '../../components/ui/DateTimePickerPlain';
import { Textarea } from '../../components/ui/Textarea';
import {
  getAppointmentById,
  createAppointment,
  updateAppointment,
  getClients,
  getCollaborators,
  getServices,
} from '../../lib/api';

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
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const loadBaseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [clientsRes, collaboratorsRes, servicesRes] = await Promise.all([
          getClients(),
          getCollaborators(),
          getServices(),
        ]);

        setClients(clientsRes);
        setCollaborators(collaboratorsRes);
        setServices(servicesRes);
      } catch (err) {
        console.error('Error loading appointment form data', err);
        setError('Erro ao carregar dados para o agendamento.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBaseData();
  }, []);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!id || id === 'novo') {
        setAppointment(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        console.error('Error loading appointment', err);
        setError('Erro ao carregar agendamento.');
        navigate('/app/agenda');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();
  }, [id, navigate]);

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
      navigate('/app/agenda');
    }
  }, [appointment, navigate]);

  const selectedCollaboratorId = watch('collaboratorId');
  const selectedCollaborator = collaborators.find(c => c.id === selectedCollaboratorId);

  const availableServices = selectedCollaborator
    ? services.filter(service => {
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

  const onSubmit: SubmitHandler<AppointmentSchema> = async (data) => {
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
    try {
      const payload = {
        clientId: data.clientId,
        collaboratorId: data.collaboratorId,
        serviceIds: data.serviceIds,
        start: startDate.toISOString(),
        notes: data.notes,
        origin: 'reception' as const,
      };

      if (appointment) {
        await updateAppointment(appointment.id, payload);
      } else {
        await createAppointment(payload);
      }

      navigate('/app/agenda');
    } catch (err) {
      console.error('Error saving appointment', err);
      const message = err instanceof Error ? err.message : 'Erro ao salvar agendamento.';
      alert(message);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">{appointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>
        <p className="text-text-muted">{appointment ? 'Altere os detalhes do agendamento.' : 'Preencha os dados para criar um novo agendamento.'}</p>
      </header>
      {(isLoading || error) && (
        <div className="text-sm text-text-muted">
          {isLoading ? 'Carregando dados do agendamento...' : error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-text">Cliente</label>
          <SearchableSelectPlain
            options={[
              ...clients.map(client => ({ value: client.id, label: client.name })),
              { value: '__add_client__', label: '+ adicionar cliente' },
            ]}
            value={watch('clientId')}
            onChange={(value: string) => {
              if (value === '__add_client__') {
                navigate('/app/clientes/novo', { state: { from: 'agendamento' } });
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
            options={collaborators
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
          <Button type="button" variant="ghost" onClick={() => navigate('/app/agenda')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (appointment ? 'Salvar Alterações' : 'Criar Agendamento')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoForm;

