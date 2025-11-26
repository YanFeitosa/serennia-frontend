// src/components/landing/Benefits.tsx
import { Check, TrendingUp, Clock, Shield, Smartphone, HeartHandshake } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Aumente sua receita em até 30%',
    description: 'Com melhor gestão de agenda e redução de no-shows.',
  },
  {
    icon: Clock,
    title: 'Economize 10+ horas por semana',
    description: 'Automatize tarefas repetitivas e foque no que importa.',
  },
  {
    icon: Shield,
    title: 'Dados sempre seguros',
    description: 'Criptografia de ponta e backups automáticos.',
  },
  {
    icon: Smartphone,
    title: 'Acesse de qualquer lugar',
    description: 'Sistema 100% web, funciona em qualquer dispositivo.',
  },
  {
    icon: HeartHandshake,
    title: 'Suporte humanizado',
    description: 'Equipe pronta para ajudar sempre que precisar.',
  },
  {
    icon: Check,
    title: 'Interface intuitiva',
    description: 'Aprenda a usar em minutos, sem treinamento.',
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
              Benefícios
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Por que escolher o{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Serennia?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Mais do que um sistema, uma parceria para o sucesso do seu negócio.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-gray-500 text-sm">Salões ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  50k+
                </div>
                <div className="text-gray-500 text-sm">Agendamentos/mês</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-500 text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right side - Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-purple-500/30 transition-all hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
