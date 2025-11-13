// src/components/ui/DatePickerPlain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './Calendar.tsx';
import { type SelectSingleEventHandler } from 'react-day-picker';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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

  const handleDateSelect: SelectSingleEventHandler = (selectedDate) => {
    setDate(selectedDate);
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
        className="w-[280px] text-left px-3 py-2 h-10 border border-border rounded-md bg-card text-text hover:bg-background transition-colors flex items-center justify-start gap-2"
      >
        <CalendarIcon className="h-4 w-4 opacity-60" />
        <span className={date ? '' : 'text-text-muted'}>{formatDisplay()}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 rounded-md border border-border bg-card text-text shadow-lg animate-slide-up">
          <div className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerPlain;
