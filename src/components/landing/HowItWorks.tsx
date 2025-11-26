// src/components/landing/HowItWorks.tsx
import { UserPlus, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se gratuitamente em menos de 2 minutos. Sem cartão de crédito.',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Configure seu salão',
    description: 'Adicione seus serviços, produtos, colaboradores e personalize as configurações.',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Comece a usar',
    description: 'Gerencie agendamentos, comandas e finanças de forma simples e eficiente.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
            Como Funciona
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simples de começar
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Em apenas 3 passos você estará gerenciando seu salão de forma profissional.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg mb-6 relative z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-purple-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => {
              const element = document.getElementById('register');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105"
          >
            Começar Agora — É Grátis
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

