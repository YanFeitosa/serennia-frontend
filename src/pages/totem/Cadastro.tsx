// src/pages/totem/Cadastro.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

const Cadastro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-4xl font-semibold text-primary mb-8 text-center">Cadastro</h1>
        <form className="bg-card p-8 rounded-xl shadow-serenna space-y-6">
          <div>
            <label htmlFor="name" className="block text-text text-sm font-medium mb-2">Nome Completo</label>
            <input 
              type="text" 
              id="name" 
              className="w-full py-3 px-4 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-text text-sm font-medium mb-2">Telefone</label>
            <input 
              type="tel" 
              id="phone" 
              className="w-full py-3 px-4 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <Link to="/totem" className="text-sm text-primary hover:text-primary-dark transition-colors">← Voltar</Link>
            <Button type="button" size="lg">
              Cadastrar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Cadastro;
