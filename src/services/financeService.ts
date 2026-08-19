<<<<<<< HEAD
import { db } from '../firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { Transaction } from '../types';

const COL = 'transactions';

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
  const docRef = await addDoc(collection(db, COL), {
    ...transaction,
    createdAt: new Date().toISOString(),
  });
  return { ...transaction, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
};

export const getBalance = async (): Promise<number> => {
  const transactions = await getAllTransactions();
  const sales = await (await import('./salesService')).getAllSales();
  const totalSales = sales.reduce((s, sale) => s + sale.totalUSD, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
  return totalSales - expenses;
=======
import { db } from '../firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { Transaction } from '../types';

const COL = 'transactions';

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
  const docRef = await addDoc(collection(db, COL), {
    ...transaction,
    createdAt: new Date().toISOString(),
  });
  return { ...transaction, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
};

export const getBalance = async (): Promise<number> => {
  const transactions = await getAllTransactions();
  const sales = await (await import('./salesService')).getAllSales();
  const totalSales = sales.reduce((s, sale) => s + sale.totalUSD, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
  return totalSales - expenses;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};