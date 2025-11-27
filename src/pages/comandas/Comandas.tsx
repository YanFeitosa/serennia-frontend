// src/pages/Comandas.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { upsertNotification } from '../../data/notifications';
import type { Client, Notification, Order, OrderItem, Product, Service } from '../../types';
import ComandaDetails from '../../components/comandas/ComandaDetails';
import SearchableSelectPlain from '../../components/ui/SearchableSelectPlain';
import { getOrders, getClients, getServices, getProducts, createOrder, getAppointmentById, updateAppointmentStatus } from '../../lib/api';

const Comandas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as
    | { focusOrderId?: string; fromNewClientClientId?: string; newOrderClientId?: string }
    | null;
  const focusOrderId = state?.focusOrderId;
  const fromNewClientClientId = state?.fromNewClientClientId;
  const initialNewOrderClientId = state?.newOrderClientId ?? '';
  // Dados carregados do backend
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa comanda selecionada a partir do estado de navegação (agenda ou novo cliente)
  const [selectedComanda, setSelectedComanda] = useState<Order | null>(null);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComanda, setExpandedComanda] = useState<string | null>(() => selectedComanda?.id ?? null);
  const [newOrderClientId, setNewOrderClientId] = useState(initialNewOrderClientId);
  const [showNewOrderPanel, setShowNewOrderPanel] = useState<boolean>(!!initialNewOrderClientId);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [ordersRes, clientsRes, servicesRes, productsRes] = await Promise.all([
          getOrders(),
          getClients(),
          getServices(),
          getProducts(),
        ]);

        setOrders(ordersRes);
        setClients(clientsRes);
        setServices(servicesRes);
        setProducts(productsRes);
      } catch (err) {
        console.error('Error loading orders page data', err);
        setError('Erro ao carregar comandas.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Ajusta comanda inicial com base no estado de navegação assim que as comandas forem carregadas
  useEffect(() => {
    if (!orders.length) return;
    if (selectedComanda) return;

    if (focusOrderId) {
      const found = orders.find((o) => o.id === focusOrderId);
      if (found) {
        setSelectedComanda(found);
        setExpandedComanda(found.id);
        return;
      }
    }

    if (fromNewClientClientId) {
      // Delega para o painel de nova comanda
      setNewOrderClientId(fromNewClientClientId);
      setShowNewOrderPanel(true);
    }
  }, [orders, focusOrderId, fromNewClientClientId, selectedComanda]);

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const isOverdueOpenOrder = (order: Order): boolean => {
    if (order.status !== 'open') return false;
    const created = new Date(order.createdAt);
    return created.getTime() < todayAtMidnight.getTime();
  };

  const getStatusVariant = (order: Order) => {
    if (isOverdueOpenOrder(order)) return 'destructive';
    switch (order.status) {
      case 'open': return 'info';
      case 'closed': return 'warning';
      case 'paid': return 'success';
      default: return 'default';
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Cliente não encontrado';
  };

  const servicesById = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services],
  );
  const productsById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const getItemLabel = (item: OrderItem) => {
    if (item.type === 'service' && item.serviceId) {
      return servicesById.get(item.serviceId)?.name || 'Serviço não encontrado';
    }
    if (item.type === 'product' && item.productId) {
      return productsById.get(item.productId)?.name || 'Produto não encontrado';
    }
    return item.type === 'service' ? 'Serviço não encontrado' : 'Produto não encontrado';
  };

  const toggleExpand = (comandaId: string) => {
    setExpandedComanda(expandedComanda === comandaId ? null : comandaId);
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'closed': return 'Fechada';
      case 'paid': return 'Paga';
      default: return status;
    }
  };

  const statusPriority: Record<Order['status'], number> = {
    open: 0,
    closed: 1,
    paid: 2,
  };

  const overdueOpenOrders = orders.filter(isOverdueOpenOrder);

  useEffect(() => {
    if (overdueOpenOrders.length === 0) return;

    // Regra 2: se o agendamento relacionado estiver 'in_progress' e a comanda for de dia anterior,
    // atualiza o status do agendamento para 'not_paid'.
    const syncOverdueAppointments = async () => {
      for (const order of overdueOpenOrders) {
        if (!order.appointmentId) continue;
        try {
          const appt = await getAppointmentById(order.appointmentId);
          if (appt.status === 'in_progress') {
            await updateAppointmentStatus(order.appointmentId, 'not_paid');
          }
        } catch (err) {
          console.error('Error updating overdue appointment status', err);
        }
      }
    };

    syncOverdueAppointments();

    const message =
      overdueOpenOrders.length === 1
        ? 'Existe 1 comanda aberta com data anterior a hoje.'
        : `Existem ${overdueOpenOrders.length} comandas abertas com data anterior a hoje.`;

    const notification: Notification = {
      id: 'overdue-open-orders',
      userId: 'system',
      salonId: 'salon-1',
      message,
      read: false,
      createdAt: new Date().toISOString(),
      type: 'warning',
    };

    upsertNotification(notification);
  }, [overdueOpenOrders.length]);

  const filteredComandas = orders
    .filter((comanda: Order) => {
      const clientName = getClientName(comanda.clientId);
      const matchesFilter = filter === 'all' || comanda.status === filter;
      const matchesSearch =
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comanda.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a: Order, b: Order) => {
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      if (statusDiff !== 0) return statusDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-4">
      {/* Enhanced header with card styling */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Comandas</h1>
          <p className="text-text-muted text-sm md:text-base mt-1">Gerencie as comandas dos seus clientes</p>
        </div>
        <Button
          onClick={() => {
            setSelectedComanda(null);
            setExpandedComanda(null);
            setNewOrderClientId('');
            setShowNewOrderPanel(true);
          }}
          className="mt-2 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Comanda
        </Button>
      </header>

      {showNewOrderPanel && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">Cliente</label>
              <SearchableSelectPlain
                options={[
                  ...clients.map((client) => ({ value: client.id, label: client.name })),
                  { value: '__add_client__', label: '+ adicionar cliente' },
                ]}
                value={newOrderClientId}
                onChange={(value: string) => {
                  if (value === '__add_client__') {
                    navigate('/app/clientes/novo', { state: { from: 'comandas' } });
                    return;
                  }
                  setNewOrderClientId(value);
                }}
                placeholder="Selecione um cliente"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowNewOrderPanel(false);
                  setNewOrderClientId('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!newOrderClientId) return;
                  try {
                    const order = await createOrder({ clientId: newOrderClientId });
                    setOrders((prev) => [order, ...prev]);
                    setSelectedComanda(order);
                    setExpandedComanda(order.id);
                    setShowNewOrderPanel(false);
                    setNewOrderClientId('');
                  } catch (err) {
                    console.error('Error creating order', err);
                    alert('Erro ao abrir nova comanda.');
                  }
                }}
                disabled={!newOrderClientId}
              >
                Abrir comanda
              </Button>
            </div>
          </div>
        </div>
      )}

      {(isLoading || error) && (
        <div className="text-sm text-text-muted">
          {isLoading ? 'Carregando comandas...' : error}
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between bg-card rounded-xl p-4 border border-border">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por cliente ou comanda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button size="sm" variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')}>Todas</Button>
          <Button size="sm" variant={filter === 'open' ? 'primary' : 'ghost'} onClick={() => setFilter('open')}>Abertas</Button>
          <Button size="sm" variant={filter === 'closed' ? 'primary' : 'ghost'} onClick={() => setFilter('closed')}>Fechadas</Button>
          <Button size="sm" variant={filter === 'paid' ? 'primary' : 'ghost'} onClick={() => setFilter('paid')}>Pagas</Button>
        </div>
      </div>

      {selectedComanda && (
        <div
          ref={detailsRef}
          className="bg-card rounded-xl shadow-sm border border-border p-4 mb-4"
        >
          <ComandaDetails
            order={selectedComanda}
            onOrderChange={(next) => {
              setSelectedComanda(next);
              setExpandedComanda(next.id);
            }}
            onFinalize={(order) => navigate(`/comandas/${order.id}/pagamento`)}
          />
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-sidebar border-b border-border">
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Data</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Valor</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredComandas.map((comanda: Order) => (
                <>
                  <tr 
                    key={comanda.id} 
                    className={`hover:bg-sidebar cursor-pointer transition-colors ${
                      isOverdueOpenOrder(comanda) ? 'bg-red-950/30' : ''
                    }`}
                    onClick={() => toggleExpand(comanda.id)}
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex items-center">
                        <div className="font-medium text-text text-sm">{getClientName(comanda.clientId)}</div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted hidden sm:table-cell">
                      {new Date(comanda.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm font-semibold text-text">
                        {comanda.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <Badge variant={getStatusVariant(comanda)}>{getStatusLabel(comanda.status)}</Badge>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {expandedComanda === comanda.id ? (
                          <ChevronUp className="w-5 h-5 text-text-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-muted" />
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedComanda === comanda.id && (
                    <tr>
                      <td colSpan={5} className="px-4 md:px-6 py-4 bg-sidebar">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-text mb-3">Itens da Comanda</h4>
                          <div className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[400px]">
                                <thead>
                                  <tr className="bg-sidebar border-b border-border">
                                    <th className="px-3 md:px-4 py-2 text-left text-xs font-medium text-text-muted">Itens</th>
                                    <th className="px-3 md:px-4 py-2 text-right text-xs font-medium text-text-muted">Preço</th>
                                    <th className="px-3 md:px-4 py-2 text-right text-xs font-medium text-text-muted hidden sm:table-cell">Horário</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {comanda.items.map((item: OrderItem) => (
                                    <tr key={item.id} className="hover:bg-sidebar">
                                      <td className="px-3 md:px-4 py-3 text-sm text-text">{getItemLabel(item)}</td>
                                      <td className="px-3 md:px-4 py-3 text-sm text-text text-right">
                                        {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                      </td>
                                      <td className="px-3 md:px-4 py-3 text-sm text-text-muted text-right hidden sm:table-cell">
                                        {new Date(comanda.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <div className="text-sm">
                              <span className="text-text-muted">Subtotal: </span>
                              <span className="font-semibold text-text">
                                {comanda.items
                                  .reduce(
                                    (sum: number, item: OrderItem) => sum + item.price,
                                    0,
                                  )
                                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-text-muted">Total: </span>
                              <span className="font-bold text-text">
                                {comanda.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {/* Comandas abertas: Adicionar Item e Fechar Comanda */}
                            {comanda.status === 'open' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedComanda(comanda);
                                    setExpandedComanda(comanda.id);
                                    if (detailsRef.current) {
                                      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                >
                                  Adicionar Item
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/comandas/${comanda.id}/pagamento`)}
                                >
                                  Finalizar Comanda
                                </Button>
                              </>
                            )}
                            {/* Comandas fechadas: nenhuma ação, aguardam pagamento */}
                            {/* Comandas pagas: nenhuma ação */}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Comandas;
