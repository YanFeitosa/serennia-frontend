// src/components/auditoria/AuditLogDetails.tsx
import React from 'react';
import type { AuditLog } from '../../types';

interface AuditLogDetailsProps {
  log: AuditLog;
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'vazio';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (value instanceof Date) return new Date(value).toLocaleString('pt-BR');
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const AuditLogDetails: React.FC<AuditLogDetailsProps> = ({ log }) => {
  const { action, oldValue, newValue } = log;

  const renderChanges = () => {
    if (action === 'INSERT' && newValue) {
      return Object.entries(newValue).map(([key, value]) => (
        <div key={key} className="text-sm">- <strong>{key}:</strong> {formatValue(value)}</div>
      ));
    }

    if (action === 'DELETE' && oldValue) {
      return Object.entries(oldValue).map(([key, value]) => (
        <div key={key} className="text-sm">- <strong>{key}:</strong> <span className="line-through">{formatValue(value)}</span></div>
      ));
    }

    if (action === 'UPDATE' && oldValue && newValue) {
      const changes = Object.keys(newValue)
        .filter(key => oldValue[key] !== newValue[key])
        .map(key => (
          <div key={key} className="text-sm">
            - <strong>{key}:</strong> de <em className="text-red-600">{formatValue(oldValue[key])}</em> para <em className="text-green-600">{formatValue(newValue[key])}</em>
          </div>
        ));
      return changes.length > 0 ? changes : <span className="text-sm text-gray-500">Nenhuma alteração visível.</span>;
    }

    return <span className="text-sm text-gray-500">Detalhes não disponíveis.</span>;
  };

  return <div>{renderChanges()}</div>;
};

export default AuditLogDetails;
