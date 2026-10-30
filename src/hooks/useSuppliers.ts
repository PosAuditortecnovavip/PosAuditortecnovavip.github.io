import { useState, useEffect, useCallback } from 'react';
import { Supplier } from '../types';
import { getAllSuppliers, addSupplier } from '../services/supplierService';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const add = useCallback(async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier = await addSupplier(supplier);
    await refresh();
    return newSupplier;
  }, [refresh]);

  return { suppliers, add, refresh, loading };
};
