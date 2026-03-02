import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, User, Calendar, X } from 'lucide-react';
import { Button } from './Button';

interface QueueAssignmentResult {
  clientName: string;
  collaboratorName: string;
  collaboratorAvatarUrl?: string;
  appointmentStart: string;
  appointmentEnd: string;
  position: number;
}

interface QueueAssignmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  result: QueueAssignmentResult | null;
  isLoading?: boolean;
  error?: string | null;
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  });
};

const QueueAssignmentPopup: React.FC<QueueAssignmentPopupProps> = ({
  isOpen,
  onClose,
  result,
  isLoading = false,
  error = null,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card rounded-2xl shadow-elevated w-full max-w-md relative border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header */}
            <div className="relative gradient-primary-secondary p-6 pb-8">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {isLoading ? (
                <div className="flex flex-col items-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mb-3" />
                  <h2 className="text-xl font-bold">Adicionando à fila...</h2>
                  <p className="text-white/80 text-sm mt-1">Encontrando o melhor profissional</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center text-white">
                  <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center mb-3">
                    <X className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Erro</h2>
                  <p className="text-white/80 text-sm mt-1 text-center">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, damping: 15 }}
                  >
                    <CheckCircle className="w-14 h-14 text-white mb-3" />
                  </motion.div>
                  <h2 className="text-xl font-bold">Adicionado à Fila!</h2>
                  <p className="text-white/80 text-sm mt-1">Profissional atribuído automaticamente</p>
                </div>
              )}
            </div>

            {/* Content */}
            {result && !isLoading && !error && (
              <div className="p-6 -mt-4">
                {/* Professional card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="bg-background rounded-xl p-4 border border-border shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {result.collaboratorAvatarUrl ? (
                      <img
                        src={result.collaboratorAvatarUrl}
                        alt={result.collaboratorName}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full gradient-primary-secondary flex items-center justify-center ring-2 ring-primary/30">
                        <span className="text-xl font-bold text-white">
                          {result.collaboratorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Profissional</p>
                      <p className="text-lg font-bold text-text">{result.collaboratorName}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Details grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="grid grid-cols-2 gap-3 mt-4"
                >
                  <div className="bg-background rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-primary" />
                      <p className="text-xs text-text-muted font-medium">Cliente</p>
                    </div>
                    <p className="text-sm font-semibold text-text truncate">{result.clientName}</p>
                  </div>

                  <div className="bg-background rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-bold text-sm">#</span>
                      <p className="text-xs text-text-muted font-medium">Posição</p>
                    </div>
                    <p className="text-sm font-semibold text-text">{result.position}º na fila</p>
                  </div>

                  <div className="bg-background rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-xs text-text-muted font-medium">Horário</p>
                    </div>
                    <p className="text-sm font-semibold text-text">
                      {formatTime(result.appointmentStart)} - {formatTime(result.appointmentEnd)}
                    </p>
                  </div>

                  <div className="bg-background rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-xs text-text-muted font-medium">Data</p>
                    </div>
                    <p className="text-sm font-semibold text-text capitalize">
                      {formatDate(result.appointmentStart)}
                    </p>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-5"
                >
                  <Button onClick={onClose} className="w-full">
                    Entendido
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Error action */}
            {error && !isLoading && (
              <div className="p-6 -mt-4">
                <Button onClick={onClose} variant="ghost" className="w-full">
                  Fechar
                </Button>
              </div>
            )}

            {/* Loading placeholder */}
            {isLoading && (
              <div className="p-6 -mt-4">
                <div className="space-y-3">
                  <div className="h-20 bg-background rounded-xl animate-pulse" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-background rounded-xl animate-pulse" />
                    <div className="h-16 bg-background rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QueueAssignmentPopup;
