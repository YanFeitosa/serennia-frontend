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

  const handleEditAppointment = (appointment: Appointment | null) => {
    navigate(`/agenda/editar/${appointment?.id ?? 'novo'}`);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Agenda</h1>
          <p className="text-text-muted">Visualize e gerencie seus agendamentos.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={view === 'daily' ? 'primary' : 'ghost'} onClick={() => setView('daily')}>Diária</Button>
          <Button variant={view === 'weekly' ? 'primary' : 'ghost'} onClick={() => setView('weekly')}>Semanal</Button>
          <Button variant={view === 'monthly' ? 'primary' : 'ghost'} onClick={() => setView('monthly')}>Mensal</Button>
          <Button onClick={() => handleEditAppointment(null)}>+ Novo Agendamento</Button>
        </div>
      </header>

      {/* Render the selected view */}
      <div>
        {view === 'daily' && <DailyView onEditAppointment={handleEditAppointment} />}
        {view === 'weekly' && <WeeklyView />}
        {view === 'monthly' && <MonthlyView />}
      </div>
    </div>
  );
};

export default Agenda;
