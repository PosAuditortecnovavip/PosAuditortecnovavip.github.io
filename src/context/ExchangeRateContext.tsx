import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ExchangeRate } from '../types';
import {
  fetchExchangeRate, getStoredRate, saveManualRate,
} from '../services/exchangeRateService';

interface ExchangeRateContextValue {
  rate: ExchangeRate | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setManualRate: (value: number) => void;
  showManualModal: boolean;
  dismissManualModal: () => void;
  promptManualRate: () => void;
  convertToBS: (usd: number) => number;
  convertToUSD: (bs: number) => number;
  formatBS: (amount: number) => string;
  formatUSD: (amount: number) => string;
  formatDual: (usd: number) => string;
}

const ExchangeRateContext = createContext<ExchangeRateContextValue | null>(null);

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
  const [rate, setRate] = useState<ExchangeRate | null>(getStoredRate());
  const [loading, setLoading] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const newRate = await fetchExchangeRate();
      setRate(newRate);
      setShowManualModal(false);
    } catch {
      const stored = getStoredRate();
      if (stored) setRate(stored);
      else setShowManualModal(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const setManualRate = (value: number) => {
    const manual = saveManualRate(value);
    setRate(manual);
    setShowManualModal(false);
  };

  const dismissManualModal = () => setShowManualModal(false);
  const promptManualRate = () => setShowManualModal(true);

  useEffect(() => { refresh(); }, [refresh]);

  const currentRate = rate?.rate ?? 62.50;
  const convertToBS = (usd: number) => usd * currentRate;
  const convertToUSD = (bs: number) => bs / currentRate;
  const formatBS = (amount: number) =>
    new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  const formatDual = (usd: number) => `${formatUSD(usd)} / ${formatBS(convertToBS(usd))}`;

  return (
    <ExchangeRateContext.Provider value={{
      rate, loading, refresh, setManualRate,
      showManualModal, dismissManualModal, promptManualRate,
      convertToBS, convertToUSD, formatBS, formatUSD, formatDual,
    }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = (): ExchangeRateContextValue => {
  const context = useContext(ExchangeRateContext);
  if (!context) throw new Error('useExchangeRate debe usarse dentro de ExchangeRateProvider');
  return context;
};