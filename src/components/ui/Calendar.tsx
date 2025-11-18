// src/components/ui/Calendar.tsx
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`bg-card rounded-xl border border-border p-4 ${className ?? ''}`}
      classNames={{
        months: 'flex flex-col space-y-4',
        month: 'space-y-4',
        caption: 'flex items-center justify-between px-1',
        caption_label: 'text-sm font-medium text-text',
        nav: 'flex items-center space-x-1',
        nav_button:
          'inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-sidebar hover:text-text',
        nav_button_previous: 'order-first',
        nav_button_next: 'order-last',
        table: 'w-full border-collapse',
        head_row: 'grid grid-cols-7 gap-1',
        head_cell: 'text-[0.75rem] text-center text-text-muted font-normal',
        row: 'grid grid-cols-7 gap-1 mt-1',
        cell: 'relative text-center text-sm',
        day: 'h-9 w-9 rounded-full flex items-center justify-center text-sm font-normal text-text hover:bg-sidebar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        day_selected:
          'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
        day_today: 'border border-primary text-primary',
        day_outside: 'text-text-muted opacity-50',
        day_disabled: 'text-text-muted opacity-40',
        day_range_middle: 'bg-accent text-text',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...(props as any)}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
