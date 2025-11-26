// src/components/landing/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Serenna</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-text hover:text-primary transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="text-text hover:text-primary transition-colors"
            >
              Benefícios
            </button>
            <Link
              to="/login"
              className="text-text hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Button
              onClick={() => scrollToSection('register')}
              size="sm"
            >
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-text hover:text-primary transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="block w-full text-left text-text hover:text-primary transition-colors"
            >
              Benefícios
            </button>
            <Link
              to="/login"
              className="block text-text hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entrar
            </Link>
            <Button
              onClick={() => scrollToSection('register')}
              className="w-full"
              size="sm"
            >
              Começar Grátis
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

