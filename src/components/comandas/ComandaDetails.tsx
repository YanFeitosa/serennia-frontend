// src/components/comandas/ComandaDetails.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { Order } from '../../types';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';
import { addItemToOrder, removeItemFromOrder } from '../../data/orders';
import { Button } from '../ui/Button';
import SearchableSelectPlain from '../ui/SearchableSelectPlain';

interface ComandaDetailsProps {
	order: Order;
	onOrderChange?: (order: Order) => void;
}

const ComandaDetails: React.FC<ComandaDetailsProps> = ({ order, onOrderChange }) => {
	const [currentOrder, setCurrentOrder] = useState<Order>(order);
	const [selectedServiceId, setSelectedServiceId] = useState('');

	useEffect(() => {
		setCurrentOrder(order);
	}, [order]);

	const client = mockClients.find(c => c.id === currentOrder.clientId);
	const servicesById = useMemo(
		() => new Map(mockServices.map(s => [s.id, s])),
		[]
	);

	const handleOrderUpdate = (updated: Order | null) => {
		if (!updated) return;
		setCurrentOrder(updated);
		if (onOrderChange) {
			onOrderChange(updated);
		}
	};

	const handleAddItem = () => {
		if (!selectedServiceId) return;
		const baseCollaboratorId = currentOrder.items[0]?.collaboratorId ?? 'collab-1';
		const updated = addItemToOrder(currentOrder.id, selectedServiceId, baseCollaboratorId);
		handleOrderUpdate(updated);
		setSelectedServiceId('');
	};

	const handleRemoveItem = (itemId: string) => {
		const updated = removeItemFromOrder(currentOrder.id, itemId);
		handleOrderUpdate(updated);
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Cliente</h3>
				<p>{client?.name || 'Cliente não encontrado'}</p>
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">Itens</h3>
				<ul className="divide-y divide-gray-200">
					{currentOrder.items.map(item => {
						const service = servicesById.get(item.serviceId);
						return (
							<li key={item.id} className="py-2 flex items-center justify-between">
								<div>
									<span>{service?.name || 'Serviço não encontrado'}</span>
								</div>
								<div className="flex items-center space-x-3">
									<span>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
									{currentOrder.status === 'open' && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => handleRemoveItem(item.id)}
										>
											Remover
										</Button>
									)}
								</div>
							</li>
						);
					})}
					{currentOrder.items.length === 0 && (
						<li className="py-2 text-sm text-text-muted">Nenhum item adicionado ainda.</li>
					)}
				</ul>
				{currentOrder.status === 'open' && (
					<div className="mt-4 space-y-2">
						<label className="block text-sm font-medium text-text">Adicionar serviço</label>
						<SearchableSelectPlain
							options={mockServices.map(service => ({ value: service.id, label: service.name }))}
							value={selectedServiceId}
							onChange={setSelectedServiceId}
							placeholder="Selecione um serviço"
						/>
						<div className="flex justify-end pt-2">
							<Button size="sm" onClick={handleAddItem} disabled={!selectedServiceId}>
								Adicionar
							</Button>
						</div>
					</div>
				)}
			</div>
			<div className="text-right font-bold text-xl">
				Total: {currentOrder.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
			</div>
			<div className="flex justify-end space-x-4 pt-4">
				<Button variant="secondary" disabled>
					Finalizar Comanda
				</Button>
			</div>
		</div>
	);
};

export default ComandaDetails;
