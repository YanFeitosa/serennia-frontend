// src/pages/ColaboradorProfile.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { mockCollaborators } from '../data/collaborators';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Collaborator } from '../types';
import { useAuth } from '../contexts/AuthContext';

const getRoleLabel = (role: Collaborator['role']) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'manager':
      return 'Gerente';
    case 'receptionist':
      return 'Recepcionista';
    case 'professional':
      return 'Profissional';
    default:
      return role;
  }
};

const ColaboradorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const collaborator = mockCollaborators.find(c => c.id === id);
  const { user } = useAuth();
  const role = user?.role ?? 'admin';
  const canEdit = role === 'admin' || role === 'manager';

  if (!collaborator) {
    return <div>Colaborador não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/colaboradores" className="flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Colaboradores</span>
      </Link>

      <header className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={`https://i.pravatar.cc/150?u=${collaborator.id}`}
            alt={collaborator.name}
            className="w-24 h-24 rounded-full object-cover ring-2 ring-border"
          />
          <div>
            <h1 className="text-3xl font-bold text-text">{collaborator.name}</h1>
            <p className="text-text-muted capitalize">{getRoleLabel(collaborator.role)}</p>
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant={collaborator.status === 'active' ? 'success' : 'default'}>
                {collaborator.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full"
            onClick={() => navigate('/colaboradores/novo', { state: { editCollaboratorId: collaborator.id } })}
          >
            <Edit className="w-5 h-5 text-text" />
          </Button>
        )}
      </header>

      <section className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text">Informações do Colaborador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text">
          <div>
            <p className="font-medium text-text-muted">Email</p>
            <p>{collaborator.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">Telefone</p>
            <p>{collaborator.phone || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">Comissão padrão</p>
            <p>{Math.round(collaborator.commissionRate * 100)}%</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">Categorias de serviços</p>
            {collaborator.serviceCategories && collaborator.serviceCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {collaborator.serviceCategories.map(category => (
                  <Badge key={category} variant="secondary">{category}</Badge>
                ))}
              </div>
            ) : (
              <p>Nenhuma categoria configurada</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ColaboradorProfile;
