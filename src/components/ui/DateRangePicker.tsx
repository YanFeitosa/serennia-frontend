// src/components/ui/DateRangePicker.tsx
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './Popover.tsx';
import { Button } from './Button.tsx';
import { Calendar } from './Calendar.tsx';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, setDateRange, className }) => {
  const from = dateRange?.from;
  const to = dateRange?.to;

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>{from.toLocaleDateString('pt-BR')} - {to.toLocaleDateString('pt-BR')}</>
              ) : (
                from.toLocaleDateString('pt-BR')
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};