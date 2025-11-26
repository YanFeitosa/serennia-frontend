// src/pages/totem/ProfessionalSelection.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { getTotemCollaborators, type TotemCollaborator } from '../../lib/api/totem';
import { useTotem } from '../../contexts/TotemContext';

const ProfessionalSelection: React.FC = () => {
  const navigate = useNavigate();
  const { state, setSelectedCollaborator } = useTotem();
  const [collaborators, setCollaborators] = useState<TotemCollaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollaborators = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extrair IDs de categorias dos serviços selecionados
        const categoryIds = state.selectedServices
          .map((s) => s.category?.id)
          .filter((id): id is string => id !== undefined);

        const data = await getTotemCollaborators({
          serviceCategoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        });
        setCollaborators(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar profissionais');
      } finally {
        setIsLoading(false);
      }
    };

    if (state.selectedServices.length === 0) {
      navigate('/totem/servicos');
      return;
    }

    loadCollaborators();
  }, [state.selectedServices, navigate]);

  const handleSelectCollaborator = (collaborator: TotemCollaborator) => {
    setSelectedCollaborator(collaborator);
    navigate('/totem/data-hora');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p className="text-text-muted">Carregando profissionais...</p>
      </div>
    );
  }

  if (error && collaborators.length === 0) {
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
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-semibold text-primary mb-2 text-center">
          Escolha o Profissional
        </h1>
        <p className="text-text-muted text-center mb-8">
          Selecione o profissional que realizará os serviços
        </p>

        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-600">{error}</p>
          </div>
        )}

        {collaborators.length === 0 ? (
          <div className="bg-card rounded-xl shadow-md p-8 text-center">
            <p className="text-text-muted">
              Nenhum profissional disponível para os serviços selecionados.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/totem/servicos')}
              className="mt-4"
            >
              Voltar e escolher outros serviços
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {collaborators.map((collaborator) => (
              <button
                key={collaborator.id}
                type="button"
                onClick={() => handleSelectCollaborator(collaborator)}
                className="bg-card p-6 rounded-xl shadow-md border-2 border-border hover:border-primary transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl text-primary">
                    {collaborator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {collaborator.name}
                </h3>
                {collaborator.serviceCategories.length > 0 && (
                  <p className="text-sm text-text-muted">
                    {collaborator.serviceCategories.join(', ')}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/totem/servicos')}
            className="flex-1"
          >
            Voltar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalSelection;

