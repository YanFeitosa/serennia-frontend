// src/data/products.ts
import type { Product } from '../types';

export let mockProducts: Product[] = [
  {
    id: 'product-1',
    salonId: 'salon-1',
    name: 'Shampoo hidratante',
    category: 'Cabelo',
    description: 'Shampoo para hidratação profunda.',
    price: 60,
    costPrice: 30,
    stock: 20,
    isActive: true,
  },
  {
    id: 'product-2',
    salonId: 'salon-1',
    name: 'Condicionador nutritivo',
    category: 'Cabelo',
    description: 'Condicionador com alto poder nutritivo.',
    price: 70,
    costPrice: 35,
    stock: 18,
    isActive: true,
  },
  {
    id: 'product-3',
    salonId: 'salon-1',
    name: 'Óleo reparador',
    category: 'Finalização',
    description: 'Óleo para pontas duplas.',
    price: 90,
    costPrice: 45,
    stock: 12,
    isActive: true,
  },
  {
    id: 'product-4',
    salonId: 'salon-1',
    name: 'Esmalte vermelho clássico',
    category: 'Unhas',
    description: 'Esmalte de longa duração.',
    price: 25,
    costPrice: 10,
    stock: 40,
    isActive: true,
  },
  {
    id: 'product-5',
    salonId: 'salon-1',
    name: 'Creme para mãos',
    category: 'Corpo',
    description: 'Creme hidratante para mãos.',
    price: 35,
    costPrice: 15,
    stock: 30,
    isActive: true,
  },
  {
    id: 'product-6',
    salonId: 'salon-1',
    name: 'Máscara capilar nutritiva',
    category: 'Cabelo',
    description: 'Máscara para nutrição intensa dos fios.',
    price: 95,
    costPrice: 50,
    stock: 10,
    isActive: true,
  },
];

export const addMockProduct = (product: Product) => {
  mockProducts = [...mockProducts, product];
};

export const updateMockProduct = (id: string, updates: Partial<Product>) => {
  mockProducts = mockProducts.map(product =>
    product.id === id ? { ...product, ...updates } : product,
  );
};
