import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { InventoryMovement } from '../types';
import { updateProductStock } from './productService';

const COL = 'inventory_movements';

export const recordMovement = async (movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Promise<InventoryMovement | null> => {
  const product = await updateProductStock(
    movement.productId,
    movement.type === 'entry' || movement.type === 'adjustment' ? movement.quantity : -movement.quantity
  );
  if (!product) return null;

  const docRef = await addDoc(collection(db, COL), {
    ...movement,
    createdAt: new Date().toISOString(),
  });
  return { ...movement, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getAllMovements = async (): Promise<InventoryMovement[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryMovement));
};

export const getMovementHistory = async (productId?: string): Promise<InventoryMovement[]> => {
  if (!productId) return [];
  const q = query(collection(db, COL), where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryMovement));
};