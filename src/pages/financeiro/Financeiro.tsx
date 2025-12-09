// src/pages/Financeiro.tsx
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Info, Plus, Trash2, Pencil, X, Check, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getOrders, getSalonSettings, getExpenses, createExpense, deleteExpense, updateExpense } from '../../lib/api';
import { Badge } from '../../components/ui/Badge';
import DatePickerPlain from '../../components/ui/DatePickerPlain';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Order, OrderItem, Expense, ExpenseType, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { getEffectiveRole } from '../../lib/utils';
import { exportToPDF, formatDateTime } from '../../lib/export';
import { getUserFriendlyError, ERROR_MESSAGES } from '../../lib/errorMessages';

type ChartResolution = 'auto' | 'daily' | 'weekly' | 'monthly' | 'yearly';

const getStatusLabel = (status: Order['status']) => {
  switch (status) {
    case 'open':
      return 'Aberta';
    case 'closed':
      return 'Fechada';
    case 'paid':
      return 'Paga';
    default:
      return status;
  }
};

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'open':
      return 'info';
    case 'closed':
      return 'warning';
    case 'paid':
      return 'success';
    default:
      return 'default';
  }
};

const Financeiro = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const effectiveRole = getEffectiveRole(user) as UserRole;
  // Can edit costs if user has 'financeiro' permission (will include accountant by default)
  const canEditCosts = can(effectiveRole, 'financeiro');

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // First day of month
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
  });
  const [chartResolution, setChartResolution] = useState<ChartResolution>('auto');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseType, setExpenseType] = useState<ExpenseType>('FIXED');
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const startEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount);
    setExpenseType(expense.type);
    setExpensesError(null);
  };

  const cancelEditExpense = () => {
    setEditingExpenseId(null);
    setExpenseName('');
    setExpenseAmount(0);
    setExpenseType('FIXED');
    setExpensesError(null);
  };

  const handleSaveExpense = async () => {
    if (!expenseName.trim() || expenseAmount <= 0) {
      setExpensesError('Preencha o nome e o valor do custo.');
      return;
    }
    setIsSavingExpense(true);
    setExpensesError(null);

    try {
      if (editingExpenseId) {
        // Update existing expense
        const updated = await updateExpense(editingExpenseId, {
          name: expenseName.trim(),
          amount: expenseAmount,
          type: expenseType,
        });
        setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      } else {
        // Create new expense
        const created = await createExpense({
          name: expenseName.trim(),
          amount: expenseAmount,
          type: expenseType,
        });
        setExpenses(prev => [...prev, created]);
      }
      // Reset form
      setEditingExpenseId(null);
      setExpenseName('');
      setExpenseAmount(0);
      setExpenseType('FIXED');
    } catch (err: any) {
      console.error('Failed to save expense', err);
      setExpensesError(getUserFriendlyError(err, ERROR_MESSAGES.SAVE_EXPENSE_FAILED));
    } finally {
      setIsSavingExpense(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [ordersData, , expensesData] = await Promise.all([
          getOrders({ status: 'paid' }),
          getSalonSettings(),
          getExpenses(),
        ]);
        setOrders(ordersData);
        setExpenses(expensesData);
      } catch (err: any) {
        console.error('Error loading financial data', err);
        setError(getUserFriendlyError(err, ERROR_MESSAGES.LOAD_FINANCIAL_DATA_FAILED));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar apenas comandas pagas no período
  const filteredOrders = orders.filter((order: Order) => {
    if (order.status !== 'paid') return false;

    const orderDate = new Date(order.createdAt);
    if (!startDate && !endDate) return true;

    const normalizeDay = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const orderDay = normalizeDay(orderDate);

    if (startDate && endDate) {
      const startDay = normalizeDay(startDate);
      const endDay = normalizeDay(endDate);

      if (startDay.getTime() === endDay.getTime()) {
        return orderDay.getTime() === startDay.getTime();
      }

      return orderDay >= startDay && orderDay <= endDay;
    }
    if (startDate) {
      const startDay = normalizeDay(startDate);
      return orderDay >= startDay;
    }
    if (endDate) {
      const endDay = normalizeDay(endDate);
      return orderDay <= endDay;
    }
    return true;
  });

  const getChartData = () => {
    if (!startDate || !endDate) return [];

    const from = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const to = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    const dayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.max(
      1,
      Math.floor((to.getTime() - from.getTime()) / dayMs) + 1
    );

    type BaseResolution = Exclude<ChartResolution, 'auto'>;
    let effective: BaseResolution;

    if (chartResolution === 'auto') {
      if (diffDays <= 7) {
        effective = 'daily';
      } else if (diffDays <= 31) {
        effective = 'weekly';
      } else if (diffDays <= 365) {
        effective = 'monthly';
      } else {
        effective = 'yearly';
      }
    } else {
      effective = chartResolution;
    }

    if (effective === 'daily') {
      return Array.from({ length: diffDays }, (_, i) => {
        const date = new Date(from);
        date.setDate(date.getDate() + i);
        const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const faturamento = filteredOrders
          .filter((order: Order) => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce((acc: number, order: Order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter((order: Order) => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce(
            (acc: number, order: Order) =>
              acc +
              order.items.reduce(
                (itemAcc: number, item: OrderItem) => itemAcc + item.commission,
                0,
              ),
            0,
          );
        return { name: dayLabel, faturamento, comissao };
      });
    }

    if (effective === 'weekly') {
      const weeks = Math.max(1, Math.ceil(diffDays / 7));
      return Array.from({ length: weeks }, (_, i) => {
        const weekStart = new Date(from);
        weekStart.setDate(weekStart.getDate() + i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `Semana ${i + 1}`;
        const faturamento = filteredOrders
          .filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce((acc: number, order: Order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce(
            (acc: number, order: Order) =>
              acc +
              order.items.reduce(
                (itemAcc: number, item: OrderItem) => itemAcc + item.commission,
                0,
              ),
            0,
          );
        return { name: weekLabel, faturamento, comissao };
      });
    }

    if (effective === 'monthly') {
      const months =
        (to.getFullYear() - from.getFullYear()) * 12 +
        (to.getMonth() - from.getMonth()) +
        1;
      return Array.from({ length: months }, (_, i) => {
        const month = new Date(from.getFullYear(), from.getMonth() + i, 1);
        const monthLabel = month.toLocaleDateString('pt-BR', { month: 'long' });
        const faturamento = filteredOrders
          .filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === month.getMonth() &&
              orderDate.getFullYear() === month.getFullYear()
            );
          })
          .reduce((acc: number, order: Order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === month.getMonth() &&
              orderDate.getFullYear() === month.getFullYear()
            );
          })
          .reduce(
            (acc: number, order: Order) =>
              acc +
              order.items.reduce(
                (itemAcc: number, item: OrderItem) => itemAcc + item.commission,
                0,
              ),
            0,
          );
        return { name: monthLabel, faturamento, comissao };
      });
    }

    const years = to.getFullYear() - from.getFullYear() + 1;
    return Array.from({ length: years }, (_, i) => {
      const year = from.getFullYear() + i;
      const faturamento = filteredOrders
        .filter((order: Order) => new Date(order.createdAt).getFullYear() === year)
        .reduce((acc: number, order: Order) => acc + order.finalValue, 0);
      const comissao = filteredOrders
        .filter((order: Order) => new Date(order.createdAt).getFullYear() === year)
        .reduce(
          (acc: number, order: Order) =>
            acc +
            order.items.reduce(
              (itemAcc: number, item: OrderItem) => itemAcc + item.commission,
              0,
            ),
          0,
        );
      return { name: String(year), faturamento, comissao };
    });
  };

  const chartData = getChartData();
  const totalFaturado = filteredOrders.reduce(
    (acc: number, order: Order) => acc + order.finalValue,
    0,
  );

  // Cálculos financeiros
  const diasNoPeriodo = startDate && endDate
    ? Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 30;

  // Calculate totals from expenses
  const fixedExpenses = expenses.filter(e => e.type === 'FIXED');
  const variableExpenses = expenses.filter(e => e.type === 'VARIABLE');
  const totalFixedMonthly = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariableMonthly = variableExpenses.reduce((sum, e) => sum + e.amount, 0);

  const gastosFixosPeriodo = totalFixedMonthly * (diasNoPeriodo / 30);
  const custosVariaveisPeriodo = totalVariableMonthly * (diasNoPeriodo / 30);
  const totalCustosPeriodo = gastosFixosPeriodo + custosVariaveisPeriodo;
  
  // Ponto de equilíbrio: considerando custos variáveis como valor fixo mensal também
  const pontoEquilibrioReceita = totalCustosPeriodo;
  const resultadoPeriodo = totalFaturado - totalCustosPeriodo;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text">Financeiro</h1>
        <p className="text-text-muted">Carregando dados financeiros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text">Financeiro</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced header with card styling */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Financeiro</h1>
          <p className="text-text-muted text-sm md:text-base">Acompanhe a saúde financeira do seu negócio.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
          <DatePickerPlain
            date={startDate}
            setDate={setStartDate}
            placeholder="Data inicial"
            className="w-full sm:w-[160px]"
          />
          <DatePickerPlain
            date={endDate}
            setDate={setEndDate}
            placeholder="Data final"
            className="w-full sm:w-[160px]"
          />
          <Button
            variant="ghost"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => {
              const today = new Date();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
              const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              setStartDate(firstDay);
              setEndDate(lastDay);
            }}
          >
            Este Mês
          </Button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-md flex items-center space-x-3 md:space-x-4 border border-border">
          <div className="p-2 md:p-3 bg-primary bg-opacity-20 rounded-full">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-text-muted">Faturamento Total</p>
            <p className="text-lg md:text-2xl font-bold text-text truncate">{totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-md flex items-center space-x-3 md:space-x-4 border border-border">
          <div className="p-2 md:p-3 bg-accent bg-opacity-20 rounded-full">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm text-text-muted">Gastos Fixos</p>
              <div className="group relative">
                <Info className="w-3 h-3 text-text-muted cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 w-56 p-2 bg-sidebar border border-border rounded-lg text-xs text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Gastos fixos são custos que não variam com a receita (aluguel, salários fixos, etc.). O valor mostrado é proporcional ao período selecionado.
                </div>
              </div>
            </div>
            <p className="text-lg md:text-2xl font-bold text-text truncate">{gastosFixosPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="text-xs text-text-muted mt-1 hidden sm:block">Mensais: {totalFixedMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-md flex items-center space-x-3 md:space-x-4 border border-border">
          <div className="p-2 md:p-3 bg-accent bg-opacity-20 rounded-full">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm text-text-muted">Custos Variáveis</p>
              <div className="group relative">
                <Info className="w-3 h-3 text-text-muted cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 w-56 p-2 bg-sidebar border border-border rounded-lg text-xs text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Custos variáveis são despesas mensais que variam (materiais, comissões extras, etc.). O valor mostrado é proporcional ao período selecionado.
                </div>
              </div>
            </div>
            <p className="text-lg md:text-2xl font-bold text-text truncate">{custosVariaveisPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="text-xs text-text-muted mt-1 hidden sm:block">Mensais: {totalVariableMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-md flex items-center space-x-3 md:space-x-4 border border-border">
          <div className={`p-2 md:p-3 rounded-full ${resultadoPeriodo >= 0 ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
            {resultadoPeriodo >= 0 ? (
              <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 ${resultadoPeriodo >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            ) : (
              <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-text-muted">Resultado</p>
            <p className={`text-lg md:text-2xl font-bold truncate ${resultadoPeriodo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {resultadoPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      {/* Ponto de Equilíbrio Card */}
      {pontoEquilibrioReceita !== null && (
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
                <Info className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-text">Ponto de Equilíbrio</h3>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-text-muted cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-sidebar border border-border rounded-lg text-xs text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      O ponto de equilíbrio é a receita mínima necessária para cobrir todos os custos (fixos + variáveis) no período. Se a receita for maior que este valor, há lucro; caso contrário, há prejuízo.
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text mb-2">
                  {pontoEquilibrioReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-sm text-text-muted mb-2">
                  Receita necessária para cobrir todos os custos no período
                </p>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${totalFaturado >= pontoEquilibrioReceita
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {totalFaturado >= pontoEquilibrioReceita ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Meta atingida</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Meta não atingida</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Diferença</p>
              <p className={`text-xl font-bold ${totalFaturado >= pontoEquilibrioReceita ? 'text-green-500' : 'text-red-500'
                }`}>
                {(totalFaturado - pontoEquilibrioReceita).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl shadow-md border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Transações Recentes</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const exportData = filteredOrders.map(order => ({
                  comanda: `#${order.id.slice(0, 6)}`,
                  data: formatDateTime(order.createdAt),
                  valor: order.finalValue,
                  status: getStatusLabel(order.status),
                }));
                exportToPDF(
                  'Relatório de Faturamento',
                  exportData,
                  [
                    { key: 'comanda', header: 'Comanda' },
                    { key: 'data', header: 'Data' },
                    { key: 'valor', header: 'Valor (R$)' },
                    { key: 'status', header: 'Status' },
                  ],
                  `faturamento_${new Date().toISOString().split('T')[0]}`
                );
              }}
            >
              <FileText className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="border-b border-border">
              <tr>
                <th className="p-3 md:p-4 text-text text-sm">Comanda</th>
                <th className="p-3 md:p-4 text-text text-sm">Data</th>
                <th className="p-3 md:p-4 text-text text-sm">Valor</th>
                <th className="p-3 md:p-4 text-text text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-background transition-colors">
                  <td className="p-3 md:p-4 font-mono text-xs md:text-sm text-text">#{order.id.slice(0, 6)}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-text">{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-text">{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="p-3 md:p-4">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="font-bold text-text">Faturamento</h3>
          <div className="inline-flex rounded-full bg-sidebar p-1 text-xs">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(key => {
              const label =
                key === 'daily'
                  ? 'Diária'
                  : key === 'weekly'
                    ? 'Semanal'
                    : key === 'monthly'
                      ? 'Mensal'
                      : 'Anual';
              const isActive = chartResolution !== 'auto' && chartResolution === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChartResolution(key)}
                  className={`px-3 py-1 rounded-full transition-colors ${isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="faturamento" fill="var(--color-primary)" />
            <Bar dataKey="comissao" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Management Section */}
      {canEditCosts && (
        <div className="bg-card rounded-xl shadow-md border border-border p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">Gestão de Custos</h3>
            <p className="text-sm text-text-muted max-w-xl mb-4">
              Adicione e gerencie seus custos fixos e variáveis mensais. Os valores são usados para calcular o ponto de equilíbrio e o resultado financeiro.
            </p>
          </div>

          {expensesError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{expensesError}</p>
            </div>
          )}

          {/* Add/Edit expense form */}
          <div className="bg-background p-4 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text">
                {editingExpenseId ? 'Editar custo' : 'Adicionar novo custo'}
              </h4>
              {editingExpenseId && (
                <button
                  type="button"
                  onClick={cancelEditExpense}
                  className="text-xs text-text-muted hover:text-text transition-colors"
                >
                  Cancelar edição
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-text-muted mb-1">Nome</label>
                <Input
                  type="text"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="Ex: Aluguel, Energia"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Valor Mensal (R$)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={expenseAmount || ''}
                  onChange={(e) => setExpenseAmount(Number(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Tipo</label>
                <select
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="FIXED">Fixo</option>
                  <option value="VARIABLE">Variável</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                {editingExpenseId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEditExpense}
                    disabled={isSavingExpense}
                    className="px-3"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleSaveExpense}
                  disabled={isSavingExpense}
                  className="flex-1"
                >
                  {editingExpenseId ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      {isSavingExpense ? 'Salvando...' : 'Salvar'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      {isSavingExpense ? 'Adicionando...' : 'Adicionar'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Expense lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fixed Expenses */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text flex items-center gap-2">
                Custos Fixos
                <Badge variant="secondary">{fixedExpenses.length}</Badge>
              </h4>
              <div className="bg-background rounded-lg border border-border divide-y divide-border">
                {fixedExpenses.length === 0 ? (
                  <p className="p-3 text-sm text-text-muted text-center">Nenhum custo fixo cadastrado.</p>
                ) : (
                  fixedExpenses.map(expense => (
                    <div 
                      key={expense.id} 
                      className={`flex items-center justify-between p-3 ${editingExpenseId === expense.id ? 'bg-primary/10' : ''}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-text">{expense.name}</p>
                        <p className="text-xs text-text-muted">
                          {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className={`p-1 transition-colors ${editingExpenseId === expense.id ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                          onClick={() => startEditExpense(expense)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-text-muted hover:text-red-500 transition-colors"
                          onClick={async () => {
                            try {
                              await deleteExpense(expense.id);
                              setExpenses(prev => prev.filter(e => e.id !== expense.id));
                              if (editingExpenseId === expense.id) cancelEditExpense();
                            } catch (err: any) {
                              console.error('Failed to delete expense', err);
                              setExpensesError(err.message || 'Falha ao remover custo.');
                            }
                          }}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-text-muted text-right">
                Total: {totalFixedMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
              </p>
            </div>

            {/* Variable Expenses */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text flex items-center gap-2">
                Custos Variáveis
                <Badge variant="secondary">{variableExpenses.length}</Badge>
              </h4>
              <div className="bg-background rounded-lg border border-border divide-y divide-border">
                {variableExpenses.length === 0 ? (
                  <p className="p-3 text-sm text-text-muted text-center">Nenhum custo variável cadastrado.</p>
                ) : (
                  variableExpenses.map(expense => (
                    <div 
                      key={expense.id} 
                      className={`flex items-center justify-between p-3 ${editingExpenseId === expense.id ? 'bg-primary/10' : ''}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-text">{expense.name}</p>
                        <p className="text-xs text-text-muted">
                          {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className={`p-1 transition-colors ${editingExpenseId === expense.id ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                          onClick={() => startEditExpense(expense)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-text-muted hover:text-red-500 transition-colors"
                          onClick={async () => {
                            try {
                              await deleteExpense(expense.id);
                              setExpenses(prev => prev.filter(e => e.id !== expense.id));
                              if (editingExpenseId === expense.id) cancelEditExpense();
                            } catch (err: any) {
                              console.error('Failed to delete expense', err);
                              setExpensesError(err.message || 'Falha ao remover custo.');
                            }
                          }}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-text-muted text-right">
                Total: {totalVariableMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;

