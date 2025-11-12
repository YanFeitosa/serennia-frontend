// src/pages/Clientes.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClients } from '../data/clients';
import { Button } from '../components/ui/Button';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Clientes</h1>
          <p className="text-gray-500">Gerencie sua base de clientes.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Button onClick={() => navigate('/clientes/novo')}>+ Novo Cliente</Button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Última Visita</th>
              <th className="p-4">Visitas</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockClients
            .filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(client => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-semibold">{client.name}</td>
                <td className="p-4">{client.phone}</td>
                <td className="p-4">{client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td className="p-4">{client.visitCount}</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/clientes/${client.id}`)}>Ver Perfil</Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/agenda/novo?clientId=${client.id}`)}>Agendar</Button>
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

