<<<<<<< HEAD
import { ExchangeRate } from '../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 517.96;
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hora

export const checkInternetAccess = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://www.google.com/generate_204', {
      mode: 'no-cors',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

export const getStoredRate = (): ExchangeRate | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed: ExchangeRate = JSON.parse(stored);
    if (parsed.source === 'manual') return parsed;
    const age = Date.now() - new Date(parsed.date).getTime();
    if (age > UPDATE_INTERVAL * 2) return null;
    return parsed;
  } catch {
    return null;
  }
};

const storeRate = (rate: ExchangeRate): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rate));
};

const fetchFromRafnixg = async (): Promise<number> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://bcv-api.rafnixg.dev/rates/', { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.dollar && typeof data.dollar === 'number') return data.dollar;
    throw new Error('Formato inesperado');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];

  try {
    const rate = await fetchFromRafnixg();
    const result: ExchangeRate = { rate, date: now, source: 'bcv-official' };
    storeRate(result);
    return result;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      console.info('Tasa BCV: solicitud abortada por timeout. Usando respaldo.');
    } else {
      console.warn('Error obteniendo tasa online:', e);
    }
  }

  const stored = getStoredRate();
  if (stored) return { ...stored, source: 'offline' };

  return { rate: FALLBACK_RATE, date: now, source: 'offline' };
};

export const saveManualRate = (rateValue: number): ExchangeRate => {
  const now = new Date().toISOString().split('T')[0];
  const manualRate: ExchangeRate = { rate: rateValue, date: now, source: 'manual' };
  storeRate(manualRate);
  return manualRate;
};

export const setupAutoUpdate = (callback: (rate: ExchangeRate) => void): (() => void) => {
  const update = () => {
    checkInternetAccess().then(online => {
      if (online) {
        fetchExchangeRate().then(callback).catch(console.error);
      }
    });
  };

  update(); // primer intento
  const intervalId = setInterval(update, UPDATE_INTERVAL);
  return () => clearInterval(intervalId);
=======
import { ExchangeRate } from '../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 517.96;
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hora

export const checkInternetAccess = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://www.google.com/generate_204', {
      mode: 'no-cors',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

export const getStoredRate = (): ExchangeRate | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed: ExchangeRate = JSON.parse(stored);
    if (parsed.source === 'manual') return parsed;
    const age = Date.now() - new Date(parsed.date).getTime();
    if (age > UPDATE_INTERVAL * 2) return null;
    return parsed;
  } catch {
    return null;
  }
};

const storeRate = (rate: ExchangeRate): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rate));
};

const fetchFromRafnixg = async (): Promise<number> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://bcv-api.rafnixg.dev/rates/', { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.dollar && typeof data.dollar === 'number') return data.dollar;
    throw new Error('Formato inesperado');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];

  try {
    const rate = await fetchFromRafnixg();
    const result: ExchangeRate = { rate, date: now, source: 'bcv-official' };
    storeRate(result);
    return result;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      console.info('Tasa BCV: solicitud abortada por timeout. Usando respaldo.');
    } else {
      console.warn('Error obteniendo tasa online:', e);
    }
  }

  const stored = getStoredRate();
  if (stored) return { ...stored, source: 'offline' };

  return { rate: FALLBACK_RATE, date: now, source: 'offline' };
};

export const saveManualRate = (rateValue: number): ExchangeRate => {
  const now = new Date().toISOString().split('T')[0];
  const manualRate: ExchangeRate = { rate: rateValue, date: now, source: 'manual' };
  storeRate(manualRate);
  return manualRate;
};

export const setupAutoUpdate = (callback: (rate: ExchangeRate) => void): (() => void) => {
  const update = () => {
    checkInternetAccess().then(online => {
      if (online) {
        fetchExchangeRate().then(callback).catch(console.error);
      }
    });
  };

  update(); // primer intento
  const intervalId = setInterval(update, UPDATE_INTERVAL);
  return () => clearInterval(intervalId);
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};