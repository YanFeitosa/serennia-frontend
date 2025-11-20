// src/pages/ProdutoForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getCategories } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const productSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  price: z.number().min(0, 'Preço inválido'),
  stock: z.number().min(0, 'Estoque não pode ser negativo'),
});

type ProductSchema = z.infer<typeof productSchema>;

const ProdutoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const categories = await getCategories('product');
        if (!isMounted) return;
        setProductCategories(categories.map(c => c.name));
      } catch (err) {
        console.error('Failed to load product categories', err);
        if (isMounted) {
          setCategoriesError('Falha ao carregar categorias de produto.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const product = await getProductById(id);
        if (!isMounted) return;

        reset({
          name: product.name,
          category: product.category ?? '',
          price: product.price,
          stock: product.stock,
        });
      } catch (err) {
        console.error('Failed to load product', err);
        if (isMounted) {
          setLoadError('Falha ao carregar produto.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, reset]);

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    try {
      setSaveError(null);
      const payload = {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
      };

      if (id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate('/produtos');
    } catch (err) {
      console.error('Failed to save product', err);
      setSaveError('Falha ao salvar produto. Verifique os dados e tente novamente.');
    }
  };

  const isEditing = Boolean(id);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-text">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
        <p className="text-text-muted">
          {isEditing
            ? 'Atualize as informações do produto.'
            : 'Preencha os dados para cadastrar um novo produto.'}
        </p>
      </header>

      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}
      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card p-6 rounded-xl shadow-md space-y-4 border border-border"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">
            Nome
          </label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text">
            Categoria
          </label>
          <select
            id="category"
            {...register('category')}
            className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="" disabled>
              Selecione uma categoria de produto
            </option>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
          {categoriesError && (
            <p className="mt-1 text-sm text-red-600">{categoriesError}</p>
          )}
          {!categoriesError && !isLoadingCategories && productCategories.length === 0 && (
            <p className="mt-1 text-sm text-text-muted">
              Nenhuma categoria de produto cadastrada. Crie categorias em Configurações &gt; Geral.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text">
              Preço (R$)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min={0}
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-text">
              Estoque
            </label>
            <Input
              id="stock"
              type="number"
              min={0}
              {...register('stock', { valueAsNumber: true })}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/produtos')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isEditing ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProdutoForm;
