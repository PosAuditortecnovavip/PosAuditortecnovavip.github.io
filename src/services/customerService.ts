<<<<<<< HEAD
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Customer } from '../types';

const COL = 'customers';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(collection(db, COL));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Customer));
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  const docRef = await addDoc(collection(db, COL), {
    ...customer,
    createdAt: new Date().toISOString(),
  });
  return { ...customer, id: docRef.id, createdAt: new Date().toISOString() };
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
  const docRef = doc(db, COL, id);
  await updateDoc(docRef, data);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id, ...snap.data() } as Customer) : null;
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(db, COL, id));
  return true;
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id, ...snap.data() } as Customer) : undefined;
=======
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Customer } from '../types';

const COL = 'customers';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(collection(db, COL));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Customer));
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
  const docRef = await addDoc(collection(db, COL), {
    ...customer,
    createdAt: new Date().toISOString(),
  });
  return { ...customer, id: docRef.id, createdAt: new Date().toISOString() };
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
  const docRef = doc(db, COL, id);
  await updateDoc(docRef, data);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id, ...snap.data() } as Customer) : null;
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(db, COL, id));
  return true;
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id, ...snap.data() } as Customer) : undefined;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};