// src/pages/Auditoria.tsx
import { useState, useEffect } from 'react';
import { getAuditLogs, getCollaborators } from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import DatePickerPlain from '../../components/ui/DatePickerPlain';
import AuditLogDetails from '../../components/auditoria/AuditLogDetails';
import type { AuditLog, Collaborator } from '../../types';

const Auditoria = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<AuditLog['action'] | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActionVariant = (action: AuditLog['action']) => {
    switch (action) {
      case 'INSERT': return 'success';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'warning';
      default: return 'default';
    }
  };

  const handleClearFilters = () => {
    setSelectedUserId('');
    setSelectedAction('');
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [logsData, collaboratorsData] = await Promise.all([
          getAuditLogs({
            dateFrom: startDate || undefined,
            dateTo: endDate || undefined,
            userId: selectedUserId || undefined,
            tableName: undefined,
          }),
          getCollaborators(),
        ]);
        let filtered = logsData;
        if (selectedAction) {
          filtered = filtered.filter(log => log.action === selectedAction);
        }
        setLogs(filtered);
        setCollaborators(collaboratorsData);
      } catch (err: any) {
        console.error('Error loading audit logs', err);
        setError(err.message || 'Erro ao carregar logs de auditoria');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [startDate, endDate, selectedUserId, selectedAction]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">Log de Auditoria</h1>
        <p className="text-text-muted">Rastreie todas as ações importantes no sistema.</p>
      </header>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant={showFilters ? 'secondary' : 'ghost'}
          onClick={() => setShowFilters(prev => !prev)}
        >
          Filtros
        </Button>
      </div>

      {showFilters && (
        <div className="bg-card rounded-xl shadow-md border border-border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Usuário</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos</option>
                {collaborators.map(collab => (
                  <option key={collab.id} value={collab.id}>
                    {collab.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Ação</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value as AuditLog['action'] | '')}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-text mb-1">De</label>
                <DatePickerPlain
                  date={startDate ? new Date(startDate) : undefined}
                  setDate={(date) =>
                    setStartDate(date ? date.toISOString().slice(0, 10) : '')
                  }
                  placeholder="Data inicial"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Até</label>
                <DatePickerPlain
                  date={endDate ? new Date(endDate) : undefined}
                  setDate={(date) =>
                    setEndDate(date ? date.toISOString().slice(0, 10) : '')
                  }
                  placeholder="Data final"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button type="button" variant="ghost" size="sm" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center p-8 text-text-muted">Carregando logs de auditoria...</div>
      )}
      {error && (
        <div className="text-center p-8 text-red-600">{error}</div>
      )}
      {!isLoading && !error && (
        <div className="bg-card rounded-xl shadow-md border border-border">
          <table className="w-full text-left">
            <thead className="border-b border-border">
              <tr>
                <th className="p-4 text-text">Usuário</th>
                <th className="p-4 text-text">Ação</th>
                <th className="p-4 text-text">Item</th>
                <th className="p-4 text-text">Data</th>
                <th className="p-4 text-text">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    Nenhum log de auditoria encontrado
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const collaborator = collaborators.find(c => c.id === log.userId);
                  return (
                    <tr key={log.id} className="border-b border-border hover:bg-background transition-colors">
                      <td className="p-4 text-text">{collaborator?.name || log.userId.slice(0, 8)}</td>
                      <td className="p-4">
                        <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                      </td>
                      <td className="p-4 capitalize text-text">{log.tableName.slice(0, -1)} #{log.recordId.slice(0, 6)}</td>
                      <td className="p-4 text-text">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                      <td className="p-4"><AuditLogDetails log={log} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Auditoria;

