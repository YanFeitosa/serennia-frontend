// src/components/landing/Hero.tsx
import { useState } from 'react';
import { ArrowRight, Play, Calendar, DollarSign, Users, BarChart3 } from 'lucide-react';
import DemoModal from './DemoModal';

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300">Teste grátis por 14 dias</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">Sem cartão de crédito</span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '100ms' }}
        >
          <span className="text-white">Gerencie seu salão</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            com inteligência
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '200ms' }}
        >
          Sistema completo para agenda, comandas, financeiro e muito mais.
          <br className="hidden sm:block" />
          <span className="text-gray-300">Tudo em um só lugar.</span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '300ms' }}
        >
          <button
            onClick={scrollToRegister}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            Começar Grátis Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setShowDemo(true)}
            className="group px-8 py-4 rounded-full border border-white/20 text-white text-lg font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Ver Demonstração
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '400ms' }}
        >
          {[
            { icon: Calendar, label: 'Agenda', sublabel: 'Inteligente' },
            { icon: DollarSign, label: 'Financeiro', sublabel: 'Completo' },
            { icon: Users, label: 'Clientes', sublabel: 'Organizados' },
            { icon: BarChart3, label: 'Relatórios', sublabel: 'Em Tempo Real' },
          ].map((item, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105"
            >
              <item.icon className="w-8 h-8 text-purple-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xl font-bold text-white">{item.label}</div>
              <div className="text-sm text-gray-500">{item.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-1/3 left-10 w-20 h-20 rounded-full bg-purple-500/20 blur-xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 right-10 w-16 h-16 rounded-full bg-blue-500/20 blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </section>
  );
};

export default Hero;
