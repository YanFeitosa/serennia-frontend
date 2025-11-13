// src/pages/Comandas.tsx
import { useState } from 'react';
import { mockOrders } from '../data/orders.ts';
import { mockClients } from '../data/clients.ts';
import { Button } from '../components/ui/Button.tsx';
import { Badge } from '../components/ui/Badge.tsx';
import Modal from '../components/ui/Modal.tsx';
import ComandaForm from '../components/comandas/ComandaForm.tsx';
import ComandaDetails from '../components/comandas/ComandaDetails.tsx';
import type { Order } from '../types/index.ts';

const Comandas = () => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'pending_payment'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComanda(null);
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'open': return 'info';
      case 'closed': return 'success';
      case 'pending_payment': return 'warning';
      default: return 'default';
    }
  };

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Comandas</h1>
          <p className="text-gray-500">Gerencie as comandas dos seus clientes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por cliente ou comanda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Button variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')}>Todas</Button>
          <Button variant={filter === 'open' ? 'primary' : 'ghost'} onClick={() => setFilter('open')}>Abertas</Button>
          <Button variant={filter === 'closed' ? 'primary' : 'ghost'} onClick={() => setFilter('closed')}>Fechadas</Button>
          <Button variant={filter === 'pending_payment' ? 'primary' : 'ghost'} onClick={() => setFilter('pending_payment')}>Pendentes</Button>
        </div>
        <Button className="font-semibold bg-secondary text-secondary border-2 border-primary font-bold py-4 px-4 rounded-lg w-40" onClick={() => setIsModalOpen(true)}>+ Nova Comanda</Button>
      </header>

      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredComandas.map(comanda => (
              <tr key={comanda.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">{getClientName(comanda.clientId)}</td>
                <td className="p-4">{new Date(comanda.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">{comanda.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4"><Badge variant={getStatusVariant(comanda.status)}>{comanda.status}</Badge></td>
                <td className="p-4">
                  <Button variant="ghost" onClick={() => { setSelectedComanda(comanda); setIsModalOpen(true); }}>Ver</Button>
                </td>
              </tr>
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
