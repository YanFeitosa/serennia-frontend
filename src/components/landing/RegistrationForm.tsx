// src/components/landing/RegistrationForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterSchema } from '../../lib/schemas';
import { register as registerUser } from '../../lib/api/register';
import { CheckCircle, Loader2 } from 'lucide-react';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await registerUser({
        salonName: data.salonName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
          });
        }, 2000);
      } else {
        setError(response.message || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Conta criada com sucesso!
        </h3>
        <p className="text-gray-400">
          Redirecionando para o login...
        </p>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all";

  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Salon Name */}
        <div>
          <label htmlFor="salonName" className="block text-sm font-medium text-gray-300 mb-2">
            Nome do salão
          </label>
          <input
            {...register('salonName')}
            id="salonName"
            type="text"
            className={inputClasses}
            placeholder="Ex: Salão da Maria"
          />
          {errors.salonName && (
            <p className="mt-1 text-sm text-red-400">{errors.salonName.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Seu nome completo
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={inputClasses}
            placeholder="Ex: Maria Silva"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={inputClasses}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Telefone
            </label>
            <input
              {...register('phone')}
              id="phone"
              type="tel"
              className={inputClasses}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              className={inputClasses}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar senha
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              className={inputClasses}
              placeholder="Digite novamente"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 mr-3 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/20"
          />
          <label htmlFor="terms" className="text-sm text-gray-400">
            Aceito os{' '}
            <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
              termos de uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
              política de privacidade
            </Link>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar minha conta grátis'
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
