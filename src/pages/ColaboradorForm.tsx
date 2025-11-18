// src/pages/ColaboradorForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import MultiSelectPlain from '../components/ui/MultiSelectPlain.tsx';
import { mockCollaborators, addMockCollaborator, updateMockCollaborator } from '../data/collaborators.ts';

const SERVICE_CATEGORIES = [
  'Cabelo',
  'Unhas',
  'Estética',
  'Massagem',
  'Depilação',
  'Maquiagem',
  'Corpo',
  'Barba',
  'Coloração',
  'Spa',
];

const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O cargo é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  serviceCategories: z.array(z.string()).min(1, 'Selecione ao menos uma categoria de serviço'),
});

type CollaboratorSchema = z.infer<typeof collaboratorSchema>;

const ColaboradorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { editCollaboratorId?: string } | null;
  const editCollaboratorId = state?.editCollaboratorId;
  const editingCollaborator = editCollaboratorId ? mockCollaborators.find(c => c.id === editCollaboratorId) : undefined;

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<CollaboratorSchema>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: editingCollaborator
      ? {
          name: editingCollaborator.name,
          role: editingCollaborator.role,
          phone: editingCollaborator.phone ?? '',
          email: editingCollaborator.email ?? '',
          serviceCategories: editingCollaborator.serviceCategories ?? [],
        }
      : {
          name: '',
          role: 'professional',
          phone: '',
          email: '',
          serviceCategories: [],
        },
  });

  useEffect(() => {
    if (editingCollaborator) {
      reset({
        name: editingCollaborator.name,
        role: editingCollaborator.role,
        phone: editingCollaborator.phone ?? '',
        email: editingCollaborator.email ?? '',
        serviceCategories: editingCollaborator.serviceCategories ?? [],
      });
    }
  }, [editingCollaborator, reset]);

  const onSubmit: SubmitHandler<CollaboratorSchema> = (data) => {
    if (editingCollaborator) {
      updateMockCollaborator(editingCollaborator.id, {
        name: data.name,
        role: data.role as any,
        phone: data.phone,
        email: data.email,
        serviceCategories: data.serviceCategories,
      });
    } else {
      addMockCollaborator({
        id: `collab-${Date.now()}`,
        name: data.name,
        role: data.role as any,
        status: 'active',
        phone: data.phone,
        email: data.email,
        commissionRate: 0.5,
        serviceCategories: data.serviceCategories,
      });
    }

    navigate('/colaboradores');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">{editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}</h1>
        <p className="text-text-muted">
          {editingCollaborator
            ? 'Atualize as informações do colaborador.'
            : 'Preencha os dados para cadastrar um novo colaborador.'}
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">Nome</label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-text">Cargo</label>
          <select
            id="role"
            {...register('role')}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="professional">Profissional</option>
            <option value="receptionist">Recepcionista</option>
            <option value="manager">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
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
        <div>
          <label className="block text-sm font-medium text-text">Categorias de serviços</label>
          <MultiSelectPlain
            options={SERVICE_CATEGORIES.map(category => ({ value: category, label: category }))}
            selected={watch('serviceCategories') || []}
            onChange={(value: string[]) => setValue('serviceCategories', value)}
            placeholder="Selecione as categorias de serviço"
          />
          {errors.serviceCategories && <p className="mt-1 text-sm text-red-600">{errors.serviceCategories.message}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ColaboradorForm;
