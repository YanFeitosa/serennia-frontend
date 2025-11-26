// src/components/ui/Select.tsx
import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
  return (
    <select
      className={`flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background text-text px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/30 cursor-pointer ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = 'Select';

export { Select };
