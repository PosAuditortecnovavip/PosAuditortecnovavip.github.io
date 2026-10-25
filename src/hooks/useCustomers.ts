import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../types';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try { const data = await getAllCustomers(); setCustomers(data); }
    catch (e) { console.error(e); }
  }, []);

  useEffect(() => { refresh().finally(() => setLoading(false)); }, [refresh]);

  const add = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust = await addCustomer(customer); await refresh(); return newCust;
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Customer>) => {
    const updated = await updateCustomer(id, data); if (updated) await refresh(); return updated;
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    const success = await deleteCustomer(id); if (success) await refresh(); return success;
  }, [refresh]);

  return { customers, add, update, remove, refresh, loading };
};