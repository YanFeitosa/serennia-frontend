// src/components/landing/Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Serenna</h3>
            <p className="text-text-muted">
              Sistema completo para gestão de salões de beleza.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-text-muted hover:text-primary transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-text-muted hover:text-primary transition-colors">
                  Benefícios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-text-muted hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-muted hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-text-muted hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-text-muted hover:text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-text-muted text-sm">
          <p>© {new Date().getFullYear()} Serenna. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

