// src/pages/ColaboradorProfile.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Collaborator, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { getEffectiveRole } from '../../lib/utils';
import { getCollaboratorById, deleteCollaborator, updateCollaborator } from '../../lib/api';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const { user } = useAuth();
  const { can } = usePermissions();
  const effectiveRole = getEffectiveRole(user) as UserRole;
  const canEdit = can(effectiveRole, 'editarPerfilColaborador');
  const canViewCommission = can(effectiveRole, 'financeiro');
  const canDelete = can(effectiveRole, 'podeDeletarColaborador');
  const canViewBankingData = can(effectiveRole, 'verDadosBancariosColaborador');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Não informado';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleDelete = async () => {
    if (!collaborator || !canDelete) return;
    
    if (!confirm(`Tem certeza que deseja excluir o colaborador "${collaborator.name}"? Esta ação também removerá o acesso dele ao sistema.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCollaborator(collaborator.id);
      navigate('/app/colaboradores', { replace: true });
    } catch (err) {
      console.error('Failed to delete collaborator', err);
      setError('Falha ao excluir colaborador.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!collaborator || !canEdit) return;
    
    const newStatus = collaborator.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'ativar' : 'desativar';
    
    if (!confirm(`Deseja ${label} o colaborador "${collaborator.name}"?`)) {
      return;
    }

    try {
      setIsTogglingStatus(true);
      const updated = await updateCollaborator(collaborator.id, { status: newStatus });
      setCollaborator(updated);
    } catch (err) {
      console.error('Failed to toggle collaborator status', err);
      setError(`Falha ao ${label} colaborador.`);
    } finally {
      setIsTogglingStatus(false);
    }
  };

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
              {canEdit ? (
                <button
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className="cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
                  title={`Clique para ${collaborator.status === 'active' ? 'desativar' : 'ativar'}`}
                >
                  <Badge variant={collaborator.status === 'active' ? 'success' : 'default'}>
                    {isTogglingStatus ? 'Alterando...' : collaborator.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </button>
              ) : (
                <Badge variant={collaborator.status === 'active' ? 'success' : 'default'}>
                  {collaborator.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full"
                onClick={() => navigate('/app/colaboradores/novo', { state: { editCollaboratorId: collaborator.id } })}
              >
                <Edit className="w-5 h-5 text-text" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>
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
              <p className="font-medium text-text-muted">Comissão</p>
              <p>
                {Math.round(collaborator.commissionRate * 100)}%
                {collaborator.commissionMode === 'professional' ? ' (taxa fixa)' : ' (por serviço)'}
              </p>
            </div>
          )}
          <div>
            <p className="font-medium text-text-muted">Data de Admissão</p>
            <p>{formatDate(collaborator.hireDate)}</p>
          </div>
          <div>
            <p className="font-medium text-text-muted">Data de Nascimento</p>
            <p>{formatDate(collaborator.birthDate)}</p>
          </div>
          <div className="sm:col-span-2">
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

      {/* Dados Bancários - apenas para quem tem permissão */}
      {canViewBankingData && (collaborator.pixKey || collaborator.bankName) && (
        <section className="bg-card rounded-xl shadow-md border border-border p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Dados Bancários</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text">
            {collaborator.pixKey && (
              <>
                <div>
                  <p className="font-medium text-text-muted">Tipo de Chave PIX</p>
                  <p className="capitalize">{collaborator.pixKeyType || 'Não informado'}</p>
                </div>
                <div>
                  <p className="font-medium text-text-muted">Chave PIX</p>
                  <p className="font-mono">{collaborator.pixKey}</p>
                </div>
              </>
            )}
            {collaborator.bankName && (
              <>
                <div>
                  <p className="font-medium text-text-muted">Banco</p>
                  <p>{collaborator.bankName}</p>
                </div>
                <div>
                  <p className="font-medium text-text-muted">Tipo de Conta</p>
                  <p className="capitalize">{collaborator.bankAccountType === 'corrente' ? 'Corrente' : collaborator.bankAccountType === 'poupanca' ? 'Poupança' : 'Não informado'}</p>
                </div>
                <div>
                  <p className="font-medium text-text-muted">Agência</p>
                  <p>{collaborator.bankAgency || 'Não informado'}</p>
                </div>
                <div>
                  <p className="font-medium text-text-muted">Conta</p>
                  <p>{collaborator.bankAccount || 'Não informado'}</p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Endereço */}
      {(collaborator.address || collaborator.addressCity) && (
        <section className="bg-card rounded-xl shadow-md border border-border p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Endereço</h2>
          <div className="text-sm text-text">
            {collaborator.address && (
              <p>
                {collaborator.address}
                {collaborator.addressNumber && `, ${collaborator.addressNumber}`}
                {collaborator.addressComplement && ` - ${collaborator.addressComplement}`}
              </p>
            )}
            {collaborator.addressNeighborhood && (
              <p>{collaborator.addressNeighborhood}</p>
            )}
            {(collaborator.addressCity || collaborator.addressState) && (
              <p>
                {collaborator.addressCity}
                {collaborator.addressState && ` - ${collaborator.addressState}`}
              </p>
            )}
            {collaborator.addressZipCode && (
              <p>CEP: {collaborator.addressZipCode.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ColaboradorProfile;
