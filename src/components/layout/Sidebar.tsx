// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Users, Scissors, Briefcase, TrendingUp, Settings, Shield, Bell, Moon, Sun, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  notification?: boolean;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, notification, children }) => {
  const activeClass = 'bg-secondary text-primary border-r-4 border-primary';
  const inactiveClass = 'text-text-muted hover:bg-secondary hover:text-primary';

  return (
    <li className="mb-1">
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center justify-between px-4 py-3 rounded-l-xl transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
        }
      >
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5">{icon}</div>
          <span className="font-medium text-sm">{children}</span>
        </div>
        {notification && <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>}
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    // Limpar dados de autenticação (se houver)
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-sidebar shadow-serenna flex flex-col border-r border-border">
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-primary">Serenna</h1>
        <p className="text-xs text-text-muted mt-1">Gestão de Salão</p>
      </div>
      <nav className="flex-1 py-4 px-2">
        <ul>
          <SidebarLink to="/agenda" icon={<Calendar />}>Agenda</SidebarLink>
          <SidebarLink to="/comandas" icon={<ShoppingCart />}>Comandas</SidebarLink>
          <SidebarLink to="/clientes" icon={<Users />}>Clientes</SidebarLink>
          <SidebarLink to="/servicos" icon={<Scissors />}>Serviços</SidebarLink>
          <SidebarLink to="/colaboradores" icon={<Briefcase />}>Colaboradores</SidebarLink>
          <SidebarLink to="/financeiro" icon={<TrendingUp />}>Financeiro</SidebarLink>
          <SidebarLink to="/configuracoes" icon={<Settings />}>Configurações</SidebarLink>
          <SidebarLink to="/auditoria" icon={<Shield />}>Auditoria</SidebarLink>
          <SidebarLink to="/notificacoes" icon={<Bell />} notification={true}>Notificações</SidebarLink>
        </ul>
      </nav>
      
      {/* Dark Mode Toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-card hover:bg-secondary transition-all duration-200 border border-border"
          aria-label="Toggle dark mode"
        >
          <span className="text-sm font-medium text-text">
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </span>
          <div className="relative w-12 h-6 bg-border rounded-full transition-colors">
            <div className={`absolute top-1 ${theme === 'dark' ? 'right-1' : 'left-1'} w-4 h-4 bg-primary rounded-full transition-all duration-200 flex items-center justify-center`}>
              {theme === 'light' ? (
                <Sun className="w-3 h-3 text-white" />
              ) : (
                <Moon className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 relative">
        <button
          onClick={() => setShowLogout(!showLogout)}
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-card rounded-xl hover:ring-2 hover:ring-primary transition-all duration-200 border border-border"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-text">Admin</p>
            <p className="text-xs text-text-muted">admin@serenna.com</p>
          </div>
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div 
            className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-slide-up"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-medium text-text">Sair</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
