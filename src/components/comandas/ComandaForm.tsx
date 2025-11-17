// src/components/comandas/ComandaForm.tsx
import React from 'react';
import { mockClients } from '../../data/clients';
import { mockServices } from '../../data/services';

interface ComandaFormProps {
	initialClientId?: string;
	initialServiceIds?: string[];
}

const ComandaForm: React.FC<ComandaFormProps> = ({ initialClientId, initialServiceIds }) => {
	const client = initialClientId
		? mockClients.find(c => c.id === initialClientId)
		: undefined;
	const services = initialServiceIds && initialServiceIds.length > 0
		? mockServices.filter(s => initialServiceIds.includes(s.id))
		: [];

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Nova Comanda</h2>
			{client && (
				<p className="mb-2 text-sm">
					Cliente selecionado: <span className="font-semibold">{client.name}</span>
				</p>
			)}
			{services.length > 0 && (
				<div className="mb-4 text-sm">
					<p className="font-medium">Serviços pré-selecionados:</p>
					<ul className="list-disc list-inside">
						{services.map(service => (
							<li key={service.id}>{service.name}</li>
						))}
					</ul>
				</div>
			)}
			<p>Formulário para criar uma nova comanda.</p>
		</div>
	);
};

export default ComandaForm;
