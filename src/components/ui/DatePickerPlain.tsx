// src/components/ui/DatePickerPlain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerPlainProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder: string;
  id?: string;
  className?: string;
}

/**
 * DatePickerPlain
 * - Não usa Radix/Portal.
 * - Usa onMouseDown para capturar cliques ANTES do blur.
 * - Calendar customizado do react-day-picker.
 * - Apenas seleção de data (sem hora).
 */
export const DatePickerPlain: React.FC<DatePickerPlainProps> = ({
  date,
  setDate,
  placeholder,
  id,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => date ?? new Date());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (date) {
      setCurrentMonth(date);
    }
  }, [date]);

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

  const getDaysInMonth = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isSameDay = (d1: Date | null, d2: Date | undefined) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (d: Date | null) => {
    if (!d) return false;
    const today = new Date();
    return isSameDay(d, today);
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDateSelect = (selected: Date) => {
    setDate(selected);
    setOpen(false);
  };

  const formatDisplay = (): string => {
    if (!date) return placeholder;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const days = getDaysInMonth(currentMonth);

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
        className="w-full text-left px-3 py-2 h-10 border border-border rounded-md bg-card text-text hover:bg-background transition-colors flex items-center justify-start gap-2"
      >
        <CalendarIcon className="h-4 w-4 opacity-60" />
        <span className={date ? '' : 'text-text-muted'}>{formatDisplay()}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 rounded-md border border-border bg-card text-text shadow-lg animate-slide-up min-w-[280px]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-2 hover:bg-background rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium capitalize">{monthName}</span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 hover:bg-background rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-text-muted py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isSelected = isSameDay(day, date);
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
                    className={`relative w-9 h-9 text-sm rounded-md transition-all ${
                      isSelected
                        ? 'bg-primary text-white font-bold shadow-md'
                        : isCurrentDay
                        ? 'bg-accent/20 text-primary font-semibold'
                        : 'hover:bg-background text-text'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerPlain;
