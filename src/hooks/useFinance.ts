import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { addTransactionLocal, getAllTransactionsLocal } from '../services/local/financeServiceLocal';
import { getAllSalesLocal } from '../services/local/salesServiceLocal';
import { useAuth } from '../context/AuthContext';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(getAllTransactionsLocal());
  const { user } = useAuth();

  const refresh = useCallback(() => {
    setTransactions(getAllTransactionsLocal());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addExpense = useCallback(async (description: string, amountUSD: number, category: string) => {
    if (!user) return null;
    addTransactionLocal({
      description,
      amountUSD,
      type: 'expense',
      category,
      userId: user.uid,
      userName: user.name,
    });
    refresh();
  }, [user, refresh]);

  const [balance, setBalance] = useState(0);
  const [totalSalesUSD, setTotalSalesUSD] = useState(0);

  useEffect(() => {
    const sales = getAllSalesLocal();
    const total = sales.reduce((s, sale) => s + sale.totalUSD, 0);
    setTotalSalesUSD(total);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
    setBalance(total - expenses);
  }, [transactions]);

  return { transactions, addExpense, balance, refresh, loading: false, totalSalesUSD };
};