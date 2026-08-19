import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { addTransaction, getAllTransactions } from '../services/financeService';
import { getAllSales } from '../services/salesService';
import { useAuth } from '../context/AuthContext';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    const data = await getAllTransactions();
    setTransactions(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addExpense = useCallback(async (description: string, amountUSD: number, category: string) => {
    if (!user) return null;
    await addTransaction({
      description,
      amountUSD,
      type: 'expense',
      category,
      userId: user.role + '-001',
      userName: user.name,
    });
    await refresh();
  }, [user, refresh]);

  const [balance, setBalance] = useState(0);
  const [totalSalesUSD, setTotalSalesUSD] = useState(0);

  useEffect(() => {
    const calc = async () => {
      const sales = await getAllSales();
      const total = sales.reduce((s, sale) => s + sale.totalUSD, 0);
      setTotalSalesUSD(total);
      const expenses = transactions.reduce((s, t) => s + t.amountUSD, 0);
      setBalance(total - expenses);
    };
    calc();
  }, [transactions]);

  return { transactions, addExpense, balance, refresh, loading, totalSalesUSD };
};