import { Product } from '../types';
import { defaultProducts } from '../data/products';

const STORAGE_KEY = 'audity_products';

const initializeProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Si hay corrupción, reinicia
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const getProducts = (): Product[] => {
  return initializeProducts();
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(p => p.id === id);
};

export const updateProductStock = (id: string, newStock: number): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index].stock = newStock;
  products[index].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return products[index];
};

export const reduceStock = (id: string, quantity: number): Product | null => {
  const product = getProductById(id);
  if (!product || product.stock < quantity) return null;
  return updateProductStock(id, product.stock - quantity);
};