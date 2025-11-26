// src/pages/Login.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSchema, type LoginSchema } from '../lib/schemas';
import { Mail, Lock } from 'lucide-react';
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
    <div className="landing-theme min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(124, 58, 237, 0.2)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.2)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse"
          style={{ background: 'rgba(236, 72, 153, 0.1)', animationDelay: '2s' }}
        />
      </div>

      {/* Login card with glass-morphism */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div 
          className="p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          {/* Logo with gradient text */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Serennia
            </h1>
            <p className="mt-3 text-gray-400">Bem-vindo(a) de volta!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email input */}
            <div className="relative group">
              <Mail className="absolute w-5 h-5 text-gray-500 top-3.5 left-4 group-focus-within:text-purple-400 transition-colors" />
              <input
                {...register('email')}
                type="email"
                placeholder="E-mail"
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {errors.email && <p className="mt-1.5 text-sm text-pink-400">{errors.email.message}</p>}
            </div>

            {/* Password input */}
            <div className="relative group">
              <Lock className="absolute w-5 h-5 text-gray-500 top-3.5 left-4 group-focus-within:text-purple-400 transition-colors" />
              <input
                {...register('password')}
                type="password"
                placeholder="Senha"
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {errors.password && <p className="mt-1.5 text-sm text-pink-400">{errors.password.message}</p>}
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-sm text-pink-400">
                {error}
              </div>
            )}

            {/* Submit button with gradient */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <a href="/#contato" className="text-purple-400 hover:text-purple-300 transition-colors">
              Entre em contato
            </a>
          </p>
        </div>
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
