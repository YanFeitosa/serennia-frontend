// src/pages/totem/Confirmation.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { createTotemAppointment } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';
import { CheckCircle, XCircle } from 'lucide-react';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state, getTotalPrice, getTotalDuration, clearState } = useTotem();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    // Validar se todos os dados estão preenchidos
    if (!state.client) {
      navigate('/totem');
      return;
    }
    if (state.selectedServices.length === 0) {
      navigate('/totem/servicos');
      return;
    }
    if (!state.selectedCollaborator) {
      navigate('/totem/profissional');
      return;
    }
    if (!state.selectedDateTime) {
      navigate('/totem/data-hora');
      return;
    }
  }, [state, navigate]);

  const handleConfirm = async () => {
    if (!state.client || !state.selectedCollaborator || !state.selectedDateTime) {
      setError('Dados incompletos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const appointment = await createTotemAppointment({
        clientId: state.client.id,
        collaboratorId: state.selectedCollaborator.id,
        serviceIds: state.selectedServices.map((s) => s.id),
        start: state.selectedDateTime.toISOString(),
      });

      setAppointmentId(appointment.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao confirmar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    clearState();
    navigate('/totem');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl text-center"
        >
          <div className="bg-card p-8 rounded-xl shadow-serennia">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-semibold text-primary mb-4">
              Agendamento Confirmado!
            </h1>
            <p className="text-text-muted mb-6">
              Seu agendamento foi realizado com sucesso.
            </p>
            {appointmentId && (
              <div className="bg-background p-4 rounded-lg mb-6">
                <p className="text-sm text-text-muted mb-1">Código do agendamento</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {appointmentId.substring(0, 8).toUpperCase()}
                </p>
              </div>
            )}
            <Button size="lg" onClick={handleFinish} className="w-full sm:w-auto">
              Novo Agendamento
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-semibold text-primary mb-8 text-center">
          Confirme seu Agendamento
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-card rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Cliente</h2>
          <p className="text-text">{state.client?.name}</p>
          <p className="text-text-muted text-sm">{state.client?.phone}</p>
        </div>

        <div className="bg-card rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Serviços</h2>
          <div className="space-y-2">
            {state.selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div>
                  <p className="text-text font-medium">{service.name}</p>
                  <p className="text-sm text-text-muted">
                    {service.duration} minutos
                  </p>
                </div>
                <p className="font-semibold text-text">
                  R$ {service.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
            <p className="text-text font-semibold">Total</p>
            <p className="text-2xl font-bold text-primary">
              R$ {getTotalPrice().toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">Profissional</h2>
          <p className="text-text">{state.selectedCollaborator?.name}</p>
        </div>

        {state.selectedDateTime && (
          <div className="bg-card rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-text mb-4">Data e Horário</h2>
            <p className="text-text capitalize">{formatDate(state.selectedDateTime)}</p>
            <p className="text-text font-semibold text-lg">
              às {formatTime(state.selectedDateTime)}
            </p>
            <p className="text-sm text-text-muted mt-2">
              Duração estimada: {getTotalDuration()} minutos
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/totem/data-hora')}
            disabled={isSubmitting}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;

