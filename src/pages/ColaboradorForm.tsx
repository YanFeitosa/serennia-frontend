// src/pages/ColaboradorForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { MultiSelect } from '../components/ui/MultiSelect.tsx';
import { mockServices } from '../data/services.ts';

const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O cargo é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  serviceIds: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
});

type CollaboratorSchema = z.infer<typeof collaboratorSchema>;

const ColaboradorForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CollaboratorSchema>({
    resolver: zodResolver(collaboratorSchema),
  });

  const onSubmit: SubmitHandler<CollaboratorSchema> = (data) => {
    console.log(data);
    navigate('/colaboradores');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">Novo Colaborador</h1>
        <p className="text-gray-500">Preencha os dados para cadastrar um novo colaborador.</p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
          <Input id="role" {...register('role')} />
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input id="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ColaboradorForm;
