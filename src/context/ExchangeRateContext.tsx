import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ExchangeRate } from '../types';
import {
  fetchExchangeRate,
  getStoredRate,
  setupAutoUpdate,
  checkInternetAccess,
  saveManualRate,
} from '../services/exchangeRateService';

interface ExchangeRateContextValue {
  rate: ExchangeRate | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setManualRate: (value: number) => void;
  showManualModal: boolean;
  dismissManualModal: () => void;
  convertToBS: (usd: number) => number;
  convertToUSD: (bs: number) => number;
  formatBS: (amount: number) => string;
  formatUSD: (amount: number) => string;
  formatDual: (usd: number) => string;
}

const ExchangeRateContext = createContext<ExchangeRateContextValue | null>(null);

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
  const [rate, setRate] = useState<ExchangeRate | null>(getStoredRate);
  const [loading, setLoading] = useState(!rate);
  const [error, setError] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const online = await checkInternetAccess();
    if (!online) {
      const stored = getStoredRate();
      if (!stored || stored.source === 'manual') {
        setShowManualModal(true);
      }
      setLoading(false);
      return;
    }
    try {
      const newRate = await fetchExchangeRate();
      setRate(newRate);
      setShowManualModal(false);
    } catch (e) {
      setError('No se pudo obtener la tasa BCV. Intente manualmente.');
      setShowManualModal(true);
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

  useEffect(() => {
    const cleanup = setupAutoUpdate((newRate) => {
      setRate(newRate);
      setShowManualModal(false);
      setLoading(false);
    });
    refresh();
    return cleanup;
  }, [refresh]);

  const currentRate = rate?.rate ?? 517.96;

  const convertToBS = (usd: number) => usd * currentRate;
  const convertToUSD = (bs: number) => bs / currentRate;

  const formatBS = (amount: number) =>
    new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  const formatDual = (usd: number) => {
    const bs = convertToBS(usd);
    return `${formatUSD(usd)} / ${formatBS(bs)}`;
  };

  return (
    <ExchangeRateContext.Provider
      value={{ rate, loading, error, refresh, setManualRate, showManualModal, dismissManualModal, convertToBS, convertToUSD, formatBS, formatUSD, formatDual }}
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