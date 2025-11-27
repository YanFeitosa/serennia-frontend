// src/components/landing/Features.tsx
import {
  Calendar,
  ShoppingCart,
  DollarSign,
  MessageCircle,
  Monitor,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Controle completo de agendamentos com visualização diária, semanal e mensal. Drag & drop para reagendar.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: ShoppingCart,
    title: 'Gestão de Comandas',
    description: 'Comandas digitais integradas com serviços e produtos. Controle total de vendas e comissões.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: DollarSign,
    title: 'Controle Financeiro',
    description: 'Relatórios e análises em tempo real. Acompanhe receitas, despesas e ponto de equilíbrio.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageCircle,
    title: 'Integração WhatsApp',
    description: 'Envie confirmações e lembretes automaticamente para seus clientes via WhatsApp.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Monitor,
    title: 'Totem de Autoatendimento',
    description: 'Seus clientes agendam sozinhos através do totem. Reduza trabalho da recepção.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Avançados',
    description: 'Tome decisões baseadas em dados. Exporte para PDF e Excel com um clique.',
    gradient: 'from-violet-500 to-purple-500',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-3 md:px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs md:text-sm font-medium mb-4">
            Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Um sistema completo para gerenciar seu salão de forma profissional e eficiente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 md:p-3 mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-4 md:mt-6 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs md:text-sm font-medium">Saiba mais</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
