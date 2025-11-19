// src/components/agenda/MonthlyView.tsx
import React from 'react';
import { mockAppointments } from '../../data/appointments';
import { mockOrders } from '../../data/orders';
import type { AppointmentStatus } from '../../types';

interface MonthlyViewProps {
	date: Date;
	onSelectDate: (date: Date) => void;
}

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MonthlyView: React.FC<MonthlyViewProps> = ({ date, onSelectDate }) => {
	const today = new Date();
	const currentMonth = date.getMonth();
	const currentYear = date.getFullYear();

	const firstOfMonth = new Date(currentYear, currentMonth, 1);
	const firstDayOfGrid = new Date(firstOfMonth);
	const offset = firstOfMonth.getDay();
	firstDayOfGrid.setDate(firstOfMonth.getDate() - offset);

	const days = Array.from({ length: 42 }, (_, i) => {
		const d = new Date(firstDayOfGrid);
		d.setDate(firstDayOfGrid.getDate() + i);
		return d;
	});

	const getDateKey = (d: Date) => d.toISOString().slice(0, 10);

	const getStatusPriority = (status: AppointmentStatus): number => {
		switch (status) {
			case 'not_paid':
				return 4;
			case 'in_progress':
				return 3;
			case 'pending':
				return 2;
			case 'completed':
				return 1;
			case 'canceled':
			case 'no_show':
			default:
				return 0;
		}
	};

	type ColorToken = 'info' | 'warning' | 'success' | 'error' | 'muted';

	interface DayAggregate {
		totalAppointments: number;
		completedAppointments: number;
		notPaidAppointments: number;
		openOrders: number;
		priority: number;
		colorToken: ColorToken;
	}

	const ensureAggregate = (map: Record<string, DayAggregate>, key: string): DayAggregate => {
		if (!map[key]) {
			map[key] = {
				totalAppointments: 0,
				completedAppointments: 0,
				notPaidAppointments: 0,
				openOrders: 0,
				priority: -1,
				colorToken: 'info',
			};
		}
		return map[key];
	};

	const aggregatedByDay: Record<string, DayAggregate> = {};

	// Agendamentos
	for (const appt of mockAppointments) {
		const key = appt.start.slice(0, 10);
		const aggregate = ensureAggregate(aggregatedByDay, key);
		aggregate.totalAppointments += 1;
		if (appt.status === 'completed') {
			aggregate.completedAppointments += 1;
		}
		if (appt.status === 'not_paid') {
			aggregate.notPaidAppointments += 1;
		}

		const priority = getStatusPriority(appt.status as AppointmentStatus);
		const token: ColorToken = (() => {
			switch (appt.status as AppointmentStatus) {
				case 'not_paid':
					return 'error';
				case 'in_progress':
					return 'warning';
				case 'completed':
					return 'success';
				case 'no_show':
					return 'muted';
				case 'canceled':
					return 'info';
				case 'pending':
				default:
					return 'info';
			}
		})();

		if (priority > aggregate.priority) {
			aggregate.priority = priority;
			aggregate.colorToken = token;
		}
	}

	// Comandas abertas por dia
	const todayKey = getDateKey(today);
	for (const order of mockOrders) {
		if (order.status !== 'open') continue;
		const key = order.createdAt.slice(0, 10);
		const aggregate = ensureAggregate(aggregatedByDay, key);
		aggregate.openOrders += 1;
		// Vermelho apenas para comandas abertas em dias anteriores ao atual
		if (key < todayKey) {
			aggregate.priority = Math.max(aggregate.priority, 10);
			aggregate.colorToken = 'error';
		}
	}

	return (
		<div className="bg-card rounded-xl shadow-md p-4 border border-border">
			<h2 className="text-xl font-bold mb-4 text-text">Visualização Mensal</h2>
			<div className="flex items-center justify-between mb-2 text-sm text-text-muted">
				<span>
					{date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
				</span>
			</div>
			<div className="grid grid-cols-7 gap-1 text-xs mb-1">
				{weekdayLabels.map(label => (
					<div key={label} className="text-center font-semibold text-text-muted">
						{label}
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 gap-1 text-[11px]">
				{days.map(d => {
					const key = getDateKey(d);
					const isCurrentMonth = d.getMonth() === currentMonth;
					const isToday = key === getDateKey(today);
					const aggregated = aggregatedByDay[key];
					const totalAppointments = aggregated?.totalAppointments || 0;
					const completedAppointments = aggregated?.completedAppointments || 0;
					const notPaidAppointments = aggregated?.notPaidAppointments || 0;
					const openOrders = aggregated?.openOrders || 0;
					const token = aggregated?.colorToken || 'info';
					const baseColor = {
						info: 'var(--color-status-info)',
						warning: 'var(--color-status-warning)',
						success: 'var(--color-status-success)',
						error: 'var(--color-status-error)',
						muted: 'var(--color-status-muted)',
					}[token];
					const isOverdueDayWithOpenOrders = openOrders > 0 && key < todayKey;

					return (
						<button
							key={d.toISOString()}
							type="button"
							onClick={() => onSelectDate(d)}
							className={`h-24 border border-border rounded-lg p-1 flex flex-col text-left transition-colors ${
								isCurrentMonth ? 'bg-background' : 'bg-muted/40 text-text-muted'
							}`}
							style={{
								backgroundColor:
									(totalAppointments + openOrders) > 0
										? `color-mix(in srgb, ${baseColor} 8%, var(--color-background) 92%)`
										: undefined,
								boxShadow: isToday ? `0 0 0 2px ${baseColor}` : undefined,
							}}
						>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm font-semibold">
									{d.getDate()}
								</span>
							</div>
							<div className="space-y-0.5">
								{totalAppointments > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{ color: 'var(--color-status-info)' }}
									>
										{totalAppointments} agendamento(s)
									</span>
								)}
								{notPaidAppointments > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{ color: 'var(--color-status-error)' }}
									>
										{notPaidAppointments} atendimento(s) não pago(s)
									</span>
								)}
								{openOrders > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{
											color: isOverdueDayWithOpenOrders
												? 'var(--color-status-error)'
												: 'var(--color-status-info)',
										}}
									>
										{openOrders} comanda(s) aberta(s)
									</span>
								)}
								{completedAppointments > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{ color: 'var(--color-status-success)' }}
									>
										{completedAppointments} atendimento(s) concluído(s)
									</span>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default MonthlyView;

