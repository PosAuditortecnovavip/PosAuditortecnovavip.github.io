import { db } from '../firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { AuditRecord } from '../types';

const COL = 'audit_records';

export const recordAudit = async (audit: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<AuditRecord> => {
  const docRef = await addDoc(collection(db, COL), {
    ...audit,
    createdAt: new Date().toISOString(),
  });
  return { ...audit, id: docRef.id, createdAt: new Date().toISOString() };
};

export const getAuditHistory = async (): Promise<AuditRecord[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditRecord));
};