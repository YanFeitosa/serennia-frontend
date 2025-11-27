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
    <section id="benefits" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 md:px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-xs md:text-sm font-medium mb-4">
              Benefícios
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              Por que escolher o{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Serennia?
              </span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8">
              Mais do que um sistema, uma parceria para o sucesso do seu negócio.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div>
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-gray-500 text-xs md:text-sm">Salões ativos</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  50k+
                </div>
                <div className="text-gray-500 text-xs md:text-sm">Agendamentos/mês</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-500 text-xs md:text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right side - Benefits list */}
          <div className="space-y-3 md:space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-lg md:rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-purple-500/30 transition-all hover:scale-[1.02]"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-0.5 md:mb-1 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">
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
