import { useState, useEffect, useCallback } from 'react';
import { AuditRecord, Product } from '../types';
import { getProducts } from '../services/productService';
import { recordAudit, getAuditHistory } from '../services/auditService';
import { recordMovement } from '../services/inventoryMovementService';
import { useAuth } from '../context/AuthContext';

export const useAudit = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [prods, audits] = await Promise.all([
        getProducts(),
        getAuditHistory(),
      ]);
      setProducts(prods);
      setHistory(audits);
    } catch (error) {
      console.error('Error cargando auditoría:', error);
    }
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const performAudit = useCallback(async (
    productId: string,
    physicalStock: number,
    reason: string,
    applyAdjustment: boolean
  ) => {
    if (!user) return null;

    const product = products.find(p => p.id === productId);
    if (!product) return null;

    const difference = physicalStock - product.stock;

    try {
      const audit = await recordAudit({
        productId,
        productName: product.name,
        systemStock: product.stock,
        physicalStock,
        difference,
        reason,
        auditorId: user.uid,
        auditorName: user.name,
      });

      if (applyAdjustment && difference !== 0) {
        await recordMovement({
          productId,
          productName: product.name,
          type: 'adjustment',
          quantity: Math.abs(difference),
          reason: `Auditoría: ${reason || 'Ajuste por diferencia'}`,
          userId: user.uid,
          userName: user.name,
        });
        window.dispatchEvent(new Event('inventory-updated'));
      }

      // Refrescar historial
      const newHistory = await getAuditHistory();
      setHistory(newHistory);
      return audit;
    } catch (error) {
      console.error('Error en auditoría:', error);
      return null;
    }
  }, [user, products]);

  return { products, history, performAudit, refreshHistory: loadData, loading };
};