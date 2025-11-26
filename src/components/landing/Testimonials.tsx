// src/components/landing/Testimonials.tsx
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Proprietária',
    salon: 'Studio Maria Hair',
    avatar: 'MS',
    content: 'O Serennia transformou a gestão do meu salão. Antes eu perdia horas com planilhas, agora tudo está automatizado. Recomendo demais!',
    rating: 5,
  },
  {
    name: 'Carlos Santos',
    role: 'Gerente',
    salon: 'Barbearia Premium',
    avatar: 'CS',
    content: 'A agenda inteligente e os lembretes automáticos reduziram nossos no-shows em 70%. O retorno do investimento foi imediato.',
    rating: 5,
  },
  {
    name: 'Ana Oliveira',
    role: 'Proprietária',
    salon: 'Espaço Beleza & Bem-estar',
    avatar: 'AO',
    content: 'O suporte é excepcional! Sempre que tenho uma dúvida, a equipe responde rapidamente. Me sinto muito bem amparada.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Histórias reais de salões que transformaram sua gestão com o Serennia.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-purple-500/30 mb-4" />

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} • {testimonial.salon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-6">Empresas que confiam no Serennia</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Salon Pro', 'Beauty Plus', 'Hair Studio', 'Estética VIP', 'Beleza Total'].map((name, i) => (
              <div key={i} className="text-gray-400 font-semibold text-lg">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

