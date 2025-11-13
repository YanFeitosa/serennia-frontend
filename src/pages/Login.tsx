// src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginSchema } from '../lib/schemas';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log('Login data:', data);
    // Simulate API call
    setTimeout(() => {
      navigate('/'); // Redirect to root after login
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-serenna">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-primary">Serenna</h1>
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
            <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative px-2 text-sm bg-white text-text-muted">Ou continue com</div>
          </div>

          <Button type="button" variant="outline" className="w-full" size="lg">
            Entrar com Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
