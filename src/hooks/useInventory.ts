import { useState, useEffect, useCallback } from 'react';
import { Product, InventoryMovement } from '../types';
import { getProducts, updateProductStock } from '../services/productService';
import { recordMovement, getAllMovements, getMovementHistory } from '../services/inventoryMovementService';
import { useAuth } from '../context/AuthContext';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useAuth();

  const loadData = useCallback(() => {
    setProducts(getProducts());
    setMovements(getAllMovements());
  }, []);

  useEffect(() => {
    loadData();
    // Recargar cuando se actualice el inventario (evento lanzado desde ventas)
    const handleInventoryUpdate = () => loadData();
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    return () => window.removeEventListener('inventory-updated', handleInventoryUpdate);
  }, [loadData]);

  const addMovement = useCallback((productId: string, type: 'entry' | 'exit' | 'adjustment', quantity: number, reason: string) => {
    if (!user) return null;
    const movement = recordMovement({
      productId,
      productName: products.find(p => p.id === productId)?.name || '',
      type,
      quantity,
      reason,
      userId: user.role + '-001',
      userName: user.name,
    });
    if (movement) {
      loadData();
    }
    return movement;
  }, [user, products, loadData]);

  const totalValueUSD = products.reduce((sum, p) => sum + (p.costUSD * p.stock), 0);

  const productMovements = useCallback((productId: string) => {
    return getMovementHistory(productId);
  }, []);

  return {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh: loadData,
  };
};