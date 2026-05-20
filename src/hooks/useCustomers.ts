import { useState, useCallback } from 'react';
import { Customer } from '../types';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(getAllCustomers);

  const refresh = useCallback(() => {
    setCustomers(getAllCustomers());
  }, []);

  const add = useCallback((customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust = addCustomer(customer);
    refresh();
    return newCust;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Customer>) => {
    const updated = updateCustomer(id, data);
    if (updated) refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = deleteCustomer(id);
    if (success) refresh();
    return success;
  }, [refresh]);

  return { customers, add, update, remove, refresh };
};