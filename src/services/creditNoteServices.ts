<<<<<<< HEAD
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface CreditNote {
  id?: string;
  saleId: string;
  reason: string;
  items: { productId: string; quantity: number; priceUSD: number }[];
  totalRefundUSD: number;
  totalRefundBS: number;
  createdAt: string;
}

const COL = 'credit_notes';

export const createCreditNote = async (
  saleId: string,
  items: { productId: string; quantity: number; priceUSD: number }[],
  reason: string,
  totalRefundUSD: number,
  totalRefundBS: number
): Promise<CreditNote> => {
  const note = {
    saleId,
    reason,
    items,
    totalRefundUSD,
    totalRefundBS,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, COL), note);
  return { ...note, id: docRef.id };
=======
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface CreditNote {
  id?: string;
  saleId: string;
  reason: string;
  items: { productId: string; quantity: number; priceUSD: number }[];
  totalRefundUSD: number;
  totalRefundBS: number;
  createdAt: string;
}

const COL = 'credit_notes';

export const createCreditNote = async (
  saleId: string,
  items: { productId: string; quantity: number; priceUSD: number }[],
  reason: string,
  totalRefundUSD: number,
  totalRefundBS: number
): Promise<CreditNote> => {
  const note = {
    saleId,
    reason,
    items,
    totalRefundUSD,
    totalRefundBS,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, COL), note);
  return { ...note, id: docRef.id };
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};