// src/pages/Financeiro.tsx
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockOrders } from '../data/orders';
import { Badge } from '../components/ui/Badge';
import { DateRangePicker } from '../components/ui/DateRangePicker';

const Financeiro = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const filteredOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    if (!dateRange || !dateRange.from || !dateRange.to) return false;
    return orderDate >= dateRange.from && orderDate <= dateRange.to;
  });

  const getChartData = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return [];

    const { from, to } = dateRange;
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
          <p className="text-gray-500">Acompanhe a saúde financeira do seu negócio.</p>
        </div>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="p-3 bg-primary bg-opacity-20 rounded-full">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Faturamento Total</p>
            <p className="text-2xl font-bold">{totalFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="p-3 bg-primary bg-opacity-20 rounded-full">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lucro Estimado</p>
            <p className="text-2xl font-bold">{(totalFaturado - totalComissao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="p-3 bg-accent bg-opacity-20 rounded-full">
            <TrendingDown className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Comissões a Pagar</p>
            <p className="text-2xl font-bold">{totalComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold p-4 border-b border-gray-200">Transações Recentes</h3>
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4">Comanda</th>
              <th className="p-4">Data</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, 5).map(order => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">#{order.id.slice(0, 6)}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                <td className="p-4">{order.finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4"><Badge>{order.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold mb-4">Faturamento Semanal</h3>
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

