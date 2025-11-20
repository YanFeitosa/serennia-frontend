// src/pages/ClienteProfile.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockOrders } from '../data/orders';
import { mockServices } from '../data/services';
import { mockProducts } from '../data/products';
import { ArrowLeft, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Order, Client } from '../types';
import { getClientById } from '../lib/api';

const ClienteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadClient = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getClientById(id);
        if (!isMounted) return;
        setClient(data);
      } catch (err) {
        console.error('Failed to load client', err);
        if (isMounted) {
          setError('Falha ao carregar cliente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadClient();

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

  const clientOrders = mockOrders.filter(order => order.clientId === client.id);

  const servicesById = new Map(mockServices.map(s => [s.id, s]));
  const productsById = new Map(mockProducts.map(p => [p.id, p]));

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
      <Link to="/clientes" className="flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Clientes</span>
      </Link>

      <header className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img src={`https://i.pravatar.cc/150?u=${client?.id}`} alt={client?.name} className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-text">{client?.name || 'Novo Cliente'}</h1>
            <p className="text-text-muted">{client?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 rounded-full"
          onClick={() => {
            if (!client) return;
            navigate('/clientes/novo', { state: { editClientId: client.id } });
          }}
        >
          <Edit className="w-5 h-5 text-text" />
        </Button>
      </header>

      <div>
        <h3 className="text-lg font-semibold text-text mb-4">Histórico de Comandas</h3>
        <div className="bg-card rounded-xl shadow-md border border-border">
          <ul className="divide-y divide-border">
            {clientOrders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const serviceItems = order.items.filter(item => item.type === 'service' && item.serviceId);
              const productItems = order.items.filter(item => item.type === 'product' && item.productId);

              return (
                <li key={order.id} className="p-4 hover:bg-background transition-colors">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between"
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-text">Comanda #{order.id.slice(0,6)}</p>
                      <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
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
