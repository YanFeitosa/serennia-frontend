// src/pages/Servicos.tsx
import { useState, useEffect } from 'react';
import { Plus, Clock, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { getEffectiveRole } from '../../lib/utils';
import type { Service, UserRole } from '../../types';
import { getServices, deleteService } from '../../lib/api';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions();
  const effectiveRole = getEffectiveRole(user) as UserRole;
  const canEdit = can(effectiveRole, 'podeEditarServico');
  const canDelete = can(effectiveRole, 'podeDeletarServico');

  const handleDelete = async (service: Service) => {
    if (!canDelete) return;
    
    if (!confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) {
      return;
    }

    try {
      setDeletingId(service.id);
      await deleteService(service.id);
      setServices(prev => prev.filter(s => s.id !== service.id));
    } catch (err) {
      console.error('Failed to delete service', err);
      setError('Falha ao excluir serviço.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getServices();
        if (!isMounted) return;
        setServices(data);
      } catch (err) {
        console.error('Failed to load services', err);
        if (isMounted) {
          setError('Falha ao carregar serviços.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Enhanced header with card styling */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Serviços</h1>
          <p className="text-text-muted text-sm md:text-base mt-1">Gerencie os serviços oferecidos pelo salão</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('/app/servicos/novo')} className="mt-2 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        )}
      </header>
      
      {/* Search section */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
        {error && (
          <p className="text-sm text-red-500 p-4">{error}</p>
        )}
        {isLoading && (
          <p className="text-sm text-text-muted p-4">Carregando serviços...</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-sidebar border-b border-border">
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Serviço</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Duração</th>
                {canEdit && (
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Comissão</th>
                )}
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Preço</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services
                .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(service => (
                  <tr key={service.id} className="hover:bg-sidebar transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-text text-sm">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted hidden sm:table-cell">
                      {service.category ?? '-'}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 md:mr-2 text-text-muted" />
                        {service.duration}m
                      </div>
                    </td>
                    {canEdit && (
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted hidden md:table-cell">{`${Math.round((service.commission ?? 0) * 100)}%`}</td>
                    )}
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-semibold text-text">
                      {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/app/servicos/${service.id}`)}
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline ml-1">Editar</span>
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(service)}
                              disabled={deletingId === service.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Servicos;

