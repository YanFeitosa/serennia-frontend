// src/pages/ServicoForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import type { Service } from '../types';
import { mockServices, addMockService, updateMockService } from '../data/services';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SERVICE_CATEGORIES = [
  'Cabelo',
  'Unhas',
  'Estética',
  'Massagem',
  'Depilação',
  'Maquiagem',
  'Corpo',
  'Pacote',
];

const serviceSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  duration: z.number().min(1, 'A duração deve ser maior que 0'),
  price: z.number().min(0, 'Preço inválido'),
  commission: z
    .number()
    .min(0, 'Comissão deve ser pelo menos 0%')
    .max(100, 'Use um valor entre 0 e 100')
    .int('Use apenas valores inteiros'),
  bufferTime: z.number().min(0).optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

type ServiceSchema = z.infer<typeof serviceSchema>;

const ServicoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editingService = id ? mockServices.find(s => s.id === id) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: editingService
      ? {
          name: editingService.name,
          duration: editingService.duration,
          price: editingService.price,
          commission: Math.round(editingService.commission * 100),
          bufferTime: editingService.bufferTime ?? 0,
          category: editingService.category ?? SERVICE_CATEGORIES[0],
        }
      : {
          name: '',
          duration: 60,
          price: 0,
          commission: 50,
          bufferTime: 0,
          category: SERVICE_CATEGORIES[0],
        },
  });

  useEffect(() => {
    if (editingService) {
      reset({
        name: editingService.name,
        duration: editingService.duration,
        price: editingService.price,
        commission: Math.round(editingService.commission * 100),
        bufferTime: editingService.bufferTime ?? 0,
        category: editingService.category ?? SERVICE_CATEGORIES[0],
      });
    }
  }, [editingService, reset]);

  const onSubmit: SubmitHandler<ServiceSchema> = (data) => {
    if (editingService) {
      updateMockService(editingService.id, {
        name: data.name,
        duration: data.duration,
        price: data.price,
        commission: data.commission / 100,
        bufferTime: data.bufferTime,
        category: data.category,
      });
    } else {
      const newService: Service = {
        id: `service-${Date.now()}`,
        name: data.name,
        duration: data.duration,
        price: data.price,
        commission: data.commission / 100,
        bufferTime: data.bufferTime,
        category: data.category,
      };
      addMockService(newService);
    }

    navigate('/servicos');
  };

  const isEditing = Boolean(editingService);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">
          {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        </h1>
        <p className="text-text-muted">
          {isEditing
            ? 'Atualize as informações do serviço.'
            : 'Preencha os dados para cadastrar um novo serviço.'}
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">
            Nome
          </label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text">
            Categoria
          </label>
          <select
            id="category"
            {...register('category')}
            className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-text">
              Duração (minutos)
            </label>
            <Input
              id="duration"
              type="number"
              min={1}
              {...register('duration', { valueAsNumber: true })}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text">
              Preço (R$)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min={0}
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="commission" className="block text-sm font-medium text-text">
              Comissão (%)
            </label>
            <Input
              id="commission"
              type="number"
              step="1"
              min={0}
              max={100}
              {...register('commission', { valueAsNumber: true })}
            />
            {errors.commission && (
              <p className="mt-1 text-sm text-red-600">{errors.commission.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bufferTime" className="block text-sm font-medium text-text">
              Tempo de buffer (minutos)
            </label>
            <Input
              id="bufferTime"
              type="number"
              min={0}
              {...register('bufferTime', { valueAsNumber: true })}
            />
            {errors.bufferTime && (
              <p className="mt-1 text-sm text-red-600">{errors.bufferTime.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/servicos')}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Salvar alterações' : 'Salvar'}</Button>
        </div>
      </form>
    </div>
  );
};

export default ServicoForm;
