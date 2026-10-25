import { ExchangeRate } from '../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 62.50;
const roundToTwo = (v: number) => Math.round(v * 100) / 100;

export const getStoredRate = (): ExchangeRate | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
};

export const saveManualRate = (rateValue: number): ExchangeRate => {
  const now = new Date().toISOString().split('T')[0];
  const manualRate: ExchangeRate = { rate: roundToTwo(rateValue), date: now, source: 'manual' };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manualRate));
  return manualRate;
};

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch('https://s3.amazonaws.com/dolartoday/data.json', { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const bcv = data?.USD?.bcv;
      if (bcv && typeof bcv === 'number') {
        const result: ExchangeRate = { rate: roundToTwo(bcv), date: now, source: 'bcv-official' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        return result;
      }
    }
    throw new Error('No se obtuvo tasa');
  } catch {
    const stored = getStoredRate();
    if (stored) return stored;
    return { rate: FALLBACK_RATE, date: now, source: 'offline' };
  }
};