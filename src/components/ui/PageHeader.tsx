// src/components/ui/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * PageHeader - Cabeçalho padronizado para páginas do app
 * Inclui card elevado com borda de gradiente sutil
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, actions }) => {
  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
          {children}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 pt-2">
            {actions}
          </div>
        )}
      </header>
    </div>
  );
};

export default PageHeader;
