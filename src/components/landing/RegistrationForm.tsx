// src/components/landing/RegistrationForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterSchema } from '../../lib/schemas';
import { Button } from '../ui/Button';
import { register as registerUser } from '../../lib/api/register';

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

      console.log('📝 Submitting registration:', { 
        salonName: data.salonName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordLength: data.password.length 
      });

      try {
        const response = await registerUser({
          salonName: data.salonName,
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });

        console.log('✅ Registration response:', response);

        if (response.success) {
          setSuccess(true);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login', { 
              state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
            });
          }, 2000);
        } else {
          setError(response.message || 'Erro ao criar conta. Tente novamente.');
        }
      } catch (registerError: any) {
        console.error('❌ Registration API error:', registerError);
        throw registerError; // Re-throw to be caught by outer catch
      }
    } catch (err: any) {
      console.error('❌ Registration form error:', err);
      const errorMessage = err.message || 'Erro ao criar conta. Tente novamente.';
      console.error('Error details:', {
        message: errorMessage,
        name: err.name,
        stack: err.stack,
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Conta criada com sucesso!
        </h3>
        <p className="text-green-700">
          Redirecionando para o login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-xl border border-border">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-2">Crie sua conta grátis</h2>
        <p className="text-text-muted">
          Comece agora e gerencie seu salão de forma profissional
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Salon Name */}
        <div>
          <label htmlFor="salonName" className="block text-sm font-medium text-text mb-2">
            Nome do salão *
          </label>
          <input
            {...register('salonName')}
            id="salonName"
            type="text"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="Ex: Salão da Maria"
          />
          {errors.salonName && (
            <p className="mt-1 text-sm text-red-600">{errors.salonName.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
            Seu nome completo *
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="Ex: Maria Silva"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
            E-mail *
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
            Telefone *
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="(11) 99999-9999"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
            Senha *
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
            Confirmar senha *
          </label>
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-text"
            placeholder="Digite a senha novamente"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 mr-2"
          />
          <label htmlFor="terms" className="text-sm text-text-muted">
            Aceito os{' '}
            <a href="/terms" className="text-primary hover:underline">
              termos de uso
            </a>{' '}
            e{' '}
            <a href="/privacy" className="text-primary hover:underline">
              política de privacidade
            </a>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-text-muted">
          Já tem conta?{' '}
          <a href="/login" className="text-primary hover:underline font-medium">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;

