// src/pages/totem/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { totemClientLogin } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setClient, isDeviceAuthenticated, salonId } = useTotem();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to device login if not authenticated
    if (!isDeviceAuthenticated) {
      navigate('/totem/device-login');
    }
  }, [isDeviceAuthenticated, navigate]);

  const formatPhone = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (00) 00000-0000
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!salonId) {
      setError('Dispositivo não autenticado');
      return;
    }

    setIsLoading(true);

    try {
      const client = await totemClientLogin(phone, salonId);
      setClient(client);
      navigate('/totem/servicos');
    } catch (err: any) {
      setError(getUserFriendlyError(err, ERROR_MESSAGES.CLIENT_NOT_FOUND));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-4xl font-semibold text-primary mb-8 text-center">Identifique-se</h1>
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-serennia">
          <div className="mb-6">
            <label htmlFor="phone" className="block text-text text-sm font-medium mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full py-3 px-4 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
              placeholder="(00) 00000-0000"
              required
              maxLength={15}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-8">
            <Link
              to="/totem"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              ← Voltar
            </Link>
            <Button type="submit" size="lg" disabled={isLoading || !phone.trim()}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
