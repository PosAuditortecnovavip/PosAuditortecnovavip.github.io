import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { Product } from '../types';

export interface ProductLogEntry {
  id: string;
  action: 'created' | 'deleted';
  productId: string;
  productCode: string;
  productName: string;
  userId: string;
  userName: string;
  timestamp: string;
}

const COL = 'product_logs';

export const addProductLog = async (
  action: 'created' | 'deleted',
  product: Product,
  userId: string,
  userName: string
): Promise<ProductLogEntry> => {
  const entry: ProductLogEntry = {
    id: '',
    action,
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COL), entry);
  return { ...entry, id: docRef.id };
};

export const getAllProductLogs = async (): Promise<ProductLogEntry[]> => {
  const q = query(collection(db, COL), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as ProductLogEntry));
};