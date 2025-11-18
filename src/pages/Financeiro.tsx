// src/pages/Financeiro.tsx
import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockOrders } from '../data/orders';
import { Badge } from '../components/ui/Badge';
import DatePickerPlain from '../components/ui/DatePickerPlain.tsx';
import { Button } from '../components/ui/Button.tsx';
import type { Order } from '../types';

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
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => new Date());
  const [chartResolution, setChartResolution] = useState<ChartResolution>('auto');

  // Filtrar apenas comandas pagas
  const filteredOrders = mockOrders.filter(order => {
    // Primeiro filtro: apenas comandas pagas
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
        // Mesmo dia selecionado nos dois campos: considerar apenas esse dia
        return orderDay.getTime() === startDay.getTime();
      }

      // Intervalo inclusivo: do primeiro até o último dia selecionado
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
          .filter(order => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => new Date(order.createdAt).toDateString() === date.toDateString())
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
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
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === month.getMonth() &&
              orderDate.getFullYear() === month.getFullYear()
            );
          })
          .reduce((acc, order) => acc + order.finalValue, 0);
        const comissao = filteredOrders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getMonth() === month.getMonth() &&
              orderDate.getFullYear() === month.getFullYear()
            );
          })
          .reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.commission, 0), 0);
        return { name: monthLabel, faturamento, comissao };
      });
    }

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
          <DatePickerPlain
            date={startDate}
            setDate={setStartDate}
            placeholder="Data inicial"
            className="w-[180px]"
          />
          <DatePickerPlain
            date={endDate}
            setDate={setEndDate}
            placeholder="Data final"
            className="w-[180px]"
          />
          <Button
            variant="ghost"
            onClick={() => {
              const today = new Date();
              const sameDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              setStartDate(sameDay);
              setEndDate(sameDay);
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
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isActive
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
    </div>
  );
};

export default Financeiro;

