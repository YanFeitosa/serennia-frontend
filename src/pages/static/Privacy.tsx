// src/pages/static/Privacy.tsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
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
          <h1 className="text-4xl font-bold text-text">Política de Privacidade</h1>
          <p className="text-text-muted mt-2">Última atualização: Novembro de 2024</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* LGPD Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Shield, title: 'LGPD Compliant', desc: 'Em conformidade com a lei brasileira' },
            { icon: Lock, title: 'Dados Criptografados', desc: 'Proteção de ponta a ponta' },
            { icon: Eye, title: 'Transparência', desc: 'Você sabe o que coletamos' },
            { icon: Database, title: 'Seus Dados', desc: 'Você controla suas informações' },
          ].map((item, index) => (
            <div key={index} className="bg-card p-4 rounded-xl border border-border text-center">
              <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-text text-sm">{item.title}</h3>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Introdução</h2>
            <p className="text-text-muted">
              Esta Política de Privacidade descreve como o Serennia coleta, usa, armazena e 
              protege suas informações pessoais. Estamos comprometidos em proteger sua 
              privacidade e garantir a segurança de seus dados, em conformidade com a 
              Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">2. Dados que Coletamos</h2>
            <div className="text-text-muted space-y-4">
              <h3 className="text-lg font-semibold text-text">2.1 Dados fornecidos por você:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome completo e nome do estabelecimento</li>
                <li>Endereço de email e telefone</li>
                <li>CPF/CNPJ para fins fiscais</li>
                <li>Endereço do estabelecimento</li>
                <li>Informações de pagamento</li>
              </ul>

              <h3 className="text-lg font-semibold text-text">2.2 Dados coletados automaticamente:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endereço IP e dados de localização aproximada</li>
                <li>Tipo de dispositivo e navegador</li>
                <li>Páginas visitadas e tempo de uso</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <h3 className="text-lg font-semibold text-text">2.3 Dados de clientes do seu salão:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome e contato dos clientes</li>
                <li>Histórico de agendamentos e serviços</li>
                <li>Preferências e observações</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">3. Como Usamos seus Dados</h2>
            <div className="text-text-muted space-y-3">
              <p>Utilizamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e manter nossos serviços</li>
                <li>Processar pagamentos e transações</li>
                <li>Enviar comunicações importantes sobre o serviço</li>
                <li>Melhorar e personalizar sua experiência</li>
                <li>Detectar e prevenir fraudes</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Compartilhamento de Dados</h2>
            <div className="text-text-muted space-y-3">
              <p>Podemos compartilhar seus dados com:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Processadores de pagamento:</strong> Para processar transações financeiras</li>
                <li><strong>Provedores de infraestrutura:</strong> Serviços de hospedagem e armazenamento</li>
                <li><strong>Autoridades legais:</strong> Quando exigido por lei</li>
              </ul>
              <p className="mt-4">
                <strong>Nunca vendemos seus dados pessoais a terceiros.</strong>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Seus Direitos (LGPD)</h2>
            <div className="text-text-muted space-y-3">
              <p>Conforme a LGPD, você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">6. Segurança dos Dados</h2>
            <div className="text-text-muted space-y-3">
              <p>Implementamos medidas de segurança técnicas e organizacionais, incluindo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso (TLS/AES-256)</li>
                <li>Autenticação de dois fatores disponível</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e redundância de dados</li>
                <li>Controle de acesso baseado em funções</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">7. Cookies</h2>
            <div className="text-text-muted space-y-3">
              <p>Utilizamos cookies para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essenciais:</strong> Necessários para o funcionamento do site</li>
                <li><strong>Analíticos:</strong> Para entender como você usa o serviço</li>
                <li><strong>Preferências:</strong> Para lembrar suas configurações</li>
              </ul>
              <p>
                Você pode gerenciar cookies nas configurações do seu navegador.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">8. Retenção de Dados</h2>
            <p className="text-text-muted">
              Mantemos seus dados pelo tempo necessário para fornecer nossos serviços e 
              cumprir obrigações legais. Após o encerramento da conta, seus dados serão 
              excluídos ou anonimizados em até 90 dias, exceto quando a retenção for 
              exigida por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">9. Transferência Internacional</h2>
            <p className="text-text-muted">
              Seus dados podem ser processados em servidores localizados fora do Brasil. 
              Garantimos que qualquer transferência internacional seja realizada com as 
              salvaguardas apropriadas, conforme exigido pela LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">10. Alterações nesta Política</h2>
            <p className="text-text-muted">
              Podemos atualizar esta política periodicamente. Notificaremos você sobre 
              alterações significativas por email ou através do serviço. Recomendamos 
              revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">11. Contato do DPO</h2>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-text-muted mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
              </p>
              <ul className="text-text-muted space-y-2">
                <li>
                  <strong>Encarregado de Proteção de Dados (DPO):</strong>
                </li>
                <li>Email: <a href="mailto:privacidade@serennia.com.br" className="text-primary hover:underline">privacidade@serennia.com.br</a></li>
                <li>Endereço: São Paulo, SP - Brasil</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;

