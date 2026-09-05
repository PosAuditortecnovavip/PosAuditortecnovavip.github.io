import { ExchangeRate } from '../../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 62.50;

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

export const getStoredRate = (): ExchangeRate | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed: ExchangeRate = JSON.parse(stored);
    return parsed;
  } catch {
    return null;
  }
};

const storeRate = (rate: ExchangeRate): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rate));
};

export const saveManualRate = (rateValue: number): ExchangeRate => {
  const now = new Date().toISOString().split('T')[0];
  const manualRate: ExchangeRate = {
    rate: roundToTwo(rateValue),
    date: now,
    source: 'manual',
  };
  storeRate(manualRate);
  return manualRate;
};

// Intento de obtener tasa automáticamente (silencioso)
export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];

  // Intento con DolarToday
  try {
    const res = await fetch('https://s3.amazonaws.com/dolartoday/data.json', {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const bcvRate = data?.USD?.bcv;
      if (bcvRate && typeof bcvRate === 'number') {
        const result: ExchangeRate = {
          rate: roundToTwo(bcvRate),
          date: now,
          source: 'bcv-official',
        };
        storeRate(result);
        return result;
      }
    }
    throw new Error('Formato inesperado');
  } catch {
    // Silencioso: no hacer nada
  }

  // Usar tasa almacenada o respaldo
  const stored = getStoredRate();
  if (stored) return stored;

  return {
    rate: FALLBACK_RATE,
    date: now,
    source: 'offline',
  };
};