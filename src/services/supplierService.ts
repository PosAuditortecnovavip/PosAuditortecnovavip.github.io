import { db } from '../firebase';
import { collection, getDocs, addDoc, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { Supplier } from '../types';

const COL = 'suppliers';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const q = query(collection(db, COL), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Supplier));
};

export const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> => {
  const existing = await getSupplierByName(supplier.name);
  if (existing) return existing;

  const docRef = await addDoc(collection(db, COL), {
    ...supplier,
    createdAt: new Date().toISOString(),
  });
  return { ...supplier, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getSupplierByName = async (name: string): Promise<Supplier | null> => {
  const q = query(collection(db, COL), where('name', '==', name));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Supplier;
};

export const getSupplierById = async (id: string): Promise<Supplier | undefined> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Supplier) : undefined;
};
