// src/pages/comissoes/Comissoes.tsx
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { getCollaborators, getCommissionRecords, payCommissions, type CommissionRecord } from '../../lib/api';
import type { Collaborator } from '../../types';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Helper to format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

interface CollaboratorCommission {
  collaborator: Collaborator;
  pendingAmount: number;
  paidAmount: number;
  pendingRecords: CommissionRecord[];
  paidRecords: CommissionRecord[];
}

const Comissoes = () => {
  const { can } = usePermissions();
  const { user } = useAuth();
  const canViewBankingData = user?.role ? can(user.role, 'verDadosBancariosColaborador') : false;

  // Development banner
  const isDevelopment = true;

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
  const [periodStart, setPeriodStart] = useState<string>(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date.toISOString().split('T')[0];
  });
  const [periodEnd, setPeriodEnd] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payingCollaborator, setPayingCollaborator] = useState<CollaboratorCommission | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [collabsData, recordsData] = await Promise.all([
        getCollaborators(),
        getCommissionRecords(),
      ]);
      
      // Filter only professionals (they have commissions)
      const professionals = collabsData.filter(c => c.role === 'professional');
      setCollaborators(professionals);
      setCommissionRecords(recordsData);
    } catch (err) {
      console.error('Error loading commission data', err);
      setError('Falha ao carregar dados de comissões');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate commission summaries per collaborator
  const collaboratorCommissions = useMemo(() => {
    const result: CollaboratorCommission[] = [];

    for (const collaborator of collaborators) {
      const collabRecords = commissionRecords.filter(r => r.collaboratorId === collaborator.id);
      
      // Filter by period if set
      const filteredRecords = collabRecords.filter(r => {
        const recordDate = new Date(r.createdAt || '');
        const start = periodStart ? new Date(periodStart) : null;
        const end = periodEnd ? new Date(periodEnd + 'T23:59:59') : null;
        
        if (start && recordDate < start) return false;
        if (end && recordDate > end) return false;
        return true;
      });

      const pendingRecords = filteredRecords.filter(r => !r.paid);
      const paidRecords = filteredRecords.filter(r => r.paid);

      const pendingAmount = pendingRecords.reduce((sum, r) => sum + Number(r.amount), 0);
      const paidAmount = paidRecords.reduce((sum, r) => sum + Number(r.amount), 0);

      // Only add if has any records or show all
      if (pendingRecords.length > 0 || paidRecords.length > 0 || !showOnlyPending) {
        result.push({
          collaborator,
          pendingAmount,
          paidAmount,
          pendingRecords,
          paidRecords,
        });
      }
    }

    // Filter by selected collaborator
    if (selectedCollaboratorId) {
      return result.filter(r => r.collaborator.id === selectedCollaboratorId);
    }

    return result.sort((a, b) => b.pendingAmount - a.pendingAmount);
  }, [collaborators, commissionRecords, periodStart, periodEnd, selectedCollaboratorId, showOnlyPending]);

  // Total pending
  const totalPending = useMemo(() => {
    return collaboratorCommissions.reduce((sum, c) => sum + c.pendingAmount, 0);
  }, [collaboratorCommissions]);

  const handlePayCommissions = async () => {
    if (!payingCollaborator) return;
    
    try {
      setIsProcessingPayment(true);
      
      await payCommissions({
        collaboratorId: payingCollaborator.collaborator.id,
        recordIds: payingCollaborator.pendingRecords.map(r => r.id),
        periodStart,
        periodEnd,
        notes: paymentNotes,
      });
      
      setShowPaymentModal(false);
      setPayingCollaborator(null);
      setPaymentNotes('');
      
      // Reload data
      await loadData();
    } catch (err) {
      console.error('Error paying commissions', err);
      setError('Falha ao processar pagamento de comissões');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const openPaymentModal = (collab: CollaboratorCommission) => {
    setPayingCollaborator(collab);
    setShowPaymentModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner de em desenvolvimento */}
      {isDevelopment && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-300">Em Desenvolvimento</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              O sistema de comissões está em desenvolvimento. Você pode visualizar as comissões pendentes, mas o pagamento ainda será liberado em breve.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        <div className="pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Comissões</h1>
            <p className="text-text-muted text-sm md:text-base">
              Gerencie as comissões dos profissionais
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-text-muted">Total Pendente</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl shadow-md border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Profissional</label>
            <select
              value={selectedCollaboratorId}
              onChange={(e) => setSelectedCollaboratorId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos</option>
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Período Início</label>
            <Input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Período Fim</label>
            <Input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyPending}
                onChange={(e) => setShowOnlyPending(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text">Apenas pendentes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          Detalhes
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaboratorCommissions.length === 0 ? (
            <div className="col-span-full text-center py-8 text-text-muted">
              Nenhuma comissão encontrada para o período selecionado
            </div>
          ) : (
            collaboratorCommissions.map((item) => (
              <div
                key={item.collaborator.id}
                className="bg-card p-4 rounded-xl shadow-md border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.collaborator.avatarUrl ? (
                      <img
                        src={item.collaborator.avatarUrl}
                        alt={item.collaborator.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {item.collaborator.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-text">{item.collaborator.name}</h3>
                      <p className="text-xs text-text-muted">
                        Taxa: {Math.round((item.collaborator.commissionRate || 0) * 100)}%
                        {item.collaborator.commissionMode === 'professional' ? ' (fixa)' : 
                         item.collaborator.commissionMode === 'service' ? ' (por serviço)' : 
                         ' (padrão salão)'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-text-muted">Pendente</p>
                    <p className="text-lg font-bold text-warning">{formatCurrency(item.pendingAmount)}</p>
                    <p className="text-xs text-text-muted">{item.pendingRecords.length} registros</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Pago no período</p>
                    <p className="text-lg font-bold text-success">{formatCurrency(item.paidAmount)}</p>
                    <p className="text-xs text-text-muted">{item.paidRecords.length} registros</p>
                  </div>
                </div>

                {/* Banking info - only if has permission */}
                {canViewBankingData && (item.collaborator.pixKey || item.collaborator.bankName) && (
                  <div className="mb-4 p-3 bg-background rounded-lg text-xs">
                    <p className="font-medium text-text mb-1">Dados para pagamento:</p>
                    {item.collaborator.pixKey && (
                      <p className="text-text-muted">
                        PIX ({item.collaborator.pixKeyType}): {item.collaborator.pixKey}
                      </p>
                    )}
                    {item.collaborator.bankName && (
                      <p className="text-text-muted">
                        {item.collaborator.bankName} - Ag: {item.collaborator.bankAgency} / Cc: {item.collaborator.bankAccount}
                      </p>
                    )}
                  </div>
                )}

                {item.pendingAmount > 0 && (
                  <Button
                    onClick={() => openPaymentModal(item)}
                    className="w-full"
                    size="sm"
                  >
                    Pagar Comissões
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Profissional
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Serviço/Produto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {commissionRecords
                  .filter(r => {
                    if (selectedCollaboratorId && r.collaboratorId !== selectedCollaboratorId) return false;
                    if (showOnlyPending && r.paid) return false;
                    
                    const recordDate = new Date(r.createdAt || '');
                    const start = periodStart ? new Date(periodStart) : null;
                    const end = periodEnd ? new Date(periodEnd + 'T23:59:59') : null;
                    
                    if (start && recordDate < start) return false;
                    if (end && recordDate > end) return false;
                    return true;
                  })
                  .map((record) => {
                    const collab = collaborators.find(c => c.id === record.collaboratorId);
                    return (
                      <tr key={record.id} className="hover:bg-background/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-text">{collab?.name || '-'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-text">{record.createdAt ? formatDate(record.createdAt) : '-'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-text">{record.description || 'Serviço'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className="text-sm font-medium text-text">{formatCurrency(Number(record.amount))}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            record.paid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.paid ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                {commissionRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      Nenhum registro de comissão encontrado.
                      <br />
                      <span className="text-xs">As comissões são geradas automaticamente quando uma comanda é paga.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && payingCollaborator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-text mb-4">Confirmar Pagamento</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted">Profissional</p>
                <p className="text-lg font-semibold text-text">{payingCollaborator.collaborator.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-muted">Valor Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(payingCollaborator.pendingAmount)}</p>
                <p className="text-xs text-text-muted">{payingCollaborator.pendingRecords.length} registros pendentes</p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Período</p>
                <p className="text-sm text-text">{formatDate(periodStart)} - {formatDate(periodEnd)}</p>
              </div>

              {canViewBankingData && (payingCollaborator.collaborator.pixKey || payingCollaborator.collaborator.bankName) && (
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-text mb-1">Dados para pagamento:</p>
                  {payingCollaborator.collaborator.pixKey && (
                    <p className="text-sm text-text-muted">
                      PIX ({payingCollaborator.collaborator.pixKeyType}): <span className="font-mono">{payingCollaborator.collaborator.pixKey}</span>
                    </p>
                  )}
                  {payingCollaborator.collaborator.bankName && (
                    <p className="text-sm text-text-muted">
                      {payingCollaborator.collaborator.bankName} - Ag: {payingCollaborator.collaborator.bankAgency} / Cc: {payingCollaborator.collaborator.bankAccount}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text mb-1">Observações (opcional)</label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Ex: Pago via PIX em 09/12/2025"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPayingCollaborator(null);
                  setPaymentNotes('');
                }}
                className="flex-1"
                disabled={isProcessingPayment}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayCommissions}
                className="flex-1"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processando...' : 'Confirmar Pagamento'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comissoes;
