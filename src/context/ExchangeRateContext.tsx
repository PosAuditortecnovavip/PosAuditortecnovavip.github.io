import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ExchangeRate } from '../types';
import {
  getStoredRate,
  saveManualRate,
  fetchExchangeRate,
} from '../services/local/exchangeRateServiceLocal';

interface ExchangeRateContextValue {
  rate: ExchangeRate | null;
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newRate = await fetchExchangeRate();
      setRate(newRate);
      setShowManualModal(false);
    } catch (e) {
      // No mostrar error, solo usar la tasa guardada
      const stored = getStoredRate();
      if (stored) {
        setRate(stored);
      } else {
        setShowManualModal(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const setManualRate = (value: number) => {
    const manual = saveManualRate(value);
    setRate(manual);
    setShowManualModal(false);
  };

  const dismissManualModal = () => {
    setShowManualModal(false);
  };

  const promptManualRate = () => {
    setShowManualModal(true);
  };

  useEffect(() => {
    // Intento inicial silencioso
    refresh();
  }, [refresh]);

  const currentRate = rate?.rate ?? 62.50;

  const convertToBS = (usd: number) => usd * currentRate;
  const convertToUSD = (bs: number) => bs / currentRate;

  const formatBS = (amount: number) =>
    new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDual = (usd: number) => {
    const bs = convertToBS(usd);
    return `${formatUSD(usd)} / ${formatBS(bs)}`;
  };

  return (
    <ExchangeRateContext.Provider
      value={{
        rate,
        loading,
        error,
        refresh,
        setManualRate,
        showManualModal,
        dismissManualModal,
        promptManualRate,
        convertToBS,
        convertToUSD,
        formatBS,
        formatUSD,
        formatDual,
      }}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = (): ExchangeRateContextValue => {
  const context = useContext(ExchangeRateContext);
  if (!context) throw new Error('useExchangeRate debe usarse dentro de ExchangeRateProvider');
  return context;
};