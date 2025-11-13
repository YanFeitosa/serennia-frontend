// src/pages/Servicos.tsx
import { useState } from 'react';
import { mockServices } from '../data/services';
import { Button } from '../components/ui/Button';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Modal state would be managed here
  // const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Serviços</h1>
          <p className="text-gray-500">Gerencie os serviços oferecidos pelo salão.</p>
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
          <Button className="font-semibold bg-secondary text-secondary border-2 border-primary font-bold py-4 px-4 rounded-lg w-40">+ Novo Serviço</Button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Duração</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Comissão</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockServices
              .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(service => (
              <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-semibold flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></span>
                  <span>{service.name}</span>
                </td>
                <td className="p-4">{service.duration} min</td>
                <td className="p-4">{service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4">{service.commission * 100}%</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servicos;

