// src/pages/Produtos.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { isAdminLike } from '../../lib/utils';
import type { Product } from '../../types';
import { getProducts, deleteProduct, getSalonSettings } from '../../lib/api';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stockControlEnabled, setStockControlEnabled] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canEdit = isAdminLike(user) || user?.tenantRole === 'manager';
  const canDelete = user?.role ? can(user.role, 'podeDeletarProduto') : false;

  const handleDelete = async (product: Product) => {
    if (!canDelete) return;
    
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      return;
    }

    try {
      setDeletingId(product.id);
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Failed to delete product', err);
      setError('Falha ao excluir produto.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [productsData, settingsData] = await Promise.all([
          getProducts(),
          getSalonSettings(),
        ]);
        if (!isMounted) return;
        setProducts(productsData);
        setStockControlEnabled(settingsData.stockControlEnabled ?? true);
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

    loadData();

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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl shadow-elevated border border-border relative overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-secondary opacity-80" />
        
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Produtos</h1>
          <p className="text-text-muted text-sm md:text-base mt-1">Gerencie os produtos de venda do salão</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('/app/produtos/novo')} className="mt-2 sm:mt-0">
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[450px]">
            <thead>
              <tr className="bg-sidebar/50 border-b border-border">
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Produto</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-semibold text-primary uppercase tracking-wider">Estoque</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Preço</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Ações</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const showStock = stockControlEnabled && product.trackStock !== false;
                return (
                <tr key={product.id} className="hover:bg-sidebar/50 transition-all duration-200">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="font-medium text-text text-sm">{product.name}</span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted hidden sm:table-cell">
                    {product.category ?? '-'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-text-muted text-center">
                    {showStock ? product.stock : 'N/A'}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-semibold text-text">
                    {product.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/app/produtos/${product.id}`)}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Editar</span>
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
