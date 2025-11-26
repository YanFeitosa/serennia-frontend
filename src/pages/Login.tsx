// src/pages/Login.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, type LoginSchema } from '../lib/schemas';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth, getDefaultPathForRole } from '../contexts/AuthContext';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setError(null);

      // Get salon_id from URL query params
      const searchParams = new URLSearchParams(location.search);
      const salonId = searchParams.get('salon_id');

      await loginUser(data.email, data.password, salonId || undefined);
      const from = (location.state as any)?.from?.pathname as string | undefined;
      // Get user role from auth context after login
      const authData = window.localStorage.getItem('serennia-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const user = parsed.user;
        if (user) {
          const target = from || getDefaultPathForRole(user.role as any);
          navigate(target, { replace: true });
          return;
        }
      }
      navigate('/app/agenda', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-serennia">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-primary">Serennia</h1>
          <p className="mt-2 text-text-muted">Bem-vindo(a) de volta!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-text-muted top-3 left-3" />
            <input
              {...register('email')}
              type="email"
              placeholder="E-mail"
              className="w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute w-5 h-5 text-text-muted top-3 left-3" />
            <input
              {...register('password')}
              type="password"
              placeholder="Senha"
              className="w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="text-sm text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default LoginPage;
