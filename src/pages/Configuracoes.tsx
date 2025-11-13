// src/pages/Configuracoes.tsx
import { useState } from 'react';
import { Button } from '../components/ui/Button';

const Configuracoes = () => {
  const [tab, setTab] = useState('geral');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações do sistema e do salão.</p>
      </header>

      <div className="flex space-x-8 border-b border-gray-200">
        <Button variant="ghost" onClick={() => setTab('geral')} className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'geral' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Geral</Button>
        <Button variant="ghost" onClick={() => setTab('mensagens')} className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'mensagens' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Mensagens</Button>
        <Button variant="ghost" onClick={() => setTab('integracoes')} className={`py-4 px-1 font-medium text-sm rounded-none ${tab === 'integracoes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Integrações</Button>
      </div>

      <div>
        {tab === 'geral' && <div>Conteúdo da aba Geral</div>}
        {tab === 'mensagens' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
            <div className="p-4 bg-white rounded-xl shadow-md">
              <label htmlFor="confirm-template" className="block text-sm font-medium text-gray-700">Confirmação de Agendamento</label>
              <textarea 
                id="confirm-template"
                rows={4}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue="Olá {{cliente_nome}}, seu agendamento para {{data}} às {{horario}} foi confirmado!"
              />
              <p className="mt-2 text-xs text-gray-500">{'Variáveis disponíveis: `{{cliente_nome}}`, `{{data}}`, `{{horario}}`'}</p>
            </div>
          </div>
        )}
        {tab === 'integracoes' && <div>Conteúdo da aba Integrações</div>}
      </div>
    </div>
  );
};

export default Configuracoes;

