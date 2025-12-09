// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Users, Scissors, Briefcase, TrendingUp, Settings, Shield, Bell, Moon, Sun, LogOut, Package, User as UserIcon, X, DollarSign } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { getNotifications } from '../../lib/api';

interface SidebarProps {
  onClose?: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  notification?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, notification, children, onClick }) => {
  const activeClass = 'bg-primary text-white border-r-4 border-accent shadow-md';
  const inactiveClass = 'text-text hover:bg-secondary/30 hover:text-primary';

  return (
    <li className="mb-1">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-l-xl transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
        }
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-5 h-5">{icon}</div>
          <span className="font-medium text-sm">{children}</span>
        </div>
        {notification && <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>}
      </NavLink>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [platformName, setPlatformName] = useState('Serennia');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

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
        const stored = window.localStorage.getItem('serennia-appearance');
        if (!stored) {
          setPlatformName('Serennia');
          return;
        }
        const parsed = JSON.parse(stored) as { platformName?: string };
        if (parsed.platformName && parsed.platformName.trim().length > 0) {
          setPlatformName(parsed.platformName.trim());
        } else {
          setPlatformName('Serennia');
        }
      } catch {
        setPlatformName('Serennia');
      }
    };

    loadAppearanceName();

    const handler = () => loadAppearanceName();
    window.addEventListener('serennia-appearance-changed', handler);
    return () => window.removeEventListener('serennia-appearance-changed', handler);
  }, []);

  useEffect(() => {
    const updateNotifications = async () => {
      try {
        const notifications = await getNotifications();
        setHasUnreadNotifications(notifications.filter(n => !n.read).length > 0);
      } catch {
        setHasUnreadNotifications(false);
      }
    };

    updateNotifications();
    const interval = setInterval(updateNotifications, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
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

  // Map user role to UserRole type for permissions
  // Super admin and tenant admin should have admin-level access
  const getRoleForPermissions = (): 'admin' | 'manager' | 'receptionist' | 'professional' | 'accountant' => {
    if (!user) return 'admin';

    // If user has platformRole (super_admin or tenant_admin), treat as admin
    if (user.platformRole === 'super_admin' || user.platformRole === 'tenant_admin') {
      return 'admin';
    }

    // Use tenantRole if available
    if (user.tenantRole) {
      return user.tenantRole;
    }

    // Fallback: if role is set (legacy), use it
    if (user.role) {
      // Map super_admin and tenant_admin to admin for permissions
      if (user.role === 'super_admin' || user.role === 'tenant_admin') {
        return 'admin';
      }
      if (user.role === 'admin' || user.role === 'manager' || user.role === 'receptionist' || user.role === 'professional' || user.role === 'accountant') {
        return user.role;
      }
    }

    // Default to admin for safety
    return 'admin';
  };

  const role = getRoleForPermissions();
  const { canAccessRoute } = usePermissions();

  const canSeeLink = (key: 'agenda' | 'comandas' | 'clientes' | 'servicos' | 'produtos' | 'colaboradores' | 'financeiro' | 'comissoes' | 'configuracoes' | 'auditoria' | 'notificacoes') => {
    return canAccessRoute(role, key);
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
    <aside className="w-64 lg:w-64 h-screen bg-sidebar shadow-serennia flex flex-col border-r border-border relative overflow-hidden">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 gradient-subtle opacity-30 pointer-events-none" />
      
      <div className="p-4 lg:p-6 relative z-10 flex items-center justify-between">
        <div>
          <h1
            className={`${titleSizeClass} font-bold text-primary leading-tight break-words max-w-full`}
          >
            {normalizedName}
          </h1>
          <p className="text-xs text-text-muted mt-1">powered by serennia</p>
        </div>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-card transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 px-2 relative z-10 overflow-y-auto">
        <ul>
          {canSeeLink('agenda') && (
            <SidebarLink to="/app/agenda" icon={<Calendar />} onClick={onClose}>Agenda</SidebarLink>
          )}
          {canSeeLink('comandas') && (
            <SidebarLink to="/app/comandas" icon={<ShoppingCart />} onClick={onClose}>Comandas</SidebarLink>
          )}
          {canSeeLink('clientes') && (
            <SidebarLink to="/app/clientes" icon={<Users />} onClick={onClose}>Clientes</SidebarLink>
          )}
          {canSeeLink('servicos') && (
            <SidebarLink to="/app/servicos" icon={<Scissors />} onClick={onClose}>Serviços</SidebarLink>
          )}
          {canSeeLink('produtos') && (
            <SidebarLink to="/app/produtos" icon={<Package />} onClick={onClose}>Produtos</SidebarLink>
          )}
          {canSeeLink('colaboradores') && (
            <SidebarLink to="/app/colaboradores" icon={<Briefcase />} onClick={onClose}>Colaboradores</SidebarLink>
          )}
          {canSeeLink('financeiro') && (
            <SidebarLink to="/app/financeiro" icon={<TrendingUp />} onClick={onClose}>Financeiro</SidebarLink>
          )}
          {canSeeLink('comissoes') && (
            <SidebarLink to="/app/comissoes" icon={<DollarSign />} onClick={onClose}>Comissões</SidebarLink>
          )}
          {canSeeLink('configuracoes') && (
            <SidebarLink to="/app/configuracoes" icon={<Settings />} onClick={onClose}>Configurações</SidebarLink>
          )}
          {canSeeLink('auditoria') && (
            <SidebarLink to="/app/auditoria" icon={<Shield />} onClick={onClose}>Auditoria</SidebarLink>
          )}
          {canSeeLink('notificacoes') && (
            <SidebarLink to="/app/notificacoes" icon={<Bell />} notification={hasUnreadNotifications} onClick={onClose}>
              Notificações
            </SidebarLink>
          )}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4 relative z-10">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-card hover:bg-secondary/50 transition-all duration-200 border border-border"
          aria-label="Toggle dark mode"
        >
          <span className="text-xs lg:text-sm font-medium text-text">
            {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
          </span>
          <div className="relative w-10 lg:w-12 h-5 lg:h-6 bg-border rounded-full transition-colors overflow-hidden">
            <div className={`absolute inset-0 gradient-primary-secondary opacity-30`} />
            <div className={`absolute top-0.5 lg:top-1 ${theme === 'dark' ? 'right-0.5 lg:right-1' : 'left-0.5 lg:left-1'} w-4 h-4 gradient-primary-secondary rounded-full transition-all duration-200 flex items-center justify-center shadow-sm`}>
              {theme === 'light' ? (
                <Sun className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
              ) : (
                <Moon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-3 lg:p-4 relative z-10" ref={profileRef}>
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 bg-card rounded-xl hover:ring-2 hover:ring-primary/50 transition-all duration-200 border border-border hover:shadow-elevated"
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 gradient-primary-secondary rounded-full flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-semibold text-xs lg:text-sm">{initials}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs lg:text-sm font-medium text-text truncate">{displayName}</p>
            {displayEmail && (
              <p className="text-xs text-text-muted truncate">{displayEmail}</p>
            )}
          </div>
        </button>

        {/* Dropdown Perfil / Logout */}
        {showLogout && (
          <div
            className="absolute bottom-full left-3 lg:left-4 right-3 lg:right-4 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-slide-up"
          >
            <button
              onClick={() => {
                setShowLogout(false);
                onClose?.();
                navigate('/app/perfil');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-secondary transition-colors text-left border-b border-border"
            >
              <UserIcon className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-medium text-text">Ver perfil</span>
            </button>
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
