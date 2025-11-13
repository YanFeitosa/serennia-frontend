// src/pages/TesteCores.tsx
// Página de teste para visualizar todas as cores dinâmicas

const TesteCores = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-text mb-8">Teste de Cores Dinâmicas</h1>
      
      {/* Cores de Fundo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Fundos (Backgrounds)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background border border-border p-4 rounded-lg">
            <p className="text-text font-semibold">bg-background</p>
            <p className="text-text-muted text-sm">Fundo principal</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-text font-semibold">bg-card</p>
            <p className="text-text-muted text-sm">Fundo de cards</p>
          </div>
          <div className="bg-sidebar border border-border p-4 rounded-lg">
            <p className="text-text font-semibold">bg-sidebar</p>
            <p className="text-text-muted text-sm">Fundo de tabelas/sidebar</p>
          </div>
        </div>
      </section>

      {/* Cores de Destaque */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Cores de Destaque</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary p-4 rounded-lg">
            <p className="text-white font-semibold">bg-primary</p>
            <p className="text-white text-sm opacity-80">Azul elegante</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-text font-semibold">bg-secondary</p>
            <p className="text-text-muted text-sm">Azul claro</p>
          </div>
          <div className="bg-accent p-4 rounded-lg">
            <p className="text-text font-semibold">bg-accent</p>
            <p className="text-text-muted text-sm">Lilás suave</p>
          </div>
        </div>
      </section>

      {/* Variações de Primary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Variações de Primary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary-dark p-4 rounded-lg">
            <p className="text-white font-semibold">bg-primary-dark</p>
            <p className="text-white text-sm opacity-80">Primary escuro</p>
          </div>
          <div className="bg-primary p-4 rounded-lg">
            <p className="text-white font-semibold">bg-primary</p>
            <p className="text-white text-sm opacity-80">Primary normal</p>
          </div>
          <div className="bg-primary-light p-4 rounded-lg">
            <p className="text-white font-semibold">bg-primary-light</p>
            <p className="text-white text-sm opacity-80">Primary claro</p>
          </div>
        </div>
      </section>

      {/* Textos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Textos</h2>
        <div className="bg-card border border-border p-6 rounded-lg space-y-2">
          <p className="text-text text-lg font-semibold">text-text - Texto Principal</p>
          <p className="text-text-muted">text-text-muted - Texto Secundário</p>
          <p className="text-primary">text-primary - Texto em Primary</p>
          <p className="text-secondary">text-secondary - Texto em Secondary</p>
          <p className="text-accent">text-accent - Texto em Accent</p>
        </div>
      </section>

      {/* Bordas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Bordas</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-text font-semibold">border-border</p>
            <p className="text-text-muted text-sm">Borda padrão</p>
          </div>
          <div className="bg-card border-2 border-primary p-4 rounded-lg">
            <p className="text-text font-semibold">border-primary</p>
            <p className="text-text-muted text-sm">Borda destaque</p>
          </div>
          <div className="bg-card border-2 border-accent p-4 rounded-lg">
            <p className="text-text font-semibold">border-accent</p>
            <p className="text-text-muted text-sm">Borda accent</p>
          </div>
        </div>
      </section>

      {/* Cards Exemplo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Exemplo de Card</h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-text mb-2">Título do Card</h3>
          <p className="text-text-muted mb-4">Este é um exemplo de card usando todas as cores dinâmicas do sistema.</p>
          <div className="flex space-x-2">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
              Botão Primary
            </button>
            <button className="bg-secondary text-text px-4 py-2 rounded-lg hover:opacity-90">
              Botão Secondary
            </button>
            <button className="bg-card border border-border text-text px-4 py-2 rounded-lg hover:bg-sidebar">
              Botão Ghost
            </button>
          </div>
        </div>
      </section>

      {/* Tabela Exemplo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text">Exemplo de Tabela</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-sidebar border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-text-muted font-semibold">Coluna 1</th>
                <th className="px-6 py-3 text-left text-text-muted font-semibold">Coluna 2</th>
                <th className="px-6 py-3 text-left text-text-muted font-semibold">Coluna 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-sidebar">
                <td className="px-6 py-4 text-text">Dados 1</td>
                <td className="px-6 py-4 text-text">Dados 2</td>
                <td className="px-6 py-4 text-text">Dados 3</td>
              </tr>
              <tr className="hover:bg-sidebar">
                <td className="px-6 py-4 text-text">Dados 1</td>
                <td className="px-6 py-4 text-text">Dados 2</td>
                <td className="px-6 py-4 text-text">Dados 3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Instruções */}
      <section className="bg-accent-light border border-accent rounded-xl p-6">
        <h2 className="text-xl font-bold text-text mb-4">🎨 Como usar as cores</h2>
        <div className="space-y-2 text-text">
          <p><strong>Fundos:</strong> bg-background, bg-card, bg-sidebar</p>
          <p><strong>Textos:</strong> text-text, text-text-muted</p>
          <p><strong>Bordas:</strong> border-border</p>
          <p><strong>Destaques:</strong> bg-primary, bg-secondary, bg-accent</p>
          <p><strong>Variações:</strong> bg-primary-light, bg-primary-dark, bg-accent-light</p>
        </div>
      </section>
    </div>
  );
};

export default TesteCores;
