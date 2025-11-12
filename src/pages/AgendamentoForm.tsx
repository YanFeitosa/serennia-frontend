// src/pages/AgendamentoForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { appointmentSchema, type AppointmentSchema } from '../lib/schemas.ts';
import { mockAppointments } from '../data/appointments.ts';
import { mockClients } from '../data/clients.ts';
import { mockCollaborators } from '../data/collaborators.ts';
import { mockServices } from '../data/services.ts';
import { Button } from '../components/ui/Button.tsx';
import { SearchableSelect } from '../components/ui/SearchableSelect.tsx';
import { MultiSelect } from '../components/ui/MultiSelect.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';

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
}

const AgendamentoForm = () => {
  const query = useQuery();
  const clientId = query.get('clientId');
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
      reset({
        clientId: clientId || '',
        collaboratorId: '',
        serviceIds: [],
        notes: '',
        start: toDateTimeLocal(new Date()),
      });
    }
  }, [appointment, reset]);

  const onSubmit: SubmitHandler<AppointmentSchema> = (data) => {
    console.log('Appointment data:', data);
    return new Promise(resolve => {
      setTimeout(() => {
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
        <p className="text-gray-500">{appointment ? 'Altere os detalhes do agendamento.' : 'Preencha os dados para criar um novo agendamento.'}</p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Cliente</label>
          <SearchableSelect
            options={mockClients.map(client => ({ value: client.id, label: client.name }))}
            value={watch('clientId')}
            onChange={value => setValue('clientId', value)}
            placeholder="Selecione um cliente"
          />
          {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>}
        </div>

        <div>
          <label htmlFor="collaboratorId" className="block text-sm font-medium text-gray-700">Profissional</label>
          <Select id="collaboratorId" {...register('collaboratorId')}>
            <option value="">Selecione um profissional</option>
            {mockCollaborators.filter(c => c.status === 'active').map(collab => (
              <option key={collab.id} value={collab.id}>{collab.name}</option>
            ))}
          </Select>
          {errors.collaboratorId && <p className="mt-1 text-sm text-red-600">{errors.collaboratorId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Serviços</label>
          <MultiSelect
            options={mockServices.map(service => ({ value: service.id, label: service.name }))}
            selected={watch('serviceIds') || []}
            onChange={value => setValue('serviceIds', value)}
            placeholder="Selecione os serviços"
          />
          {errors.serviceIds && <p className="mt-1 text-sm text-red-600">{errors.serviceIds.message}</p>}
        </div>

        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700">Início</label>
          <Input type="datetime-local" id="start" {...register('start')} />
          {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start.message}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações</label>
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
