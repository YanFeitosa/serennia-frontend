// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import RoleGuard from '../components/auth/RoleGuard';
import LoginPage from '../pages/Login';
import SelecionarSalao from '../pages/SelecionarSalao';
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
import Comissoes from '../pages/comissoes/Comissoes';
import Configuracoes from '../pages/configuracoes/Configuracoes';
import Auditoria from '../pages/configuracoes/Auditoria';
import Notificacoes from '../pages/configuracoes/Notificacoes';
import Welcome from '../pages/totem/Welcome';
import ServiceSelection from '../pages/totem/ServiceSelection';
import ProfessionalSelection from '../pages/totem/ProfessionalSelection';
import DateTimeSelection from '../pages/totem/DateTimeSelection';
import Confirmation from '../pages/totem/Confirmation';
import Cadastro from '../pages/totem/Cadastro';
import TotemLogin from '../pages/totem/Login';
import DeviceLogin from '../pages/totem/DeviceLogin';
import TotemLayout from '../components/layout/TotemLayout';
import Landing from '../pages/Landing';
// Auth pages
import EmailConfirmed from '../pages/auth/EmailConfirmed';
// Static pages
import About from '../pages/static/About';
import Contact from '../pages/static/Contact';
import Terms from '../pages/static/Terms';
import Privacy from '../pages/static/Privacy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/selecionar-salao',
    element: <SelecionarSalao />,
  },
  // Auth callback pages
  {
    path: '/auth/callback',
    element: <EmailConfirmed />,
  },
  {
    path: '/verificar-email',
    element: <EmailConfirmed />,
  },
  // Static pages
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/totem',
    element: <TotemLayout />,
    children: [
      { path: '', element: <Welcome />, index: true },
      { path: 'device-login', element: <DeviceLogin /> },
      { path: 'login', element: <TotemLogin /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'servicos', element: <ServiceSelection /> },
      { path: 'profissional', element: <ProfessionalSelection /> },
      { path: 'data-hora', element: <DateTimeSelection /> },
      { path: 'confirmacao', element: <Confirmation /> },
    ],
  },
  {
    path: '/app',
    element: <App />,
    children: [
      {
        path: '',
        index: true,
        element: (
          <RoleGuard resourceKey="agenda">
            <Agenda />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda',
        element: (
          <RoleGuard resourceKey="agenda">
            <Agenda />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda/novo',
        element: (
          <RoleGuard resourceKey="agenda">
            <AgendamentoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'agenda/editar/:id',
        element: (
          <RoleGuard resourceKey="agenda">
            <AgendamentoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'comandas',
        element: (
          <RoleGuard resourceKey="comandas">
            <Comandas />
          </RoleGuard>
        ),
      },
      {
        path: 'comandas/:id/pagamento',
        element: (
          <RoleGuard resourceKey="comandas">
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
              <RoleGuard resourceKey="clientes">
                <Clientes />
              </RoleGuard>
            ),
          },
          {
            path: 'novo',
            element: (
              <RoleGuard resourceKey="clientes">
                <ClienteForm />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard resourceKey="clientes">
                <ClienteProfile />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'perfil',
        element: (
          <RoleGuard allowed={['admin', 'manager', 'receptionist', 'professional', 'super_admin', 'tenant_admin']}>
            <UserProfile />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos',
        element: (
          <RoleGuard resourceKey="servicos">
            <Servicos />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos/novo',
        element: (
          <RoleGuard resourceKey="servicos">
            <ServicoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'servicos/:id',
        element: (
          <RoleGuard resourceKey="servicos">
            <ServicoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos',
        element: (
          <RoleGuard resourceKey="produtos">
            <Produtos />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos/novo',
        element: (
          <RoleGuard resourceKey="produtos">
            <ProdutoForm />
          </RoleGuard>
        ),
      },
      {
        path: 'produtos/:id',
        element: (
          <RoleGuard resourceKey="produtos">
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
              <RoleGuard resourceKey="colaboradores">
                <Colaboradores />
              </RoleGuard>
            ),
          },
          {
            path: 'novo',
            element: (
              <RoleGuard resourceKey="colaboradores">
                <ColaboradorForm />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard resourceKey="colaboradores">
                <ColaboradorProfile />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'financeiro',
        element: (
          <RoleGuard resourceKey="financeiro">
            <Financeiro />
          </RoleGuard>
        ),
      },
      {
        path: 'comissoes',
        element: (
          <RoleGuard resourceKey="comissoes">
            <Comissoes />
          </RoleGuard>
        ),
      },
      {
        path: 'configuracoes',
        element: (
          <RoleGuard resourceKey="configuracoes">
            <Configuracoes />
          </RoleGuard>
        ),
      },
      {
        path: 'auditoria',
        element: (
          <RoleGuard resourceKey="auditoria">
            <Auditoria />
          </RoleGuard>
        ),
      },
      {
        path: 'notificacoes',
        element: (
          <RoleGuard resourceKey="notificacoes">
            <Notificacoes />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
