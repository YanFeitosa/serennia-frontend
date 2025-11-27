// src/components/landing/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import serenLogo from '../../assets/serennia-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <img
              src={serenLogo}
              alt="Serennia Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Serennia
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Benefícios
            </button>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Entrar
            </Link>
            <button
              onClick={() => scrollToSection('register')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
            >
              Começar Grátis
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="block w-full text-left text-gray-300 hover:text-white py-2 transition-colors"
            >
              Benefícios
            </button>
            <Link
              to="/login"
              className="block text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entrar
            </Link>
            <button
              onClick={() => scrollToSection('register')}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
            >
              Começar Grátis
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
