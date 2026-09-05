import { ExchangeRate } from '../types';

const STORAGE_KEY = 'audity_exchange_rate';
const FALLBACK_RATE = 62.50;
const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutos

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

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

// Obtener tasa BCV desde DolarToday (accesible, sin CORS)
const fetchFromDolarToday = async (): Promise<number> => {
  console.log('📡 Intentando obtener tasa BCV desde DolarToday...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://s3.amazonaws.com/dolartoday/data.json', {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('📦 Respuesta DolarToday:', data);

    // DolarToday incluye la tasa BCV en data.USD.bcv
    const bcvRate = data?.USD?.bcv;
    if (bcvRate && typeof bcvRate === 'number') {
      return roundToTwo(bcvRate);
    }

    throw new Error('No se encontró la tasa BCV en DolarToday');
  } catch (error) {
    console.warn('⚠️ DolarToday falló:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Intento alternativo: usar una API de respaldo (puede fallar por CORS)
const fetchFromRafnixg = async (): Promise<number> => {
  console.log('📡 Intentando obtener tasa desde bcv-api.rafnixg.dev...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://bcv-api.rafnixg.dev/rates/', {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('📦 Respuesta rafnixg:', data);
    if (data?.dollar && typeof data.dollar === 'number') {
      return roundToTwo(data.dollar);
    }
    throw new Error('Formato inesperado en rafnixg');
  } catch (error) {
    console.warn('⚠️ Rafnixg falló:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchExchangeRate = async (): Promise<ExchangeRate> => {
  const now = new Date().toISOString().split('T')[0];

  // 1. DolarToday (BCV)
  try {
    const rate = await fetchFromDolarToday();
    const result: ExchangeRate = { rate, date: now, source: 'bcv-official' };
    storeRate(result);
    return result;
  } catch (e) {
    console.info('ℹ️ DolarToday no disponible, probando respaldo...');
  }

  // 2. Rafnixg
  try {
    const rate = await fetchFromRafnixg();
    const result: ExchangeRate = { rate, date: now, source: 'fallback' };
    storeRate(result);
    return result;
  } catch (e) {
    console.info('ℹ️ Rafnixg no disponible, usando respaldo local...');
  }

  // 3. Tasa almacenada
  const stored = getStoredRate();
  if (stored) {
    console.log('💾 Usando tasa almacenada:', stored);
    return { ...stored, source: 'offline' };
  }

  // 4. Tasa hardcodeada
  console.warn('🔴 Usando tasa de respaldo hardcodeada:', FALLBACK_RATE);
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
    checkInternetAccess().then((online) => {
      if (online) {
        fetchExchangeRate().then(callback).catch(console.error);
      } else {
        console.warn('📴 Sin conexión a internet.');
      }
    });
  };

  update();
  const intervalId = setInterval(update, UPDATE_INTERVAL);
  return () => clearInterval(intervalId);
};