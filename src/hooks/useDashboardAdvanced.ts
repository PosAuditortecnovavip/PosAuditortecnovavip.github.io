import { useMemo } from 'react';
import { Sale } from '../types';

export const useDashboardAdvanced = (sales: Sale[]) => {
  const weeklySales = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().split('T')[0]] = 0;
    }
    sales.forEach(sale => {
      const day = sale.createdAt.split('T')[0];
      if (days[day] !== undefined) days[day] += sale.totalUSD;
    });
    return Object.entries(days).map(([date, total]) => ({ date: date.slice(5), total: parseFloat(total.toFixed(2)) }));
  }, [sales]);

  const topProducts = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach(sale => sale.items.forEach(item => {
      map[item.productName] = (map[item.productName] || 0) + item.quantity;
    }));
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
  }, [sales]);

  return { weeklySales, topProducts };
};