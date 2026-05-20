import { Transaction } from '../types';

const STORAGE_KEY = 'audity_finance_transactions';

const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
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

export const getAllTransactions = (): Transaction[] => {
  return getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getBalance = (): number => {
  return getTransactions().reduce((acc, t) => acc + (t.type === 'income' ? t.amountUSD : -t.amountUSD), 0);
};