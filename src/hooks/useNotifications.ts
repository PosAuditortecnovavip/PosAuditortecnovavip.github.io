<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { Product } from '../types';

export const useNotifications = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const fetchLowStock = async () => {
    const products = await getProducts();
    setLowStockProducts(products.filter(p => p.stock <= p.minStock));
  };

  useEffect(() => {
    fetchLowStock();
    window.addEventListener('inventory-updated', fetchLowStock);
    return () => window.removeEventListener('inventory-updated', fetchLowStock);
  }, []);

  return lowStockProducts;
=======
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { Product } from '../types';

export const useNotifications = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const fetchLowStock = async () => {
    const products = await getProducts();
    setLowStockProducts(products.filter(p => p.stock <= p.minStock));
  };

  useEffect(() => {
    fetchLowStock();
    window.addEventListener('inventory-updated', fetchLowStock);
    return () => window.removeEventListener('inventory-updated', fetchLowStock);
  }, []);

  return lowStockProducts;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};