// src/pages/Servicos.tsx
import { useState, useEffect } from 'react';
import { Plus, Clock, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminLike } from '../../lib/utils';
import type { Service } from '../../types';
import { getServices } from '../../lib/api';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = isAdminLike(user) || user?.tenantRole === 'manager';

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
      <header className="flex items-center justify-between p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-primary">Serviços</h1>
          <p className="text-text-muted mt-1">Gerencie os serviços oferecidos pelo salão</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('/app/servicos/novo')} className="mt-2">
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
          <p className="text-sm text-red-500">{error}</p>
        )}
        {isLoading && (
          <p className="text-sm text-text-muted">Carregando serviços...</p>
        )}
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Serviço</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Duração</th>
              {canEdit && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Comissão</th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Preço</th>
              {canEdit && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services
              .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(service => (
                <tr key={service.id} className="hover:bg-sidebar transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-text">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {service.category ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-text-muted" />
                      {service.duration} min
                    </div>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-sm text-text-muted">{`${Math.round((service.commission ?? 0) * 100)}%`}</td>
                  )}
                  <td className="px-6 py-4 text-sm font-semibold text-text">
                    {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/app/servicos/${service.id}`)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servicos;

