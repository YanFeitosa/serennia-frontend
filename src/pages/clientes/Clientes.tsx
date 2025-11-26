// src/pages/Clientes.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, Calendar, Eye } from 'lucide-react';
import type { Client } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getClients, getOrders } from '../../lib/api';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

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
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Clientes</h1>
            <p className="text-text-muted mt-1">Gerencie sua base de clientes</p>
          </div>
          <Button onClick={() => navigate('/app/clientes/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-card text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {isLoading && (
          <p className="text-sm text-text-muted">Carregando clientes...</p>
        )}
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nome</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Última Visita</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Visitas</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients
            .filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(client => (
              <tr key={client.id} className="hover:bg-sidebar transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text">{client.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-text-muted" />
                    {client.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                    {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : 'Nunca'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getVisitCount(client.id) > 5 ? 'success' : 'default'}>
                    {getVisitCount(client.id)} {getVisitCount(client.id) === 1 ? 'visita' : 'visitas'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/app/clientes/${client.id}`)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Perfil
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/app/agenda/novo?clientId=${client.id}`)}>Agendar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;

