// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import RoleGuard from '../components/auth/RoleGuard';
import LoginPage from '../pages/Login';
import Agenda from '../pages/agenda/Agenda';
import AgendamentoForm from '../pages/agenda/AgendamentoForm';
import Comandas from '../pages/comandas/Comandas';
import PagamentoComanda from '../pages/comandas/PagamentoComanda';
import Clientes from '../pages/clientes/Clientes';
import ClienteForm from '../pages/clientes/ClienteForm';
import ClienteProfile from '../pages/clientes/ClienteProfile';
import Servicos from '../pages/servicos/Servicos';
import ServicoForm from '../pages/servicos/ServicoForm';
import Produtos from '../pages/produtos/Produtos';
import ProdutoForm from '../pages/produtos/ProdutoForm';
import Colaboradores from '../pages/colaboradores/Colaboradores';
import ColaboradorForm from '../pages/colaboradores/ColaboradorForm';
import ColaboradorProfile from '../pages/colaboradores/ColaboradorProfile';
import UserProfile from '../pages/user/UserProfile';
import Financeiro from '../pages/financeiro/Financeiro';
import Configuracoes from '../pages/configuracoes/Configuracoes';
import Auditoria from '../pages/configuracoes/Auditoria';
import Notificacoes from '../pages/configuracoes/Notificacoes';
import Welcome from '../pages/totem/Welcome';
import ServiceSelection from '../pages/totem/ServiceSelection';
import Confirmation from '../pages/totem/Confirmation';
import Cadastro from '../pages/totem/Cadastro';
import TotemLogin from '../pages/totem/Login';
import TotemLayout from '../components/layout/TotemLayout';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/totem',
    element: <TotemLayout />,
    children: [
      { path: '', element: <Welcome />, index: true },
      { path: 'servicos', element: <ServiceSelection /> },
      { path: 'confirmacao', element: <Confirmation /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'login', element: <TotemLogin /> },
    ],
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        index: true,
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <Agenda />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda',
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <Agenda />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda/novo',
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <AgendamentoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda/editar/:id',
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <AgendamentoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'comandas',
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <Comandas />
          </RoleGuard>
        ),
      },
      {
        path: 'comandas/:id/pagamento',
        element: (
          <RoleGuard allowed={['admin', 'receptionist', 'professional']}>
            <PagamentoComanda />
          </RoleGuard>
        ),
      },
      {
        path: 'clientes',
        children: [
          {
            path: '',
            index: true,
            element: (
              <RoleGuard allowed={['admin', 'receptionist']}>
                <Clientes />
              </RoleGuard>
            ),
          },
          {
            path: 'novo',
            element: (
              <RoleGuard allowed={['admin', 'receptionist']}>
                <ClienteForm />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard allowed={['admin', 'receptionist']}>
                <ClienteProfile />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'perfil',
        element: (
          <RoleGuard allowed={['admin', 'manager', 'receptionist', 'professional']}>
            <UserProfile />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos',
        element: (
          <RoleGuard allowed={['admin', 'manager', 'receptionist']}>
            <Servicos />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos/novo',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <ServicoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos/:id',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <ServicoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos',
        element: (
          <RoleGuard allowed={['admin', 'manager', 'receptionist']}>
            <Produtos />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos/novo',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <ProdutoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos/:id',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <ProdutoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'colaboradores',
        children: [
          {
            path: '',
            index: true,
            element: (
              <RoleGuard allowed={['admin', 'manager', 'receptionist']}>
                <Colaboradores />
              </RoleGuard>
            ),
          },
          {
            path: 'novo',
            element: (
              <RoleGuard allowed={['admin', 'manager']}>
                <ColaboradorForm />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard allowed={['admin', 'manager', 'receptionist']}>
                <ColaboradorProfile />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'financeiro',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <Financeiro />
          </RoleGuard>
        ),
      },
      {
        path: 'configuracoes',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <Configuracoes />
          </RoleGuard>
        ),
      },
      {
        path: 'auditoria',
        element: (
          <RoleGuard allowed={['admin', 'manager']}>
            <Auditoria />
          </RoleGuard>
        ),
      },
      {
        path: 'notificacoes',
        element: (
          <RoleGuard allowed={['admin', 'receptionist']}>
            <Notificacoes />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
