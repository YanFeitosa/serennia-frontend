// src/pages/Agenda.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment, Client } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import QueueAssignmentPopup from '../../components/ui/QueueAssignmentPopup';
import DailyView from '../../components/agenda/DailyView';
import WeeklyView from '../../components/agenda/WeeklyView';
import MonthlyView from '../../components/agenda/MonthlyView';
import { getClients, addToQueue } from '../../lib/api';

const Agenda = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Queue states
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQueuePopup, setShowQueuePopup] = useState(false);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [queueResult, setQueueResult] = useState<{
    clientName: string;
    collaboratorName: string;
    collaboratorAvatarUrl?: string;
    appointmentStart: string;
    appointmentEnd: string;
    position: number;
  } | null>(null);

  const handleSearchClients = async (term: string) => {
    setClientSearchTerm(term);
    if (term.trim().length < 2) {
      setClientResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const clients = await getClients();
      const lowerTerm = term.toLowerCase().trim();
      const searchDigits = lowerTerm.replace(/\D/g, '');
      const filtered = clients.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(lowerTerm);
        const phoneDigits = (c.phone || '').replace(/\D/g, '');
        const phoneMatch = searchDigits.length > 0 && phoneDigits.endsWith(searchDigits);
        return nameMatch || phoneMatch;
      });
      setClientResults(filtered.slice(0, 10));
    } catch {
      setClientResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClientToQueue = async (client: Client) => {
    setShowClientSearch(false);
    setClientSearchTerm('');
    setClientResults([]);
    setShowQueuePopup(true);
    setQueueLoading(true);
    setQueueError(null);
    setQueueResult(null);

    try {
      const entry = await addToQueue({ clientId: client.id });
      setQueueResult({
        clientName: client.name,
        collaboratorName: entry.collaborator?.name || 'Profissional',
        collaboratorAvatarUrl: entry.collaborator?.avatarUrl,
        appointmentStart: entry.appointment?.start || entry.arrivedAt,
        appointmentEnd: entry.appointment?.end || entry.arrivedAt,
        position: entry.position,
      });
    } catch (err: any) {
      const message = err?.message || 'Falha ao adicionar à fila';
      try {
        const parsed = JSON.parse(message);
        setQueueError(parsed.error || message);
      } catch {
        setQueueError(message);
      }
    } finally {
      setQueueLoading(false);
    }
  };

  const handleEditAppointment = (appointment: Appointment | null) => {
    if (appointment?.id) {
      navigate(`/app/agenda/editar/${appointment.id}`);
    } else {
      navigate('/app/agenda/novo');
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const changeDate = (delta: number) => {
    const next = new Date(currentDate);
    if (view === 'daily') {
      next.setDate(next.getDate() + delta);
    } else if (view === 'weekly') {
      next.setDate(next.getDate() + delta * 7);
    } else {
      next.setMonth(next.getMonth() + delta);
    }
    setCurrentDate(next);
  };

  return (
    <div className="space-y-4">
      {/* Page header with gradient accent */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Agenda</h1>
          <p className="text-text-muted text-sm md:text-base">Visualize e gerencie seus agendamentos.</p>
          <p className="text-xs md:text-sm text-text-muted mt-1">
            {currentDate.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={view === 'daily' ? 'primary' : 'ghost'} onClick={() => setView('daily')}>Diária</Button>
            <Button size="sm" variant={view === 'weekly' ? 'primary' : 'ghost'} onClick={() => setView('weekly')}>Semanal</Button>
            <Button size="sm" variant={view === 'monthly' ? 'primary' : 'ghost'} onClick={() => setView('monthly')}>Mensal</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowClientSearch(true)} className="whitespace-nowrap border border-primary/30 text-primary hover:bg-primary/10">
              ⏱ Fila
            </Button>
            <Button size="sm" onClick={() => handleEditAppointment(null)} className="whitespace-nowrap">+ Novo</Button>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-1 text-sm">
            <Button variant="ghost" size="sm" onClick={() => changeDate(-1)}>
              Anterior
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Atual
            </Button>
            <Button variant="ghost" size="sm" onClick={() => changeDate(1)}>
              Próximo
            </Button>
          </div>
        </div>
      </header>
      
      {/* Decorative gradient line */}
      <div className="h-1 w-full rounded-full gradient-primary-secondary opacity-60" />

      {/* Render the selected view */}
      <div>
        {view === 'daily' && (
          <DailyView date={currentDate} onEditAppointment={handleEditAppointment} />
        )}
        {view === 'weekly' && (
          <WeeklyView
            date={currentDate}
            onSelectDate={(date: Date) => {
              setCurrentDate(date);
              setView('daily');
            }}
          />
        )}
        {view === 'monthly' && (
          <MonthlyView
            date={currentDate}
            onSelectDate={(date: Date) => {
              setCurrentDate(date);
              setView('daily');
            }}
          />
        )}
      </div>

      {/* Client search modal for queue */}
      <Modal
        isOpen={showClientSearch}
        onClose={() => { setShowClientSearch(false); setClientSearchTerm(''); setClientResults([]); }}
        title="Adicionar à Fila"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Busque o cliente para adicionar à fila de atendimento por ordem de chegada.
          </p>
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={clientSearchTerm}
            onChange={(e) => handleSearchClients(e.target.value)}
            autoFocus
          />
          {isSearching && (
            <p className="text-sm text-text-muted">Buscando...</p>
          )}
          {clientResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-1">
              {clientResults.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleAddClientToQueue(client)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors text-left border border-border"
                >
                  <div>
                    <p className="font-medium text-text text-sm">{client.name}</p>
                    <p className="text-xs text-text-muted">{client.phone}</p>
                  </div>
                  <span className="text-xs text-primary font-medium">Adicionar</span>
                </button>
              ))}
            </div>
          )}
          {clientSearchTerm.length >= 2 && clientResults.length === 0 && !isSearching && (
            <p className="text-sm text-text-muted text-center py-4">Nenhum cliente encontrado</p>
          )}
        </div>
      </Modal>

      {/* Queue assignment result popup */}
      <QueueAssignmentPopup
        isOpen={showQueuePopup}
        onClose={() => setShowQueuePopup(false)}
        result={queueResult}
        isLoading={queueLoading}
        error={queueError}
      />
    </div>
  );
};

export default Agenda;
