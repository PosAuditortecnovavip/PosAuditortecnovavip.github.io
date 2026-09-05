import { Transaction } from '../../types';

const STORAGE_KEY = 'audity_finance_transactions';

const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const addTransactionLocal = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: `fin-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const transactions = getTransactions();
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const getAllTransactionsLocal = (): Transaction[] => {
  return getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getBalanceLocal = (): number => {
  const transactions = getTransactions();
  const totalSales = (window as any).__AUDITY_TOTAL_SALES__ || 0;
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
  return totalSales - expenses;
};