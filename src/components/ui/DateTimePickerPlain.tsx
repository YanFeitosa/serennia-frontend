// src/components/ui/DateTimePickerPlain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';

interface DateTimePickerPlainProps {
  value: string; // formato: "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

/**
 * DateTimePickerPlain
 * - Não usa Radix/Portal ou react-day-picker.
 * - Calendar customizado com indicador visual claro no dia selecionado.
 * - Usa onMouseDown para capturar cliques ANTES do blur.
 */
export const DateTimePickerPlain: React.FC<DateTimePickerPlainProps> = ({
  value,
  onChange,
  id,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Parse value inicial
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
        setHours(date.getHours().toString().padStart(2, '0'));
        setMinutes(date.getMinutes().toString().padStart(2, '0'));
      }
    } else {
      const now = new Date();
      setCurrentMonth(now);
      setHours(now.getHours().toString().padStart(2, '0'));
      setMinutes(now.getMinutes().toString().padStart(2, '0'));
    }
  }, [value]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!containerRef.current) return;
      if (target && containerRef.current.contains(target)) return;
      setOpen(false);
    }
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = formatDateToInput(date, hours, minutes);
    onChange(dateStr);
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours);
    setMinutes(newMinutes);

    let baseDate = selectedDate;
    if (!baseDate) {
      baseDate = new Date();
      setSelectedDate(baseDate);
      setCurrentMonth(baseDate);
    }

    const dateStr = formatDateToInput(baseDate, newHours, newMinutes);
    onChange(dateStr);
  };

  const formatDateToInput = (date: Date, h: string, m: string): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${h}:${m}`;
  };

  const formatDisplay = (): string => {
    if (!selectedDate) return 'Selecione data e hora';
    const dateStr = selectedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${dateStr} às ${hours}:${minutes}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date | undefined) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return isSameDay(date, today);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    onChange('');
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      onKeyDown={(e) => {
        // Previne Enter de submeter o formulário quando o picker está aberto
        if (e.key === 'Enter' && open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <button
        id={id}
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 h-10 border border-border rounded-md bg-card text-text hover:bg-background transition-colors flex items-center justify-between group"
      >
        <div className="flex items-center gap-2 flex-1">
          <CalendarIcon className="h-4 w-4 opacity-60 flex-shrink-0" />
          <span className={selectedDate ? '' : 'text-text-muted'}>{formatDisplay()}</span>
        </div>
        <div className="flex items-center gap-1">
          {selectedDate && (
            <button
              type="button"
              onClick={clearSelection}
              className="p-1 hover:bg-background rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <Clock className="h-4 w-4 opacity-60 flex-shrink-0" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 rounded-md border border-border bg-card text-text shadow-lg animate-slide-up">
          {/* Calendar */}
          <div className="p-4">
            {/* Header do calendário */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-2 hover:bg-background rounded-md transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-sm font-medium capitalize">{monthName}</span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 hover:bg-background rounded-md transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-text-muted py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);

                if (!day) {
                  return <div key={`empty-${index}`} className="w-9 h-9" />;
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleDateSelect(day);
                    }}
                    className={`
                      relative w-9 h-9 text-sm rounded-md transition-all
                      ${isSelected 
                        ? 'bg-primary text-white font-bold shadow-md' 
                        : isCurrentDay
                        ? 'bg-accent/20 text-primary font-semibold'
                        : 'hover:bg-background text-text'
                      }
                    `}
                  >
                    {day.getDate()}
                    {isSelected && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seleção de horário */}
          <div className="p-4 border-t border-border">
            <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(23, parseInt(e.target.value) || 0)).toString().padStart(2, '0');
                  handleTimeChange(val, minutes);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }
                }}
                className="w-16 px-2 py-1 text-center border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="HH"
              />
              <span className="text-text font-semibold">:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0)).toString().padStart(2, '0');
                  handleTimeChange(hours, val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }
                }}
                className="w-16 px-2 py-1 text-center border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="MM"
              />
            </div>
          </div>

          {/* Botão confirmar */}
          <div className="p-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text hover:bg-background rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePickerPlain;
