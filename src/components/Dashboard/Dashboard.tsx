import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { motion } from 'framer-motion';
import { PackageOpen, ShoppingCart, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { useInventory } from '../../hooks/useInventory';
import { useFinance } from '../../hooks/useFinance';
import { getTodaySales } from '../../services/salesService';
import DashboardCharts from './DashboardCharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { rate, formatUSD } = useExchangeRate();
  const { products } = useInventory();
  const { balance } = useFinance();

  const todaySales = useMemo(() => getTodaySales(), []);
  const totalSalesToday = todaySales.reduce((sum, s) => sum + s.totalUSD, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.costUSD * p.stock), 0);

  // Ingresos y egresos (balance ya es ingresos - egresos; necesitamos separados)
  const { transactions } = useFinance();
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.createdAt.startsWith(today));
  const incomeToday = todayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUSD, 0);
  const expenseToday = todayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);

  const stats = [
    { label: 'Ventas Hoy', value: totalSalesToday, icon: ShoppingCart, color: 'primary' },
    { label: 'Valor Inventario', value: totalInventoryValue, icon: PackageOpen, color: 'success' },
    { label: 'Ingresos', value: incomeToday, icon: TrendingUp, color: 'warning' },
    { label: 'Egresos', value: expenseToday, icon: TrendingDown, color: 'danger' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Panel de Control</h1>
        <p className="text-text-secondary mt-1 text-base md:text-lg">Bienvenido, {user?.name}</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} whileHover={{ y: -4 }} className="glass-card p-4 md:p-6 flex items-center gap-4 md:gap-5">
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

      {/* Tasa BCV */}
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
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Activity size={14} />
            <span>Actualizado: {new Date(rate.date).toLocaleString('es-VE')}</span>
          </div>
        </div>
      )}

      {/* Gráficas */}
      <DashboardCharts products={products} sales={todaySales} transactions={transactions} />
    </motion.div>
  );
}