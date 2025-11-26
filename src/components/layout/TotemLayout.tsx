// src/components/layout/TotemLayout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TotemProvider } from '../../contexts/TotemContext';

const TotemLayout: React.FC = () => {
  const [salonName, setSalonName] = useState('Serennia');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('serennia-appearance');
      if (!stored) {
        setSalonName('Serennia');
        return;
      }
      const parsed = JSON.parse(stored) as { platformName?: string };
      const name = parsed.platformName?.trim();
      setSalonName(name && name.length > 0 ? name : 'Serennia');
    } catch {
      setSalonName('Serennia');
    }
  }, []);

  return (
    <TotemProvider>
      <div className="min-h-screen bg-background">
        {/* Header com logo */}
        <header className="bg-card shadow-md py-4 px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-primary">{salonName}</h1>
          </div>
        </header>
        
        {/* Conteúdo com animação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-80px)]"
        >
          <Outlet />
        </motion.div>
      </div>
    </TotemProvider>
  );
};

export default TotemLayout;
