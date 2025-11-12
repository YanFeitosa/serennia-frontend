// src/pages/totem/Welcome.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary">
      <h1 className="text-5xl font-bold text-primary mb-8">Bem-vindo à Serenna</h1>
      <div className="flex space-x-8">
        <Link to="/totem/login">
          <button className="bg-secondary text-primary border-2 border-primary font-bold py-4 px-8 rounded-lg text-2xl w-64">
            Já sou cliente
          </button>
        </Link>
        <Link to="/totem/cadastro">
          <button className="bg-secondary text-primary border-2 border-primary font-bold py-4 px-8 rounded-lg text-2xl w-64">
            Fazer cadastro
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
