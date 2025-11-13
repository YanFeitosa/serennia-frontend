// src/components/layout/TotemLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const TotemLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header com logo */}
      <header className="bg-white shadow-md py-4 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-primary">Serenna</h1>
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
  );
};

export default TotemLayout;
