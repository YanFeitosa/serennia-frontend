// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
      primary: 'bg-secondary text-text hover:opacity-90 shadow-md border-2 border-primary',
      secondary: 'bg-card text-text hover:bg-sidebar border border-border',
      ghost: 'bg-transparent text-text hover:bg-secondary',
      outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-background',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
