// src/components/agenda/MonthlyView.tsx
import React from 'react';
import { mockAppointments } from '../../data/appointments';

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

	const appointmentsByDay = mockAppointments.reduce<Record<string, number>>((acc, appt) => {
		const key = appt.start.slice(0, 10);
		acc[key] = (acc[key] || 0) + 1;
		return acc;
	}, {});

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
					const count = appointmentsByDay[key] || 0;

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
									count > 0
										? 'color-mix(in srgb, var(--color-status-info) 8%, var(--color-background) 92%)'
										: undefined,
								boxShadow: isToday ? '0 0 0 2px var(--color-status-info)' : undefined,
							}}
						>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm font-semibold">
									{d.getDate()}
								</span>
								{count > 0 && (
									<span
										className="text-xs px-1 rounded-full font-semibold"
										style={{
											backgroundColor: 'color-mix(in srgb, var(--color-status-info) 12%, transparent)',
											color: 'var(--color-status-info)',
										}}
									>
										{count} agend.
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

