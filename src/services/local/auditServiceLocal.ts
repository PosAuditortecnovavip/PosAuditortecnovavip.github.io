import { AuditRecord } from '../../types';

const STORAGE_KEY = 'audity_audit_records';

const getRecords = (): AuditRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveRecords = (records: AuditRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const recordAuditLocal = (audit: Omit<AuditRecord, 'id' | 'createdAt'>): AuditRecord => {
  const newRecord: AuditRecord = {
    ...audit,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const records = getRecords();
  records.push(newRecord);
  saveRecords(records);
  return newRecord;
};

export const getAuditHistoryLocal = (): AuditRecord[] => {
  return getRecords().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};