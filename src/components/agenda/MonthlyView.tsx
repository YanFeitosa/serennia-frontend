// src/components/agenda/MonthlyView.tsx
import React, { useEffect, useState } from 'react';
import type { Appointment, AppointmentStatus, Collaborator } from '../../types';
import { getAppointments, getCollaborators } from '../../lib/api';

interface MonthlyViewProps {
	date: Date;
	onSelectDate: (date: Date) => void;
}

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MonthlyView: React.FC<MonthlyViewProps> = ({ date, onSelectDate }) => {
	const today = new Date();
	const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>('');
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const activeCollaborators = collaborators.filter(
		c => c.status === 'active' && c.role === 'professional',
	);
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

	const getDateKey = (d: Date) => {
		const year = d.getFullYear();
		const month = (d.getMonth() + 1).toString().padStart(2, '0');
		const day = d.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const firstOfMonth = new Date(currentYear, currentMonth, 1);
				const firstDayOfGrid = new Date(firstOfMonth);
				const offset = firstOfMonth.getDay();
				firstDayOfGrid.setDate(firstOfMonth.getDate() - offset);

				const from = new Date(firstDayOfGrid);
				from.setHours(0, 0, 0, 0);
				const to = new Date(firstDayOfGrid);
				to.setDate(to.getDate() + 42);
				to.setHours(23, 59, 59, 999);

				const [appointmentsRes, collaboratorsRes] = await Promise.all([
					getAppointments({
						dateFrom: from.toISOString(),
						dateTo: to.toISOString(),
						collaboratorId: selectedCollaboratorId || undefined,
					}),
					getCollaborators(),
				]);

				setAppointments(appointmentsRes);
				setCollaborators(collaboratorsRes);
			} catch (err) {
				console.error('Error loading monthly view data', err);
				setError('Erro ao carregar agendamentos.');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [currentMonth, currentYear, selectedCollaboratorId]);

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
		pendingAppointments: number;
		inProgressAppointments: number;
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
				pendingAppointments: 0,
				inProgressAppointments: 0,
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
	for (const appt of appointments) {
		if (appt.status === 'canceled' || appt.status === 'no_show') continue;
		if (selectedCollaboratorId && appt.collaboratorId !== selectedCollaboratorId) continue;
		const key = getDateKey(new Date(appt.start));
		const aggregate = ensureAggregate(aggregatedByDay, key);
		aggregate.totalAppointments += 1;
		if (appt.status === 'pending') {
			aggregate.pendingAppointments += 1;
		}
		if (appt.status === 'in_progress') {
			aggregate.inProgressAppointments += 1;
		}
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

	return (
		<div className="bg-card rounded-xl shadow-md p-4 border border-border">
			<h2 className="text-xl font-bold mb-4 text-text">Visualização Mensal</h2>
			{(isLoading || error) && (
				<div className="mb-2 text-[11px] text-text-muted">
					{isLoading ? 'Carregando agendamentos...' : error}
				</div>
			)}
			<div className="flex items-center justify-between mb-2 text-sm text-text-muted">
				<span>
					{date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
				</span>
				<div className="flex items-center space-x-2 text-[11px]">
					<span className="text-text-muted">Profissional:</span>
					<select
						value={selectedCollaboratorId}
						onChange={(e) => setSelectedCollaboratorId(e.target.value)}
						className="border border-border bg-card text-text text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
					>
						<option value="">Todos</option>
						{activeCollaborators.map(collab => (
							<option key={collab.id} value={collab.id}>
								{collab.name}
							</option>
						))}
					</select>
				</div>
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
					const pendingAppointments = aggregated?.pendingAppointments || 0;
					const inProgressAppointments = aggregated?.inProgressAppointments || 0;
					const completedAppointments = aggregated?.completedAppointments || 0;
					const notPaidAppointments = aggregated?.notPaidAppointments || 0;
					const tokenForDay = aggregated?.colorToken || 'info';
					const baseColor = {
						info: 'var(--color-status-info)',
						warning: 'var(--color-status-warning)',
						success: 'var(--color-status-success)',
						error: 'var(--color-status-error)',
						muted: 'var(--color-status-muted)',
					}[tokenForDay];

					const hasActivity =
						pendingAppointments +
						inProgressAppointments +
						notPaidAppointments +
						completedAppointments > 0;

					return (
						<button
							key={d.toISOString()}
							type="button"
							onClick={() => onSelectDate(d)}
							className={`h-24 border border-border rounded-lg p-1 flex flex-col text-left transition-colors ${
								isCurrentMonth ? 'bg-background' : 'bg-muted/40 text-text-muted'
							}`}
							style={{
								backgroundColor: hasActivity
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
								{pendingAppointments > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{
											color:
												tokenForDay === 'muted'
													? 'var(--color-status-muted)'
													: 'var(--color-status-info)',
										}}
									>
										{pendingAppointments} agendamento(s)
									</span>
								)}
								{inProgressAppointments > 0 && (
									<span
										className="block text-[10px] font-normal"
										style={{ color: 'var(--color-status-warning)' }}
									>
										{inProgressAppointments} atendimento(s) em progresso
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
