<<<<<<< HEAD
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAllSales } from './salesService';
import { getAllTransactions } from './financeService';

const COL = 'cash_closings';

export const closeCashRegister = async (userId: string, userName: string) => {
  const today = new Date().toISOString().split('T')[0];
  const sales = await getAllSales();
  const transactions = await getAllTransactions();
  const todaySales = sales.filter(s => s.createdAt.startsWith(today));
  const todayExpenses = transactions.filter(t => t.createdAt.startsWith(today) && t.type === 'expense');

  const totalSalesUSD = todaySales.reduce((s, sale) => s + sale.totalUSD, 0);
  const totalExpensesUSD = todayExpenses.reduce((s, t) => s + t.amountUSD, 0);
  const balanceUSD = totalSalesUSD - totalExpensesUSD;

  const closing = {
    date: today,
    userId,
    userName,
    totalSalesUSD,
    totalExpensesUSD,
    balanceUSD,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, COL), closing);
  return { ...closing, id: docRef.id };
=======
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAllSales } from './salesService';
import { getAllTransactions } from './financeService';

const COL = 'cash_closings';

export const closeCashRegister = async (userId: string, userName: string) => {
  const today = new Date().toISOString().split('T')[0];
  const sales = await getAllSales();
  const transactions = await getAllTransactions();
  const todaySales = sales.filter(s => s.createdAt.startsWith(today));
  const todayExpenses = transactions.filter(t => t.createdAt.startsWith(today) && t.type === 'expense');

  const totalSalesUSD = todaySales.reduce((s, sale) => s + sale.totalUSD, 0);
  const totalExpensesUSD = todayExpenses.reduce((s, t) => s + t.amountUSD, 0);
  const balanceUSD = totalSalesUSD - totalExpensesUSD;

  const closing = {
    date: today,
    userId,
    userName,
    totalSalesUSD,
    totalExpensesUSD,
    balanceUSD,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, COL), closing);
  return { ...closing, id: docRef.id };
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};