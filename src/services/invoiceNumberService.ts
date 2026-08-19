<<<<<<< HEAD
import { db } from '../firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

const COUNTER_DOC_ID = 'invoice_counter';

interface CounterData {
  current: number;
  month: string; // formato "MMAA"
}

const getMonthKey = (): string => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  return `${month}${year}`;
};

export const getNextInvoiceNumber = async (): Promise<string> => {
  const counterRef = doc(db, 'config', COUNTER_DOC_ID);
  const monthKey = getMonthKey();

  const newNumber = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    let currentNum = 1;

    if (counterSnap.exists()) {
      const data = counterSnap.data() as CounterData;
      if (data.month === monthKey) {
        currentNum = data.current + 1;
      } else {
        currentNum = 1; // Reiniciar si cambió el mes
      }
    }

    transaction.set(counterRef, { current: currentNum, month: monthKey });
    return currentNum;
  });

  const paddedNumber = newNumber.toString().padStart(4, '0');
  return `${monthKey}-${paddedNumber}`;
=======
import { db } from '../firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

const COUNTER_DOC_ID = 'invoice_counter';

interface CounterData {
  current: number;
  month: string; // formato "MMAA"
}

const getMonthKey = (): string => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  return `${month}${year}`;
};

export const getNextInvoiceNumber = async (): Promise<string> => {
  const counterRef = doc(db, 'config', COUNTER_DOC_ID);
  const monthKey = getMonthKey();

  const newNumber = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    let currentNum = 1;

    if (counterSnap.exists()) {
      const data = counterSnap.data() as CounterData;
      if (data.month === monthKey) {
        currentNum = data.current + 1;
      } else {
        currentNum = 1; // Reiniciar si cambió el mes
      }
    }

    transaction.set(counterRef, { current: currentNum, month: monthKey });
    return currentNum;
  });

  const paddedNumber = newNumber.toString().padStart(4, '0');
  return `${monthKey}-${paddedNumber}`;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};