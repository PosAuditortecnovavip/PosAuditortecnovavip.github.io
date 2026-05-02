import { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../services/api';

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRate = async () => {
      try {
        const data = await fetchExchangeRate();
        setExchangeRate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getRate();
    // Actualizar cada 5 minutos
    const interval = setInterval(getRate, 300000);
    return () => clearInterval(interval);
  }, []);

  const convertUSDtoVES = (usd) => {
    if (!exchangeRate) return 'Cargando...';
    const bs = usd * exchangeRate.rate;
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(bs);
  };

  return { exchangeRate, loading, error, convertUSDtoVES };
};