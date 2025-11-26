// src/pages/totem/Welcome.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-7xl font-semibold text-primary mb-2">{salonName}</h1>
        <h2 className="text-6xl font-semibold text-primary mb-10">Bem-vindo</h2>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/totem/login">
            <Button size="lg" className="py-6 px-12 text-xl w-full sm:w-80 shadow-serennia">
              Já sou cliente
            </Button>
          </Link>
          <Link to="/totem/cadastro">
            <Button variant="outline" size="lg" className="py-6 px-12 text-xl w-full sm:w-80 shadow-serennia">
              Fazer cadastro
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
