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
    description: 'Controle completo de agendamentos com visualização diária, semanal e mensal.',
  },
  {
    icon: ShoppingCart,
    title: 'Gestão de Comandas',
    description: 'Comandas digitais integradas com serviços e produtos. Controle total de vendas.',
  },
  {
    icon: DollarSign,
    title: 'Controle Financeiro',
    description: 'Relatórios e análises em tempo real. Acompanhe receitas, despesas e comissões.',
  },
  {
    icon: MessageCircle,
    title: 'Integração WhatsApp',
    description: 'Envie confirmações e lembretes automaticamente para seus clientes.',
  },
  {
    icon: Monitor,
    title: 'Totem de Autoatendimento',
    description: 'Seus clientes agendam sozinhos através do totem. Reduza trabalho da recepção.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Avançados',
    description: 'Tome decisões baseadas em dados. Visualize performance e tendências.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Um sistema completo para gerenciar seu salão de forma profissional e eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-muted">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

