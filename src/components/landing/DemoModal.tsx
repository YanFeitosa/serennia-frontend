// src/components/landing/DemoModal.tsx

import { useState } from "react";
import {
  X,
  Calendar,
  ShoppingCart,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";

// Import das imagens locais
import agendaImg from "../../assets/landing/demo/agenda.png";
import comandasImg from "../../assets/landing/demo/comandas.png";
import financeiroImg from "../../assets/landing/demo/financeiro.png";
import clientesImg from "../../assets/landing/demo/clientes.png";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSlides = [
  {
    title: "Agenda Inteligente",
    description:
      "Visualize todos os agendamentos do dia, semana ou mês. Arraste e solte para reagendar. Cores por profissional para fácil identificação.",
    icon: Calendar,
    image: agendaImg,
    features: [
      "Visualização diária, semanal e mensal",
      "Drag & drop para reagendar",
      "Cores personalizadas por profissional",
      "Notificações automáticas para clientes",
    ],
  },
  {
    title: "Gestão de Comandas",
    description:
      "Controle completo das comandas do salão. Adicione serviços e produtos, aplique descontos e processe pagamentos.",
    icon: ShoppingCart,
    image: comandasImg,
    features: [
      "Criação rápida de comandas",
      "Adição de serviços e produtos",
      "Descontos e formas de pagamento",
      "Histórico completo por cliente",
    ],
  },
  {
    title: "Controle Financeiro",
    description:
      "Acompanhe receitas, despesas e comissões em tempo real. Relatórios detalhados para tomada de decisão.",
    icon: DollarSign,
    image: financeiroImg,
    features: [
      "Dashboard financeiro em tempo real",
      "Gestão de custos fixos e variáveis",
      "Cálculo automático de comissões",
      "Ponto de equilíbrio e metas",
    ],
  },
  {
    title: "Gestão de Clientes",
    description:
      "Cadastro completo de clientes com histórico de serviços, preferências e aniversários.",
    icon: Users,
    image: clientesImg,
    features: [
      "Perfil completo do cliente",
      "Histórico de atendimentos",
      "Preferências e observações",
      "Lembretes de aniversário",
    ],
  },
];

const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  if (!isOpen) return null;

  const slide = demoSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left side - Text */}
          <div className="lg:w-1/2 bg-gradient-to-br from-primary via-primary/80 to-accent p-8 lg:p-12 text-white">
            <div className="h-full flex flex-col justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-white/80 text-lg mb-8">{slide.description}</p>

              <ul className="space-y-3">
                {slide.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="h-full flex flex-col">
              {/* Slide indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm text-text-muted">
                  {currentSlide + 1} de {demoSlides.length}
                </span>
                <div className="flex gap-2">
                  {demoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-primary" : "bg-border"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              <div className="flex-1 rounded-xl border border-border overflow-hidden shadow-md mb-8">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentSlide === demoSlides.length - 1 ? (
                  <Button onClick={handleClose}>Começar Agora</Button>
                ) : (
                  <Button onClick={nextSlide} className="flex items-center gap-2">
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
