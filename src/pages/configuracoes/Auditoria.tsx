// src/pages/Auditoria.tsx
import { useState } from 'react';
import { mockAuditLogs } from '../../data/audit';
import { mockUsers } from '../../data/users';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import DatePickerPlain from '../../components/ui/DatePickerPlain';
import AuditLogDetails from '../../components/auditoria/AuditLogDetails';
import type { AuditLog } from '../../types';

const Auditoria = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<AuditLog['action'] | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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

  const startDateObj = startDate ? new Date(startDate + 'T00:00:00') : undefined;
  const endDateObj = endDate ? new Date(endDate + 'T00:00:00') : undefined;

  const filteredLogs = mockAuditLogs.filter(log => {
    if (selectedUserId && log.userId !== selectedUserId) return false;
    if (selectedAction && log.action !== selectedAction) return false;

    const logTime = new Date(log.timestamp).getTime();

    if (startDate) {
      const start = new Date(startDate + 'T00:00:00').getTime();
      if (logTime < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate + 'T23:59:59.999').getTime();
      if (logTime > end) return false;
    }

    return true;
  });

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
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
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
                  date={startDateObj}
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
                  date={endDateObj}
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
            {filteredLogs.map(log => {
              const user = mockUsers.find(u => u.id === log.userId);
              return (
                <tr key={log.id} className="border-b border-border hover:bg-background transition-colors">
                  <td className="p-4 text-text">{user?.name || 'Sistema'}</td>
                  <td className="p-4">
                    <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                  </td>
                  <td className="p-4 capitalize text-text">{log.tableName.slice(0, -1)} #{log.recordId.slice(0, 6)}</td>
                  <td className="p-4 text-text">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                  <td className="p-4"><AuditLogDetails log={log} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Auditoria;

