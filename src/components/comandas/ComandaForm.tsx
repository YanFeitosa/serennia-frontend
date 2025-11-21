// src/components/comandas/ComandaForm.tsx
import React, { useEffect, useState } from 'react';
import type { Client, Service } from '../../types';
import { getClients, getServices } from '../../lib/api';

interface ComandaFormProps {
	initialClientId?: string;
	initialServiceIds?: string[];
}

const ComandaForm: React.FC<ComandaFormProps> = ({ initialClientId, initialServiceIds }) => {
	const [clients, setClients] = useState<Client[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const [clientsRes, servicesRes] = await Promise.all([
					getClients(),
					getServices(),
				]);

				setClients(clientsRes);
				setServices(servicesRes);
			} catch (err) {
				console.error('Error loading comanda form data', err);
				setError('Erro ao carregar dados para a comanda.');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	const client = initialClientId
		? clients.find((c) => c.id === initialClientId)
		: undefined;
	const selectedServices = initialServiceIds && initialServiceIds.length > 0
		? services.filter((s) => initialServiceIds.includes(s.id))
		: [];

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Nova Comanda</h2>
			{(isLoading || error) && (
				<p className="mb-2 text-sm text-text-muted">
					{isLoading ? 'Carregando dados...' : error}
				</p>
			)}
			{client && (
				<p className="mb-2 text-sm">
					Cliente selecionado: <span className="font-semibold">{client.name}</span>
				</p>
			)}
			{selectedServices.length > 0 && (
				<div className="mb-4 text-sm">
					<p className="font-medium">Serviços pré-selecionados:</p>
					<ul className="list-disc list-inside">
						{selectedServices.map((service) => (
							<li key={service.id}>{service.name}</li>
						))}
					</ul>
				</div>
			)}
			<p className="text-sm text-text-muted">
				Formulário para criar uma nova comanda. Em breve, este componente poderá ser estendido para
				abrir a comanda automaticamente com estes dados.
			</p>
		</div>
	);
};

export default ComandaForm;
