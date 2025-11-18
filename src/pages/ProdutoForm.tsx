// src/pages/ProdutoForm.tsx
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../types';
import { mockProducts, addMockProduct, updateMockProduct } from '../data/products';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const PRODUCT_CATEGORIES = ['Cabelo', 'Finalização', 'Unhas', 'Corpo'];

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
  const editingProduct = id ? mockProducts.find(p => p.id === id) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct
      ? {
          name: editingProduct.name,
          category: editingProduct.category ?? PRODUCT_CATEGORIES[0],
          price: editingProduct.price,
          stock: editingProduct.stock,
        }
      : {
          name: '',
          category: PRODUCT_CATEGORIES[0],
          price: 0,
          stock: 0,
        },
  });

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        category: editingProduct.category ?? PRODUCT_CATEGORIES[0],
        price: editingProduct.price,
        stock: editingProduct.stock,
      });
    }
  }, [editingProduct, reset]);

  const onSubmit: SubmitHandler<ProductSchema> = (data) => {
    if (editingProduct) {
      updateMockProduct(editingProduct.id, {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
      });
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
      };
      addMockProduct(newProduct);
    }

    navigate('/produtos');
  };

  const isEditing = Boolean(editingProduct);

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
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
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
          <Button type="submit">{isEditing ? 'Salvar alterações' : 'Salvar'}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProdutoForm;
