// src/pages/PagamentoComanda.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Client, Order, Product, Service } from '../../types';
import { getOrderById, getClients, getServices, getProducts, closeOrder, payOrder, getAppointmentById, updateAppointmentStatus } from '../../lib/api';

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

const PagamentoComanda = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [method, setMethod] = useState<'cash' | 'card' | 'pix' | 'online'>('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [orderRes, clientsRes, servicesRes, productsRes] = await Promise.all([
          getOrderById(id),
          getClients(),
          getServices(),
          getProducts(),
        ]);

        setOrder(orderRes);
        setClients(clientsRes);
        setServices(servicesRes);
        setProducts(productsRes);
      } catch (err) {
        console.error('Error loading order for payment', err);
        setError('Erro ao carregar comanda.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const servicesById = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services],
  );
  const productsById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  if (!order && isLoading) {
    return <div>Carregando comanda...</div>;
  }

  if (!order && error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Comanda não encontrada.</div>;
  }

  const client = clients.find((c) => c.id === order.clientId);
  const shortId = order.id.slice(0, 6);

  const serviceLines = new Map<string, { name: string; quantity: number; total: number }>();
  const productLines = new Map<string, { name: string; quantity: number; total: number }>();

  order.items.forEach((item) => {
    if (item.type === 'service' && item.serviceId) {
      const service = servicesById.get(item.serviceId);
      const key = item.serviceId;
      const name = service?.name || 'Serviço não encontrado';
      const existing = serviceLines.get(key);
      if (existing) {
        existing.quantity += 1;
        existing.total += item.price;
      } else {
        serviceLines.set(key, { name, quantity: 1, total: item.price });
      }
    }
    if (item.type === 'product' && item.productId) {
      const product = productsById.get(item.productId);
      const key = item.productId;
      const name = product?.name || 'Produto não encontrado';
      const existing = productLines.get(key);
      if (existing) {
        existing.quantity += 1;
        existing.total += item.price;
      } else {
        productLines.set(key, { name, quantity: 1, total: item.price });
      }
    }
  });

  const serviceSummary = Array.from(serviceLines.values());
  const productSummary = Array.from(productLines.values());

  const handleConfirm = async () => {
    if (!order) return;
    try {
      setIsSubmitting(true);
      let updated = order;
      if (updated.status === 'open') {
        updated = await closeOrder(updated.id);
      }
      if (updated.status === 'closed') {
        updated = await payOrder(updated.id);
      }
      setOrder(updated);
      // Se a comanda foi paga, tenta atualizar o agendamento relacionado para 'completed'
      if (updated.status === 'paid' && updated.appointmentId) {
        try {
          const appt = await getAppointmentById(updated.appointmentId);
          if (appt.status === 'in_progress' || appt.status === 'not_paid') {
            await updateAppointmentStatus(updated.appointmentId, 'completed');
          }
        } catch (err) {
          console.error('Error updating related appointment after payment', err);
          // Erro aqui não deve bloquear o fluxo de pagamento
        }
      }
      navigate('/app/comandas');
    } catch (err) {
      console.error('Error confirming payment', err);
      const message = err instanceof Error ? err.message : 'Erro ao confirmar pagamento.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/app/comandas" className="flex items-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Comandas</span>
      </Link>

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Pagamento da Comanda #{shortId}</h1>
          <p className="text-text-muted">
            Cliente: {client?.name ?? 'Cliente não encontrado'}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Resumo da Comanda
          </h2>
          <div className="space-y-4 text-sm text-text">
            {/* Lista de serviços */}
            {serviceSummary.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Serviços</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1">Serviço</th>
                      <th className="text-center py-1">Qtd</th>
                      <th className="text-right py-1">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceSummary.map((line) => (
                      <tr key={line.name} className="border-b border-border/60 last:border-0">
                        <td className="py-1 pr-2">{line.name}</td>
                        <td className="py-1 text-center">{line.quantity}</td>
                        <td className="py-1 text-right">
                          {line.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Lista de produtos */}
            {productSummary.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Produtos</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1">Produto</th>
                      <th className="text-center py-1">Qtd</th>
                      <th className="text-right py-1">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSummary.map((line) => (
                      <tr key={line.name} className="border-b border-border/60 last:border-0">
                        <td className="py-1 pr-2">{line.name}</td>
                        <td className="py-1 text-center">{line.quantity}</td>
                        <td className="py-1 text-right">
                          {line.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Resumo de valores */}
            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {order.items
                    .reduce((sum, item) => sum + item.price, 0)
                    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total a pagar</span>
                <span>{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Forma de pagamento
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={method === 'cash' ? 'primary' : 'ghost'}
                onClick={() => setMethod('cash')}
              >
                Dinheiro
              </Button>
              <Button
                type="button"
                variant={method === 'card' ? 'primary' : 'ghost'}
                onClick={() => setMethod('card')}
              >
                Cartão
              </Button>
              <Button
                type="button"
                variant={method === 'pix' ? 'primary' : 'ghost'}
                onClick={() => setMethod('pix')}
              >
                Pix
              </Button>
              <Button
                type="button"
                variant={method === 'online' ? 'primary' : 'ghost'}
                onClick={() => setMethod('online')}
              >
                Online
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Valor total a pagar</label>
              <div className="w-full px-3 py-2 border border-border rounded-md bg-muted text-text font-semibold text-right">
                {order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/app/comandas')}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={isSubmitting}>
              Confirmar pagamento
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PagamentoComanda;
