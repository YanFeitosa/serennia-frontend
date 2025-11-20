// src/pages/ColaboradorForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import MultiSelectPlain from '../components/ui/MultiSelectPlain';
import type { Collaborator } from '../types';
import { createCollaborator, updateCollaborator, getCollaboratorById, getCategories } from '../lib/api';

const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O cargo é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  // Categorias de serviço só fazem sentido para profissionais; para outros roles manteremos o array vazio por padrão via defaultValues.
  serviceCategories: z.array(z.string()),
  commission: z
    .number()
    .min(0, 'Comissão deve ser pelo menos 0%')
    .max(100, 'Use um valor entre 0 e 100')
    .optional(),
});

type CollaboratorSchema = z.infer<typeof collaboratorSchema>;

const getDefaultCommissionRate = (): number => {
  if (typeof window === 'undefined') return 0.5;
  const raw = window.localStorage.getItem('serenna-default-commission');
  const percent = Number(raw);
  if (!Number.isFinite(percent)) return 0.5;
  const clamped = Math.max(0, Math.min(100, percent));
  return clamped / 100;
};

const ColaboradorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { editCollaboratorId?: string } | null;
  const editCollaboratorId = state?.editCollaboratorId;
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [serviceCategoryOptions, setServiceCategoryOptions] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<CollaboratorSchema>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: '',
      role: 'professional',
      phone: '',
      email: '',
      serviceCategories: [],
      commission: undefined,
    },
  });

  useEffect(() => {
    if (!editCollaboratorId) return;

    let isMounted = true;

    const loadCollaborator = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const collaborator = await getCollaboratorById(editCollaboratorId);
        if (!isMounted) return;
        setEditingCollaborator(collaborator);
        reset({
          name: collaborator.name,
          role: collaborator.role,
          phone: collaborator.phone ?? '',
          email: collaborator.email ?? '',
          serviceCategories: collaborator.serviceCategories ?? [],
          commission: Math.round((collaborator.commissionRate ?? getDefaultCommissionRate()) * 100),
        });
        // Garante que categorias já atribuídas apareçam nas opções mesmo que não venham do backend
        if (collaborator.serviceCategories && collaborator.serviceCategories.length > 0) {
          setServiceCategoryOptions(prev => {
            const merged = new Set<string>([...prev, ...collaborator.serviceCategories!]);
            return Array.from(merged).sort((a, b) => a.localeCompare(b));
          });
        }
      } catch (err) {
        console.error('Failed to load collaborator', err);
        if (isMounted) {
          setLoadError('Falha ao carregar colaborador.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCollaborator();

    return () => {
      isMounted = false;
    };
  }, [editCollaboratorId, reset]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);

        const categories = await getCategories('service');
        if (!isMounted) return;

        const names = categories.map(c => c.name);
        setServiceCategoryOptions(prev => {
          const merged = new Set<string>([...prev, ...names]);
          return Array.from(merged).sort((a, b) => a.localeCompare(b));
        });
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
  const selectedRole = watch('role');
  const showCommissionField = Boolean(editingCollaborator) && selectedRole === 'professional';
  const showServiceCategoriesField = selectedRole === 'professional';

  useEffect(() => {
    if (selectedRole !== 'professional') {
      setValue('serviceCategories', []);
    }
  }, [selectedRole, setValue]);

  const onSubmit: SubmitHandler<CollaboratorSchema> = async (data) => {
    const defaultCommissionRate = getDefaultCommissionRate();
    const isProfessional = selectedRole === 'professional';

    try {
      setSaveError(null);

      if (editingCollaborator) {
        let commissionRate = editingCollaborator.commissionRate ?? defaultCommissionRate;
        if (isProfessional && typeof data.commission === 'number') {
          commissionRate = data.commission / 100;
        } else if (!isProfessional) {
          commissionRate = 0;
        }

        await updateCollaborator(editingCollaborator.id, {
          name: data.name,
          role: data.role as any,
          status: editingCollaborator.status,
          phone: data.phone,
          email: data.email,
          commissionRate,
          serviceCategories: isProfessional ? data.serviceCategories : [],
        });
      } else {
        let commissionRate: number;
        if (isProfessional) {
          commissionRate =
            typeof data.commission === 'number'
              ? data.commission / 100
              : defaultCommissionRate;
        } else {
          commissionRate = 0;
        }

        await createCollaborator({
          name: data.name,
          role: data.role as any,
          status: 'active',
          phone: data.phone,
          email: data.email,
          commissionRate,
          serviceCategories: isProfessional ? data.serviceCategories : [],
        });
      }

      navigate('/colaboradores');
    } catch (err) {
      console.error('Failed to save collaborator', err);
      setSaveError('Falha ao salvar colaborador.');
    }
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
      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}
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
        {showServiceCategoriesField && (
          <div>
            <label className="block text-sm font-medium text-text">Categorias de serviços</label>
            <MultiSelectPlain
              options={serviceCategoryOptions.map(category => ({ value: category, label: category }))}
              selected={watch('serviceCategories') || []}
              onChange={(value: string[]) => setValue('serviceCategories', value)}
              placeholder="Selecione as categorias de serviço"
            />
            {isLoadingCategories && (
              <p className="mt-1 text-xs text-text-muted">Carregando categorias de serviço...</p>
            )}
            {categoriesError && (
              <p className="mt-1 text-xs text-red-500">{categoriesError}</p>
            )}
            {errors.serviceCategories && <p className="mt-1 text-sm text-red-600">{errors.serviceCategories.message}</p>}
          </div>
        )}

        {showCommissionField && (
          <div>
            <label htmlFor="commission" className="block text-sm font-medium text-text">
              Comissão do profissional (%)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="commission"
                type="number"
                min={0}
                max={100}
                {...register('commission', { valueAsNumber: true })}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const defaultPercent = Math.round(getDefaultCommissionRate() * 100);
                  setValue('commission', defaultPercent);
                }}
              >
                Resetar padrão
              </Button>
            </div>
            {errors.commission && (
              <p className="mt-1 text-sm text-red-600">{errors.commission.message}</p>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit" disabled={isLoading}>Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ColaboradorForm;
