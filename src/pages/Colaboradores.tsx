// src/pages/Colaboradores.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Mail, Phone, Eye } from 'lucide-react';
import { mockCollaborators } from '../data/collaborators';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const Colaboradores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? 'admin';
  const canCreate = role === 'admin' || role === 'manager';

  return (
    <div className="space-y-4">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Colaboradores</h1>
            <p className="text-text-muted mt-1">Gerencie sua equipe de profissionais</p>
          </div>
          {canCreate && (
            <Button onClick={() => navigate('/colaboradores/novo')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Colaborador
            </Button>
          )}
        </div>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-card text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollaborators
          .filter(collab => collab.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(collab => (
          <div key={collab.id} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://i.pravatar.cc/150?u=${collab.id}`}
                  alt={collab.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-text">{collab.name}</h3>
                  <p className="text-sm text-text-muted capitalize">{collab.role}</p>
                </div>
              </div>
              <Badge variant={collab.status === 'active' ? 'success' : 'default'}>
                {collab.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              {collab.email && (
                <div className="flex items-center text-sm text-text-muted">
                  <Mail className="w-4 h-4 mr-2 text-text-muted" />
                  {collab.email}
                </div>
              )}
              {collab.phone && (
                <div className="flex items-center text-sm text-text-muted">
                  <Phone className="w-4 h-4 mr-2 text-text-muted" />
                  {collab.phone}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/colaboradores/${collab.id}`)}
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

