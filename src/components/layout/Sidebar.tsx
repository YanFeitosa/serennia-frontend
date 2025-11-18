// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Users, Scissors, Briefcase, TrendingUp, Settings, Shield, Bell, Moon, Sun, LogOut, Package } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [platformName, setPlatformName] = useState('Serenna');

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!profileRef.current) return;
      const target = e.target as Node | null;
      if (target && profileRef.current.contains(target)) return;
      setShowLogout(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const loadAppearanceName = () => {
      try {
        const stored = window.localStorage.getItem('serenna-appearance');
        if (!stored) {
          setPlatformName('Serenna');
          return;
        }
        const parsed = JSON.parse(stored) as { platformName?: string };
        if (parsed.platformName && parsed.platformName.trim().length > 0) {
          setPlatformName(parsed.platformName.trim());
        } else {
          setPlatformName('Serenna');
        }
      } catch {
        setPlatformName('Serenna');
      }
    };

    loadAppearanceName();

    const handler = () => loadAppearanceName();
    window.addEventListener('serenna-appearance-changed', handler);
    return () => window.removeEventListener('serenna-appearance-changed', handler);
  }, []);

	const normalizedName = platformName.trim();
	const titleLength = normalizedName.length;

	let titleSizeClass = 'text-3xl';
	if (titleLength > 18) titleSizeClass = 'text-2xl';
	if (titleLength > 26) titleSizeClass = 'text-xl';
	if (titleLength > 34) titleSizeClass = 'text-lg';

	const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role ?? 'admin';

  const canSeeLink = (key: 'agenda' | 'comandas' | 'clientes' | 'servicos' | 'produtos' | 'colaboradores' | 'financeiro' | 'configuracoes' | 'auditoria' | 'notificacoes') => {
    if (role === 'admin') return true;
    if (role === 'manager') {
      return ['servicos', 'produtos', 'colaboradores', 'financeiro', 'configuracoes', 'auditoria'].includes(key);
    }
    if (role === 'receptionist') {
      return ['agenda', 'comandas', 'clientes', 'servicos', 'produtos', 'colaboradores', 'notificacoes'].includes(key);
    }
    if (role === 'professional') {
      return ['agenda', 'comandas', 'clientes', 'notificacoes'].includes(key);
    }
    return false;
  };

  const displayName = user?.name ?? 'Usuário';
  const displayEmail = user?.email ?? '';
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 h-screen bg-sidebar shadow-serenna flex flex-col border-r border-border">
      <div className="p-6">
        <h1
          className={`${titleSizeClass} font-semibold text-primary leading-tight break-words max-w-full`}
        >
          {normalizedName}
        </h1>
        <p className="text-xs text-text-muted mt-1">Gestão de Salão</p>
      </div>
      <nav className="flex-1 py-4 px-2">
        <ul>
          {canSeeLink('agenda') && (
            <SidebarLink to="/agenda" icon={<Calendar />}>Agenda</SidebarLink>
          )}
          {canSeeLink('comandas') && (
            <SidebarLink to="/comandas" icon={<ShoppingCart />}>Comandas</SidebarLink>
          )}
          {canSeeLink('clientes') && (
            <SidebarLink to="/clientes" icon={<Users />}>Clientes</SidebarLink>
          )}
          {canSeeLink('servicos') && (
            <SidebarLink to="/servicos" icon={<Scissors />}>Serviços</SidebarLink>
          )}
          {canSeeLink('produtos') && (
            <SidebarLink to="/produtos" icon={<Package />}>Produtos</SidebarLink>
          )}
          {canSeeLink('colaboradores') && (
            <SidebarLink to="/colaboradores" icon={<Briefcase />}>Colaboradores</SidebarLink>
          )}
          {canSeeLink('financeiro') && (
            <SidebarLink to="/financeiro" icon={<TrendingUp />}>Financeiro</SidebarLink>
          )}
          {canSeeLink('configuracoes') && (
            <SidebarLink to="/configuracoes" icon={<Settings />}>Configurações</SidebarLink>
          )}
          {canSeeLink('auditoria') && (
            <SidebarLink to="/auditoria" icon={<Shield />}>Auditoria</SidebarLink>
          )}
          {canSeeLink('notificacoes') && (
            <SidebarLink to="/notificacoes" icon={<Bell />} notification={true}>Notificações</SidebarLink>
          )}
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
            {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
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
      <div className="p-4 relative" ref={profileRef}>
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-card rounded-xl hover:ring-2 hover:ring-primary transition-all duration-200 border border-border"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-text">{displayName}</p>
            {displayEmail && (
              <p className="text-xs text-text-muted">{displayEmail}</p>
            )}
          </div>
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div 
            className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-slide-up"
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
