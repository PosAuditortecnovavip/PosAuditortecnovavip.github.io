import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../types';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const add = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCust = await addCustomer(customer);
      await refresh();
      return newCust;
    } catch (error) {
      console.error('Error añadiendo cliente:', error);
      return null;
    }
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Customer>) => {
    try {
      const updated = await updateCustomer(id, data);
      if (updated) await refresh();
      return updated;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      return null;
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    try {
      const success = await deleteCustomer(id);
      if (success) await refresh();
      return success;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      return false;
    }
  }, [refresh]);

  return { customers, add, update, remove, refresh, loading };
};