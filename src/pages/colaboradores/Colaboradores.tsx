// src/pages/Colaboradores.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Mail, Phone, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminLike } from '../../lib/utils';
import type { Collaborator } from '../../types';
import { getCollaborators } from '../../lib/api';

const Colaboradores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = isAdminLike(user) || user?.tenantRole === 'manager';

  useEffect(() => {
    let isMounted = true;

    const loadCollaborators = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCollaborators();
        if (!isMounted) return;
        setCollaborators(data);
      } catch (err) {
        console.error('Failed to load collaborators', err);
        if (isMounted) {
          setError('Falha ao carregar colaboradores.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCollaborators();

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
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Colaboradores</h1>
          <p className="text-text-muted text-sm md:text-base mt-1">Gerencie sua equipe de profissionais</p>
        </div>
        {canCreate && (
          <Button onClick={() => navigate('/app/colaboradores/novo')} className="mt-2 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Novo Colaborador
          </Button>
        )}
      </header>

      {/* Search bar */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/30"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isLoading && (
        <p className="text-sm text-text-muted">Carregando colaboradores...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {collaborators
          .filter(collab => collab.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(collab => (
          <div key={collab.id} className="bg-card rounded-xl shadow-elevated border border-border p-4 md:p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <img 
                  src={collab.avatarUrl || `https://i.pravatar.cc/150?u=${collab.id}`}
                  alt={collab.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${collab.id}`;
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-text truncate">{collab.name}</h3>
                  <p className="text-xs md:text-sm text-text-muted capitalize">{collab.role}</p>
                </div>
              </div>
              <Badge variant={collab.status === 'active' ? 'success' : 'default'} className="text-xs">
                {collab.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              {collab.email && (
                <div className="flex items-center text-xs md:text-sm text-text-muted">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2 text-text-muted flex-shrink-0" />
                  <span className="truncate">{collab.email}</span>
                </div>
              )}
              {collab.phone && (
                <div className="flex items-center text-xs md:text-sm text-text-muted">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2 text-text-muted flex-shrink-0" />
                  {collab.phone}
                </div>
              )}
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/app/colaboradores/${collab.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colaboradores;

