// src/components/landing/Benefits.tsx
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Aumente sua receita em até 30%',
  'Reduza no-shows com lembretes automáticos',
  'Economize tempo com automações inteligentes',
  'Tenha controle total do seu negócio',
  'Acesso de qualquer lugar, a qualquer hora',
  'Interface intuitiva e fácil de usar',
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
            Por que escolher o Serenna?
          </h2>
          <p className="text-xl text-text-muted">
            Veja os benefícios que fazem a diferença no seu dia a dia.
          </p>
        </div>

        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
            >
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-lg text-text">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

