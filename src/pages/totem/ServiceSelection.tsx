// src/pages/totem/ServiceSelection.tsx
import React from 'react';
import { motion } from 'framer-motion';

const ServiceSelection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl font-semibold text-primary mb-8 text-center">Selecione os Serviços</h1>
        <div className="bg-white p-8 rounded-xl shadow-serenna">
          <p className="text-text-muted text-center">A seleção de serviços será implementada aqui</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceSelection;
