# Serennia Frontend

Sistema de gestão para salões de beleza - Interface do usuário.

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router v6** para navegação
- **React Hook Form + Zod** para validação de formulários
- **Recharts** para gráficos
- **Supabase** para autenticação

## 📋 Pré-requisitos

- Node.js >= 18
- npm ou pnpm
- Backend Serennia rodando (ver [serennia-backend](../serennia-backend/))

## 🚀 Instalação

1. **Clone o repositório e entre na pasta:**

```bash
cd serennia-frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto (para desenvolvimento) e use `.env.production` ou variáveis de ambiente no provedor (para produção):

```env
# URL da API do backend
VITE_API_BASE_URL=http://localhost:4000

# Supabase (Auth)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa ESLint |

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes base (Button, Input, etc.)
│   ├── agenda/      # Componentes de agenda
│   ├── comandas/    # Componentes de comandas
│   └── landing/     # Componentes da landing page
├── contexts/        # Contextos React (Auth, Theme, Permissions)
├── lib/             # Utilitários e APIs
│   └── api/         # Funções de chamada à API
├── pages/           # Páginas da aplicação
│   ├── agenda/
│   ├── clientes/
│   ├── colaboradores/
│   ├── comandas/
│   ├── configuracoes/
│   ├── financeiro/
│   ├── produtos/
│   ├── servicos/
│   ├── totem/
│   └── user/
├── types/           # Tipos TypeScript
└── router.tsx       # Configuração de rotas
```

## 🎨 Funcionalidades

- **Agenda**: Visualização e gerenciamento de agendamentos
- **Clientes**: Cadastro e histórico de clientes
- **Colaboradores**: Gestão de profissionais com CPF e comissões
- **Comandas**: Atendimentos e pagamentos
- **Financeiro**: Dashboard com receitas, custos e ponto de equilíbrio
- **Serviços e Produtos**: Catálogo completo
- **Totem**: Interface para autoatendimento
- **Configurações**: Personalização de cores, templates de mensagens e permissões

## 🔐 Autenticação

A autenticação é feita via Supabase Auth. Os usuários são criados pelo backend e recebem um email de boas-vindas com link para definir a senha.

## 🌐 Deploy (Render)

Static Site (Render):

- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment (Build-time):
	- `VITE_API_BASE_URL=https://serennia-backend.onrender.com`
	- `VITE_SUPABASE_URL=<sua URL do Supabase>`
	- `VITE_SUPABASE_PUBLISHABLE_KEY=<sua chave publicável do Supabase>`

Recomendado para SPA (React Router): adicione um Redirect/Rewrite `/* -> /index.html` na aba Redirects do site para que rotas do app funcionem ao recarregar a página.

Para testar localmente a build de produção:

```bash
npm run build
npm run preview
```

Os arquivos compilados estarão em `dist/`.

## 📄 Licença

Projeto proprietário - Todos os direitos reservados.
