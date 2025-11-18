// src/data/products.ts
import type { Product } from '../types';

export let mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Shampoo Hidratante 300ml',
    category: 'Cabelo',
    price: 39.9,
    stock: 24,
  },
  {
    id: 'product-2',
    name: 'Condicionador Nutritivo 300ml',
    category: 'Cabelo',
    price: 42.5,
    stock: 18,
  },
  {
    id: 'product-3',
    name: 'Máscara Capilar Reparadora 250g',
    category: 'Cabelo',
    price: 79.9,
    stock: 12,
  },
  {
    id: 'product-4',
    name: 'Óleo Finalizador 60ml',
    category: 'Finalização',
    price: 55.0,
    stock: 20,
  },
  {
    id: 'product-5',
    name: 'Esmalte Hipoalergênico Nude',
    category: 'Unhas',
    price: 19.9,
    stock: 35,
  },
  {
    id: 'product-6',
    name: 'Creme Hidratante Corporal 200ml',
    category: 'Corpo',
    price: 49.9,
    stock: 15,
  },
];

export const addMockProduct = (product: Product) => {
  mockProducts = [...mockProducts, product];
};

export const updateMockProduct = (id: string, updates: Partial<Product>) => {
  mockProducts = mockProducts.map(product =>
    product.id === id ? { ...product, ...updates } : product
  );
};
