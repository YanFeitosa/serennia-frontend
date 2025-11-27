// src/pages/ColaboradorProfile.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Collaborator } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminLike } from '../../lib/utils';
import { getCollaboratorById } from '../../lib/api';

const getRoleLabel = (role: Collaborator['role']) => {
  switch (role) {
    case 'manager':
      return 'Gerente';
    case 'receptionist':
      return 'Recepcionista';
    case 'professional':
      return 'Profissional';
    case 'accountant':
      return 'Contador';
    default:
      return role;
  }
};

// Avatar placeholder component that shows initials or user icon
const AvatarPlaceholder = ({ name, className }: { name: string; className?: string }) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`bg-primary/20 flex items-center justify-center text-primary font-bold ${className || ''}`}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
};

const ColaboradorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const canEdit = isAdminLike(user) || user?.tenantRole === 'manager';
  const canViewCommission = isAdminLike(user) || user?.tenantRole === 'manager';

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadCollaborator = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCollaboratorById(id);
        if (!isMounted) return;
        setCollaborator(data);
      } catch (err) {
        console.error('Failed to load collaborator', err);
        if (isMounted) {
          setError('Falha ao carregar colaborador.');
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
  }, [id]);

  if (isLoading) {
    return <div>Carregando colaborador...</div>;
  }

  if (error || !collaborator) {
    return <div>{error || 'Colaborador não encontrado.'}</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/app/colaboradores" className="flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Colaboradores</span>
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
          {collaborator.avatarUrl ? (
            <img
              src={collaborator.avatarUrl}
              alt={collaborator.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-border"
              onError={(e) => {
                // Hide broken image and show placeholder
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent && !parent.querySelector('.avatar-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'avatar-fallback w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl md:text-2xl ring-2 ring-border';
                  fallback.textContent = collaborator.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <AvatarPlaceholder name={collaborator.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-2 ring-border text-xl md:text-2xl" />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{collaborator.name}</h1>
            <p className="text-text-muted capitalize">{getRoleLabel(collaborator.role)}</p>
            <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
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
            className="p-2 rounded-full self-end sm:self-auto"
            onClick={() => navigate('/app/colaboradores/novo', { state: { editCollaboratorId: collaborator.id } })}
          >
            <Edit className="w-5 h-5 text-text" />
          </Button>
        )}
      </header>

      <section className="bg-card rounded-xl shadow-md border border-border p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text">Informações do Colaborador</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text">
          <div>
            <p className="font-medium text-text-muted">Email</p>
            <p>{collaborator.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">Telefone</p>
            <p>{collaborator.phone || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">CPF</p>
            <p>{collaborator.cpf ? collaborator.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'Não informado'}</p>
          </div>
          {canViewCommission && (
            <div>
              <p className="font-medium text-text-muted">Comissão padrão</p>
              <p>{Math.round(collaborator.commissionRate * 100)}%</p>
            </div>
          )}
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
