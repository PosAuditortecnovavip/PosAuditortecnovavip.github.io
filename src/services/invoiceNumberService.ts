import { db } from '../firebase';
import { doc, setDoc, runTransaction } from 'firebase/firestore';

const COUNTER_DOC_ID = 'invoice_counter';
interface CounterData { current: number; month: string; }

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
      currentNum = data.month === monthKey ? data.current + 1 : 1;
    }
    transaction.set(counterRef, { current: currentNum, month: monthKey });
    return currentNum;
  });

  return `${monthKey}-${newNumber.toString().padStart(4, '0')}`;
};