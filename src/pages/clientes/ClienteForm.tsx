// src/pages/ClienteForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Client } from '../../types';
import { createClient, updateClient, getClientById } from '../../lib/api';

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
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!editClientId) return;

    let isMounted = true;

    const loadClient = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const client = await getClientById(editClientId);
        if (!isMounted) return;
        setEditingClient(client);
        reset({
          name: client.name,
          phone: client.phone,
          email: client.email ?? '',
        });
      } catch (err) {
        console.error('Failed to load client', err);
        if (isMounted) {
          setLoadError('Falha ao carregar cliente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadClient();

    return () => {
      isMounted = false;
    };
  }, [editClientId, reset]);

  const onSubmit: SubmitHandler<ClientSchema> = async (data) => {
    try {
      setSaveError(null);

      let client: Client;
      if (editingClient) {
        client = await updateClient(editingClient.id, {
          name: data.name,
          phone: data.phone,
          email: data.email,
        });
      } else {
        client = await createClient({
          name: data.name,
          phone: data.phone,
          email: data.email,
        });
      }

      const id = client.id;

      if (from === 'agendamento') {
        navigate('/app/agenda/novo', {
          state: { newClientId: id },
        });
        return;
      }

      if (from === 'comandas') {
        navigate('/app/comandas', {
          state: { fromNewClientClientId: id },
        });
        return;
      }

      navigate(`/app/clientes/${id}`);
    } catch (err) {
      console.error('Failed to save client', err);
      setSaveError('Falha ao salvar cliente.');
    }
  };

  const isEditing = Boolean(editingClient);

  return (
    <div className="space-y-4">
      <header className="p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h1>
          <p className="text-text-muted text-sm md:text-base">
            {isEditing
              ? 'Atualize as informações do cliente.'
              : 'Preencha os dados para cadastrar um novo cliente.'}
          </p>
        </div>
      </header>
      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-4 md:p-6 rounded-xl shadow-md space-y-4 border border-border">
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
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(isEditing && editingClient ? `/app/clientes/${editingClient.id}` : '/app/clientes')}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
