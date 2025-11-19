// src/pages/ClienteForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Client } from '../types';
import { addMockClient, mockClients, updateMockClient } from '../data/clients';

const clientSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
});

type ClientSchema = z.infer<typeof clientSchema>;

const ClienteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: 'agendamento' | 'comandas' | 'clientes'; editClientId?: string } | null;
  const from = state?.from;
  const editClientId = state?.editClientId;
  const editingClient = editClientId ? mockClients.find(c => c.id === editClientId) : undefined;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: editingClient
      ? {
          name: editingClient.name,
          phone: editingClient.phone,
          email: editingClient.email ?? '',
        }
      : {
          name: '',
          phone: '',
          email: '',
        },
  });

  useEffect(() => {
    if (editingClient) {
      reset({
        name: editingClient.name,
        phone: editingClient.phone,
        email: editingClient.email ?? '',
      });
    }
  }, [editingClient, reset]);

  const onSubmit: SubmitHandler<ClientSchema> = (data) => {
    if (editingClient) {
      updateMockClient(editingClient.id, {
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
      navigate(`/clientes/${editingClient.id}`);
      return;
    }

    const id = `client-${Date.now()}`;
    const newClient: Client = {
      id,
      salonId: 'salon-1',
      name: data.name,
      phone: data.phone,
      email: data.email,
    };
    addMockClient(newClient);

    if (from === 'agendamento') {
      navigate('/agenda/novo', {
        state: { newClientId: id },
      });
      return;
    }

    if (from === 'comandas') {
      navigate('/comandas', {
        state: { fromNewClientClientId: id },
      });
      return;
    }

    navigate('/clientes');
  };

  const isEditing = Boolean(editingClient);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h1>
        <p className="text-text-muted">
          {isEditing
            ? 'Atualize as informações do cliente.'
            : 'Preencha os dados para cadastrar um novo cliente.'}
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">Nome</label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text">Telefone</label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">Email</label>
          <Input id="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(isEditing && editingClient ? `/clientes/${editingClient.id}` : '/clientes')}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
