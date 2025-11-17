// src/pages/ClienteForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import type { Client } from '../types';
import { addMockClient } from '../data/clients';

const clientSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
});

type ClientSchema = z.infer<typeof clientSchema>;

const ClienteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: 'agendamento' | 'comandas' } | null;
  const from = state?.from;
  const { register, handleSubmit, formState: { errors } } = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit: SubmitHandler<ClientSchema> = (data) => {
    const id = `client-${Date.now()}`;
    const newClient: Client = {
      id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      visitCount: 0,
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

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">Novo Cliente</h1>
        <p className="text-text-muted">Preencha os dados para cadastrar um novo cliente.</p>
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
          <Button type="button" variant="ghost" onClick={() => navigate('/clientes')}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
