// src/pages/ClienteProfile.tsx
import { useParams, Link } from 'react-router-dom';
import { mockClients } from '../data/clients';
import { mockOrders } from '../data/orders';
import { ArrowLeft, Edit } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const ClienteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'novo';
  const client = mockClients.find(c => c.id === id);

  if (!client && !isNew) {
    return <div>Cliente não encontrado.</div>;
  }

  const clientOrders = mockOrders.filter(order => order.clientId === client?.id);

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
            {client?.tags && (
              <div className="mt-2 flex space-x-2">
                {client.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-2 rounded-full">
          <Edit className="w-5 h-5 text-text" />
        </Button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-primary text-primary">Histórico</a>
          <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-text-muted hover:text-text hover:border-border transition-colors">Preferências</a>
          <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-text-muted hover:text-text hover:border-border transition-colors">Observações</a>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        <h3 className="text-lg font-semibold text-text mb-4">Histórico de Comandas</h3>
        <div className="bg-card rounded-xl shadow-md border border-border">
          <ul className="divide-y divide-border">
            {clientOrders.map(order => (
              <li key={order.id} className="p-4 flex justify-between items-center hover:bg-background transition-colors">
                <div>
                  <p className="font-semibold text-text">Comanda #{order.id.slice(0,6)}</p>
                  <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text">{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <Badge>{order.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClienteProfile;
