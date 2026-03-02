// src/pages/UserProfile.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { changePassword, updateProfile } from '../../lib/api';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // All hooks must be declared before any early returns
  const [name, setName] = useState(user?.name ?? '');
  const [email] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-text">Nenhum usuário autenticado.</p>
        <Button onClick={() => navigate('/login')}>Ir para login</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    // Save profile fields (name, phone) if changed
    const nameChanged = name.trim() !== user.name;
    const phoneChanged = phone.trim() !== (user.phone ?? '');

    if (nameChanged || phoneChanged) {
      try {
        setIsSavingProfile(true);
        await updateProfile({
          ...(nameChanged ? { name: name.trim() } : {}),
          ...(phoneChanged ? { phone: phone.trim() } : {}),
        });
        setProfileSuccess(true);
        // Refresh user data in context
        if (refreshUser) await refreshUser();
        setTimeout(() => setProfileSuccess(false), 3000);
      } catch (err: any) {
        setProfileError(getUserFriendlyError(err, 'Erro ao atualizar perfil'));
        return;
      } finally {
        setIsSavingProfile(false);
      }
    }

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
        setPasswordError(getUserFriendlyError(err, ERROR_MESSAGES.PASSWORD_CHANGE_FAILED));
      } finally {
        setIsChangingPassword(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <header className="p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Meu perfil</h1>
          <p className="text-text-muted text-sm md:text-base">Edite suas informações pessoais. Todas as funções podem editar o próprio perfil.</p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-md border border-border p-4 md:p-6 space-y-4"
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
            disabled
            className="bg-sidebar text-text-muted cursor-not-allowed"
          />
          <p className="text-xs text-text-muted mt-1">O email não pode ser alterado.</p>
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

        {profileError && (
          <p className="text-xs text-red-600">{profileError}</p>
        )}
        {profileSuccess && (
          <p className="text-xs text-green-600">Perfil atualizado com sucesso!</p>
        )}

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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" disabled={isChangingPassword || isSavingProfile} className="w-full sm:w-auto">
            {isChangingPassword || isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
