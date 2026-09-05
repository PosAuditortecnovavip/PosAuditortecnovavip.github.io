import { Sale } from '../../types';
import { reduceStockLocal } from './productServiceLocal';

const STORAGE_KEY = 'audity_sales';

const getSales = (): Sale[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveSales = (sales: Sale[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
};

export const recordSaleLocal = (sale: Omit<Sale, 'id' | 'createdAt'>): Sale | null => {
  for (const item of sale.items) {
    const result = reduceStockLocal(item.productId, item.quantity);
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

export const getTodaySalesLocal = (): Sale[] => {
  const today = new Date().toISOString().split('T')[0];
  return getSales().filter(s => s.createdAt.startsWith(today));
};

export const getAllSalesLocal = (): Sale[] => {
  return getSales().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};