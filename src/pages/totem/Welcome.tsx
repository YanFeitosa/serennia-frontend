// src/pages/totem/Welcome.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-6xl font-semibold text-primary mb-4">Bem-vindo à Serenna</h1>
        <p className="text-xl text-text-muted mb-12">Seu momento de beleza começa aqui</p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/totem/login">
            <Button size="lg" className="py-6 px-12 text-xl w-full sm:w-80 shadow-serenna">
              Já sou cliente
            </Button>
          </Link>
          <Link to="/totem/cadastro">
            <Button variant="outline" size="lg" className="py-6 px-12 text-xl w-full sm:w-80 shadow-serenna">
              Fazer cadastro
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
