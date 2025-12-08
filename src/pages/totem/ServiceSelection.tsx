// src/pages/totem/ServiceSelection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { getTotemServices, type TotemService } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

const ServiceSelection: React.FC = () => {
  const navigate = useNavigate();
  const { state, addService, removeService, getTotalPrice, getTotalDuration } = useTotem();
  const [services, setServices] = useState<TotemService[]>([]);
  const [categories, setCategories] = useState<Record<string, TotemService[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTotemServices();
        setServices(data);

        // Agrupar por categoria
        const grouped: Record<string, TotemService[]> = {};
        data.forEach((service) => {
          const categoryName = service.category?.name || 'Outros';
          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }
          grouped[categoryName].push(service);
        });
        setCategories(grouped);
      } catch (err: any) {
        setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_SERVICES_FAILED));
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleServiceToggle = (service: TotemService) => {
    const isSelected = state.selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const handleContinue = () => {
    if (state.selectedServices.length === 0) {
      setError('Selecione pelo menos um serviço');
      return;
    }
    navigate('/totem/profissional');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p className="text-text-muted">Carregando serviços...</p>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-semibold text-primary mb-2 text-center">
          Selecione os Serviços
        </h1>
        <p className="text-text-muted text-center mb-8">
          Toque nos serviços desejados
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {Object.entries(categories).map(([categoryName, categoryServices]) => (
            <div key={categoryName} className="bg-card rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-text mb-4">{categoryName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServices.map((service) => {
                  const isSelected = state.selectedServices.some((s) => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-text">{service.name}</h3>
                        {isSelected && (
                          <span className="text-primary text-xl">✓</span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-text-muted mb-2">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-text-muted">
                          {service.duration} min
                        </span>
                        <span className="font-semibold text-primary">
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {state.selectedServices.length > 0 && (
          <div className="bg-card rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-text mb-4">Resumo</h3>
            <div className="space-y-2 mb-4">
              {state.selectedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <span className="text-text">{service.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-text-muted">{service.duration} min</span>
                    <span className="font-semibold text-text">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Duração total</p>
                <p className="text-lg font-semibold text-text">{getTotalDuration()} minutos</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Total</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/totem')}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={state.selectedServices.length === 0}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceSelection;
