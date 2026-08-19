<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { Product, InventoryMovement } from '../types';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  recordMovement,
  getAllMovements,
  getMovementHistory,
} from '../services/inventoryMovementService';
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
      setProducts(prods);
      setMovements(movs);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
    const handleInventoryUpdate = () => loadData();
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    return () => window.removeEventListener('inventory-updated', handleInventoryUpdate);
  }, [loadData]);

  const addNewProduct = useCallback(
    async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await addProduct(product);
        await loadData();
      } catch (error) {
        console.error('Error añadiendo producto:', error);
      }
    },
    [loadData]
  );

  const editProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      try {
        await updateProduct(id, data);
        await loadData();
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error editando producto:', error);
      }
    },
    [loadData]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        const success = await deleteProduct(id);
        if (success) {
          await loadData();
          if (selectedProduct?.id === id) setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    },
    [loadData, selectedProduct]
  );

  const addMovement = useCallback(
    async (
      productId: string,
      type: 'entry' | 'exit' | 'adjustment',
      quantity: number,
      reason: string
    ) => {
      if (!user) return null;
      try {
        const movement = await recordMovement({
          productId,
          productName: products.find((p) => p.id === productId)?.name || '',
          type,
          quantity,
          reason,
          userId: user.uid,
          userName: user.name,
        });
        if (movement) {
          await loadData();
        }
        return movement;
      } catch (error) {
        console.error('Error registrando movimiento:', error);
        return null;
      }
    },
    [user, products, loadData]
  );

  const totalValueUSD = products.reduce(
    (sum, p) => sum + p.costUSD * p.stock,
    0
  );

  const productMovements = useCallback(async (productId: string) => {
    return await getMovementHistory(productId);
  }, []);

  return {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addNewProduct,
    editProduct,
    removeProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh: loadData,
    loading,
  };
=======
import { useState, useEffect, useCallback } from 'react';
import { Product, InventoryMovement } from '../types';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  recordMovement,
  getAllMovements,
  getMovementHistory,
} from '../services/inventoryMovementService';
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
      setProducts(prods);
      setMovements(movs);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
    const handleInventoryUpdate = () => loadData();
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    return () => window.removeEventListener('inventory-updated', handleInventoryUpdate);
  }, [loadData]);

  const addNewProduct = useCallback(
    async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await addProduct(product);
        await loadData();
      } catch (error) {
        console.error('Error añadiendo producto:', error);
      }
    },
    [loadData]
  );

  const editProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      try {
        await updateProduct(id, data);
        await loadData();
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error editando producto:', error);
      }
    },
    [loadData]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        const success = await deleteProduct(id);
        if (success) {
          await loadData();
          if (selectedProduct?.id === id) setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    },
    [loadData, selectedProduct]
  );

  const addMovement = useCallback(
    async (
      productId: string,
      type: 'entry' | 'exit' | 'adjustment',
      quantity: number,
      reason: string
    ) => {
      if (!user) return null;
      try {
        const movement = await recordMovement({
          productId,
          productName: products.find((p) => p.id === productId)?.name || '',
          type,
          quantity,
          reason,
          userId: user.uid,
          userName: user.name,
        });
        if (movement) {
          await loadData();
        }
        return movement;
      } catch (error) {
        console.error('Error registrando movimiento:', error);
        return null;
      }
    },
    [user, products, loadData]
  );

  const totalValueUSD = products.reduce(
    (sum, p) => sum + p.costUSD * p.stock,
    0
  );

  const productMovements = useCallback(async (productId: string) => {
    return await getMovementHistory(productId);
  }, []);

  return {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addNewProduct,
    editProduct,
    removeProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh: loadData,
    loading,
  };
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};