// src/pages/static/Contact.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

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
          <h1 className="text-4xl font-bold text-text">Contato</h1>
          <p className="text-text-muted mt-2">Estamos aqui para ajudar</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text mb-4">Fale Conosco</h2>
              <p className="text-text-muted">
                Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato 
                conosco através do formulário ou pelos canais abaixo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Email</h3>
                  <p className="text-text-muted">contato@serennia.com.br</p>
                  <p className="text-text-muted">suporte@serennia.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Telefone</h3>
                  <p className="text-text-muted">(11) 99999-9999</p>
                  <p className="text-sm text-text-muted">Seg a Sex, 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Endereço</h3>
                  <p className="text-text-muted">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text mb-3">Perguntas Frequentes</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Como funciona o período de teste?
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Posso cancelar a qualquer momento?
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Como migrar meus dados de outro sistema?
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-xl border border-border">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Mensagem Enviada!</h3>
                <p className="text-text-muted mb-6">
                  Obrigado pelo contato. Responderemos em até 24 horas.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-text mb-4">Envie uma mensagem</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Assunto *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre o sistema</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="comercial">Informações comerciais</option>
                    <option value="parceria">Proposta de parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Mensagem *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Como podemos ajudar?"
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;

