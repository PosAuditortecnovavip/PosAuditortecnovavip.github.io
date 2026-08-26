import { ExchangeRate } from '../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 62.50;
const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutos

// Función para redondear a dos decimales
const roundToTwo = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const checkInternetAccess = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
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

// Intento 1: DolarAPI (Venezuela oficial)
const fetchFromDolarAPI = async (): Promise<number> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://dolarapi.com/v1/dolares/venezuela', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const rate = data?.oficial?.price;
      if (rate && typeof rate === 'number') return roundToTwo(rate);
    }

    const res2 = await fetch('https://dolarapi.com/v1/dolares/venezuela/oficial', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    if (res2.ok) {
      const data2 = await res2.json();
      const rate2 = data2?.price;
      if (rate2 && typeof rate2 === 'number') return roundToTwo(rate2);
    }

    throw new Error('Formato inesperado en DolarAPI');
  } finally {
    clearTimeout(timeoutId);
  }
};

// Intento 2: rafnixg (respaldo)
const fetchFromRafnixg = async (): Promise<number> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://bcv-api.rafnixg.dev/rates/', { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.dollar && typeof data.dollar === 'number') return roundToTwo(data.dollar);
    throw new Error('Formato inesperado');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];

  // 1. DolarAPI
  try {
    const rate = await fetchFromDolarAPI();
    const result: ExchangeRate = { rate, date: now, source: 'bcv-official' };
    storeRate(result);
    return result;
  } catch (e) {
    console.info('DolarAPI falló, intentando rafnixg...');
  }

  // 2. Rafnixg
  try {
    const rate = await fetchFromRafnixg();
    const result: ExchangeRate = { rate, date: now, source: 'fallback' };
    storeRate(result);
    return result;
  } catch (e) {
    console.info('Rafnixg falló, usando respaldo local.');
  }

  // 3. Tasa almacenada
  const stored = getStoredRate();
  if (stored) return { ...stored, source: 'offline' };

  // 4. Tasa hardcodeada (redondeada)
  return { rate: roundToTwo(FALLBACK_RATE), date: now, source: 'offline' };
};

export const saveManualRate = (rateValue: number): ExchangeRate => {
  const now = new Date().toISOString().split('T')[0];
  const manualRate: ExchangeRate = { rate: roundToTwo(rateValue), date: now, source: 'manual' };
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

  update();
  const intervalId = setInterval(update, UPDATE_INTERVAL);
  return () => clearInterval(intervalId);
};