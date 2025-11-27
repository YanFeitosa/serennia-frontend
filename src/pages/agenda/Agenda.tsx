// src/pages/Agenda.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../../types';
import { Button } from '../../components/ui/Button';
import DailyView from '../../components/agenda/DailyView';
import WeeklyView from '../../components/agenda/WeeklyView';
import MonthlyView from '../../components/agenda/MonthlyView';

const Agenda = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const handleEditAppointment = (appointment: Appointment | null) => {
    if (appointment?.id) {
      navigate(`/app/agenda/editar/${appointment.id}`);
    } else {
      navigate('/app/agenda/novo');
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const changeDate = (delta: number) => {
    const next = new Date(currentDate);
    if (view === 'daily') {
      next.setDate(next.getDate() + delta);
    } else if (view === 'weekly') {
      next.setDate(next.getDate() + delta * 7);
    } else {
      next.setMonth(next.getMonth() + delta);
    }
    setCurrentDate(next);
  };

  return (
    <div className="space-y-4">
      {/* Page header with gradient accent */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Agenda</h1>
          <p className="text-text-muted text-sm md:text-base">Visualize e gerencie seus agendamentos.</p>
          <p className="text-xs md:text-sm text-text-muted mt-1">
            {currentDate.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={view === 'daily' ? 'primary' : 'ghost'} onClick={() => setView('daily')}>Diária</Button>
            <Button size="sm" variant={view === 'weekly' ? 'primary' : 'ghost'} onClick={() => setView('weekly')}>Semanal</Button>
            <Button size="sm" variant={view === 'monthly' ? 'primary' : 'ghost'} onClick={() => setView('monthly')}>Mensal</Button>
            <Button size="sm" onClick={() => handleEditAppointment(null)} className="whitespace-nowrap">+ Novo</Button>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-1 text-sm">
            <Button variant="ghost" size="sm" onClick={() => changeDate(-1)}>
              Anterior
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Atual
            </Button>
            <Button variant="ghost" size="sm" onClick={() => changeDate(1)}>
              Próximo
            </Button>
          </div>
        </div>
      </header>
      
      {/* Decorative gradient line */}
      <div className="h-1 w-full rounded-full gradient-primary-secondary opacity-60" />

      {/* Render the selected view */}
      <div>
        {view === 'daily' && (
          <DailyView date={currentDate} onEditAppointment={handleEditAppointment} />
        )}
        {view === 'weekly' && (
          <WeeklyView
            date={currentDate}
            onSelectDate={(date: Date) => {
              setCurrentDate(date);
              setView('daily');
            }}
          />
        )}
        {view === 'monthly' && (
          <MonthlyView
            date={currentDate}
            onSelectDate={(date: Date) => {
              setCurrentDate(date);
              setView('daily');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Agenda;
