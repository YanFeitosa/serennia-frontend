// src/components/comandas/ComandaDetails.tsx
import React, { useState } from 'react';
import type { Order } from '../../types';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';
import { Button } from '../ui/Button';
import AddItems from './AddItems';

interface ComandaDetailsProps {
  order: Order;
}

const ComandaDetails: React.FC<ComandaDetailsProps> = ({ order }) => {
  const [isAddingItems, setIsAddingItems] = useState(false);
  const client = mockClients.find(c => c.id === order.clientId);
  const services = mockServices.filter(s => order.items.some(item => item.serviceId === s.id));

  if (isAddingItems) {
    return <AddItems />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Cliente</h3>
        <p>{client?.name || 'Cliente não encontrado'}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Itens</h3>
        <ul className="divide-y divide-gray-200">
          {order.items.map(item => {
            const service = services.find(s => s.id === item.serviceId);
            return (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{service?.name || 'Serviço não encontrado'}</span>
                <span>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="text-right font-bold text-xl">
        Total: {order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="secondary" onClick={() => setIsAddingItems(true)}>Adicionar Itens</Button>
        <Button>Finalizar Comanda</Button>
      </div>
    </div>
  );
};

export default ComandaDetails;
