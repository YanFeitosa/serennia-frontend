// src/pages/static/Terms.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
          <h1 className="text-4xl font-bold text-text">Termos de Uso</h1>
          <p className="text-text-muted mt-2">Última atualização: Novembro de 2024</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Aceitação dos Termos</h2>
            <p className="text-text-muted">
              Ao acessar e usar o Serennia, você concorda em cumprir e estar vinculado a estes 
              Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá 
              acessar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">2. Descrição do Serviço</h2>
            <p className="text-text-muted">
              O Serennia é uma plataforma de gestão para salões de beleza que oferece funcionalidades 
              como agendamento, gestão de clientes, controle financeiro, comandas e relatórios. 
              O serviço é fornecido "como está" e "conforme disponível".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">3. Conta do Usuário</h2>
            <div className="text-text-muted space-y-3">
              <p>Ao criar uma conta no Serennia, você concorda em:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter a segurança de sua senha e conta</li>
                <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Uso Aceitável</h2>
            <div className="text-text-muted space-y-3">
              <p>Você concorda em não usar o serviço para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violar leis ou regulamentos aplicáveis</li>
                <li>Infringir direitos de propriedade intelectual</li>
                <li>Transmitir vírus ou código malicioso</li>
                <li>Interferir na segurança ou integridade do serviço</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Pagamentos e Assinaturas</h2>
            <div className="text-text-muted space-y-3">
              <p>
                Alguns recursos do Serennia requerem uma assinatura paga. Ao assinar:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você autoriza a cobrança recorrente conforme o plano escolhido</li>
                <li>Os preços podem ser alterados com aviso prévio de 30 dias</li>
                <li>Cancelamentos podem ser feitos a qualquer momento</li>
                <li>Não há reembolso para períodos parciais</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">6. Propriedade Intelectual</h2>
            <p className="text-text-muted">
              O Serennia e todo seu conteúdo, recursos e funcionalidades são de propriedade 
              exclusiva da empresa e estão protegidos por leis de direitos autorais, marcas 
              registradas e outras leis de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-text-muted">
              Em nenhuma circunstância o Serennia será responsável por danos indiretos, 
              incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, 
              dados, uso ou outras perdas intangíveis, resultantes do uso ou incapacidade 
              de usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">8. Modificações dos Termos</h2>
            <p className="text-text-muted">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Alterações significativas serão notificadas por email ou através do serviço. 
              O uso continuado após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">9. Rescisão</h2>
            <p className="text-text-muted">
              Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, 
              por qualquer motivo, incluindo violação destes Termos. Após a rescisão, 
              seu direito de usar o serviço cessará imediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">10. Lei Aplicável</h2>
            <p className="text-text-muted">
              Estes termos serão regidos e interpretados de acordo com as leis do Brasil, 
              sem considerar conflitos de disposições legais. Qualquer disputa será 
              resolvida nos tribunais competentes de São Paulo, SP.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">11. Contato</h2>
            <p className="text-text-muted">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <ul className="text-text-muted mt-2">
              <li>Email: <a href="mailto:legal@serennia.com.br" className="text-primary hover:underline">legal@serennia.com.br</a></li>
              <li>Endereço: São Paulo, SP - Brasil</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;

