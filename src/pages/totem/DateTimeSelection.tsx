// src/pages/totem/DateTimeSelection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { getTotemAvailability, type AvailabilityResponse } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

const DateTimeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { state, setSelectedDateTime, getTotalDuration } = useTotem();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.selectedCollaborator || state.selectedServices.length === 0) {
      navigate('/totem/servicos');
      return;
    }
  }, [state, navigate]);

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError(null);

    if (!state.selectedCollaborator) return;

    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const duration = getTotalDuration();
      const data = await getTotemAvailability({
        collaboratorId: state.selectedCollaborator.id,
        date: dateStr,
        duration,
      });
      setAvailability(data);
    } catch (err: any) {
      setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_AVAILABILITY_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    const slotDate = new Date(slot);
    setSelectedDateTime(slotDate);
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      setError('Selecione um horário');
      return;
    }
    navigate('/totem/confirmacao');
  };

  // Gerar próximos 30 dias
  const generateDateOptions = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-semibold text-primary mb-2 text-center">
          Escolha Data e Horário
        </h1>
        <p className="text-text-muted text-center mb-8">
          Selecione quando deseja realizar os serviços
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-card rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-text mb-4">Selecione a Data</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {dateOptions.map((date) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isPast = date < new Date();
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => !isPast && handleDateChange(date)}
                  disabled={isPast}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : isPast
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {date.toLocaleDateString('pt-BR', { day: '2-digit' })}
                  </div>
                  <div className="text-xs text-text-muted">
                    {date.toLocaleDateString('pt-BR', { month: 'short' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-card rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-text mb-4">
              Horários disponíveis - {formatDate(selectedDate)}
            </h3>
            {isLoading ? (
              <p className="text-text-muted text-center py-8">Carregando horários...</p>
            ) : availability && availability.availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availability.availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-text-muted text-center py-8">
                Nenhum horário disponível para esta data. Selecione outra data.
              </p>
            )}
          </div>
        )}

        {selectedSlot && (
          <div className="bg-card rounded-xl shadow-md p-6 mb-6">
            <p className="text-text">
              <span className="font-semibold">Data e horário selecionados:</span>{' '}
              {formatDate(new Date(selectedSlot))} às {formatTime(selectedSlot)}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/totem/profissional')}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedSlot}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DateTimeSelection;

