import { Product } from '../../types';

const STORAGE_KEY = 'audity_products';

const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProductsLocal = (): Product[] => {
  return getProducts();
};

export const getProductByIdLocal = (id: string): Product | undefined => {
  return getProducts().find(p => p.id === id);
};

export const addProductLocal = (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProductLocal = (
  id: string,
  data: Partial<Product>
): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveProducts(products);
  return products[index];
};

export const updateProductStockLocal = (
  id: string,
  newStock: number
): Product | null => {
  return updateProductLocal(id, { stock: newStock });
};

export const reduceStockLocal = (
  id: string,
  quantity: number
): Product | null => {
  const product = getProductByIdLocal(id);
  if (!product || product.stock < quantity) return null;
  return updateProductStockLocal(id, product.stock - quantity);
};

export const deleteProductLocal = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};