// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/Login';
import Agenda from '../pages/Agenda';
import AgendamentoForm from '../pages/AgendamentoForm';
import Comandas from '../pages/Comandas';
import PagamentoComanda from '../pages/PagamentoComanda';
import Clientes from '../pages/Clientes';
import ClienteForm from '../pages/ClienteForm.tsx';
import ClienteProfile from '../pages/ClienteProfile';
import Servicos from '../pages/Servicos';
import ServicoForm from '../pages/ServicoForm';
import Produtos from '../pages/Produtos';
import ProdutoForm from '../pages/ProdutoForm';
import Colaboradores from '../pages/Colaboradores';
import ColaboradorForm from '../pages/ColaboradorForm';
import ColaboradorProfile from '../pages/ColaboradorProfile';
import Financeiro from '../pages/Financeiro';
import Configuracoes from '../pages/Configuracoes';
import Auditoria from '../pages/Auditoria';
import Notificacoes from '../pages/Notificacoes';
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
      { path: '/', element: <Agenda />, index: true }, // Redirect root to agenda
      { path: 'agenda', element: <Agenda /> },
      { path: 'agenda/novo', element: <AgendamentoForm /> },
      { path: 'agenda/editar/:id', element: <AgendamentoForm /> },
      { path: 'comandas', element: <Comandas /> },
      { path: 'comandas/:id/pagamento', element: <PagamentoComanda /> },
      {
        path: 'clientes',
        children: [
          { path: '', element: <Clientes />, index: true },
          { path: 'novo', element: <ClienteForm /> },
          { path: ':id', element: <ClienteProfile /> },
        ],
      },
      { path: 'servicos', element: <Servicos /> },
      { path: 'servicos/novo', element: <ServicoForm /> },
      { path: 'servicos/:id', element: <ServicoForm /> },
      { path: 'produtos', element: <Produtos /> },
      { path: 'produtos/novo', element: <ProdutoForm /> },
      { path: 'produtos/:id', element: <ProdutoForm /> },
      {
        path: 'colaboradores',
        children: [
          { path: '', element: <Colaboradores />, index: true },
          { path: 'novo', element: <ColaboradorForm /> },
          { path: ':id', element: <ColaboradorProfile /> },
        ],
      },
      { path: 'financeiro', element: <Financeiro /> },
      { path: 'configuracoes', element: <Configuracoes /> },
      { path: 'auditoria', element: <Auditoria /> },
      { path: 'notificacoes', element: <Notificacoes /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
