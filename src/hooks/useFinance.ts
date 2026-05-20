import { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { addTransaction, getAllTransactions } from '../services/financeService';
import { getAllSales } from '../services/salesService';
import { useAuth } from '../context/AuthContext';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(getAllTransactions);
  const { user } = useAuth();

  const refresh = useCallback(() => {
    setTransactions(getAllTransactions());
  }, []);

  // Solo permite registrar egresos
  const addExpense = useCallback((description: string, amountUSD: number, category: string) => {
    if (!user) return null;
    const transaction = addTransaction({
      description,
      amountUSD,
      type: 'expense',  // siempre egreso
      category,
      userId: user.role + '-001',
      userName: user.name,
    });
    refresh();
    return transaction;
  }, [user, refresh]);

  // Los ingresos se obtienen de las ventas
  const totalSalesUSD = getAllSales().reduce((sum, sale) => sum + sale.totalUSD, 0);
  const totalExpensesUSD = transactions.reduce((sum, t) => sum + t.amountUSD, 0);
  const balance = totalSalesUSD - totalExpensesUSD;

  return { transactions, addExpense, balance, refresh, totalSalesUSD, totalExpensesUSD };
};