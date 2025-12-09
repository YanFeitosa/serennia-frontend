// src/pages/ColaboradorForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import MultiSelectPlain from '../../components/ui/MultiSelectPlain';
import type { Collaborator } from '../../types';
import { createCollaborator, updateCollaborator, getCollaboratorById, getCategories } from '../../lib/api';

// CPF validation helper
const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

// CPF mask helper
const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
};

// CEP mask helper
const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

// Phone mask helper
const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

const collaboratorSchema = z.object({
  // Dados básicos
  name: z.string().min(1, 'O nome é obrigatório'),
  role: z.string().min(1, 'O cargo é obrigatório'),
  cpf: z.string().min(1, 'O CPF é obrigatório').refine((val) => {
    const cleaned = val.replace(/\D/g, '');
    return cleaned.length === 11 && validateCPF(cleaned);
  }, 'CPF inválido'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  serviceCategories: z.array(z.string()),
  commission: z
    .number()
    .min(0, 'Comissão deve ser pelo menos 0%')
    .max(100, 'Use um valor entre 0 e 100')
    .optional(),
  commissionMode: z.enum(['service', 'professional']).optional(),
  // Datas
  hireDate: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  // Dados bancários
  pixKey: z.string().optional().or(z.literal('')),
  pixKeyType: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random']).optional(),
  bankName: z.string().optional().or(z.literal('')),
  bankAgency: z.string().optional().or(z.literal('')),
  bankAccount: z.string().optional().or(z.literal('')),
  bankAccountType: z.enum(['corrente', 'poupanca']).optional(),
  // Endereço
  address: z.string().optional().or(z.literal('')),
  addressNumber: z.string().optional().or(z.literal('')),
  addressComplement: z.string().optional().or(z.literal('')),
  addressNeighborhood: z.string().optional().or(z.literal('')),
  addressCity: z.string().optional().or(z.literal('')),
  addressState: z.string().optional().or(z.literal('')),
  addressZipCode: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // Pelo menos telefone ou email deve ser fornecido
  return (data.phone && data.phone.trim().length > 0) || (data.email && data.email.trim().length > 0);
}, {
  message: 'Telefone ou email deve ser fornecido',
  path: ['phone'],
});

type CollaboratorSchema = z.infer<typeof collaboratorSchema>;

const getDefaultCommissionRate = (): number => {
  if (typeof window === 'undefined') return 0.5;
  const raw = window.localStorage.getItem('serennia-default-commission');
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    professional: true,
    banking: false,
    address: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<CollaboratorSchema>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: '',
      role: 'professional',
      cpf: '',
      phone: '',
      email: '',
      serviceCategories: [],
      commission: undefined,
      commissionMode: 'service',
      hireDate: '',
      birthDate: '',
      pixKey: '',
      pixKeyType: undefined,
      bankName: '',
      bankAgency: '',
      bankAccount: '',
      bankAccountType: undefined,
      address: '',
      addressNumber: '',
      addressComplement: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZipCode: '',
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
          cpf: collaborator.cpf ? formatCPF(collaborator.cpf) : '',
          phone: collaborator.phone ? formatPhone(collaborator.phone) : '',
          email: collaborator.email ?? '',
          avatarUrl: collaborator.avatarUrl ?? '',
          serviceCategories: collaborator.serviceCategories ?? [],
          commission: Math.round((collaborator.commissionRate ?? getDefaultCommissionRate()) * 100),
          commissionMode: collaborator.commissionMode ?? 'service',
          hireDate: collaborator.hireDate ? collaborator.hireDate.split('T')[0] : '',
          birthDate: collaborator.birthDate ? collaborator.birthDate.split('T')[0] : '',
          pixKey: collaborator.pixKey ?? '',
          pixKeyType: collaborator.pixKeyType,
          bankName: collaborator.bankName ?? '',
          bankAgency: collaborator.bankAgency ?? '',
          bankAccount: collaborator.bankAccount ?? '',
          bankAccountType: collaborator.bankAccountType,
          address: collaborator.address ?? '',
          addressNumber: collaborator.addressNumber ?? '',
          addressComplement: collaborator.addressComplement ?? '',
          addressNeighborhood: collaborator.addressNeighborhood ?? '',
          addressCity: collaborator.addressCity ?? '',
          addressState: collaborator.addressState ?? '',
          addressZipCode: collaborator.addressZipCode ? formatCEP(collaborator.addressZipCode) : '',
        });
        // Expand sections with data
        if (collaborator.pixKey || collaborator.bankName) {
          setExpandedSections(prev => ({ ...prev, banking: true }));
        }
        if (collaborator.address || collaborator.addressCity) {
          setExpandedSections(prev => ({ ...prev, address: true }));
        }
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

    // Helper to clean optional string fields
    const cleanString = (val?: string) => val && val.trim().length > 0 ? val.trim() : undefined;

    try {
      setSaveError(null);

      const commonData = {
        name: data.name,
        role: data.role as any,
        cpf: data.cpf.replace(/\D/g, ''),
        phone: cleanString(data.phone?.replace(/\D/g, '')),
        email: cleanString(data.email),
        avatarUrl: cleanString(data.avatarUrl),
        serviceCategories: isProfessional ? data.serviceCategories : [],
        commissionMode: isProfessional ? (data.commissionMode ?? 'service') : undefined,
        hireDate: cleanString(data.hireDate),
        birthDate: cleanString(data.birthDate),
        // Banking info
        pixKey: cleanString(data.pixKey),
        pixKeyType: data.pixKey?.trim() ? data.pixKeyType : undefined,
        bankName: cleanString(data.bankName),
        bankAgency: cleanString(data.bankAgency),
        bankAccount: cleanString(data.bankAccount),
        bankAccountType: data.bankName?.trim() ? data.bankAccountType : undefined,
        // Address
        address: cleanString(data.address),
        addressNumber: cleanString(data.addressNumber),
        addressComplement: cleanString(data.addressComplement),
        addressNeighborhood: cleanString(data.addressNeighborhood),
        addressCity: cleanString(data.addressCity),
        addressState: cleanString(data.addressState),
        addressZipCode: cleanString(data.addressZipCode?.replace(/\D/g, '')),
      };

      if (editingCollaborator) {
        let commissionRate = editingCollaborator.commissionRate ?? defaultCommissionRate;
        if (isProfessional && typeof data.commission === 'number') {
          commissionRate = data.commission / 100;
        } else if (!isProfessional) {
          commissionRate = 0;
        }

        await updateCollaborator(editingCollaborator.id, {
          ...commonData,
          status: editingCollaborator.status,
          commissionRate,
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
          ...commonData,
          status: 'active',
          commissionRate,
        });
      }

      navigate('/app/colaboradores');
    } catch (err) {
      console.error('Failed to save collaborator', err);
      setSaveError('Falha ao salvar colaborador.');
    }
  };

  const SectionHeader = ({ title, section, subtitle }: { title: string; section: string; subtitle?: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 text-left border-b border-border"
    >
      <div>
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      <svg
        className={`w-5 h-5 text-text-muted transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="space-y-4">
      <header className="p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}</h1>
          <p className="text-text-muted text-sm md:text-base">
            {editingCollaborator
              ? 'Atualize as informações do colaborador.'
              : 'Preencha os dados para cadastrar um novo colaborador.'}
          </p>
        </div>
      </header>
      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-4 md:p-6 rounded-xl shadow-md space-y-6 border border-border">
        {/* Seção: Dados Básicos */}
        <div>
          <SectionHeader title="Dados Básicos" section="basic" subtitle="Informações principais do colaborador" />
          {expandedSections.basic && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text">Nome *</label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-text">Cargo *</label>
                  <select
                    id="role"
                    {...register('role')}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="professional">Profissional</option>
                    <option value="receptionist">Recepcionista</option>
                    <option value="manager">Gerente</option>
                    <option value="accountant">Contador</option>
                  </select>
                  {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-text">CPF *</label>
                  <Input 
                    id="cpf" 
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setValue('cpf', formatted);
                    }}
                  />
                  <p className="mt-1 text-xs text-text-muted">Senha inicial: primeiro nome + 4 últimos dígitos do CPF</p>
                  {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text">Email *</label>
                  <Input id="email" {...register('email')} type="email" />
                  <p className="mt-1 text-xs text-text-muted">Para login no sistema</p>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text">Telefone</label>
                  <Input 
                    id="phone" 
                    {...register('phone')} 
                    placeholder="(00) 00000-0000"
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setValue('phone', formatted);
                    }}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-text">URL da Foto</label>
                  <Input 
                    id="avatarUrl" 
                    {...register('avatarUrl')} 
                    placeholder="https://exemplo.com/foto.jpg"
                    type="url"
                  />
                  {errors.avatarUrl && <p className="mt-1 text-sm text-red-600">{errors.avatarUrl.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hireDate" className="block text-sm font-medium text-text">Data de Admissão</label>
                  <Input id="hireDate" {...register('hireDate')} type="date" />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-text">Data de Nascimento</label>
                  <Input id="birthDate" {...register('birthDate')} type="date" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção: Profissional (apenas para profissionais) */}
        {showServiceCategoriesField && (
          <div>
            <SectionHeader title="Configurações Profissionais" section="professional" subtitle="Comissões e especialidades" />
            {expandedSections.professional && (
              <div className="pt-4 space-y-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="commissionMode" className="block text-sm font-medium text-text">Modo de Comissão</label>
                    <select
                      id="commissionMode"
                      {...register('commissionMode')}
                      className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="service">Usar comissão do serviço</option>
                      <option value="professional">Usar taxa do profissional</option>
                    </select>
                    <p className="mt-1 text-xs text-text-muted">
                      {watch('commissionMode') === 'service' 
                        ? 'A comissão será a definida em cada serviço'
                        : 'A comissão será a taxa padrão deste profissional'}
                    </p>
                  </div>
                  {showCommissionField && (
                    <div>
                      <label htmlFor="commission" className="block text-sm font-medium text-text">
                        Taxa de Comissão (%)
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
                          size="sm"
                          onClick={() => {
                            const defaultPercent = Math.round(getDefaultCommissionRate() * 100);
                            setValue('commission', defaultPercent);
                          }}
                        >
                          Padrão
                        </Button>
                      </div>
                      {errors.commission && (
                        <p className="mt-1 text-sm text-red-600">{errors.commission.message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seção: Dados Bancários (para pagamento de comissões) */}
        <div>
          <SectionHeader title="Dados Bancários" section="banking" subtitle="Para pagamento de comissões (opcional)" />
          {expandedSections.banking && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pixKeyType" className="block text-sm font-medium text-text">Tipo de Chave PIX</label>
                  <select
                    id="pixKeyType"
                    {...register('pixKeyType')}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="email">E-mail</option>
                    <option value="phone">Telefone</option>
                    <option value="random">Chave aleatória</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pixKey" className="block text-sm font-medium text-text">Chave PIX</label>
                  <Input id="pixKey" {...register('pixKey')} placeholder="Digite a chave PIX" />
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted mb-3">Ou dados bancários para TED/DOC:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-text">Banco</label>
                    <Input id="bankName" {...register('bankName')} placeholder="Ex: Nubank, Itaú" />
                  </div>
                  <div>
                    <label htmlFor="bankAccountType" className="block text-sm font-medium text-text">Tipo de Conta</label>
                    <select
                      id="bankAccountType"
                      {...register('bankAccountType')}
                      className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione...</option>
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="bankAgency" className="block text-sm font-medium text-text">Agência</label>
                    <Input id="bankAgency" {...register('bankAgency')} placeholder="0000" />
                  </div>
                  <div>
                    <label htmlFor="bankAccount" className="block text-sm font-medium text-text">Conta</label>
                    <Input id="bankAccount" {...register('bankAccount')} placeholder="00000-0" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção: Endereço */}
        <div>
          <SectionHeader title="Endereço" section="address" subtitle="Endereço residencial (opcional)" />
          {expandedSections.address && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-text">Logradouro</label>
                  <Input id="address" {...register('address')} placeholder="Rua, Avenida, etc." />
                </div>
                <div>
                  <label htmlFor="addressNumber" className="block text-sm font-medium text-text">Número</label>
                  <Input id="addressNumber" {...register('addressNumber')} placeholder="123" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="addressComplement" className="block text-sm font-medium text-text">Complemento</label>
                  <Input id="addressComplement" {...register('addressComplement')} placeholder="Apto, Bloco, etc." />
                </div>
                <div>
                  <label htmlFor="addressNeighborhood" className="block text-sm font-medium text-text">Bairro</label>
                  <Input id="addressNeighborhood" {...register('addressNeighborhood')} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="addressCity" className="block text-sm font-medium text-text">Cidade</label>
                  <Input id="addressCity" {...register('addressCity')} />
                </div>
                <div>
                  <label htmlFor="addressState" className="block text-sm font-medium text-text">Estado</label>
                  <select
                    id="addressState"
                    {...register('addressState')}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="addressZipCode" className="block text-sm font-medium text-text">CEP</label>
                  <Input 
                    id="addressZipCode" 
                    {...register('addressZipCode')} 
                    placeholder="00000-000"
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      setValue('addressZipCode', formatted);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={() => navigate('/app/colaboradores')} className="w-full sm:w-auto">Cancelar</Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">Salvar</Button>
        </div>
      </form>
    </div>
  );
};

export default ColaboradorForm;
