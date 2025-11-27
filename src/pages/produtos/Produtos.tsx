// src/pages/Produtos.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminLike } from '../../lib/utils';
import type { Product } from '../../types';
import { getProducts } from '../../lib/api';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = isAdminLike(user) || user?.tenantRole === 'manager';

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        if (!isMounted) return;
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
        if (isMounted) {
          setError('Falha ao carregar produtos.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.category?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <div className="space-y-4">
      {/* Enhanced header with card styling */}
      <header className="flex items-center justify-between p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-primary">Produtos</h1>
          <p className="text-text-muted mt-1">Gerencie os produtos de venda do salão</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('/app/produtos/novo')} className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        )}
      </header>

      {/* Search bar */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-background text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/30"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {(error || isLoading) && (
        <div className="text-sm text-text-muted p-4 bg-card rounded-xl border border-border">
          {error ? <span className="text-red-500">{error}</span> : 'Carregando produtos...'}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-sidebar/50 border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Produto</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Estoque</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Preço</th>
              {canEdit && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Ações</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-sidebar/50 transition-all duration-200">
                <td className="px-6 py-4">
                  <span className="font-medium text-text">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {product.category ?? '-'}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{product.stock}</td>
                <td className="px-6 py-4 text-sm font-semibold text-text">
                  {product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                {canEdit && (
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/app/produtos/${product.id}`)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Produtos;
