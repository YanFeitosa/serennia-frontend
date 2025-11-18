// src/pages/Financeiro.tsx
import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar as CalendarIcon, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockOrders } from '../data/orders';
import { Badge } from '../components/ui/Badge';
import { Calendar } from '../components/ui/Calendar.tsx';
import { Button } from '../components/ui/Button.tsx';
import type { Order } from '../types';

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
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => new Date());
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  // Filtrar apenas comandas pagas
  const filteredOrders = mockOrders.filter(order => {
    // Primeiro filtro: apenas comandas pagas
    if (order.status !== 'paid') return false;

    const orderDate = new Date(order.createdAt);
    if (!startDate && !endDate) return true;

    if (startDate && endDate) {
      return orderDate >= startDate && orderDate <= endDate;
    }
    if (startDate) {
      return orderDate >= startDate;
    }
    if (endDate) {
      return orderDate <= endDate;
    }
    return true;
  });

  const getChartData = () => {
    if (!startDate || !endDate) return [];

    const from = startDate;
    const to = endDate;
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return Array.from({ length: diffDays }, (_, i) => {
        const date = new Date(from);
        date.setDate(date.getDate() + i);
        const day = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const faturamento = filteredOrders
          .filter(order => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
        return { name: day, faturamento, comissao };
      });
    } else if (diffDays <= 31) {
      const weeks = Math.ceil(diffDays / 7);
      return Array.from({ length: weeks }, (_, i) => {
        const weekStart = new Date(from);
        weekStart.setDate(weekStart.getDate() + i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `Semana ${i + 1}`;
        const faturamento = filteredOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
        return { name: weekLabel, faturamento, comissao };
      });
    } else if (diffDays <= 365) {
      const months = to.getMonth() - from.getMonth() + 12 * (to.getFullYear() - from.getFullYear());
      return Array.from({ length: months }, (_, i) => {
        const month = new Date(from.getFullYear(), from.getMonth() + i, 1);
        const monthLabel = month.toLocaleDateString('pt-BR', { month: 'long' });
        const faturamento = filteredOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === month.getMonth() && orderDate.getFullYear() === month.getFullYear();
          })
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === month.getMonth() && orderDate.getFullYear() === month.getFullYear();
          })
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
        return { name: monthLabel, faturamento, comissao };
      });
    } else {
      const years = to.getFullYear() - from.getFullYear() + 1;
      return Array.from({ length: years }, (_, i) => {
        const year = from.getFullYear() + i;
        const faturamento = filteredOrders
          .filter(order => new Date(order.createdAt).getFullYear() === year)
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => new Date(order.createdAt).getFullYear() === year)
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
        return { name: String(year), faturamento, comissao };
      });
    }
  };

  const chartData = getChartData();
  const totalFaturado = filteredOrders.reduce((acc, order) => acc + order.finalValue, 0);
  const totalComissao = filteredOrders.reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Financeiro</h1>
          <p className="text-text-muted">Acompanhe a saúde financeira do seu negócio.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenStartPicker(!openStartPicker)}
              className="w-[180px] text-left px-3 py-2 h-10 border border-border rounded-md bg-card text-text hover:bg-background transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 opacity-60" />
                <span className={startDate ? '' : 'text-text-muted'}>
                  {startDate ? startDate.toLocaleDateString('pt-BR') : 'Data inicial'}
                </span>
              </div>
              {startDate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartDate(undefined);
                  }}
                  className="p-1 hover:bg-background rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </button>
            {openStartPicker && (
              <div className="absolute z-50 mt-1 left-0 rounded-md border border-border bg-card text-text shadow-lg animate-slide-up">
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date ?? undefined);
                      setOpenStartPicker(false);
                    }}
                    initialFocus
                  />
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenEndPicker(!openEndPicker)}
              className="w-[180px] text-left px-3 py-2 h-10 border border-border rounded-md bg-card text-text hover:bg-background transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 opacity-60" />
                <span className={endDate ? '' : 'text-text-muted'}>
                  {endDate ? endDate.toLocaleDateString('pt-BR') : 'Data final'}
                </span>
              </div>
              {endDate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEndDate(undefined);
                  }}
                  className="p-1 hover:bg-background rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </button>
            {openEndPicker && (
              <div className="absolute z-50 mt-1 left-0 rounded-md border border-border bg-card text-text shadow-lg animate-slide-up">
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date ?? undefined);
                      setOpenEndPicker(false);
                    }}
                    initialFocus
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
            }}
          >
            Limpar Filtro
          </Button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-md flex items-center space-x-4 border border-border">
          <div className="p-3 bg-primary bg-opacity-20 rounded-full">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Faturamento Total</p>
            <p className="text-2xl font-bold text-text">{totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-md flex items-center space-x-4 border border-border">
          <div className="p-3 bg-primary bg-opacity-20 rounded-full">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Lucro Estimado</p>
            <p className="text-2xl font-bold text-text">{(totalFaturado - totalComissao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-md flex items-center space-x-4 border border-border">
          <div className="p-3 bg-accent bg-opacity-20 rounded-full">
            <TrendingDown className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Comissões a Pagar</p>
            <p className="text-2xl font-bold text-text">{totalComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl shadow-md border border-border">
        <h3 className="text-lg font-semibold text-text p-4 border-b border-border">Transações Recentes</h3>
        <table className="w-full text-left">
          <thead className="border-b border-border">
            <tr>
              <th className="p-4 text-text">Comanda</th>
              <th className="p-4 text-text">Data</th>
              <th className="p-4 text-text">Valor</th>
              <th className="p-4 text-text">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, 5).map(order => (
              <tr key={order.id} className="border-b border-border hover:bg-background transition-colors">
                <td className="p-4 font-mono text-sm text-text">#{order.id.slice(0, 6)}</td>
                <td className="p-4 text-text">{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                <td className="p-4 text-text">{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4">
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <h3 className="font-bold text-text mb-4">Faturamento</h3>
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
    </div>
  );
};

export default Financeiro;

