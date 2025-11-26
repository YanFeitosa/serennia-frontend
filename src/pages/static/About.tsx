// src/pages/static/About.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Users, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-text">Sobre o Serennia</h1>
          <p className="text-text-muted mt-2">Conheça nossa história e missão</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* História */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Nossa História
          </h2>
          <div className="prose prose-lg text-text-muted space-y-4">
            <p>
              O Serennia nasceu da necessidade real de modernizar a gestão de salões de beleza. 
              Observando o dia a dia de profissionais da área, percebemos que muitos ainda 
              dependiam de agendas de papel, planilhas complexas e processos manuais que 
              consumiam tempo precioso.
            </p>
            <p>
              Em 2024, decidimos criar uma solução completa, intuitiva e acessível para 
              transformar a forma como salões de beleza operam. Nosso objetivo é simples: 
              permitir que você foque no que faz de melhor — cuidar dos seus clientes — 
              enquanto cuidamos de toda a gestão do seu negócio.
            </p>
          </div>
        </section>

        {/* Missão */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Nossa Missão
          </h2>
          <p className="text-lg text-text-muted">
            Empoderar profissionais da beleza com tecnologia simples e poderosa, 
            democratizando o acesso a ferramentas de gestão que antes eram exclusivas 
            de grandes redes. Queremos que cada salão, independente do tamanho, 
            possa crescer e prosperar.
          </p>
        </section>

        {/* Valores */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Simplicidade',
                description: 'Tecnologia deve facilitar, não complicar. Cada funcionalidade é pensada para ser intuitiva.',
              },
              {
                title: 'Transparência',
                description: 'Preços claros, sem surpresas. Você sabe exatamente o que está pagando e recebendo.',
              },
              {
                title: 'Inovação',
                description: 'Estamos sempre evoluindo, ouvindo nossos clientes e implementando melhorias.',
              },
              {
                title: 'Suporte',
                description: 'Você nunca está sozinho. Nossa equipe está sempre pronta para ajudar.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-text mb-2">{value.title}</h3>
                <p className="text-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipe */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Nossa Equipe
          </h2>
          <p className="text-text-muted mb-6">
            Somos uma equipe apaixonada por tecnologia e pelo mercado de beleza. 
            Combinamos experiência em desenvolvimento de software com conhecimento 
            profundo das necessidades do setor.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ana Silva', role: 'CEO & Fundadora' },
              { name: 'Carlos Santos', role: 'CTO' },
              { name: 'Maria Oliveira', role: 'Design Lead' },
              { name: 'João Costa', role: 'Customer Success' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-text">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text mb-4">
            Pronto para transformar seu salão?
          </h2>
          <p className="text-text-muted mb-6">
            Junte-se a centenas de salões que já estão usando o Serennia.
          </p>
          <Link
            to="/#register"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Começar Grátis
          </Link>
        </section>
      </main>
    </div>
  );
};

export default About;

