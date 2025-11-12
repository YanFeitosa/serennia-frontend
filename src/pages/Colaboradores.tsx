// src/pages/Colaboradores.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCollaborators } from '../data/collaborators';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const Colaboradores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Colaboradores</h1>
          <p className="text-gray-500">Gerencie sua equipe.</p>
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
          <Button onClick={() => navigate('/colaboradores/novo')}>+ Novo Colaborador</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollaborators
          .filter(collab => collab.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(collab => (
          <div key={collab.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <img 
              src={`https://i.pravatar.cc/150?u=${collab.id}`}
              alt={collab.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-lg font-bold">{collab.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{collab.role}</p>
            <Badge 
              variant={collab.status === 'active' ? 'success' : 'destructive'}
              className="mt-4"
            >
              {collab.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
            <div className="mt-6 w-full">
              <Button variant="ghost" size="sm" className="w-full">Ver Detalhes</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colaboradores;

