<<<<<<< HEAD
import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export const exportAllData = async () => {
  const collections = [
    'products',
    'sales',
    'inventory_movements',
    'audit_records',
    'transactions',
    'customers',
    'credit_notes',
    'cash_closings',
  ];
  const data: Record<string, any[]> = {};
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    data[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_audity_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};

export const importAllData = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const batch = writeBatch(db);
  for (const [colName, docs] of Object.entries(data)) {
    for (const docData of docs as any[]) {
      const { id, ...fields } = docData;
      batch.set(doc(db, colName, id), fields);
    }
  }
  await batch.commit();
=======
import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export const exportAllData = async () => {
  const collections = [
    'products',
    'sales',
    'inventory_movements',
    'audit_records',
    'transactions',
    'customers',
    'credit_notes',
    'cash_closings',
  ];
  const data: Record<string, any[]> = {};
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    data[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_audity_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};

export const importAllData = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const batch = writeBatch(db);
  for (const [colName, docs] of Object.entries(data)) {
    for (const docData of docs as any[]) {
      const { id, ...fields } = docData;
      batch.set(doc(db, colName, id), fields);
    }
  }
  await batch.commit();
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};