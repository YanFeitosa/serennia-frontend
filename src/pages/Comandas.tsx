// src/pages/Comandas.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { mockOrders } from '../data/orders.ts';
import { mockClients } from '../data/clients.ts';
import { mockServices } from '../data/services.ts';
import { Button } from '../components/ui/Button.tsx';
import { Badge } from '../components/ui/Badge.tsx';
import Modal from '../components/ui/Modal.tsx';
import ComandaForm from '../components/comandas/ComandaForm.tsx';
import ComandaDetails from '../components/comandas/ComandaDetails.tsx';
import type { Order } from '../types/index.ts';

const Comandas = () => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'paid'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComanda, setExpandedComanda] = useState<string | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComanda(null);
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'open': return 'info';
      case 'closed': return 'warning';
      case 'paid': return 'success';
      default: return 'default';
    }
  };

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    return mockServices.find(s => s.id === serviceId)?.name || 'Serviço não encontrado';
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

  const filteredComandas = mockOrders.filter(comanda => {
    const clientName = getClientName(comanda.clientId);
    const matchesFilter = filter === 'all' || comanda.status === filter;
    const matchesSearch = 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comanda.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Comandas</h1>
            <p className="text-text-muted mt-1">Gerencie as comandas dos seus clientes</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Comanda
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por cliente ou comanda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border bg-card text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button size="sm" variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')}>Todas</Button>
            <Button size="sm" variant={filter === 'open' ? 'primary' : 'ghost'} onClick={() => setFilter('open')}>Abertas</Button>
            <Button size="sm" variant={filter === 'closed' ? 'primary' : 'ghost'} onClick={() => setFilter('closed')}>Fechadas</Button>
            <Button size="sm" variant={filter === 'paid' ? 'primary' : 'ghost'} onClick={() => setFilter('paid')}>Pagas</Button>
          </div>
        </div>
      </header>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredComandas.map(comanda => (
              <>
                <tr 
                  key={comanda.id} 
                  className="hover:bg-sidebar cursor-pointer transition-colors"
                  onClick={() => toggleExpand(comanda.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="font-medium text-text">{getClientName(comanda.clientId)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(comanda.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-text">
                      {comanda.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(comanda.status)}>{getStatusLabel(comanda.status)}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
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
                    <td colSpan={5} className="px-6 py-4 bg-sidebar">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-text mb-3">Itens da Comanda</h4>
                        <div className="bg-card rounded-lg border border-border overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-sidebar border-b border-border">
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Serviço</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-text-muted">Preço</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-text-muted">Horário</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {comanda.items.map(item => (
                                <tr key={item.id} className="hover:bg-sidebar">
                                  <td className="px-4 py-3 text-sm text-text">{getServiceName(item.serviceId)}</td>
                                  <td className="px-4 py-3 text-sm text-text text-right">
                                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-text-muted text-right">
                                    {new Date(comanda.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="text-text-muted">Subtotal: </span>
                              <span className="font-semibold text-text">
                                {comanda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                            {comanda.discount > 0 && (
                              <div className="text-sm">
                                <span className="text-text-muted">Desconto: </span>
                                <span className="font-semibold text-green-600">
                                  -{comanda.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                              </div>
                            )}
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
                                <Button size="sm" variant="secondary">Adicionar Item</Button>
                                <Button size="sm">Fechar Comanda</Button>
                              </>
                            )}
                            {/* Comandas fechadas: Efetuar Pagamento */}
                            {comanda.status === 'closed' && (
                              <Button size="sm" variant="primary">Efetuar Pagamento</Button>
                            )}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedComanda ? getClientName(selectedComanda.clientId) : 'Nova Comanda'}>
        {selectedComanda ? (
          <ComandaDetails order={selectedComanda} />
        ) : (
          <ComandaForm />
        )}
      </Modal>
    </div>
  );
};

export default Comandas;
