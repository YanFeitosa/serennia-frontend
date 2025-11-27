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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-[#0f0f1a] rounded-xl md:rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left side - Text */}
          <div className="lg:w-1/2 bg-gradient-to-br from-landing-purple via-landing-blue to-landing-pink p-6 md:p-8 lg:p-12 text-white">
            <div className="h-full flex flex-col justify-center">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <Icon className="w-7 h-7 md:w-10 md:h-10" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{slide.title}</h2>
              <p className="text-white/80 text-base md:text-lg mb-6 md:mb-8">{slide.description}</p>

              <ul className="space-y-2 md:space-y-3">
                {slide.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                    <span className="text-white/90 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="lg:w-1/2 p-4 md:p-8 lg:p-12 text-white">
            <div className="h-full flex flex-col">
              {/* Slide indicator */}
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <span className="text-xs md:text-sm text-gray-400">
                  {currentSlide + 1} de {demoSlides.length}
                </span>
                <div className="flex gap-1.5 md:gap-2">
                  {demoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${index === currentSlide ? "bg-purple-500" : "bg-white/20"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              <div className="flex-1 rounded-lg md:rounded-xl border border-white/10 overflow-hidden shadow-md mb-4 md:mb-8">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  className="flex items-center gap-1 md:gap-2 text-sm md:text-base px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {currentSlide === demoSlides.length - 1 ? (
                  <button onClick={handleClose} className="text-sm md:text-base px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">Começar Agora</button>
                ) : (
                  <button onClick={nextSlide} className="flex items-center gap-1 md:gap-2 text-sm md:text-base px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
                    Próximo
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
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
