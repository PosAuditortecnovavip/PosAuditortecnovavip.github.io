import { useState, useEffect } from 'react';
import { getProductsLocal } from '../services/local/productServiceLocal';
import { Product } from '../types';

export const useNotifications = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const fetchLowStock = () => {
    const products = getProductsLocal();
    setLowStockProducts(products.filter(p => p.stock <= p.minStock));
  };

  useEffect(() => {
    fetchLowStock();
    window.addEventListener('inventory-updated', fetchLowStock);
    return () => window.removeEventListener('inventory-updated', fetchLowStock);
  }, []);

  return lowStockProducts;
};