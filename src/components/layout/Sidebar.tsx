// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { Calendar, ShoppingCart, Users, Scissors, Briefcase, TrendingUp, Settings, Shield, Bell } from 'lucide-react';
import React from 'react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  notification?: boolean;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, notification, children }) => {
  const activeClass = 'bg-accent text-primary';
  const inactiveClass = 'text-text hover:bg-background';

  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center justify-between space-x-3 p-3 rounded-lg transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`
        }
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span>{children}</span>
        </div>
        {notification && <span className="w-2 h-2 bg-primary rounded-full"></span>}
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Serenna</h1>
      <nav className="flex-1">
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
      <div className="mt-auto">
        <p className="text-center text-xs text-gray-400">Serenna v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
