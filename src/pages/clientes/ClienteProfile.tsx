// src/pages/ClienteProfile.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getClientById, getOrders, getServices, getProducts, deleteClient } from '../../lib/api';
import type { Client, Order, Service, Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';

const ClienteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const { can } = usePermissions();

  const canDelete = user?.role ? can(user.role, 'podeDeletarCliente') : false;

  const handleDelete = async () => {
    if (!client || !canDelete) return;
    
    if (!confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteClient(client.id);
      navigate('/app/clientes', { replace: true });
    } catch (err) {
      console.error('Failed to delete client', err);
      setError('Falha ao excluir cliente.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [clientData, ordersData, servicesData, productsData] = await Promise.all([
          getClientById(id),
          getOrders({ clientId: id }),
          getServices(),
          getProducts(),
        ]);
        if (!isMounted) return;
        setClient(clientData);
        setOrders(ordersData);
        setServices(servicesData);
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to load client data', err);
        if (isMounted) {
          setError('Falha ao carregar dados do cliente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <div>Carregando cliente...</div>;
  }

  if (error || !client) {
    return <div>{error || 'Cliente não encontrado.'}</div>;
  }

  const servicesById = new Map(services.map(s => [s.id, s]));
  const productsById = new Map(products.map(p => [p.id, p]));

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'closed':
        return 'Fechada';
      case 'paid':
        return 'Paga';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'open':
        return 'info';
      case 'closed':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/app/clientes" className="flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Clientes</span>
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{client?.name || 'Novo Cliente'}</h1>
          <p className="text-text-muted text-sm md:text-base">{client?.email || client?.phone}</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full"
            onClick={() => {
              if (!client) return;
              navigate('/app/clientes/novo', { state: { editClientId: client.id } });
            }}
          >
            <Edit className="w-5 h-5 text-text" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <div>
        <h3 className="text-lg font-semibold text-text mb-4">Histórico de Comandas</h3>
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
          <ul className="divide-y divide-border">
            {orders.length === 0 && (
              <li className="p-4 text-center text-text-muted">
                Nenhuma comanda encontrada para este cliente.
              </li>
            )}
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const serviceItems = order.items.filter(item => item.type === 'service' && item.serviceId);
              const productItems = order.items.filter(item => item.type === 'product' && item.productId);

              return (
                <li key={order.id} className="p-3 md:p-4 hover:bg-background transition-colors">
                  <button
                    type="button"
                    className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-text">Comanda #{order.id.slice(0,6)}</p>
                      <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-text">{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        <Badge variant={getStatusVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 border-t border-border pt-4 text-sm text-text">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Serviços</h4>
                          {serviceItems.length > 0 ? (
                            <ul className="space-y-1">
                              {serviceItems.map(item => {
                                const service = item.serviceId ? servicesById.get(item.serviceId) : undefined;
                                return (
                                  <li key={item.id} className="flex justify-between">
                                    <span>{service?.name || 'Serviço não encontrado'}</span>
                                    <span className="font-medium">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-text-muted">Nenhum serviço consumido.</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Produtos</h4>
                          {productItems.length > 0 ? (
                            <ul className="space-y-1">
                              {productItems.map(item => {
                                const product = item.productId ? productsById.get(item.productId) : undefined;
                                return (
                                  <li key={item.id} className="flex justify-between">
                                    <span>{product?.name || 'Produto não encontrado'}</span>
                                    <span className="font-medium">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-text-muted">Nenhum produto consumido.</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-right font-semibold">
                        Total: {order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClienteProfile;
