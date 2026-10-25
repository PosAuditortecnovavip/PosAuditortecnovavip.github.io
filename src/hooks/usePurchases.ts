import { useState, useCallback } from 'react';
import { Purchase } from '../types';
import { registerPurchase, getAllPurchases } from '../services/purchaseService';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { const data = await getAllPurchases(); setPurchases(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const addPurchase = useCallback(async (input: Parameters<typeof registerPurchase>[0]) => {
    const purchase = await registerPurchase(input);
    await refresh();
    return purchase;
  }, [refresh]);

  return { purchases, addPurchase, refresh, loading };
};