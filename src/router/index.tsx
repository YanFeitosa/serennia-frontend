// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/Login';
import Agenda from '../pages/Agenda';
import AgendamentoForm from '../pages/AgendamentoForm';
import Comandas from '../pages/Comandas';
import Clientes from '../pages/Clientes';
import ClienteForm from '../pages/ClienteForm.tsx';
import ClienteProfile from '../pages/ClienteProfile';
import Servicos from '../pages/Servicos';
import Colaboradores from '../pages/Colaboradores';
import ColaboradorForm from '../pages/ColaboradorForm';
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
      {
        path: 'clientes',
        children: [
          { path: '', element: <Clientes />, index: true },
          { path: 'novo', element: <ClienteForm /> },
          { path: ':id', element: <ClienteProfile /> },
        ],
      },
      { path: 'servicos', element: <Servicos /> },
      { path: 'colaboradores', element: <Colaboradores /> },
      { path: 'colaboradores/novo', element: <ColaboradorForm /> },
      { path: 'financeiro', element: <Financeiro /> },
      { path: 'configuracoes', element: <Configuracoes /> },
      { path: 'auditoria', element: <Auditoria /> },
      { path: 'notificacoes', element: <Notificacoes /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
