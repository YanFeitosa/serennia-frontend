// src/pages/Clientes.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, Calendar, Eye, UserPlus } from 'lucide-react';
import type { Client, Service } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { MultiSelectPlain } from '../../components/ui/MultiSelectPlain';
import QueueAssignmentPopup from '../../components/ui/QueueAssignmentPopup';
import { getClients, getOrders, getServices, addToQueue } from '../../lib/api';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  // Queue state
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

  // Service selection for queue
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedClientForQueue, setSelectedClientForQueue] = useState<Client | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    if (showServiceModal && allServices.length === 0) {
      getServices()
        .then(services => setAllServices(services.filter(s => s.isActive)))
        .catch(() => {});
    }
  }, [showServiceModal]);

  const handleQueueClick = (client: Client) => {
    setSelectedClientForQueue(client);
    setSelectedServiceIds([]);
    setShowServiceModal(true);
  };

  const handleConfirmQueue = async () => {
    if (!selectedClientForQueue || selectedServiceIds.length === 0) return;

    const client = selectedClientForQueue;
    setShowServiceModal(false);
    setSelectedClientForQueue(null);
    setSelectedServiceIds([]);

    setShowQueuePopup(true);
    setQueueLoading(true);
    setQueueError(null);
    setQueueResult(null);

    try {
      const entry = await addToQueue({ clientId: client.id, serviceIds: selectedServiceIds });
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
      // Try to extract server error message
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

  const getVisitCount = (clientId: string) =>
    orders.filter((order: any) => order.clientId === clientId).length;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Error loading orders for visit count', err);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getClients();
        if (!isMounted) return;
        setClients(data);
      } catch (err) {
        console.error('Failed to load clients', err);
        if (isMounted) {
          setError('Falha ao carregar clientes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Enhanced header with card styling */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Clientes</h1>
          <p className="text-text-muted text-sm md:text-base mt-1">Gerencie sua base de clientes</p>
        </div>
        <Button onClick={() => navigate('/app/clientes/novo')} className="mt-2 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </header>
      
      {/* Search section */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
        {error && (
          <p className="text-sm text-red-500 p-4">{error}</p>
        )}
        {isLoading && (
          <p className="text-sm text-text-muted p-4">Carregando clientes...</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-sidebar border-b border-border">
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nome</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Telefone</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Última Visita</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Visitas</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients
              .filter(client => {
                const term = searchTerm.toLowerCase().trim();
                if (!term) return true;
                const nameMatch = client.name.toLowerCase().includes(term);
                // For phone search: strip non-digits from both the search term and the phone,
                // then check if the phone number ENDS WITH the searched digits
                const searchDigits = term.replace(/\D/g, '');
                const phoneDigits = (client.phone || '').replace(/\D/g, '');
                const phoneMatch = searchDigits.length > 0 && phoneDigits.endsWith(searchDigits);
                return nameMatch || phoneMatch;
              })
              .map(client => (
                <tr key={client.id} className="hover:bg-sidebar transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="font-medium text-text text-sm">{client.name}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-text-muted hidden sm:block" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted hidden sm:table-cell">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                      {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : 'Nunca'}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 hidden md:table-cell">
                    <Badge variant={getVisitCount(client.id) > 5 ? 'success' : 'default'}>
                      {getVisitCount(client.id)} {getVisitCount(client.id) === 1 ? 'visita' : 'visitas'}
                    </Badge>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/app/clientes/${client.id}`)}>
                        <Eye className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleQueueClick(client)} title="Adicionar à fila">
                        <UserPlus className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Fila</span>
                      </Button>
                      <Button size="sm" onClick={() => navigate(`/app/agenda/novo?clientId=${client.id}`)}>
                        <span className="hidden sm:inline">Agendar</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service selection modal for queue */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => { setShowServiceModal(false); setSelectedClientForQueue(null); setSelectedServiceIds([]); }}
        title={`Serviços — ${selectedClientForQueue?.name}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Selecione os serviços que serão realizados.
          </p>
          <MultiSelectPlain
            options={allServices.map(s => ({ value: s.id, label: s.name }))}
            selected={selectedServiceIds}
            onChange={setSelectedServiceIds}
            placeholder="Selecione os serviços..."
            emptyText="Nenhum serviço encontrado."
          />
          {selectedServiceIds.length > 0 && (
            <p className="text-xs text-text-muted">
              Duração estimada: {allServices.filter(s => selectedServiceIds.includes(s.id)).reduce((sum, s) => sum + s.duration, 0)} min
            </p>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => { setShowServiceModal(false); setSelectedClientForQueue(null); setSelectedServiceIds([]); }}>
              Cancelar
            </Button>
            <Button size="sm" disabled={selectedServiceIds.length === 0} onClick={handleConfirmQueue}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>

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

export default Clientes;

