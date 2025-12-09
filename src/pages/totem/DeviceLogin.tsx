// src/pages/totem/DeviceLogin.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { totemDeviceLogin } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';
import { Tablet, Lock } from 'lucide-react';

const DeviceLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginDevice, isAuthenticated } = useTotem();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to totem welcome
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/totem');
    }
  }, [isAuthenticated, navigate]);

  const formatAccessCode = (value: string) => {
    // Remove tudo exceto números e limita a 6 dígitos
    return value.replace(/\D/g, '').slice(0, 6);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAccessCode(e.target.value);
    setAccessCode(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (accessCode.length !== 6) {
      setError('O código de acesso deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await totemDeviceLogin(accessCode);
      loginDevice(response);
      navigate('/totem');
    } catch (err: any) {
      setError(err.message || 'Código de acesso inválido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Tablet className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Configuração do Totem</h1>
          <p className="text-text-muted">Digite o código de acesso do totem para vincular ao salão</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl shadow-elevated border border-border">
          <div className="mb-6">
            <label htmlFor="accessCode" className="block text-text text-sm font-medium mb-2">
              <Lock className="w-4 h-4 inline-block mr-1" />
              Código de Acesso
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="accessCode"
              value={accessCode}
              onChange={handleCodeChange}
              className="w-full py-4 px-4 border border-border rounded-xl text-text text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
              placeholder="000000"
              required
              maxLength={6}
              autoComplete="off"
            />
            {error && (
              <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isLoading || accessCode.length !== 6}
          >
            {isLoading ? 'Verificando...' : 'Conectar Totem'}
          </Button>

          <p className="mt-6 text-xs text-text-muted text-center">
            O código de acesso é gerado nas configurações do salão.
            Entre em contato com o administrador se você não possui o código.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default DeviceLogin;
