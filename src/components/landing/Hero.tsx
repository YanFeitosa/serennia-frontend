// src/components/landing/Hero.tsx
import { Button } from '../ui/Button';
import { Calendar, DollarSign, Users, BarChart3 } from 'lucide-react';

const Hero = () => {
  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <span className="mr-2">✓</span>
          Teste grátis por 14 dias • Sem cartão de crédito
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text mb-6 leading-tight">
          Gerencie seu salão de beleza
          <br />
          <span className="text-primary">com inteligência</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-text-muted mb-12 max-w-3xl mx-auto">
          Sistema completo para agenda, comandas, financeiro e muito mais.
          <br />
          Tudo em um só lugar.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            onClick={scrollToRegister}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Começar Grátis Agora
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => {
              // TODO: Open demo modal/video
              console.log('Demo clicked');
            }}
          >
            Ver Demonstração
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-text">Agenda</div>
            <div className="text-sm text-text-muted">Inteligente</div>
          </div>
          <div className="flex flex-col items-center">
            <DollarSign className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-text">Financeiro</div>
            <div className="text-sm text-text-muted">Completo</div>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-text">Clientes</div>
            <div className="text-sm text-text-muted">Organizados</div>
          </div>
          <div className="flex flex-col items-center">
            <BarChart3 className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-text">Relatórios</div>
            <div className="text-sm text-text-muted">Em Tempo Real</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

