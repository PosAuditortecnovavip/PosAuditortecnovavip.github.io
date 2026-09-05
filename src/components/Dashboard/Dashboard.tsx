import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { motion } from 'framer-motion';
import {
  PackageOpen, ShoppingCart, TrendingUp, TrendingDown,
  DollarSign, Activity, RefreshCw, Bell,
} from 'lucide-react';
import { getTodaySalesLocal } from '../../services/local/salesServiceLocal';
import { useInventory } from '../../hooks/useInventory';
import { useFinance } from '../../hooks/useFinance';
import { useNotifications } from '../../hooks/useNotifications';
import { useDashboardAdvanced } from '../../hooks/useDashboardAdvanced';
import DashboardCharts from './DashboardCharts';
import AdvancedCharts from './AdvancedCharts';
import { Sale } from '../../types';

export default function Dashboard() {
  const { user } = useAuth();
  const { rate, formatUSD, refresh: refreshRate, loading: rateLoading } = useExchangeRate();
  const { products, loading: inventoryLoading } = useInventory();
  const { transactions, loading: financeLoading } = useFinance();
  const lowStockProducts = useNotifications();

  const [todaySales, setTodaySales] = useState<Sale[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);

  useEffect(() => {
    setTodaySales(getTodaySalesLocal());
    setSalesLoading(false);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setTodaySales(getTodaySalesLocal());
    };
    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const totalSalesToday = todaySales.reduce((sum, s) => sum + s.totalUSD, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.costUSD * p.stock, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = transactions
    .filter((t) => t.createdAt.startsWith(today) && t.type === 'expense')
    .reduce((s, t) => s + t.amountUSD, 0);

  const stats = [
    { label: 'Ventas Hoy', value: totalSalesToday, icon: ShoppingCart, color: 'primary' },
    { label: 'Valor Inventario', value: totalInventoryValue, icon: PackageOpen, color: 'success' },
    { label: 'Ingresos', value: totalSalesToday, icon: TrendingUp, color: 'warning' },
    { label: 'Egresos', value: todayExpenses, icon: TrendingDown, color: 'danger' },
  ];

  const isLoading = salesLoading || inventoryLoading || financeLoading;
  const { weeklySales, topProducts } = useDashboardAdvanced(todaySales);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 md:space-y-8"
    >
      {/* Encabezado con Tecnova VIP en grande */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Tecnova VIP
        </h1>
        <p className="text-sm md:text-base text-text-secondary">Audity Pro · Panel de Control</p>
        <p className="text-text-secondary mt-1">Bienvenido, {user?.name}</p>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="glass-card px-4 py-2 flex items-center gap-2 text-warning">
          <Bell size={18} />
          <span>{lowStockProducts.length} productos bajos de stock</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="animate-spin mx-auto" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="glass-card p-4 md:p-6 flex items-center gap-4 md:gap-5"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-${color}/20 flex items-center justify-center shadow-lg shadow-${color}/10 shrink-0`}>
                  <Icon size={22} className={`text-${color}`} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-medium text-text-muted uppercase tracking-wider">{label}</p>
                  <p className="text-xl md:text-2xl font-bold mt-0.5 md:mt-1">{formatUSD(value)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {rate && (
            <div className="glass-card p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-medium text-text-muted uppercase tracking-wider">Tasa BCV oficial</p>
                  <p className="text-xl md:text-2xl font-bold">{rate.rate.toFixed(2)} Bs/USD</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Activity size={14} />
                  <span>Actualizado: {new Date(rate.date).toLocaleString('es-VE')}</span>
                </div>
                <button
                  onClick={refreshRate}
                  disabled={rateLoading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition disabled:opacity-50"
                >
                  <RefreshCw size={14} className={rateLoading ? 'animate-spin' : ''} />
                  Actualizar
                </button>
              </div>
            </div>
          )}

          <DashboardCharts products={products} sales={todaySales} transactions={transactions} />
          <AdvancedCharts weeklySales={weeklySales} topProducts={topProducts} />
        </>
      )}
    </motion.div>
  );
}