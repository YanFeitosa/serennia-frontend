// src/pages/totem/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary">
      <h1 className="text-4xl font-bold text-primary mb-8">Identifique-se</h1>
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="phone" className="block text-text text-sm font-bold mb-2">Telefone</label>
          <input type="tel" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between mt-8">
          <Link to="/totem" className="text-sm text-primary hover:underline">Voltar</Link>
          <button className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
