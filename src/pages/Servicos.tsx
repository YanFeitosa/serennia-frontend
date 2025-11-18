// src/pages/Servicos.tsx
import { useState } from 'react';
import { Plus, Clock, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../data/services';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? 'admin';
  const canEdit = role === 'admin' || role === 'manager';

  return (
    <div className="space-y-4">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Serviços</h1>
            <p className="text-text-muted mt-1">Gerencie os serviços oferecidos pelo salão</p>
          </div>
          {canEdit && (
            <Button onClick={() => navigate('/servicos/novo')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          )}
        </div>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-card text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Serviço</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Duração</th>
              {canEdit && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Comissão</th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Preço</th>
              {canEdit && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Ações</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockServices
              .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(service => (
                <tr key={service.id} className="hover:bg-sidebar transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-text">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {service.category ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-text-muted" />
                      {service.duration} min
                    </div>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-sm text-text-muted">{`${Math.round(service.commission * 100)}%`}</td>
                  )}
                  <td className="px-6 py-4 text-sm font-semibold text-text">
                    {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/servicos/${service.id}`)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servicos;

