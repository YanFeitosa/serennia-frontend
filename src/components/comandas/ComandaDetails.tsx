// src/components/comandas/ComandaDetails.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { Client, Collaborator, Order, Product, Service } from '../../types';
import { Button } from '../ui/Button';
import SearchableSelectPlain from '../ui/SearchableSelectPlain';
import Modal from '../ui/Modal';
import { getClients, getCollaborators, getProducts, getServices, addOrderItem, removeOrderItem } from '../../lib/api';

interface ComandaDetailsProps {
	order: Order;
	onOrderChange?: (order: Order) => void;
	onFinalize?: (order: Order) => void;
}

const ComandaDetails: React.FC<ComandaDetailsProps> = ({ order, onOrderChange, onFinalize }) => {
	const [currentOrder, setCurrentOrder] = useState<Order>(order);
	const [selectedServiceId, setSelectedServiceId] = useState('');
	const [selectedProductId, setSelectedProductId] = useState('');
	const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
	const [itemToRemove, setItemToRemove] = useState<string | null>(null);
	const [clients, setClients] = useState<Client[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setCurrentOrder(order);
	}, [order]);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const [clientsRes, collaboratorsRes, servicesRes, productsRes] = await Promise.all([
					getClients(),
					getCollaborators(),
					getServices(),
					getProducts(),
				]);

				setClients(clientsRes);
				setCollaborators(collaboratorsRes);
				setServices(servicesRes);
				setProducts(productsRes);
			} catch (err) {
				console.error('Error loading comanda details data', err);
				setError('Erro ao carregar dados da comanda.');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	const client = clients.find(c => c.id === currentOrder.clientId);
	const servicesById = useMemo(
		() => new Map(services.map(s => [s.id, s])),
		[services]
	);
	const productsById = useMemo(
		() => new Map(products.map(p => [p.id, p])),
		[products]
	);

	const handleOrderUpdate = (updated: Order | null) => {
		if (!updated) return;
		setCurrentOrder(updated);
		if (onOrderChange) {
			onOrderChange(updated);
		}
	};

	const handleAddService = async () => {
		if (!selectedServiceId || !selectedCollaboratorId) return;
		try {
			const updated = await addOrderItem(currentOrder.id, {
				type: 'service',
				serviceId: selectedServiceId,
				collaboratorId: selectedCollaboratorId,
				quantity: 1,
			});
			handleOrderUpdate(updated);
			setSelectedServiceId('');
			setSelectedCollaboratorId('');
		} catch (err) {
			console.error('Error adding service to order', err);
			alert('Erro ao adicionar serviço à comanda.');
		}
	};

	const handleAddProduct = async () => {
		if (!selectedProductId) return;
		try {
			const updated = await addOrderItem(currentOrder.id, {
				type: 'product',
				productId: selectedProductId,
				quantity: 1,
			});
			handleOrderUpdate(updated);
			setSelectedProductId('');
		} catch (err) {
			console.error('Error adding product to order', err);
			alert('Erro ao adicionar produto à comanda.');
		}
	};

	const handleConfirmRemoveItem = async () => {
		if (!itemToRemove) return;
		try {
			const updated = await removeOrderItem(currentOrder.id, itemToRemove);
			handleOrderUpdate(updated);
			setItemToRemove(null);
		} catch (err) {
			console.error('Error removing item from order', err);
			alert('Erro ao remover item da comanda.');
		}
	};

	return (
		<div className="space-y-4">
			{(isLoading || error) && (
				<div className="text-sm text-text-muted">
					{isLoading ? 'Carregando dados da comanda...' : error}
				</div>
			)}
			<div>
				<h3 className="text-lg font-semibold">Cliente</h3>
				<p>{client?.name || 'Cliente não encontrado'}</p>
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">Itens</h3>
				<ul className="divide-y divide-gray-200">
					{currentOrder.items.map(item => {
						const service = item.type === 'service' && item.serviceId ? servicesById.get(item.serviceId) : undefined;
						const product = item.type === 'product' && item.productId ? productsById.get(item.productId) : undefined;
						const label =
							item.type === 'service'
								? service?.name || 'Serviço não encontrado'
								: product?.name || 'Produto não encontrado';
						const typeLabel = item.type === 'service' ? 'Serviço' : 'Produto';
						return (
							<li key={item.id} className="py-2 flex items-center justify-between">
								<div className="flex flex-col">
									<span className="font-medium">{label}</span>
									<span className="text-xs text-text-muted">{typeLabel}</span>
								</div>
								<div className="flex items-center space-x-3">
									<span>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
									{currentOrder.status === 'open' && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setItemToRemove(item.id)}
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
					<div className="mt-4 space-y-4">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-text">Adicionar serviço</label>
							<SearchableSelectPlain
								options={collaborators
									.filter((collab) => collab.status === 'active' && collab.role === 'professional')
									.map((collab) => ({ value: collab.id, label: collab.name }))}
								value={selectedCollaboratorId}
								onChange={setSelectedCollaboratorId}
								placeholder="Selecione o profissional"
							/>
							<SearchableSelectPlain
								options={services.map((service) => ({ value: service.id, label: service.name }))}
								value={selectedServiceId}
								onChange={setSelectedServiceId}
								placeholder="Selecione um serviço"
							/>
							<div className="flex justify-end pt-2">
								<Button
									size="sm"
									onClick={handleAddService}
									disabled={!selectedServiceId || !selectedCollaboratorId}
								>
									Adicionar serviço
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-text">Adicionar produto</label>
							<SearchableSelectPlain
								options={products.map((product) => ({ value: product.id, label: product.name }))}
								value={selectedProductId}
								onChange={setSelectedProductId}
								placeholder="Selecione um produto"
							/>
							<div className="flex justify-end pt-2">
								<Button size="sm" onClick={handleAddProduct} disabled={!selectedProductId}>
									Adicionar produto
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="text-right font-bold text-xl">
				Total: {currentOrder.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
			</div>
			<div className="flex justify-end space-x-4 pt-4">
				<Button
					variant="secondary"
					onClick={() => onFinalize?.(currentOrder)}
				>
					Finalizar Comanda
				</Button>
			</div>

			<Modal
				isOpen={itemToRemove !== null}
				onClose={() => setItemToRemove(null)}
				title="Remover item"
			>
				<p className="mb-4 text-sm text-text">
					Tem certeza que deseja remover este item da comanda?
				</p>
				<div className="flex justify-end space-x-2">
					<Button variant="ghost" onClick={() => setItemToRemove(null)}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={handleConfirmRemoveItem}>
						Remover
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default ComandaDetails;
