// src/pages/ServicoForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiceById, createService, updateService, getCategories } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const serviceSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  duration: z.number().min(1, 'A duração deve ser maior que 0'),
  price: z.number().min(0, 'Preço inválido'),
  commission: z
    .number()
    .min(0, 'Comissão deve ser pelo menos 0%')
    .max(100, 'Use um valor entre 0 e 100')
    .int('Use apenas valores inteiros'),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

type ServiceSchema = z.infer<typeof serviceSchema>;

const ServicoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration: 60,
      price: 0,
      commission: 50,
      category: '',
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const categories = await getCategories('service');
        if (!isMounted) return;
        setServiceCategories(categories.map(c => c.name));
      } catch (err) {
        console.error('Failed to load service categories', err);
        if (isMounted) {
          setCategoriesError('Falha ao carregar categorias de serviço.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadService = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const service = await getServiceById(id);
        if (!isMounted) return;

        reset({
          name: service.name,
          duration: service.duration,
          price: service.price,
          commission: Math.round((service.commission ?? 0) * 100),
          category: service.category ?? '',
        });
      } catch (err) {
        console.error('Failed to load service', err);
        if (isMounted) {
          setLoadError('Falha ao carregar serviço.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
    };
  }, [id, reset]);

  const onSubmit: SubmitHandler<ServiceSchema> = async (data) => {
    try {
      setSaveError(null);
      const payload = {
        name: data.name,
        duration: data.duration,
        price: data.price,
        commission: data.commission / 100,
        category: data.category,
      };

      if (id) {
        await updateService(id, payload);
      } else {
        await createService(payload);
      }

      navigate('/app/servicos');
    } catch (err) {
      console.error('Failed to save service', err);
      setSaveError('Falha ao salvar serviço. Verifique os dados e tente novamente.');
    }
  };

  const isEditing = Boolean(id);

  return (
    <div className="space-y-4">
      <header className="p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            {isEditing
              ? 'Atualize as informações do serviço.'
              : 'Preencha os dados para cadastrar um novo serviço.'}
          </p>
        </div>
      </header>

      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card p-4 md:p-6 rounded-xl shadow-md space-y-4 border border-border"
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
            <option value="" disabled>
              Selecione uma categoria de serviço
            </option>
            {serviceCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
          {categoriesError && (
            <p className="mt-1 text-sm text-red-600">{categoriesError}</p>
          )}
          {!categoriesError && !isLoadingCategories && serviceCategories.length === 0 && (
            <p className="mt-1 text-sm text-text-muted">
              Nenhuma categoria de serviço cadastrada. Crie categorias em Configurações &gt; Geral.
            </p>
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

        {/* Campo de bufferTime removido: não estamos mais usando tempo de buffer por serviço. */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/app/servicos')} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isEditing ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServicoForm;
