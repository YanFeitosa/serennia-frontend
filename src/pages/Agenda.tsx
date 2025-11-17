// src/pages/Agenda.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../types';
import { Button } from '../components/ui/Button';
import DailyView from '../components/agenda/DailyView';
import WeeklyView from '../components/agenda/WeeklyView';
import MonthlyView from '../components/agenda/MonthlyView';

const Agenda = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const handleEditAppointment = (appointment: Appointment | null) => {
    navigate(`/agenda/editar/${appointment?.id ?? 'novo'}`);
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Agenda</h1>
          <p className="text-text-muted">Visualize e gerencie seus agendamentos.</p>
          <p className="text-sm text-text-muted mt-1">
            {currentDate.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant={view === 'daily' ? 'primary' : 'ghost'} onClick={() => setView('daily')}>Diária</Button>
            <Button variant={view === 'weekly' ? 'primary' : 'ghost'} onClick={() => setView('weekly')}>Semanal</Button>
            <Button variant={view === 'monthly' ? 'primary' : 'ghost'} onClick={() => setView('monthly')}>Mensal</Button>
            <Button onClick={() => handleEditAppointment(null)}>+ Novo Agendamento</Button>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" onClick={() => changeDate(-1)}>
              Anterior
            </Button>
            <Button variant="ghost" onClick={goToToday}>
              Atual
            </Button>
            <Button variant="ghost" onClick={() => changeDate(1)}>
              Próximo
            </Button>
          </div>
        </div>
      </header>

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
