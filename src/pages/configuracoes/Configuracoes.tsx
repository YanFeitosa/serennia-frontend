// src/pages/Configuracoes.tsx
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { getCategories, createCategory, deleteCategory, getSalonSettings, updateSalonSettings, getMessageTemplates, createMessageTemplate, updateMessageTemplate, deleteMessageTemplate, type MessageTemplate, type SalonTheme } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { isAdminLike } from '../../lib/utils';
import type { CategoryType, UserRole } from '../../types';

const AVAILABLE_VARIABLES = [
  { key: 'cliente_nome', label: 'Nome do cliente' },
  { key: 'data', label: 'Data do agendamento' },
  { key: 'horario', label: 'Horário do agendamento' },
  { key: 'servico', label: 'Itens' },
  { key: 'colaborador', label: 'Profissional' },
];

type CategoryGroup = 'services' | 'products' | 'roles';

type SettingsTab = 'geral' | 'mensagens' | 'integracoes' | 'personalizacao' | 'permissoes';

type ThemePalette = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

type AppearanceSettings = {
  platformName: string;
  light: ThemePalette;
  dark: ThemePalette;
};

const Configuracoes = () => {
  const [tab, setTab] = useState<SettingsTab>('geral');

  // Comissão padrão de profissionais (em porcentagem, 0-100)
  const [defaultCommissionPercent, setDefaultCommissionPercent] = useState<number>(50);
  const [commissionCalcMode, setCommissionCalcMode] = useState<'service' | 'professional'>('professional');
  const [isLoadingCommissionSettings, setIsLoadingCommissionSettings] = useState(false);
  const [isSavingCommissionSettings, setIsSavingCommissionSettings] = useState(false);
  const [commissionSettingsError, setCommissionSettingsError] = useState<string | null>(null);


  // Categorias por tipo (serviços/produtos vêm do backend)
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([
    'Cabeleireiro(a)',
    'Manicure/Pedicure',
    'Designer de Sobrancelhas',
    'Esteticista',
    'Massagista',
    'Recepcionista',
    'Gerente',
  ]);

  const [serviceCategoryIdsByName, setServiceCategoryIdsByName] = useState<Record<string, string>>({});
  const [productCategoryIdsByName, setProductCategoryIdsByName] = useState<Record<string, string>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const [editingGroup, setEditingGroup] = useState<CategoryGroup | null>(null);
  const [newCategoryValues, setNewCategoryValues] = useState<Record<CategoryGroup, string>>({
    services: '',
    products: '',
    roles: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ group: CategoryGroup; category: string } | null>(null);

  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) ?? null;

  // Local form state for template editing (to avoid saving on every keystroke)
  const [templateFormData, setTemplateFormData] = useState<{
    name: string;
    channel: MessageTemplate['channel'];
    content: string;
  } | null>(null);

  // Sync form data when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateFormData({
        name: selectedTemplate.name,
        channel: selectedTemplate.channel,
        content: selectedTemplate.content,
      });
    } else {
      setTemplateFormData(null);
    }
  }, [selectedTemplateId, selectedTemplate?.id]);

  const [appearanceDraft, setAppearanceDraft] = useState<AppearanceSettings | null>(null);
  const [appearanceApplied, setAppearanceApplied] = useState<AppearanceSettings | null>(null);
  const [editingTheme, setEditingTheme] = useState<'light' | 'dark'>('light');

  const applyAppearance = (settings: AppearanceSettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const light = settings.light;
    const dark = settings.dark;

    root.style.setProperty('--color-primary-light-theme', light.primaryColor);
    root.style.setProperty('--color-secondary-light-theme', light.secondaryColor);
    root.style.setProperty('--color-accent-light-theme', light.accentColor);
    root.style.setProperty('--color-background-light-theme', light.backgroundColor);
    root.style.setProperty('--color-text-light-theme', light.textColor);

    root.style.setProperty('--color-primary-dark-theme', dark.primaryColor);
    root.style.setProperty('--color-secondary-dark-theme', dark.secondaryColor);
    root.style.setProperty('--color-accent-dark-theme', dark.accentColor);
    root.style.setProperty('--color-background-dark-theme', dark.backgroundColor);
    root.style.setProperty('--color-text-dark-theme', dark.textColor);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const base: AppearanceSettings = {
      platformName: 'Serenna',
      light: {
        primaryColor: '#25445A',
        secondaryColor: '#7AA7D8',
        accentColor: '#BFA2DB',
        backgroundColor: '#FFFFFF',
        textColor: '#0F1724',
      },
      dark: {
        primaryColor: '#4A708A',
        secondaryColor: '#0F1724',
        accentColor: '#BFA2DB',
        backgroundColor: '#0B1220',
        textColor: '#F8FAFC',
      },
    };

    const stored = window.localStorage.getItem('serenna-appearance');
    let initial = base;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<AppearanceSettings>;
        initial = {
          platformName: parsed.platformName || base.platformName,
          light: {
            primaryColor: parsed.light?.primaryColor || base.light.primaryColor,
            secondaryColor: parsed.light?.secondaryColor || base.light.secondaryColor,
            accentColor: parsed.light?.accentColor || base.light.accentColor,
            backgroundColor: parsed.light?.backgroundColor || base.light.backgroundColor,
            textColor: parsed.light?.textColor || base.light.textColor,
          },
          dark: {
            primaryColor: parsed.dark?.primaryColor || base.dark.primaryColor,
            secondaryColor: parsed.dark?.secondaryColor || base.dark.secondaryColor,
            accentColor: parsed.dark?.accentColor || base.dark.accentColor,
            backgroundColor: parsed.dark?.backgroundColor || base.dark.backgroundColor,
            textColor: parsed.dark?.textColor || base.dark.textColor,
          },
        };
      } catch {
        initial = base;
      }
    }

    setAppearanceDraft(initial);
    setAppearanceApplied(initial);
    applyAppearance(initial);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      if (typeof window === 'undefined') return;

      try {
        setIsLoadingCommissionSettings(true);
        setCommissionSettingsError(null);

        const settings = await getSalonSettings();
        if (!isMounted) return;

        // Commission settings
        let percent = 50;
        if (
          settings.defaultCommissionRate != null &&
          Number.isFinite(settings.defaultCommissionRate)
        ) {
          percent = Math.round(settings.defaultCommissionRate * 100);
        } else {
          const raw = window.localStorage.getItem('serenna-default-commission');
          const parsed = raw != null ? Number(raw) : NaN;
          if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
            percent = parsed;
          }
        }

        setDefaultCommissionPercent(percent);
        const mode =
          settings.commissionMode === 'service' || settings.commissionMode === 'professional'
            ? settings.commissionMode
            : 'professional';
        setCommissionCalcMode(mode);

        // Load theme from backend if available
        if (settings.theme) {
          const themeFromBackend: AppearanceSettings = {
            platformName: settings.theme.platformName || settings.name || 'Serenna',
            light: {
              primaryColor: settings.theme.light?.primaryColor || '#25445A',
              secondaryColor: settings.theme.light?.secondaryColor || '#7AA7D8',
              accentColor: settings.theme.light?.accentColor || '#BFA2DB',
              backgroundColor: settings.theme.light?.backgroundColor || '#FFFFFF',
              textColor: settings.theme.light?.textColor || '#0F1724',
            },
            dark: {
              primaryColor: settings.theme.dark?.primaryColor || '#4A708A',
              secondaryColor: settings.theme.dark?.secondaryColor || '#0F1724',
              accentColor: settings.theme.dark?.accentColor || '#BFA2DB',
              backgroundColor: settings.theme.dark?.backgroundColor || '#0B1220',
              textColor: settings.theme.dark?.textColor || '#F8FAFC',
            },
          };
          setAppearanceDraft(themeFromBackend);
          setAppearanceApplied(themeFromBackend);
          applyAppearance(themeFromBackend);
          window.localStorage.setItem('serenna-appearance', JSON.stringify(themeFromBackend));
        }

        window.localStorage.setItem('serenna-default-commission', String(percent));
      } catch (error) {
        console.error('Failed to load settings', error);
        if (!isMounted) return;

        // Fallback para localStorage se disponível
        if (typeof window !== 'undefined') {
          const raw = window.localStorage.getItem('serenna-default-commission');
          const parsed = raw != null ? Number(raw) : NaN;
          if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
            setDefaultCommissionPercent(parsed);
          } else {
            setDefaultCommissionPercent(50);
          }
        }

        setCommissionSettingsError('Falha ao carregar configurações.');
      } finally {
        if (isMounted) {
          setIsLoadingCommissionSettings(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);

        const [serviceCats, productCats] = await Promise.all([
          getCategories('service'),
          getCategories('product'),
        ]);

        if (!isMounted) return;

        setServiceCategories(serviceCats.map(c => c.name));
        setProductCategories(productCats.map(c => c.name));
        setServiceCategoryIdsByName(
          Object.fromEntries(serviceCats.map(c => [c.name, c.id])),
        );
        setProductCategoryIdsByName(
          Object.fromEntries(productCats.map(c => [c.name, c.id])),
        );
      } catch (error) {
        console.error('Failed to load categories', error);
        if (isMounted) {
          setCategoriesError('Falha ao carregar categorias.');
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
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplatesError(null);
        const data = await getMessageTemplates();
        if (!isMounted) return;
        setTemplates(data);
        if (data.length > 0 && !selectedTemplateId) {
          setSelectedTemplateId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to load templates', error);
        if (isMounted) {
          setTemplatesError('Falha ao carregar templates.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, [selectedTemplateId]);

  const handlePlatformNameChange = (value: string) => {
    setAppearanceDraft(prev => (prev ? { ...prev, platformName: value } : prev));
  };

  const handleSaveSalonName = async () => {
    if (!appearanceDraft) return;

    const trimmed = appearanceDraft.platformName.trim();
    const nameToSave = trimmed.length > 0 ? trimmed : 'Serenna';

    try {
      const updated = await updateSalonSettings({ name: nameToSave });

      const next: AppearanceSettings = {
        ...(appearanceDraft || {
          platformName: nameToSave,
          light: {
            primaryColor: '#25445A',
            secondaryColor: '#7AA7D8',
            accentColor: '#BFA2DB',
            backgroundColor: '#FFFFFF',
            textColor: '#0F1724',
          },
          dark: {
            primaryColor: '#4A708A',
            secondaryColor: '#0F1724',
            accentColor: '#BFA2DB',
            backgroundColor: '#0B1220',
            textColor: '#F8FAFC',
          },
        }),
        platformName: updated.name || nameToSave,
      };

      setAppearanceDraft(next);
      setAppearanceApplied(next);
      applyAppearance(next);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('serenna-appearance', JSON.stringify(next));
        window.dispatchEvent(new Event('serenna-appearance-changed'));
      }
    } catch (error) {
      console.error('Failed to save salon name', error);
    }
  };

  const handleSaveCommissionSettings = async () => {
    const normalized = Math.max(0, Math.min(100, defaultCommissionPercent || 0));
    setDefaultCommissionPercent(normalized);

    setIsSavingCommissionSettings(true);
    setCommissionSettingsError(null);

    try {
      const updated = await updateSalonSettings({
        defaultCommissionRate: normalized / 100,
        commissionMode: commissionCalcMode,
      });

      const effectivePercent =
        updated.defaultCommissionRate != null
          ? Math.round(updated.defaultCommissionRate * 100)
          : normalized;

      setDefaultCommissionPercent(effectivePercent);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'serenna-default-commission',
          String(effectivePercent),
        );
      }
    } catch (error) {
      console.error('Failed to save commission settings', error);
      setCommissionSettingsError('Falha ao salvar configurações de comissão.');
    } finally {
      setIsSavingCommissionSettings(false);
    }
  };


  const handlePaletteChange = (
    theme: 'light' | 'dark',
    field: keyof ThemePalette,
    value: string,
  ) => {
    setAppearanceDraft(prev => {
      if (!prev) return prev;
      const next: AppearanceSettings = {
        ...prev,
        [theme]: {
          ...prev[theme],
          [field]: value,
        },
      };
      // Pré-visualização: aplica, mas não persiste até confirmação
      applyAppearance(next);
      return next;
    });
  };

  const handleConfirmPalette = async () => {
    if (!appearanceDraft) return;
    
    try {
      // Save to backend
      const themePayload: SalonTheme = {
        platformName: appearanceDraft.platformName,
        light: appearanceDraft.light,
        dark: appearanceDraft.dark,
      };
      
      await updateSalonSettings({ theme: themePayload });
      
      setAppearanceApplied(appearanceDraft);
      applyAppearance(appearanceDraft);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('serenna-appearance', JSON.stringify(appearanceDraft));
        window.dispatchEvent(new Event('serenna-appearance-changed'));
      }
    } catch (error) {
      console.error('Failed to save theme to backend', error);
      // Still apply locally even if backend save fails
      setAppearanceApplied(appearanceDraft);
      applyAppearance(appearanceDraft);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('serenna-appearance', JSON.stringify(appearanceDraft));
        window.dispatchEvent(new Event('serenna-appearance-changed'));
      }
    }
  };

  const handleCancelPalette = () => {
    if (!appearanceApplied) return;
    setAppearanceDraft(appearanceApplied);
    applyAppearance(appearanceApplied);
  };

  const handleAddCategory = async (group: CategoryGroup) => {
    const value = newCategoryValues[group].trim();
    if (!value) return;

    if (group === 'roles') {
      if (roleCategories.includes(value)) return;
      setRoleCategories(prev => [...prev, value]);
      setNewCategoryValues(prev => ({ ...prev, roles: '' }));
      return;
    }

    const currentList = group === 'services' ? serviceCategories : productCategories;
    if (currentList.includes(value)) return;

    try {
      setIsSavingCategory(true);
      setCategoriesError(null);

      const type: CategoryType = group === 'services' ? 'service' : 'product';
      const created = await createCategory({ type, name: value });

      if (group === 'services') {
        setServiceCategories(prev => [...prev, created.name]);
        setServiceCategoryIdsByName(prev => ({ ...prev, [created.name]: created.id }));
      } else {
        setProductCategories(prev => [...prev, created.name]);
        setProductCategoryIdsByName(prev => ({ ...prev, [created.name]: created.id }));
      }

      setNewCategoryValues(prev => ({ ...prev, [group]: '' }));
    } catch (error) {
      console.error('Failed to create category', error);
      setCategoriesError('Falha ao criar categoria. Verifique se o nome já não existe.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const askRemoveCategory = (group: CategoryGroup, category: string) => {
    setDeleteConfirm({ group, category });
  };

  const handleConfirmRemoveCategory = async () => {
    if (!deleteConfirm) return;

    const { group, category } = deleteConfirm;

    if (group === 'roles') {
      setRoleCategories(prev => prev.filter(c => c !== category));
      setDeleteConfirm(null);
      return;
    }

    const isService = group === 'services';
    const id = isService
      ? serviceCategoryIdsByName[category]
      : productCategoryIdsByName[category];

    if (!id) {
      console.warn('Category id not found for', category);
      if (isService) {
        setServiceCategories(prev => prev.filter(c => c !== category));
      } else {
        setProductCategories(prev => prev.filter(c => c !== category));
      }
      setDeleteConfirm(null);
      return;
    }

    try {
      setIsDeletingCategory(true);
      setCategoriesError(null);
      await deleteCategory(id);

      if (isService) {
        setServiceCategories(prev => prev.filter(c => c !== category));
        setServiceCategoryIdsByName(prev => {
          const next = { ...prev };
          delete next[category];
          return next;
        });
      } else {
        setProductCategories(prev => prev.filter(c => c !== category));
        setProductCategoryIdsByName(prev => {
          const next = { ...prev };
          delete next[category];
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to delete category', error);
      setCategoriesError('Falha ao remover categoria. Ela pode estar sendo usada em serviços ou produtos.');
    } finally {
      setDeleteConfirm(null);
      setIsDeletingCategory(false);
    }
  };

  const handleAddTemplate = async () => {
    try {
      setIsSavingTemplate(true);
      setTemplatesError(null);
      const newTemplate = await createMessageTemplate({
        name: 'Novo Template',
        channel: 'whatsapp',
        content: 'Olá {{cliente_nome}}, seu agendamento está confirmado para {{data}} às {{horario}}.',
      });
      setTemplates([...templates, newTemplate]);
      setSelectedTemplateId(newTemplate.id);
    } catch (error) {
      console.error('Failed to create template', error);
      setTemplatesError('Falha ao criar template.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleUpdateTemplate = async (updates: Partial<MessageTemplate>) => {
    if (!selectedTemplate) return;
    try {
      setIsSavingTemplate(true);
      setTemplatesError(null);
      const updated = await updateMessageTemplate(selectedTemplate.id, {
        name: updates.name,
        channel: updates.channel,
        content: updates.content,
        isActive: updates.isActive,
      });
      setTemplates(templates.map(t => (t.id === selectedTemplate.id ? updated : t)));
    } catch (error) {
      console.error('Failed to update template', error);
      setTemplatesError('Falha ao atualizar template.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleRemoveTemplate = async (id: string) => {
    try {
      setIsSavingTemplate(true);
      setTemplatesError(null);
      await deleteMessageTemplate(id);
      const filtered = templates.filter(t => t.id !== id);
      setTemplates(filtered);
      if (selectedTemplateId === id && filtered.length > 0) {
        setSelectedTemplateId(filtered[0].id);
      } else if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
      }
    } catch (error) {
      console.error('Failed to delete template', error);
      setTemplatesError('Falha ao remover template.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleInsertVariable = (key: string) => {
    if (!templateFormData) return;
    const placeholder = `{{${key}}}`;
    setTemplateFormData(prev => prev ? {
      ...prev,
      content: `${prev.content}${prev.content ? ' ' : ''}${placeholder}`,
    } : null);
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate || !templateFormData) return;
    try {
      setIsSavingTemplate(true);
      setTemplatesError(null);
      const updated = await updateMessageTemplate(selectedTemplate.id, {
        name: templateFormData.name,
        channel: templateFormData.channel,
        content: templateFormData.content,
      });
      setTemplates(templates.map(t => (t.id === selectedTemplate.id ? updated : t)));
    } catch (error) {
      console.error('Failed to update template', error);
      setTemplatesError('Falha ao atualizar template.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações do sistema e do salão.</p>
      </header>

      <div className="flex space-x-8 border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={() => setTab('geral')}
          className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'geral' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Geral
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab('mensagens')}
          className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'mensagens' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Mensagens
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab('integracoes')}
          className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'integracoes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Integrações
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab('personalizacao')}
          className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'personalizacao' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Personalização
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab('permissoes')}
          className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'permissoes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Permissões
        </Button>
      </div>

      <div>
        {tab === 'geral' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-md border border-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold text-text">Comissão padrão dos profissionais</h3>
                  <p className="text-sm text-text-muted max-w-xl">
                    Defina o percentual padrão de comissão aplicado quando um colaborador presta um serviço.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={defaultCommissionPercent}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isNaN(value)) {
                        setDefaultCommissionPercent(0);
                      } else {
                        setDefaultCommissionPercent(value);
                      }
                    }}
                    className="w-20 px-3 py-2 border border-border rounded-md bg-card text-right text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-text">%</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-text">Como calcular a comissão</p>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 text-sm text-text">
                    <input
                      type="radio"
                      name="commissionMode"
                      value="service"
                      checked={commissionCalcMode === 'service'}
                      onChange={() => setCommissionCalcMode('service')}
                    />
                    <span>Usar comissão definida no serviço</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-text">
                    <input
                      type="radio"
                      name="commissionMode"
                      value="professional"
                      checked={commissionCalcMode === 'professional'}
                      onChange={() => setCommissionCalcMode('professional')}
                    />
                    <span>Usar comissão definida no profissional</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end pt-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveCommissionSettings}
                  disabled={isSavingCommissionSettings || isLoadingCommissionSettings}
                >
                  Salvar configurações de comissão
                </Button>
              </div>
              {commissionSettingsError && (
                <p className="mt-2 text-xs text-red-500">{commissionSettingsError}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-text">Categorias do sistema</h3>
              <p className="text-sm text-text-muted">
                Visualize e organize separadamente as categorias usadas em serviços, produtos e funções da equipe.
              </p>
              {categoriesError && (
                <p className="text-xs text-red-500">{categoriesError}</p>
              )}
              {isLoadingCategories && (
                <p className="text-xs text-text-muted">Carregando categorias...</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categorias de serviços */}
              <div className="bg-card rounded-xl shadow-md border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text">Categorias de serviços</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingGroup(editingGroup === 'services' ? null : 'services')}
                  >
                    {editingGroup === 'services' ? 'Fechar' : 'Editar'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                  {serviceCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-background text-text text-xs border border-border"
                    >
                      {category}
                      {editingGroup === 'services' && (
                        <button
                          type="button"
                          className="ml-2 text-[10px] text-text-muted hover:text-red-500"
                          onClick={() => askRemoveCategory('services', category)}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  {serviceCategories.length === 0 && (
                    <span className="text-xs text-text-muted">Nenhuma categoria cadastrada.</span>
                  )}
                </div>

                {editingGroup === 'services' && (
                  <div className="space-y-2 pt-3 border-t border-border mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryValues.services}
                        onChange={(e) =>
                          setNewCategoryValues(prev => ({ ...prev, services: e.target.value }))
                        }
                        placeholder="Nova categoria de serviço"
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddCategory('services')}
                        disabled={isSavingCategory || isLoadingCategories}
                      >
                        Adicionar
                      </Button>
                    </div>

                    {deleteConfirm && deleteConfirm.group === 'services' && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background border border-border text-xs">
                        <span>
                          Remover categoria "{deleteConfirm.category}"?
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleConfirmRemoveCategory}
                            disabled={isDeletingCategory}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Categorias de produtos */}
              <div className="bg-card rounded-xl shadow-md border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text">Categorias de produtos</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingGroup(editingGroup === 'products' ? null : 'products')}
                  >
                    {editingGroup === 'products' ? 'Fechar' : 'Editar'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                  {productCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-background text-text text-xs border border-border"
                    >
                      {category}
                      {editingGroup === 'products' && (
                        <button
                          type="button"
                          className="ml-2 text-[10px] text-text-muted hover:text-red-500"
                          onClick={() => askRemoveCategory('products', category)}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  {productCategories.length === 0 && (
                    <span className="text-xs text-text-muted">Nenhuma categoria cadastrada.</span>
                  )}
                </div>

                {editingGroup === 'products' && (
                  <div className="space-y-2 pt-3 border-t border-border mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryValues.products}
                        onChange={(e) =>
                          setNewCategoryValues(prev => ({ ...prev, products: e.target.value }))
                        }
                        placeholder="Nova categoria de produto"
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddCategory('products')}
                        disabled={isSavingCategory || isLoadingCategories}
                      >
                        Adicionar
                      </Button>
                    </div>

                    {deleteConfirm && deleteConfirm.group === 'products' && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background border border-border text-xs">
                        <span>
                          Remover categoria "{deleteConfirm.category}"?
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={handleConfirmRemoveCategory}
                            disabled={isDeletingCategory}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {tab === 'mensagens' && (
          <div className="space-y-4">
            {templatesError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{templatesError}</p>
              </div>
            )}

            {isLoadingTemplates ? (
              <p className="text-text-muted">Carregando templates...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text">Templates</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddTemplate}
                      disabled={isSavingTemplate}
                    >
                      Novo
                    </Button>
                  </div>
                  <div className="bg-card rounded-xl shadow-md border border-border divide-y divide-border">
                    {templates.length === 0 ? (
                      <div className="p-4 text-center text-text-muted text-sm">
                        Nenhum template cadastrado. Clique em "Novo" para criar um.
                      </div>
                    ) : (
                      templates.map(template => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between ${selectedTemplateId === template.id ? 'bg-background' : 'hover:bg-background'
                            }`}
                        >
                          <span className="flex-1 truncate">{template.name}</span>
                          <span className="ml-2 text-xs uppercase text-text-muted">{template.channel}</span>
                          <button
                            type="button"
                            className="ml-2 text-xs text-text-muted hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTemplate(template.id);
                            }}
                            disabled={isSavingTemplate}
                          >
                            Excluir
                          </button>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  {selectedTemplate && templateFormData ? (
                    <div className="bg-card rounded-xl shadow-md border border-border p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text">Nome do template</label>
                          <input
                            type="text"
                            value={templateFormData.name}
                            onChange={(e) => setTemplateFormData(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text">Canal</label>
                          <select
                            value={templateFormData.channel}
                            onChange={(e) => setTemplateFormData(prev => prev ? { ...prev, channel: e.target.value as MessageTemplate['channel'] } : null)}
                            className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">Mensagem</label>
                        <textarea
                          rows={5}
                          value={templateFormData.content}
                          onChange={(e) => setTemplateFormData(prev => prev ? { ...prev, content: e.target.value } : null)}
                          className="mt-1 block w-full px-3 py-2 text-base border border-border focus:outline-none focus:ring-primary focus:border-primary rounded-md bg-card text-text"
                        />
                        <p className="mt-2 text-xs text-text-muted">
                          Monte a mensagem como ela será enviada. Você pode inserir informações dinâmicas usando os botões de variáveis abaixo.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-text">Variáveis disponíveis</p>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_VARIABLES.map(variable => (
                            <button
                              key={variable.key}
                              type="button"
                              className="px-3 py-1 rounded-full bg-background text-text text-xs border border-border hover:bg-border/40"
                              onClick={() => handleInsertVariable(variable.key)}
                            >
                              {variable.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-text-muted">
                          Ao clicar em uma variável, ela será adicionada na mensagem no formato {'{{variavel}}'}. O gestor não precisa decorar o código da variável.
                        </p>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-border">
                        <Button
                          type="button"
                          onClick={handleSaveTemplate}
                          disabled={isSavingTemplate}
                        >
                          {isSavingTemplate ? 'Salvando...' : 'Salvar Template'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-xl shadow-md border border-border p-8 text-center">
                      <p className="text-text-muted">
                        Selecione um template ou crie um novo para começar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'personalizacao' && appearanceDraft && (
          <div className="space-y-8 mt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-text">Personalização do salão</h3>
              <p className="text-sm text-text-muted max-w-2xl">
                Defina o nome do salão exibido na interface e ajuste separadamente as cores do modo claro e do modo escuro.
                As alterações de cor só são salvas após confirmação.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">Nome do salão</label>
                <input
                  type="text"
                  value={appearanceDraft.platformName}
                  onChange={(e) => handlePlatformNameChange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end mt-3">
                  <Button type="button" size="sm" onClick={handleSaveSalonName}>
                    Salvar nome do salão
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-text">Paleta de cores</h4>
                  <p className="text-xs text-text-muted">Edite separadamente o modo claro e o modo escuro.</p>
                </div>
                <div className="inline-flex rounded-full bg-sidebar p-1">
                  <button
                    type="button"
                    onClick={() => setEditingTheme('light')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${editingTheme === 'light'
                        ? 'bg-primary text-white'
                        : 'text-text-muted hover:text-text'
                      }`}
                  >
                    Modo claro
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTheme('dark')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${editingTheme === 'dark'
                        ? 'bg-primary text-white'
                        : 'text-text-muted hover:text-text'
                      }`}
                  >
                    Modo escuro
                  </button>
                </div>
              </div>

              {(() => {
                const palette = appearanceDraft[editingTheme];
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={palette.primaryColor}
                          onChange={(e) => handlePaletteChange(editingTheme, 'primaryColor', e.target.value)}
                          className="w-10 h-10 rounded-md border border-border bg-card cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">Cor primária</p>
                          <p className="text-xs text-text-muted">Botões principais e destaques.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={palette.secondaryColor}
                          onChange={(e) => handlePaletteChange(editingTheme, 'secondaryColor', e.target.value)}
                          className="w-10 h-10 rounded-md border border-border bg-card cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">Cor secundária</p>
                          <p className="text-xs text-text-muted">Detalhes e elementos de apoio.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={palette.accentColor}
                          onChange={(e) => handlePaletteChange(editingTheme, 'accentColor', e.target.value)}
                          className="w-10 h-10 rounded-md border border-border bg-card cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">Cor de destaque</p>
                          <p className="text-xs text-text-muted">Realces sutis, chips e estados.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={palette.backgroundColor}
                          onChange={(e) => handlePaletteChange(editingTheme, 'backgroundColor', e.target.value)}
                          className="w-10 h-10 rounded-md border border-border bg-card cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">Fundo</p>
                          <p className="text-xs text-text-muted">Plano de fundo principal.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={palette.textColor}
                          onChange={(e) => handlePaletteChange(editingTheme, 'textColor', e.target.value)}
                          className="w-10 h-10 rounded-md border border-border bg-card cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-text">Texto</p>
                          <p className="text-xs text-text-muted">Texto principal da interface.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
                      <Button type="button" variant="ghost" onClick={handleCancelPalette}>
                        Cancelar alterações
                      </Button>
                      <Button type="button" onClick={handleConfirmPalette}>
                        Salvar alterações
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {tab === 'integracoes' && <div>Conteúdo da aba Integrações</div>}

        {tab === 'permissoes' && <PermissionsTab />}
      </div>
    </div>
  );
};

const PermissionsTab = () => {
  const { user } = useAuth();
  const { permissions, refreshPermissions } = usePermissions();
  const [localPermissions, setLocalPermissions] = useState<Record<UserRole, string[]>>(permissions);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalPermissions(permissions);
  }, [permissions]);

  if (!isAdminLike(user)) {
    return (
      <div className="p-8 text-center text-text-muted">
        Apenas administradores podem configurar permissões.
      </div>
    );
  }

  const resources: Array<{ key: string; label: string }> = [
    { key: 'agenda', label: 'Agenda' },
    { key: 'comandas', label: 'Comandas' },
    { key: 'clientes', label: 'Clientes' },
    { key: 'servicos', label: 'Serviços' },
    { key: 'produtos', label: 'Produtos' },
    { key: 'colaboradores', label: 'Colaboradores' },
    { key: 'financeiro', label: 'Financeiro' },
    { key: 'configuracoes', label: 'Configurações' },
    { key: 'auditoria', label: 'Auditoria' },
    { key: 'notificacoes', label: 'Notificações' },
  ];

  const specificPermissions: Array<{ key: string; label: string }> = [
    { key: 'editarPerfilProfissionais', label: 'Pode editar perfil dos profissionais' },
    { key: 'podeEditarProduto', label: 'Pode editar produto' },
    { key: 'podeEditarServico', label: 'Pode editar serviço' },
  ];

  const roles: Array<{ key: UserRole; label: string }> = [
    { key: 'admin', label: 'Administrador' },
    { key: 'manager', label: 'Gerente' },
    { key: 'receptionist', label: 'Recepcionista' },
    { key: 'professional', label: 'Profissional' },
    { key: 'accountant', label: 'Contador' },
  ];

  const togglePermission = (role: UserRole, permissionKey: string) => {
    setLocalPermissions((prev) => {
      const rolePerms = prev[role] || [];
      const hasPermission = rolePerms.includes(permissionKey);

      return {
        ...prev,
        [role]: hasPermission
          ? rolePerms.filter((p) => p !== permissionKey)
          : [...rolePerms, permissionKey],
      };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateSalonSettings({ rolePermissions: localPermissions });
      await refreshPermissions();
    } catch (err: any) {
      console.error('Error saving permissions', err);
      setError(err.message || 'Erro ao salvar permissões');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultPerms: Record<UserRole, string[]> = {
      admin: [
        'agenda',
        'comandas',
        'clientes',
        'servicos',
        'produtos',
        'colaboradores',
        'financeiro',
        'configuracoes',
        'auditoria',
        'notificacoes',
        'editarPerfilProfissionais',
        'podeEditarProduto',
        'podeEditarServico',
      ],
      manager: [
        'servicos',
        'produtos',
        'colaboradores',
        'financeiro',
        'configuracoes',
        'auditoria',
        'podeEditarProduto',
        'podeEditarServico',
      ],
      receptionist: [
        'agenda',
        'comandas',
        'clientes',
        'servicos',
        'produtos',
        'colaboradores',
        'notificacoes',
      ],
      professional: [
        'agenda',
        'comandas',
        'clientes',
        'notificacoes',
      ],
      accountant: [
        'financeiro',
      ],
    };
    setLocalPermissions(defaultPerms);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text mb-2">Permissões por Role</h3>
        <p className="text-sm text-text-muted mb-4">
          Configure quais recursos cada tipo de usuário pode acessar. Administradores sempre têm acesso total.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="p-4 text-left text-sm font-semibold text-text">Recurso</th>
              {roles.map((role) => (
                <th key={role.key} className="p-4 text-center text-sm font-semibold text-text">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.key} className="border-b border-border hover:bg-background transition-colors">
                <td className="p-4 text-text">{resource.label}</td>
                {roles.map((role) => {
                  const hasPermission = localPermissions[role.key]?.includes(resource.key) ?? false;
                  const isAdmin = role.key === 'admin';
                  return (
                    <td key={role.key} className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isAdmin || hasPermission}
                        disabled={isAdmin}
                        onChange={() => !isAdmin && togglePermission(role.key, resource.key)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card rounded-xl shadow-md border border-border p-4">
        <h4 className="text-sm font-semibold text-text mb-3">Permissões Específicas</h4>
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="p-4 text-left text-sm font-semibold text-text">Permissão</th>
              {roles.map((role) => (
                <th key={role.key} className="p-4 text-center text-sm font-semibold text-text">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specificPermissions.map((perm) => (
              <tr key={perm.key} className="border-b border-border hover:bg-background transition-colors">
                <td className="p-4 text-text">{perm.label}</td>
                {roles.map((role) => {
                  const hasPermission = localPermissions[role.key]?.includes(perm.key) ?? false;
                  const isAdmin = role.key === 'admin';
                  return (
                    <td key={role.key} className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isAdmin || hasPermission}
                        disabled={isAdmin}
                        onChange={() => !isAdmin && togglePermission(role.key, perm.key)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={handleReset} disabled={isSaving}>
          Restaurar padrão
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar permissões'}
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;

