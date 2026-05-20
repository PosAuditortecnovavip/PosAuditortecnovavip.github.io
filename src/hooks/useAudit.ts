import { useState, useCallback } from 'react';
import { AuditRecord, Product } from '../types';
import { getProducts } from '../services/productService';
import { recordAudit, getAuditHistory } from '../services/auditService';
import { recordMovement } from '../services/inventoryMovementService';
import { useAuth } from '../context/AuthContext';

export const useAudit = () => {
  const [products] = useState<Product[]>(getProducts);
  const [history, setHistory] = useState<AuditRecord[]>(getAuditHistory);
  const { user } = useAuth();

  const performAudit = useCallback((
    productId: string,
    physicalStock: number,
    reason: string,
    applyAdjustment: boolean
  ) => {
    if (!user) return null;

    const product = products.find(p => p.id === productId);
    if (!product) return null;

    const difference = physicalStock - product.stock;

    // Registrar auditoría
    const audit = recordAudit({
      productId,
      productName: product.name,
      systemStock: product.stock,
      physicalStock,
      difference,
      reason,
      auditorId: user.role + '-001',
      auditorName: user.name,
    });

    // Aplicar ajuste si se solicita y hay diferencia
    if (applyAdjustment && difference !== 0) {
      recordMovement({
        productId,
        productName: product.name,
        type: 'adjustment',
        quantity: Math.abs(difference),
        reason: `Auditoría: ${reason || 'Ajuste por diferencia'}`,
        userId: user.role + '-001',
        userName: user.name,
      });
      // Notificar actualización de inventario
      window.dispatchEvent(new Event('inventory-updated'));
    }

    // Refrescar historial
    setHistory(getAuditHistory());
    return audit;
  }, [user, products]);

  return { products, history, performAudit, refreshHistory: () => setHistory(getAuditHistory()) };
};