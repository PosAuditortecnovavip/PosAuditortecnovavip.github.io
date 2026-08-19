import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Product } from '../types';

const COL = 'products';

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, COL));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : undefined;
};

export const updateProductStock = async (id: string, newStock: number): Promise<Product | null> => {
  const docRef = doc(db, COL, id);
  await updateDoc(docRef, { stock: newStock, updatedAt: new Date().toISOString() });
  const updated = await getProductById(id);
  return updated || null;
};

export const reduceStock = async (id: string, quantity: number): Promise<Product | null> => {
  const product = await getProductById(id);
  if (!product || product.stock < quantity) return null;
  return await updateProductStock(id, product.stock - quantity);
};

export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> => {
  const docRef = await addDoc(collection(db, COL), {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return {
    ...product,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const updateProduct = async (
  id: string,
  product: Partial<Product>
): Promise<Product | null> => {
  const docRef = doc(db, COL, id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: new Date().toISOString(),
  });
  const updated = await getProductById(id);
  return updated || null;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COL, id));
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return false;
  }
};