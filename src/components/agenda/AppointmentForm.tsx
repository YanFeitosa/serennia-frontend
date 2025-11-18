// src/components/agenda/AppointmentForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentSchema } from '../../lib/schemas';
import type { Appointment } from '../../types';
import { mockClients } from '../../data/clients';
import { mockCollaborators } from '../../data/collaborators';
import { mockServices } from '../../data/services';
import { Button } from '../ui/Button';

const toDateTimeLocal = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Return a default value or handle the error appropriately
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

interface AppointmentFormProps {
  onClose: () => void;
  appointment?: Appointment | null;
}

const AppointmentForm = ({ onClose, appointment }: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<AppointmentSchema>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: '',
      collaboratorId: '',
      serviceIds: [],
      notes: '',
      start: toDateTimeLocal(new Date()),
    },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        ...appointment,
        start: toDateTimeLocal(appointment.start),
      });
    } else {
      reset({
        clientId: '',
        collaboratorId: '',
        serviceIds: [],
        notes: '',
        start: toDateTimeLocal(new Date()),
      });
    }
  }, [appointment, reset]);

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
    console.log('Appointment data:', data);
    return new Promise(resolve => {
      setTimeout(() => {
        alert(appointment ? 'Agendamento atualizado!' : 'Agendamento criado!');
        onClose();
        resolve(void 0);
      }, 1000);
    });
  };

  const handleCancelAppointment = () => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      alert('Agendamento cancelado!');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Cliente</label>
        <select 
          id="clientId"
          {...register('clientId')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="">Selecione um cliente</option>
          {mockClients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>}
      </div>

      <div>
        <label htmlFor="collaboratorId" className="block text-sm font-medium text-gray-700">Profissional</label>
        <select 
          id="collaboratorId"
          {...register('collaboratorId')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="">Selecione um profissional</option>
          {mockCollaborators
            .filter(c => c.status === 'active' && c.role === 'professional')
            .map(collab => (
              <option key={collab.id} value={collab.id}>{collab.name}</option>
            ))}
        </select>
        {errors.collaboratorId && <p className="mt-1 text-sm text-red-600">{errors.collaboratorId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Serviços</label>
        <select 
          id="serviceIds"
          multiple
          {...register('serviceIds')}
          disabled={!selectedCollaborator}
          className="mt-1 block w-full h-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-400"
        >
          {selectedCollaborator ? (
            availableServices.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))
          ) : (
            <option value="">Selecione um profissional primeiro</option>
          )}
        </select>
        {errors.serviceIds && <p className="mt-1 text-sm text-red-600">{errors.serviceIds.message}</p>}
      </div>

      <div>
        <label htmlFor="start" className="block text-sm font-medium text-gray-700">Início</label>
        <input 
          type="datetime-local"
          id="start"
          {...register('start')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        />
        {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start.message}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea 
          id="notes"
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <div>
          {appointment && (
            <Button type="button" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={handleCancelAppointment}>
              Cancelar Agendamento
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button type="button" variant="ghost" onClick={onClose}>Fechar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : (appointment ? 'Salvar Alterações' : 'Criar Agendamento')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;
