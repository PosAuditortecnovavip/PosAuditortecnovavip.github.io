import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { Sale } from '../types';
import { reduceStock } from './productService';

const COL = 'sales';

export const recordSale = async (sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale | null> => {
  // Descontar inventario
  for (const item of sale.items) {
    const result = await reduceStock(item.productId, item.quantity);
    if (!result) return null;
  }

  const docRef = await addDoc(collection(db, COL), {
    ...sale,
    createdAt: new Date().toISOString(),
  });

  return { ...sale, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getTodaySales = async (): Promise<Sale[]> => {
  const today = new Date().toISOString().split('T')[0];
  const q = query(collection(db, COL), where('createdAt', '>=', today), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sale));
};

export const getAllSales = async (): Promise<Sale[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sale));
};