// src/components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'destructive' | 'default' | 'secondary';
  className?: string;
}

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors';

  const variantStyles = {
    success: { 
      backgroundColor: 'color-mix(in srgb, var(--color-status-success) 10%, transparent)',
      color: 'var(--color-status-success)',
      borderColor: 'color-mix(in srgb, var(--color-status-success) 20%, transparent)'
    },
    warning: { 
      backgroundColor: 'color-mix(in srgb, var(--color-status-warning) 10%, transparent)',
      color: 'var(--color-status-warning)',
      borderColor: 'color-mix(in srgb, var(--color-status-warning) 20%, transparent)'
    },
    info: { 
      backgroundColor: 'color-mix(in srgb, var(--color-status-info) 10%, transparent)',
      color: 'var(--color-status-info)',
      borderColor: 'color-mix(in srgb, var(--color-status-info) 20%, transparent)'
    },
    destructive: { 
      backgroundColor: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)',
      color: 'var(--color-status-error)',
      borderColor: 'color-mix(in srgb, var(--color-status-error) 20%, transparent)'
    },
  };

  const variantClasses = {
    success: 'border',
    warning: 'border',
    info: 'border',
    destructive: 'border',
    secondary: 'bg-sidebar text-text border border-border',
    default: 'bg-card text-text border border-border',
  };

  const hasCustomStyle = variant in variantStyles;

  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={hasCustomStyle ? variantStyles[variant as keyof typeof variantStyles] : undefined}
    >
      {children}
    </span>
  );
};

export { Badge };
