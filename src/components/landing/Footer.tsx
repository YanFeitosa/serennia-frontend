// src/components/landing/Footer.tsx
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import sereniaLogo from '../../assets/serennia-logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <img
                src={sereniaLogo}
                alt="Serennia Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <span className="text-xl md:text-2xl font-bold text-white">Serennia</span>
            </Link>
            <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">
              Sistema completo para gestão de salões de beleza. Simplifique sua operação e foque no que importa.
            </p>
            {/* Social links */}
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Produto</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#features" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Benefícios
                </a>
              </li>
              <li>
                <Link to="/login" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Empresa</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors text-xs md:text-sm">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-gray-600 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Serennia. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs md:text-sm">
            Feito com 💜 no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
