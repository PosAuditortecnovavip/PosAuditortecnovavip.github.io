import { Product } from '../../types';

export interface ProductLogEntry {
  id: string;
  action: 'created' | 'deleted';
  productId: string;
  productCode: string;
  productName: string;
  userId: string;
  userName: string;
  timestamp: string;
}

const STORAGE_KEY = 'audity_product_logs';

const getLogs = (): ProductLogEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLogs = (logs: ProductLogEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const addProductLog = (
  action: 'created' | 'deleted',
  product: Product,
  userId: string,
  userName: string
): ProductLogEntry => {
  const logs = getLogs();
  const entry: ProductLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    action,
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  saveLogs(logs);
  return entry;
};

export const getAllProductLogs = (): ProductLogEntry[] => {
  return getLogs().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};