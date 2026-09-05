import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../types';
import {
  getAllCustomersLocal,
  addCustomerLocal,
  updateCustomerLocal,
  deleteCustomerLocal,
} from '../services/local/customerServiceLocal';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(getAllCustomersLocal());

  const refresh = useCallback(() => {
    setCustomers(getAllCustomersLocal());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust = addCustomerLocal(customer);
    refresh();
    return newCust;
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Customer>) => {
    const updated = updateCustomerLocal(id, data);
    if (updated) refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    const success = deleteCustomerLocal(id);
    if (success) refresh();
    return success;
  }, [refresh]);

  return { customers, add, update, remove, refresh, loading: false };
};