// src/pages/UserProfile.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { changePassword } from '../../lib/api';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-text">Nenhum usuário autenticado.</p>
        <Button onClick={() => navigate('/login')}>Ir para login</Button>
      </div>
    );
  }

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement profile update via backend API
    // For now, only password change is supported

    // Handle password change if provided
    if (newPassword.trim()) {
      if (newPassword.length < 8) {
        setPasswordError('A nova senha deve ter pelo menos 8 caracteres');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('As senhas não coincidem');
        return;
      }
      if (!currentPassword) {
        setPasswordError('Digite a senha atual');
        return;
      }

      try {
        setIsChangingPassword(true);
        setPasswordError(null);
        await changePassword({
          currentPassword,
          newPassword,
        });
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } catch (err: any) {
        setPasswordError(err.message || 'Erro ao alterar senha');
      } finally {
        setIsChangingPassword(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h1 className="text-3xl font-bold text-text">Meu perfil</h1>
        <p className="text-text-muted">Edite suas informações pessoais. Todas as funções podem editar o próprio perfil.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-text mb-1">Nome</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Telefone</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">Função</label>
          <Input value={user.role} disabled className="bg-sidebar text-text-muted cursor-not-allowed" />
        </div>

        <div className="pt-2 border-t border-border mt-2 space-y-2">
          <h3 className="text-sm font-medium text-text mb-2">Alterar senha</h3>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Senha atual</label>
            <Input
              type="password"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Nova senha</label>
            <Input
              type="password"
              placeholder="Digite uma nova senha (mínimo 8 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Confirmar nova senha</label>
            <Input
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {passwordError && (
            <p className="text-xs text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-xs text-green-600">Senha alterada com sucesso!</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
