import { useState, useEffect, useCallback } from 'react';
import { Product, InventoryMovement } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { recordMovement, getAllMovements, getMovementHistory } from '../services/inventoryMovementService';
import { addProductLog } from '../services/productLogService';
import { useAuth } from '../context/AuthContext';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [prods, movs] = await Promise.all([getProducts(), getAllMovements()]);
      setProducts(prods); setMovements(movs);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
    const h = () => loadData();
    window.addEventListener('inventory-updated', h);
    return () => window.removeEventListener('inventory-updated', h);
  }, [loadData]);

  const addNewProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = await addProduct(product);
    if (user) await addProductLog('created', newProduct, user.uid, user.name);
    await loadData();
  }, [loadData, user]);

  const editProduct = useCallback(async (id: string, data: Partial<Product>) => {
    await updateProduct(id, data); await loadData(); setSelectedProduct(null);
  }, [loadData]);

  const removeProduct = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product && await deleteProduct(id)) {
      if (user) await addProductLog('deleted', product, user.uid, user.name);
      await loadData();
      if (selectedProduct?.id === id) setSelectedProduct(null);
    }
  }, [loadData, products, selectedProduct, user]);

  const addMovement = useCallback(async (productId: string, type: 'entry' | 'exit' | 'adjustment', quantity: number, reason: string, origin: 'sale' | 'audit' | 'purchase' | 'adjustment' = 'adjustment') => {
    if (!user) return null;
    await recordMovement({
      productId, productName: products.find(p => p.id === productId)?.name || '',
      type, origin, quantity, reason, userId: user.uid, userName: user.name,
    });
    await loadData();
  }, [user, products, loadData]);

  const totalValueUSD = products.reduce((sum, p) => sum + p.costUSD * p.stock, 0);
  const productMovements = useCallback(async (productId: string) => await getMovementHistory(productId), []);

  return {
    products, movements, selectedProduct, setSelectedProduct,
    addNewProduct, editProduct, removeProduct, addMovement,
    totalValueUSD, productMovements, refresh: loadData, loading,
  };
};