import { Sale, SaleIVA } from '../types';
import { reduceStock } from './productService';

const STORAGE_KEY = 'audity_sales';

const getSales = (): Sale[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveSales = (sales: Sale[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
};

export const recordSale = (sale: Omit<Sale, 'id' | 'createdAt'>): Sale | null => {
  for (const item of sale.items) {
    const result = reduceStock(item.productId, item.quantity);
    if (!result) return null;
  }

  const newSale: Sale = {
    ...sale,
    id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const sales = getSales();
  sales.push(newSale);
  saveSales(sales);
  return newSale;
};

export const getTodaySales = (): Sale[] => {
  const today = new Date().toISOString().split('T')[0];
  return getSales().filter(s => s.createdAt.startsWith(today));
};

export const getAllSales = (): Sale[] => {
  return getSales();
};