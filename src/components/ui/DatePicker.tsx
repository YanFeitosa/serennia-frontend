// src/components/ui/DatePicker.tsx
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type SelectSingleEventHandler } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Button } from './Button.tsx';
import { Calendar } from './Calendar.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './Popover.tsx';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder: string;
}

export const DatePicker = ({ date, setDate, placeholder }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
