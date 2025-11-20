// src/pages/UserProfile.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const UserProfile = () => {
  const { user, loginAs } = useAuth();
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
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
    };

    loginAs(updatedUser);

    if (password.trim()) {
      // Apenas mock: em produção isso chamaria a API de alteração de senha
      // Mantemos o campo para futura integração
      alert('Senha alterada (simulação). Integração com a API será adicionada.');
      setPassword('');
    }

    alert('Perfil atualizado com sucesso.');
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
          <label className="block text-sm font-medium text-text mb-1">Nova senha</label>
          <Input
            type="password"
            placeholder="Digite uma nova senha (opcional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-text-muted">
            Este campo é apenas para simulação no front-end. A senha será de fato alterada quando a integração com a API estiver disponível.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar alterações</Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
