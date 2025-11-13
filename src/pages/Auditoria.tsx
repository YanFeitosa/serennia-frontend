// src/pages/Auditoria.tsx
import { mockAuditLogs } from '../data/audit';
import { mockUsers } from '../data/users';
import { Badge } from '../components/ui/Badge';
import AuditLogDetails from '../components/auditoria/AuditLogDetails';
import type { AuditLog } from '../types';

const Auditoria = () => {
  const getActionVariant = (action: AuditLog['action']) => {
    switch (action) {
      case 'INSERT': return 'success';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">Log de Auditoria</h1>
        <p className="text-text-muted">Rastreie todas as ações importantes no sistema.</p>
      </header>

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
            {mockAuditLogs.map(log => {
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

