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
        <p className="text-gray-500">Rastreie todas as ações importantes no sistema.</p>
      </header>

      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Ação</th>
              <th className="p-4">Item</th>
              <th className="p-4">Data</th>
              <th className="p-4">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map(log => {
              const user = mockUsers.find(u => u.id === log.userId);
              return (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">{user?.name || 'Sistema'}</td>
                  <td className="p-4">
                    <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                  </td>
                  <td className="p-4 capitalize">{log.tableName.slice(0, -1)} #{log.recordId.slice(0, 6)}</td>
                  <td className="p-4">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
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

